// node --test test/worker.test.mjs  (no dependencies; ASSETS is a stub that answers like the asset binding)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { serve } from "../src/worker.js";

const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const robots = readFileSync(new URL("../public/robots.txt", import.meta.url), "utf8");
const assets = { fetch: async req => {
  const p = new URL(req.url).pathname;
  if (p === "/") return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex, nofollow", ETag: '"x"' } });
  if (p === "/robots.txt") return new Response(robots, { headers: { "Content-Type": "text/plain", "X-Robots-Tag": "noindex, nofollow" } });
  return new Response("nope", { status: 404, headers: { "Content-Type": "text/plain" } });
} };
const get = (u) => serve(new Request(u), assets);

for (const host of ["itairotem.com", "www.itairotem.com"]) {
  test(`${host} is indexable`, async () => {
    const r = await get(`https://${host}/`);
    assert.equal(r.headers.get("X-Robots-Tag"), null);
    assert.equal(r.headers.get("X-Content-Type-Options"), "nosniff");
    const body = await r.text();
    assert.ok(!/name="robots"/.test(body));
    assert.ok(body.includes("<title>"));
    const t = await (await get(`https://${host}/robots.txt`)).text();
    assert.match(t, /Allow: \//); assert.ok(!t.includes("Disallow"));
  });
}

for (const host of ["itairotem-ai.itairotem23.workers.dev", "itairotem.com.evil.com", "x.itairotem.com"]) {
  test(`${host} stays noindex`, async () => {
    const r = await get(`https://${host}/`);
    assert.equal(r.headers.get("X-Robots-Tag"), "noindex, nofollow");
    assert.match(await r.text(), /<meta name="robots" content="noindex, nofollow">/);
    assert.match(await (await get(`https://${host}/robots.txt`)).text(), /Disallow: \//);
  });
}

test("a missing file keeps its status and gets noindex off-domain", async () => {
  const r = await get("https://itairotem-ai.itairotem23.workers.dev/missing");
  assert.equal(r.status, 404); assert.equal(r.headers.get("X-Robots-Tag"), "noindex, nofollow");
});
