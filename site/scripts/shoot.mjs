// Screenshots + checks over CDP with the box's headless Chrome. No Playwright.
// usage: node scripts/shoot.mjs <base-url> <outdir> [mode]
//   base-url: https://itairotem-ai.itairotem23.workers.dev  or  file:///.../public
//   mode: mock (default) | live
//     mock: the API is intercepted (CDP Fetch), so no live question is spent.
//           Covers: landing (desktop, 390, 430), a canned stream mid-answer and
//           done, the projects chip (artifacts under the model's words), the
//           fallback states (busy JSON, 429, a dropped stream, health=busy),
//           keyboard open at 390, reduced motion, console errors.
//     live: real API. Asks LIVE_QUESTIONS (5) and writes transcript.md.
//           The API allows 20 questions/hour from one IP; keep runs rare.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [base, outdir, mode = "mock"] = process.argv.slice(2);
if (!base || !outdir) { console.error("usage: shoot.mjs <base-url> <outdir> [mock|live]"); process.exit(2); }
mkdirSync(outdir, { recursive: true });
const url = base.startsWith("file:") ? `${base}/index.html` : `${base.replace(/\/$/, "")}/`;
const API = "https://itairotem-ai-api.itairotem23.workers.dev";

const chrome = process.env.CHROME_PATH || "/usr/bin/google-chrome";
const profile = mkdtempSync(join(tmpdir(), "shoot-"));
const proc = spawn(chrome, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--disable-gpu", "--font-render-hinting=none", "--allow-file-access-from-files", "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
const wsUrl = await new Promise((res, rej) => { let buf = ""; proc.stderr.on("data", d => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error("chrome did not start\n" + buf)), 15000); });
const port = new URL(wsUrl).port;
const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const page = list.find(t => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => (ws.onopen = r));
let id = 0; const pending = new Map(); let logs = [];
let intercept = null; // (req) => { status, headers, body } | null
ws.onmessage = ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); }
  else if (m.method === "Runtime.consoleAPICalled") logs.push(m.params.type + ": " + m.params.args.map(a => a.value ?? a.description).join(" "));
  else if (m.method === "Runtime.exceptionThrown") logs.push("exception: " + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  else if (m.method === "Fetch.requestPaused") {
    const p = m.params; const r = intercept ? intercept(p.request) : null;
    if (!r) { send("Fetch.continueRequest", { requestId: p.requestId }); return; }
    if (r.fail) { send("Fetch.failRequest", { requestId: p.requestId, errorReason: "ConnectionFailed" }); return; }
    const headers = Object.entries({ "content-type": r.type, "access-control-allow-origin": "*", ...(r.headers || {}) }).map(([name, value]) => ({ name, value: String(value) }));
    send("Fetch.fulfillRequest", { requestId: p.requestId, responseCode: r.status || 200, responseHeaders: headers, body: Buffer.from(r.body).toString("base64") });
  }
};
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const js = async expr => (await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true })).result.value;
await send("Page.enable"); await send("Runtime.enable");
if (mode === "mock") await send("Fetch.enable", { patterns: [{ urlPattern: API + "/*", requestStage: "Request" }] });

const out = []; const log = (...a) => { console.log(...a); out.push(a.join(" ")); };
async function load(wait = 900) { await send("Page.navigate", { url: "about:blank" }); await sleep(80); await send("Page.navigate", { url }); await sleep(wait); }
async function shot(name, full = false) {
  await sleep(350);
  let p = { format: "png" };
  if (full) { await js("Promise.all([...document.images].map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r; setTimeout(r,3000)})))"); const h = await js("Math.min(document.documentElement.scrollHeight, 9000)"); const w = await js("document.documentElement.clientWidth"); p = { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: h, scale: 1 } }; }
  const r = await send("Page.captureScreenshot", p);
  writeFileSync(join(outdir, name), Buffer.from(r.data, "base64")); console.log("wrote", name);
}
const waitDone = async (max = 45000) => { const t0 = Date.now(); while (Date.now() - t0 < max) { if (await js("!!document.querySelector('#thread .msg.bot:last-child .answer.done') && !document.querySelector('#thread .thinking') && document.querySelectorAll('#chips .chip').length > 0 && !document.getElementById('send').classList.contains('stop')")) return true; await sleep(200); } log("waitDone timed out"); return false; };
const clickChip = async label => js(`(()=>{const c=[...document.querySelectorAll('.chip')].find(c=>c.textContent===${JSON.stringify(label)}); if(!c) return 'no chip'; c.click(); return 'ok';})()`);
const type = async text => js(`document.getElementById('input').value=${JSON.stringify(text)}; document.getElementById('composer').requestSubmit(); 1`);
const lastAnswer = () => js("(()=>{const a=document.querySelector('#thread .msg.bot:last-child .answer'); if(!a) return ''; const live=[...a.querySelectorAll('.blk[data-live]')]; return (live.length? live.map(b=>b.textContent).join(' ¶ ') : a.textContent).replace(/\\s+/g,' ').trim()})()");
const lastModel = () => js("document.querySelector('#thread .msg.bot:last-child')?.dataset.model");
const setMedia = (rm) => send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: rm }, { name: "prefers-color-scheme", value: "light" }] });
const desktop = async () => { await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 2, mobile: false }); await send("Emulation.setTouchEmulationEnabled", { enabled: false }); };
const mobile = async (w = 390, h = 844) => { await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 3, mobile: true }); await send("Emulation.setTouchEmulationEnabled", { enabled: true }); };

// ---- mocks ----
const sse = (text, done = true) => {
  // Split a canned answer into token-sized deltas like the real stream.
  const parts = text.match(/[^\s]+\s*|\s+/g) || [text]; let body = "";
  let chunk = "";
  for (const p of parts) { chunk += p; if (chunk.length > 9 + Math.random() * 10) { body += `data: ${JSON.stringify({ type: "delta", text: chunk })}\n\n`; chunk = ""; } }
  if (chunk) body += `data: ${JSON.stringify({ type: "delta", text: chunk })}\n\n`;
  body += done ? `data: {"type":"done"}\n\n` : `data: {"type":"error","fallback":true}\n\n`;
  return { type: "text/event-stream", body };
};
const CANNED = {
  built: "Itai has built two iPhone apps, a security scanner and a stack of trading tools.\n\n- **Tend**: tasks, calendar, habits and notes in one calm iPhone app. Live on the App Store.\n- **Unskippable**: takes a video from idea to posted, in one app. Invite-only beta.\n- **MCPSafe**: a security scanner and quality registry for MCP servers, at https://mcpsafe.org.\n- Trading: three iterations of automated crypto bots, a backtest engine, a signals API and **Walleto**.\n\nTend and MCPSafe ship under his company, Mexant LLC. Want the detail on any of them?",
  tend: "**Tend** is a calm place for your day: tasks, calendar, habits and notes in one iPhone app, with one assistant bar that files whatever you type or say. It's live on the [App Store](https://apps.apple.com/us/app/tend-tasks-habits-notes/id6753848757).",
  org: "Itai designed and manages an AI engineering team. Mexant runs with him as the only human and **23 AI agents** organised like a company on Paperclip: a CEO agent, two managers, builders who each own a product, separate reviewers, security and DevOps. Every task is a tracked issue, the builder never reviews its own work, and nothing reaches a client or costs money without his approval. Want more on the rules, or on what the team has shipped?",
  hire: "Three things, each tied to a real project. He designed and runs a 23-agent AI engineering team that ships: [Tend](https://apps.apple.com/us/app/tend-agentic-notes/id6815052928) is on the App Store and [MCPSafe](https://mcpsafe.org) is live. He owns products end to end as the product owner. And he builds with guardrails: separate review, security review, backups and spend caps. Want the detail on any of these?",
  short: "Yes. Unskippable is an invite-only beta on iPhone; people apply at [getunskippable.com](https://getunskippable.com). It's 18 and over only, and the code is private. Want to know what it does?",
  bare: "Email is easiest: itairotem23@gmail.com. His code is at https://github.com/itaiwins, and Tend is on the App Store at https://apps.apple.com/us/app/tend-agentic-notes/id6815052928. He usually replies within 24–48 hours.",
  long: "Here's the long version, since you asked for detail.\n\nItai Rotem is an AI engineer and crypto trader in Florida, USA, studying Information Technology at FSU. He founded Mexant LLC, which ships Tend and MCPSafe, and he's building Unskippable, an iPhone app that takes a video from idea to posted. Before that: three iterations of automated crypto trading bots, a paid trading community (AlphaHQ), and Walleto, a crypto tracking platform for perpetual trades.\n\n1. **Tend** files what you type into tasks, events and habits, works offline, and syncs with Sign in with Apple.\n2. **Unskippable** helps shot by shot, does a one-tap edit and a *Ready to post?* check, and never posts for you.\n3. **MCPSafe** scans MCP servers for prompt injection, data exfiltration and excessive permissions, with a public registry of 260+ scanned servers.\n\nHe's open to work. Email is easiest: itairotem23@gmail.com."
};
const mocks = {
  health: { type: "application/json", body: JSON.stringify({ ok: true, fallback: false }) },
  healthBusy: { type: "application/json", body: JSON.stringify({ ok: true, fallback: true }) },
  busy: { type: "application/json", body: JSON.stringify({ fallback: true, reason: "daily_cap" }) },
  limited: { type: "application/json", status: 429, headers: { "retry-after": "1800" }, body: JSON.stringify({ fallback: true, reason: "rate_limited", retryAfter: 1800 }) }
};
let chat = () => sse(CANNED.built);
let health = mocks.health; let lastPost = null;
intercept = req => { const u = new URL(req.url); if (u.pathname === "/chat" && req.method === "POST") lastPost = req.postData || null; if (req.method === "OPTIONS") return { type: "text/plain", body: "", headers: { "access-control-allow-headers": "content-type", "access-control-allow-methods": "POST, GET, OPTIONS" } }; if (u.pathname === "/health") return health; if (u.pathname === "/chat") return chat(req); return null; };

logs = [];
log(`=== ${mode} · ${url}`);

if (mode === "mock") {
  // Desktop landing (the hero writes itself; wait for it).
  await desktop(); await setMedia("no-preference"); await load(900); await sleep(1800);
  log("fonts:", await js("[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family).filter((v,i,a)=>a.indexOf(v)===i).join(',')"), "| chips:", await js("document.querySelectorAll('#chips .chip').length"), "| hero:", await js("!!document.querySelector('#hero:not(.gone)')"), "| model state:", await js("document.body.dataset.model"), "| hero words on:", await js("document.querySelectorAll('#hero .tok.on').length + '/' + document.querySelectorAll('#hero .tok').length"));
  log("copy says scripted/no model:", await js("/scripted|no model/i.test(document.body.innerText)"));
  await shot("desktop-landing.png");
  await js("document.querySelector('#model').open = true; 1"); await sleep(250);
  log("model options:", await js("document.querySelectorAll('.model-opt').length"), "| state line:", await js("document.querySelector('.model-state-text').textContent"));
  await shot("desktop-model.png");
  await js("document.querySelector('#model').open = false; 1");

  // A canned stream, mid-answer and done.
  chat = () => sse(CANNED.built);
  await type("What has Itai built?"); await sleep(1400);
  log("mid-answer: words on:", await js("document.querySelectorAll('#thread .answer .tok.on').length"), "| words laid out:", await js("document.querySelectorAll('#thread .answer .tok').length"), "| caret:", await js("!!document.querySelector('.tok.cur')"), "| stop button:", await js("document.getElementById('send').classList.contains('stop')"));
  await shot("desktop-streaming.png");
  const t0 = Date.now(); let ok = await waitDone(); log("done:", ok, "in", Date.now() - t0, "ms | model:", await lastModel(), "| autolinks:", await js("[...document.querySelectorAll('#thread .msg.bot:last-child li a')].map(a=>a.textContent+'→'+a.href).join(' ')"), "| bullets:", await js("document.querySelectorAll('#thread .msg.bot:last-child li').length"), "| bold:", await js("document.querySelectorAll('#thread .msg.bot:last-child strong').length"), "| text:", (await lastAnswer()).slice(0, 90));
  await shot("desktop-answer.png");
  // The projects chip: artifacts under the model's words.
  log("click projects:", await clickChip("What's Tend?") === "ok" ? "(tend chip present) " : "", await js(`(()=>{const c=[...document.querySelectorAll('.chip')].map(c=>c.textContent); return c.join(' / ')})()`));
  await waitDone();
  chat = () => sse(CANNED.built);
  await js("window.ASK('What has Itai built?', 'projects'); 1"); ok = await waitDone();
  log("projects answer done:", ok, "| tiles:", await js("document.querySelectorAll('#thread .msg.bot:last-child .bento .tile').length"), "| demos:", await js("document.querySelectorAll('#thread .msg.bot:last-child .bento .demo').length"), "| imgs loaded:", await js("[...document.querySelectorAll('.bento img')].filter(i=>i.naturalWidth>0).length + '/' + document.querySelectorAll('.bento img').length"), "| scrollWidth:", await js("document.documentElement.scrollWidth"));
  await js("document.querySelector('#thread .msg.bot:last-child').scrollIntoView({block:'start', behavior:'instant'}); window.scrollBy(0,-70); 1"); await sleep(1800);
  await shot("desktop-projects.png");
  await js("window.scrollTo(0,0); 1"); await sleep(200); await shot("desktop-projects-full.png", true);
  // Tend via the live path: demo + drawing + card under the words, with a link in the text.
  chat = () => sse(CANNED.tend);
  await clickChip("What's Tend?"); ok = await waitDone();
  log("tend: link in text:", await js("document.querySelectorAll('#thread .msg.bot:last-child p a').length"), "| drawing:", await js("!!document.querySelector('#thread .msg.bot:last-child .dd-sheet')"), "| demo rows:", await js("document.querySelectorAll('#thread .msg.bot:last-child .demo-tend:not(.compact) .row').length"), "| card:", await js("!!document.querySelector('#thread .msg.bot:last-child .pcard')"));
  await js("document.querySelector('#thread .msg.bot:last-child .dd').scrollIntoView({block:'start', behavior:'instant'}); window.scrollBy(0,-80); 1"); await sleep(300);
  await shot("desktop-drawing.png");
  // Links: markdown links keep their short labels; bare URLs show the host only; the email links as mailto.
  chat = () => sse(CANNED.short);
  await type("Can I try Unskippable?"); ok = await waitDone();
  log("md link:", await js("[...document.querySelectorAll('#thread .msg.bot:last-child .blk[data-live] a')].map(a=>a.textContent+'→'+a.href).join(' ')"), "| raw brackets left:", await js("/\\[|\\]\\(/.test(document.querySelector('#thread .msg.bot:last-child .answer').textContent)"));
  await js("document.querySelector('#thread .msg.bot:last-child').scrollIntoView({block:'start', behavior:'instant'}); window.scrollBy(0,-70); 1"); await sleep(400);
  await shot("desktop-linked.png");
  chat = () => sse(CANNED.bare);
  await type("How do I reach him?"); ok = await waitDone();
  log("bare links:", await js("[...document.querySelectorAll('#thread .msg.bot:last-child .blk[data-live] a')].map(a=>a.textContent+'→'+a.href).join(' ')"));
  // How Itai works: the org sheet draws itself once it's in view.
  chat = () => sse(CANNED.org);
  await js("window.ASK('How does he use AI agents?', 'org'); 1"); ok = await waitDone();
  log("org: sheet:", await js("!!document.querySelector('#thread .msg.bot:last-child .dd-org')"), "| narrow:", await js("document.querySelector('#thread .msg.bot:last-child .dd-org')?.classList.contains('dd-narrow')"), "| drawn elements:", await js("document.querySelectorAll('#thread .msg.bot:last-child .dd-org .dd-draw').length"), "| faded:", await js("document.querySelectorAll('#thread .msg.bot:last-child .dd-org .dd-fade').length"), "| names on sheet:", await js("['ITAI ROTEM','LELOUCH','GOJO','GUTS','ROY MUSTANG','REIGEN','PAPERCLIP','ISSUE','SHIP'].filter(n=>document.querySelector('#thread .msg.bot:last-child .dd-org').textContent.includes(n)).length + '/9'"), "| sheet px:", await js("(()=>{const r=document.querySelector('#thread .msg.bot:last-child .dd-org-sheet').getBoundingClientRect(); return Math.round(r.width)+'x'+Math.round(r.height)})()"));
  await js("document.querySelector('#thread .msg.bot:last-child .dd-org').scrollIntoView({block:'start', behavior:'instant'}); window.scrollBy(0,-70); 1"); await sleep(1100);
  log("org building: on:", await js("document.querySelector('#thread .msg.bot:last-child .dd-org').classList.contains('on')"), "| running transitions at 1.1s:", await js("document.getAnimations().filter(a=>a.playState==='running').length"));
  await shot("desktop-org-building.png");
  await sleep(4200);
  log("org settled: running at 5.3s:", await js("document.getAnimations().filter(a=>a.playState==='running').length"));
  await shot("desktop-org.png");
  await js("window.scrollTo(0,0); 1"); await sleep(200); await shot("desktop-org-full.png", true);
  // Why hire him: words with links, then the sheet and the proves list.
  chat = () => sse(CANNED.hire);
  await js("window.ASK('Why should I hire him?', 'hire'); 1"); ok = await waitDone();
  log("hire: links:", await js("document.querySelectorAll('#thread .msg.bot:last-child .blk[data-live] a').length"), "| arts:", await js("[...document.querySelectorAll('#thread .msg.bot:last-child .art')].map(a=>a.dataset.art).join(',')"), "| proves rows:", await js("document.querySelectorAll('#thread .msg.bot:last-child .proves dt').length"));
  // Projects: the tiles plus the ledger of the pack-v2 work.
  chat = () => sse(CANNED.built);
  await js("window.ASK('What has Itai built?', 'projects'); 1"); ok = await waitDone();
  log("projects v2: tiles:", await js("document.querySelectorAll('#thread .msg.bot:last-child .tile').length"), "| ledger rows:", await js("document.querySelectorAll('#thread .msg.bot:last-child .lrow').length"), "| client rows:", await js("[...document.querySelectorAll('#thread .msg.bot:last-child .lrow-name')].filter(n=>/^An? /.test(n.textContent)).length"));
  await js("document.querySelector('#thread .msg.bot:last-child .ledger').scrollIntoView({block:'start', behavior:'instant'}); window.scrollBy(0,-70); 1"); await sleep(400);
  await shot("desktop-ledger.png");
  // Every project card with a screenshot loads it (desktop).
  { const ids = await js("window.DATA.projects.filter(p=>p.shot).map(p=>p.id)"); const bad = [];
    for (const pid of ids) { chat = () => sse(CANNED.short); await js(`window.ASK("What's ${pid}?", ${JSON.stringify(pid)}); 1`); await waitDone(); await sleep(300); const okImg = await js("(()=>{const i=document.querySelector('#thread .msg.bot:last-child .pcard-shot'); return !!i && i.complete && i.naturalWidth>0})()"); if (!okImg) bad.push(pid); }
    log("card images loaded (desktop):", ids.length - bad.length + "/" + ids.length, bad.length ? "missing " + bad.join(",") : ""); }
  // A client row answers with its card and no name.
  chat = () => sse(CANNED.short);
  await js("window.ASK('Tell me about the fragrance brand', 'client-store'); 1"); ok = await waitDone();
  log("client card:", await js("document.querySelector('#thread .msg.bot:last-child .pcard-name')?.textContent"), "| shot:", await js("!!document.querySelector('#thread .msg.bot:last-child .pcard-shot')"), "| body:", await js("!!document.querySelector('#thread .msg.bot:last-child .pcard-body')"));
  // Long answer with an ordered list and an *em*.
  chat = () => sse(CANNED.long);
  await type("Tell me everything, in detail"); ok = await waitDone();
  log("long: ol items:", await js("document.querySelectorAll('#thread .msg.bot:last-child ol li').length"), "| em:", await js("document.querySelectorAll('#thread .msg.bot:last-child em').length"), "| paragraphs:", await js("document.querySelectorAll('#thread .msg.bot:last-child p').length"), "| history sent last:", lastPost ? JSON.parse(lastPost).messages.length + " msgs, roles " + JSON.parse(lastPost).messages.map(m=>m.role[0]).join("") : "n/a");
  // Fallback: busy JSON.
  chat = () => mocks.busy;
  await type("How do I reach him?"); ok = await waitDone();
  log("busy fallback: model:", await lastModel(), "| note:", await js("document.querySelector('#thread .msg.bot:last-child .note')?.textContent"), "| contact rows:", await js("document.querySelectorAll('#thread .msg.bot:last-child .contact-row').length"), "| body state:", await js("document.body.dataset.model"));
  await js("document.querySelector('#thread .msg.bot:last-child').scrollIntoView({block:'start', behavior:'instant'}); window.scrollBy(0,-70); 1"); await sleep(400);
  await shot("desktop-fallback.png");
  // Fallback: 429.
  chat = () => mocks.limited;
  await type("What's MCPSafe?"); ok = await waitDone();
  log("429 fallback: note:", await js("document.querySelector('#thread .msg.bot:last-child .note')?.textContent"), "| demo:", await js("!!document.querySelector('#thread .msg.bot:last-child .demo-mcp')"));
  // Fallback: the stream drops mid-way.
  chat = () => sse("MCPSafe is a security scanner and", false);
  await type("What's MCPSafe?"); ok = await waitDone();
  log("dropped stream: kept text:", (await lastAnswer()).slice(0, 60), "| note:", await js("document.querySelector('#thread .msg.bot:last-child .note')?.textContent"));
  // Fallback: network failure.
  chat = () => ({ fail: true });
  await type("Who is Itai?"); ok = await waitDone();
  log("network fail: model:", await lastModel(), "| note:", await js("document.querySelector('#thread .msg.bot:last-child .note')?.textContent"));
  // Unknown intent, model answers anyway, no artifact, root chips.
  chat = () => sse("I don't know that one. I can tell you about Itai's projects, his story or how to reach him.");
  await type("what is the meaning of life"); ok = await waitDone();
  log("unknown intent: arts:", await js("document.querySelectorAll('#thread .msg.bot:last-child .art').length"), "| chips:", await js("document.querySelectorAll('#chips .chip').length"));
  // Everything.
  await js("document.getElementById('open-everything').click(); 1"); await sleep(400);
  log("everything open:", await js("document.getElementById('everything').open"), "| sections:", await js("[...document.querySelectorAll('#everything-body section h3')].map(h=>h.textContent).join(' / ')"), "| projects listed:", await js("document.querySelectorAll('.plist .p').length"), "| client rows:", await js("document.querySelectorAll('.plist .client').length"), "| org sheet in panel:", await js("!!document.querySelector('#everything-body .dd-org')"), "| steps:", await js("document.querySelectorAll('#everything-body .steps li').length"));
  await shot("desktop-everything.png");
  await js("document.querySelector('#everything-body .dd-org').scrollIntoView({block:'start'}); 1"); await sleep(4500); await shot("desktop-everything-how.png");
  await js("document.getElementById('everything').close(); 1");
  // /health fails on load (network): the model is still tried on the next turn.
  health = { fail: true }; chat = () => sse(CANNED.short);
  await load(1200);
  log("health network fail: body state:", await js("document.body.dataset.model"));
  await type("Can I try Unskippable?"); ok = await waitDone();
  log("after health fail, turn used model:", await lastModel(), "| body state now:", await js("document.body.dataset.model"));
  health = mocks.health;
  // Health says busy on load.
  health = mocks.healthBusy; chat = () => mocks.busy;
  await load(1200);
  log("health busy: body state:", await js("document.body.dataset.model"), "| dot grey:", await js("getComputedStyle(document.querySelector('.model-dot')).backgroundColor"));
  await js("document.querySelector('#model').open = true; 1"); await sleep(250);
  await shot("desktop-busy-chip.png");
  health = mocks.health;

  // Mobile 390 and 430.
  for (const w of [390, 430]) {
    await mobile(w); await load(900); await sleep(1800);
    log(`mobile ${w}: scrollWidth:`, await js("document.documentElement.scrollWidth"), "| input font-size:", await js("getComputedStyle(document.getElementById('input')).fontSize"), "| composer bottom in view:", await js("document.getElementById('composer').getBoundingClientRect().bottom <= innerHeight"), "| fine in view:", await js("document.querySelector('.fine').getBoundingClientRect().bottom <= innerHeight"));
    await shot(`mobile-${w}-landing.png`);
    chat = () => sse(CANNED.built);
    await js("window.ASK('What has Itai built?', 'projects'); 1"); await sleep(1300); await shot(`mobile-${w}-streaming.png`); ok = await waitDone();
    log(`mobile ${w} after projects: scrollWidth:`, await js("document.documentElement.scrollWidth"), "| bento scrollable:", await js("(()=>{const b=document.querySelector('.bento'); return b.scrollWidth>b.clientWidth})()"), "| tile width:", await js("Math.round(document.querySelector('.tile').getBoundingClientRect().width)"), "| widest el overflow:", await js("(()=>{let w=0,n='';for(const e of document.querySelectorAll('body *')){if(e.closest('.bento, .dd-frame, .chips'))continue;const r=e.getBoundingClientRect(); if(r.right>w){w=r.right;n=e.className||e.tagName}} return Math.round(w)+' '+String(n).slice(0,40)})()"));
    await js("document.querySelector('.bento').scrollIntoView({block:'start', behavior:'instant'}); window.scrollBy(0,-70); 1"); await sleep(1800);
    await shot(`mobile-${w}-projects.png`);
    await js("document.querySelector('.bento').scrollBy({left: 400, behavior:'instant'}); 1"); await sleep(300);
    await shot(`mobile-${w}-projects-swiped.png`);
    await js("window.scrollTo(0, document.documentElement.scrollHeight); 1"); await sleep(300);
    await shot(`mobile-${w}-answer-end.png`);
    await js("window.scrollTo(0,0); 1"); await sleep(200); await shot(`mobile-${w}-answer-full.png`, true);
    log(`mobile ${w} ledger rows:`, await js("document.querySelectorAll('#thread .msg.bot:last-child .lrow').length"), "| ledger overflow:", await js("(()=>{const l=document.querySelector('.ledger'); return l.scrollWidth>l.clientWidth})()"));
  }
  // 390: the Unskippable card's image is there (it was blank in a full-page capture on MEXA-2140), and the org sheet reads stacked.
  await mobile(390); await load(900); await sleep(1200);
  chat = () => sse(CANNED.short);
  await js("window.ASK(\"What's Unskippable?\", 'unskippable'); 1"); ok = await waitDone(); await sleep(400);
  log("390 unskippable card image:", await js("(()=>{const i=document.querySelector('#thread .msg.bot:last-child .pcard-shot'); return i ? i.loading+' complete='+i.complete+' natural='+i.naturalWidth : 'no img'})()"), "| scrollWidth:", await js("document.documentElement.scrollWidth"));
  await js("window.scrollTo(0,0); 1"); await sleep(200); await shot("mobile-390-unskippable-full.png", true);
  chat = () => sse(CANNED.org);
  await js("window.ASK('How does he use AI agents?', 'org'); 1"); ok = await waitDone();
  log("390 org: narrow:", await js("document.querySelector('#thread .msg.bot:last-child .dd-org')?.classList.contains('dd-narrow')"), "| sheet px:", await js("(()=>{const r=document.querySelector('#thread .msg.bot:last-child .dd-org-sheet').getBoundingClientRect(); return Math.round(r.width)+'x'+Math.round(r.height)})()"), "| scrollWidth:", await js("document.documentElement.scrollWidth"), "| smallest text px:", await js("(()=>{const s=document.querySelector('#thread .msg.bot:last-child .dd-org-sheet'); const k=s.getBoundingClientRect().width/s.viewBox.baseVal.width; let m=99; for(const t of s.querySelectorAll('text')){const fs=parseFloat(getComputedStyle(t).fontSize)*k; if(fs<m)m=fs;} return m.toFixed(1)})()"));
  await js("document.querySelector('#thread .msg.bot:last-child .dd-org').scrollIntoView({block:'start', behavior:'instant'}); window.scrollBy(0,-60); 1"); await sleep(5200);
  await shot("mobile-390-org.png");
  await js("window.scrollTo(0,0); 1"); await sleep(200); await shot("mobile-390-org-full.png", true);
  // Keyboard open at 390: the layout viewport shrinks (interactive-widget=resizes-content); the dock must stay in view with the input focused.
  await mobile(390, 844); await load(900); await sleep(1500);
  chat = () => sse(CANNED.tend);
  await js("window.ASK(\"What's Tend?\", 'tend'); 1"); await waitDone();
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 508, deviceScaleFactor: 3, mobile: true });
  await js("document.getElementById('input').focus(); window.scrollTo(0, document.documentElement.scrollHeight); 1"); await sleep(500);
  log("keyboard 390x508: composer in view:", await js("(()=>{const r=document.getElementById('composer').getBoundingClientRect(); return r.bottom<=innerHeight && r.top>=0})()"), "| input focused:", await js("document.activeElement===document.getElementById('input')"), "| chips in view:", await js("document.getElementById('chips').getBoundingClientRect().top>=0"));
  await shot("mobile-390-keyboard.png");

  // Reduced motion: whole answer at once, nothing animating, no hero writing.
  await desktop(); await setMedia("reduce"); await load(500);
  log("reduced motion: hero writing:", await js("document.querySelector('#hero').classList.contains('writing')"), "| hero toks:", await js("document.querySelectorAll('#hero .tok').length"));
  chat = () => sse(CANNED.built);
  await js("window.ASK('What has Itai built?', 'projects'); 1"); await sleep(700);
  log("reduced motion: answer done at 0.7s:", await js("!!document.querySelector('#thread .answer.done')"), "| running animations:", await js("document.getAnimations().filter(a=>a.playState==='running').length"), "| thinking shown:", await js("!!document.querySelector('.thinking')"));
  chat = () => sse(CANNED.org);
  await js("window.ASK('How does he use AI agents?', 'org'); 1"); await sleep(500);
  log("reduced motion org: still:", await js("document.querySelector('#thread .msg.bot:last-child .dd-org')?.classList.contains('still')"), "| all visible:", await js("[...document.querySelectorAll('#thread .msg.bot:last-child .dd-org .dd-fade')].every(e=>getComputedStyle(e).opacity==='1')"), "| running:", await js("document.getAnimations().filter(a=>a.playState==='running').length"));
  await setMedia("no-preference");
}

if (mode === "live") {
  const QUESTIONS = process.env.LIVE_QUESTIONS ? process.env.LIVE_QUESTIONS.split("|") : ["How does he use AI agents?", "Why should I hire him?", "What's Mexant?", "Who are Mexant's clients?", "What's Tend?", "Tell me about Tickets"];
  const transcript = [`# Live transcript · ${new Date().toISOString()} · ${url}\n`];
  await desktop(); await setMedia("no-preference"); await load(1200);
  log("health on load:", await js("document.body.dataset.model"));
  await js("window.__fetch = window.fetch; 1");
  let i = 0;
  for (const q of QUESTIONS) {
    i++;
    const topic = await js(`(window.ANSWERS.prompts[${JSON.stringify(q)}] || '')`);
    const t0 = Date.now();
    if (topic) await js(`window.ASK(${JSON.stringify(q)}, ${JSON.stringify(topic)}); 1`); else await type(q);
    if (i === 1) { await sleep(2200); await shot("live-desktop-streaming.png"); }
    const ok = await waitDone(60000);
    const a = await lastAnswer(); const model = await lastModel();
    const arts = await js("[...document.querySelectorAll('#thread .msg.bot:last-child .art')].map(a=>a.dataset.art).join(',')");
    log(`Q${i} "${q}" → ${model} in ${Date.now() - t0} ms, done ${ok}, arts [${arts}]: ${a.slice(0, 100)}`);
    transcript.push(`**Q${i}: ${q}**\n\n_${model}, ${Date.now() - t0} ms, artifacts: ${arts || "none"}_\n\n${a}\n`);
    if (i === 1) { await js("document.querySelector('#thread .msg.bot:last-child').scrollIntoView({block:'start', behavior:'instant'}); window.scrollBy(0,-70); 1"); await sleep(5000); await shot("live-desktop-org.png"); }
    if (i === 5) { await js("document.querySelector('#thread .msg.bot:last-child').scrollIntoView({block:'start', behavior:'instant'}); window.scrollBy(0,-70); 1"); await sleep(600); await shot("live-desktop-linked.png"); }
  }
  await js("window.scrollTo(0,0); 1"); await sleep(200); await shot("live-desktop-full.png", true);
  writeFileSync(join(outdir, "transcript.md"), transcript.join("\n"));
  // One mobile live answer.
  await mobile(390); await load(1200);
  await js("window.ASK(\"What's Unskippable?\", 'unskippable'); 1"); await sleep(2000); await shot("live-mobile-390-streaming.png");
  const ok = await waitDone(60000); log("mobile live: done", ok, "| model:", await lastModel(), "| demo:", await js("!!document.querySelector('#thread .msg.bot:last-child .demo-unsk')"));
  await js("window.scrollTo(0,0); 1"); await sleep(200); await shot("live-mobile-390-answer-full.png", true);
  await js("window.scrollTo(0, document.documentElement.scrollHeight); 1"); await sleep(300); await shot("live-mobile-390-answer-end.png");
}

const errs = logs.filter(l => /^(error|exception)/.test(l));
log("console errors:", errs.length, errs.slice(0, 5).join(" || "));
writeFileSync(join(outdir, `${mode}-console.txt`), logs.join("\n") + "\n");
writeFileSync(join(outdir, `${mode}-checks.txt`), out.join("\n") + "\n");
ws.close(); proc.kill();
