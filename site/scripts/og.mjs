// Renders public/img/og.jpg (1200×630, the link preview) from the landing state.
// usage: node scripts/og.mjs   (box's headless Chrome over CDP, reduced motion, API blocked)
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const chrome = process.env.CHROME_PATH || "/usr/bin/google-chrome";
const proc = spawn(chrome, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${mkdtempSync(join(tmpdir(), "og-"))}`, "--no-first-run", "--hide-scrollbars", "--disable-gpu", "--font-render-hinting=none", "--allow-file-access-from-files", "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
const wsUrl = await new Promise((res, rej) => { let b = ""; proc.stderr.on("data", d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error(b)), 15000); });
const list = await (await fetch(`http://127.0.0.1:${new URL(wsUrl).port}/json/list`)).json();
const ws = new WebSocket(list.find(t => t.type === "page").webSocketDebuggerUrl);
await new Promise(r => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
await send("Network.enable");
await send("Network.setBlockedURLs", { urls: ["*workers.dev*"] });
await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await send("Page.enable");
await send("Page.navigate", { url: `file://${root}/public/index.html` });
await sleep(2500);
const r = await send("Page.captureScreenshot", { format: "jpeg", quality: 90 });
writeFileSync(join(root, "public/img/og.jpg"), Buffer.from(r.data, "base64"));
console.log("wrote public/img/og.jpg");
ws.close(); proc.kill();
