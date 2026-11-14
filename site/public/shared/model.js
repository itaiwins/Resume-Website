// The real model: Itai's AI (MEXA-2123), a Cloudflare Worker in front of a small
// Claude model with one public-only brief. This file only talks to it; the
// scripted answers (answers.js) stay the fallback for every turn that fails.
//
//   MODEL.check()            GET /health → { fallback } ; sets body[data-model].
//                            Only the chip reads it: the engine tries the model
//                            on every turn regardless (Gojo's nit, MEXA-2140:
//                            a failed /health on load is not a visit-long verdict).
//   MODEL.open(messages)     POST /chat → { kind: "stream", read(onDelta) } or
//                            { kind: "fallback", reason, retryAfter }
//
// Error path (Gojo's carry-over on MEXA-2140): a network error, a timeout
// (~20 s to the first byte and between chunks), a non-200, a non-SSE body or
// `fallback:true` all come back as "fallback" so the caller can drop to the
// scripted reply for that turn. A stream that breaks off returns what arrived
// with result "dropped".
window.MODEL = (() => {
  const API = "https://itairotem-ai-api.itairotem23.workers.dev";
  const TIMEOUT = 20000;
  let health = { fallback: false, reason: null, checked: false };
  const setState = () => { document.body.dataset.model = health.fallback ? "busy" : "live"; };

  async function check() {
    try {
      const r = await fetch(API + "/health", { cache: "no-store" });
      const j = await r.json();
      health = { fallback: !!j.fallback, reason: j.fallback ? "unavailable" : null, checked: true };
    } catch {
      health = { fallback: true, reason: "network", checked: true };
    }
    setState();
    return health;
  }

  async function open(messages) {
    const ac = new AbortController();
    let timer = setTimeout(() => ac.abort(), TIMEOUT);
    let res;
    try {
      res = await fetch(API + "/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages }), signal: ac.signal });
    } catch {
      clearTimeout(timer);
      return { kind: "fallback", reason: "network" };
    }
    const ct = res.headers.get("content-type") || "";
    if (!res.ok || !ct.includes("text/event-stream") || !res.body) {
      clearTimeout(timer);
      let j = null; try { j = await res.json(); } catch {}
      const reason = j?.reason || (res.status === 429 ? "rate_limited" : "unavailable");
      if (j?.fallback && reason !== "rate_limited") { health = { fallback: true, reason, checked: true }; setState(); } // the server said so: the chip shows busy until a stream succeeds
      return { kind: "fallback", reason, retryAfter: j?.retryAfter, status: res.status };
    }
    return {
      kind: "stream",
      async read(onDelta) {
        const reader = res.body.getReader(); const dec = new TextDecoder();
        let carry = "", got = false, result = "dropped";
        const arm = () => { clearTimeout(timer); timer = setTimeout(() => ac.abort(), TIMEOUT); };
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            arm();
            carry += dec.decode(value, { stream: true });
            let i;
            while ((i = carry.indexOf("\n\n")) !== -1) {
              const ev = carry.slice(0, i); carry = carry.slice(i + 2);
              for (const line of ev.split("\n")) {
                if (!line.startsWith("data:")) continue;
                let j; try { j = JSON.parse(line.slice(5).trim()); } catch { continue; }
                if (j.type === "delta" && typeof j.text === "string") { got = true; onDelta(j.text); }
                else if (j.type === "done") result = "done";
                else if (j.type === "error") result = "dropped";
              }
            }
          }
        } catch { /* aborted or cut: result stays "dropped" */ }
        clearTimeout(timer);
        if (health.fallback && result === "done") { health = { fallback: false, reason: null, checked: true }; setState(); }
        return { result, got };
      }
    };
  }

  return { api: API, check, open, get health() { return health; } };
})();
