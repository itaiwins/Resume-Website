import { LimitsDO, type Limits } from "./limits";
import { SYSTEM_PROMPT } from "./persona";
import { StreamGuard } from "./guard";
import { ipKey } from "./ip";
import { originAllowed } from "./origins";

export { LimitsDO };

interface Env {
  LIMITS: DurableObjectNamespace<LimitsDO>;
  ANTHROPIC_API_KEY?: string;
  STUB?: string; // "1" = canned streamed answers, no provider call
  LIMITS_NS?: string; // name of the limits object; stub runs use their own
  MODEL?: string;
  DAILY_CAP_USD?: string;
  IP_PER_HOUR?: string;
  IP_PER_DAY?: string;
}

// Claude Haiku 5.5, prompts up to 100k tokens (https://platform.claude.com/docs/en/about-claude/pricing,
// read 2026-11-13), per 1M tokens: base input $0.10, 5m cache write $0.125, cache hit $0.01,
// output $0.50. Our prompts stay far below 100k (body <= 40 KB + ~11k-token system prompt).
const PRICE = { in: 0.1 / 1e6, cacheWrite: 0.125 / 1e6, cacheRead: 0.01 / 1e6, out: 0.5 / 1e6 };

const MAX_MESSAGES = 10;
const MAX_CHARS = 2000;
const MAX_BODY = 40_000;
// Haiku 5.5 thinks before answering by default (~300 tokens, billed as output); 500 cut answers off mid-sentence
const MAX_OUTPUT_TOKENS = 1200;
const MAX_ANSWER_CHARS = 4000;
const PROVIDER_TIMEOUT_MS = 30_000;

type Msg = { role: "user" | "assistant"; content: string };

const cors = (origin: string) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
});

const json = (body: unknown, status: number, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers } });

const log = (o: Record<string, unknown>) => console.log(JSON.stringify(o)); // counts and errors only, never message text

async function hashIp(ip: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("itairotem-ai:" + ipKey(ip)));
  return [...new Uint8Array(d).slice(0, 16)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function parseMessages(body: unknown): Msg[] | string {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return "messages must be a non-empty array";
  const msgs: Msg[] = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    const role = (m as Msg)?.role;
    const content = (m as Msg)?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return "each message needs role user|assistant and string content";
    const text = content.slice(0, MAX_CHARS).trim();
    if (!text) continue;
    // The Messages API wants alternating turns: fold repeats into one
    const last = msgs[msgs.length - 1];
    if (last?.role === role) last.content += "\n\n" + text;
    else msgs.push({ role, content: text });
  }
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return "the last message must be from the user";
  return msgs;
}

const limitsOf = (env: Env): Limits => ({
  perHour: Number(env.IP_PER_HOUR) || 20,
  perDay: Number(env.IP_PER_DAY) || 60,
  capUsd: Number(env.DAILY_CAP_USD) || 2,
});

// input = uncached tokens only; the three input counts add up to the whole prompt
type Usage = { in: number; cacheWrite: number; cacheRead: number; out: number };
const costOf = (u: Usage) => u.in * PRICE.in + u.cacheWrite * PRICE.cacheWrite + u.cacheRead * PRICE.cacheRead + u.out * PRICE.out;

// Worst case for this request: a cache miss (system prompt written to cache), 2.5 chars per
// token (the v2 prompt measures 2.75: 30,740 chars = 11,167 tokens), plus a full answer.
const CHARS_PER_TOKEN = 2.5;
const reserveFor = (msgs: Msg[]) =>
  costOf({
    in: Math.ceil(msgs.reduce((n, m) => n + m.content.length, 0) / CHARS_PER_TOKEN),
    cacheWrite: Math.ceil(SYSTEM_PROMPT.length / CHARS_PER_TOKEN),
    cacheRead: 0,
    out: MAX_OUTPUT_TOKENS,
  });

const STUB_ANSWER =
  "Hi! I'm Itai's AI (stub mode, no model is called). Itai is an AI engineer and crypto trader in Florida. He founded Mexant LLC, which ships Tend and MCPSafe. Email him at itairotem23@gmail.com.";
const STUB_GUARD_ANSWER =
  "Guard test: key " + "AIza" + "SyA1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q, link https://evil.example.net/x, ok link https://getunskippable.com and bare evil.io, mail bob@evil.com.";

function sse(obj: unknown) {
  return new TextEncoder().encode(`data: ${JSON.stringify(obj)}\n\n`);
}

async function* stubDeltas(msgs: Msg[]): AsyncGenerator<{ text?: string; usage?: Usage }> {
  const text = msgs[msgs.length - 1].content.includes("__guardtest__") ? STUB_GUARD_ANSWER : STUB_ANSWER;
  for (let i = 0; i < text.length; i += 17) {
    await new Promise((r) => setTimeout(r, 20));
    yield { text: text.slice(i, i + 17) };
  }
  yield { usage: { in: 20, cacheWrite: 0, cacheRead: Math.ceil(SYSTEM_PROMPT.length / 4), out: 60 } };
}

// Reads the Messages API stream. message_start carries the input and cache counts;
// message_delta carries the running output count, so the last one wins.
async function* claudeDeltas(res: Response): AsyncGenerator<{ text?: string; usage?: Usage }> {
  const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
  let buf = "";
  let usage: Usage | null = null;
  const take = (u: any) => {
    if (!u) return;
    usage ??= { in: 0, cacheWrite: 0, cacheRead: 0, out: 0 };
    if (u.input_tokens != null) usage.in = Number(u.input_tokens) || 0;
    if (u.cache_creation_input_tokens != null) usage.cacheWrite = Number(u.cache_creation_input_tokens) || 0;
    if (u.cache_read_input_tokens != null) usage.cacheRead = Number(u.cache_read_input_tokens) || 0;
    if (u.output_tokens != null) usage.out = Number(u.output_tokens) || 0;
  };
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += value;
      let i: number;
      while ((i = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, i).trim();
        buf = buf.slice(i + 1);
        if (!line.startsWith("data:")) continue;
        let ev: any;
        try { ev = JSON.parse(line.slice(5)); } catch { continue; }
        if (ev.type === "message_start") take(ev.message?.usage);
        else if (ev.type === "message_delta") take(ev.usage);
        else if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta" && typeof ev.delta.text === "string") yield { text: ev.delta.text };
        else if (ev.type === "error") throw new Error("provider_stream_error");
      }
    }
  } finally {
    reader.releaseLock();
  }
  if (usage) yield { usage };
}

async function chat(req: Request, env: Env, ctx: ExecutionContext, h: Record<string, string>): Promise<Response> {
  const t0 = Date.now();
  const raw = await req.text();
  if (raw.length > MAX_BODY) return json({ error: "too_large" }, 413, h);
  let body: unknown;
  try { body = JSON.parse(raw); } catch { return json({ error: "bad_request", message: "body must be JSON" }, 400, h); }
  const msgs = parseMessages(body);
  if (typeof msgs === "string") return json({ error: "bad_request", message: msgs }, 400, h);

  const stub = env.STUB === "1";
  if (!stub && !env.ANTHROPIC_API_KEY) {
    log({ evt: "chat", result: "no_key" });
    return json({ fallback: true, reason: "unavailable" }, 200, h);
  }

  const limits = env.LIMITS.get(env.LIMITS.idFromName(env.LIMITS_NS || (stub ? "stub" : "live")));
  const lim = limitsOf(env);
  const ip = await hashIp(req.headers.get("CF-Connecting-IP") ?? "unknown");
  const reserve = reserveFor(msgs);
  const admit = await limits.admit(ip, reserve, lim);
  if (!admit.ok) {
    log({ evt: "chat", result: admit.reason });
    if (admit.reason === "rate_limited")
      return json({ fallback: true, reason: "rate_limited", retryAfter: admit.retryAfter }, 429, { ...h, "Retry-After": String(admit.retryAfter) });
    return json({ fallback: true, reason: "daily_cap" }, 200, h);
  }

  let deltas: AsyncGenerator<{ text?: string; usage?: Usage }>;
  if (stub) {
    deltas = stubDeltas(msgs);
  } else {
    let res: Response;
    try {
      res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": env.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01" },
        signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
        body: JSON.stringify({
          model: env.MODEL || "claude-haiku-5-5",
          max_tokens: MAX_OUTPUT_TOKENS,
          stream: true,
          // Identical on every request, so it's cached: later hits bill at a tenth of the input price
          system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
          messages: msgs.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
    } catch (e) {
      await limits.release(admit.id);
      log({ evt: "chat", result: "provider_unreachable", err: String((e as Error)?.name) });
      return json({ fallback: true, reason: "unavailable" }, 200, h);
    }
    if (!res.ok) {
      // Billing is only for successful calls; the body may echo our request, so log the status only
      await limits.release(admit.id);
      log({ evt: "chat", result: "provider_error", status: res.status });
      return json({ fallback: true, reason: "unavailable" }, 200, h);
    }
    deltas = claudeDeltas(res);
  }

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const w = writable.getWriter();
  const guard = new StreamGuard();
  const pump = (async () => {
    let usage: Usage | null = null;
    let sent = 0;
    let result = "ok";
    try {
      for await (const d of deltas) {
        if (d.usage) { usage = d.usage; continue; }
        if (!d.text || sent >= MAX_ANSWER_CHARS) continue;
        const safe = guard.push(d.text.slice(0, MAX_ANSWER_CHARS - sent));
        sent += d.text.length;
        if (safe) await w.write(sse({ type: "delta", text: safe }));
      }
      const tail = guard.flush();
      if (tail) await w.write(sse({ type: "delta", text: tail }));
      await w.write(sse({ type: "done" }));
    } catch (e) {
      result = "stream_error";
      try { await w.write(sse({ type: "error", fallback: true })); } catch { /* client gone */ }
    } finally {
      try { await w.close(); } catch { /* already closed */ }
      const usd = usage ? costOf(usage) : null;
      await limits.settle(admit.id, usd);
      log({ evt: "chat", result, turns: msgs.length, inTok: usage?.in ?? null, cacheWrite: usage?.cacheWrite ?? null, cacheRead: usage?.cacheRead ?? null, outTok: usage?.out ?? null, usd, guardHits: guard.hits, ms: Date.now() - t0, stub });
    }
  })();
  ctx.waitUntil(pump);

  return new Response(readable, {
    headers: { ...h, "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    const origin = req.headers.get("Origin") ?? "";
    const allowed = originAllowed(origin);
    const h = allowed ? cors(origin) : {};

    if (req.method === "OPTIONS") return allowed ? new Response(null, { status: 204, headers: h }) : new Response(null, { status: 403 });

    if (url.pathname === "/health" && req.method === "GET") {
      const stub = env.STUB === "1";
      const s = await env.LIMITS.get(env.LIMITS.idFromName(env.LIMITS_NS || (stub ? "stub" : "live"))).status(limitsOf(env).capUsd);
      // True once even a one-line question no longer fits under today's cap
      const fallback = (!stub && !env.ANTHROPIC_API_KEY) || s.spentUsd + s.heldUsd + reserveFor([{ role: "user", content: "" }]) > s.capUsd;
      return json({ ok: true, fallback }, 200, h);
    }

    if (url.pathname === "/chat") {
      if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405, h);
      // Not a security boundary (any client can set Origin); the limits are. This just keeps other sites' browsers out.
      if (!allowed) return json({ error: "forbidden_origin" }, 403);
      try {
        return await chat(req, env, ctx, h);
      } catch (e) {
        log({ evt: "chat", result: "internal_error", err: String((e as Error)?.name) });
        return json({ fallback: true, reason: "unavailable" }, 200, h);
      }
    }
    return json({ error: "not_found" }, 404, h);
  },
} satisfies ExportedHandler<Env>;
