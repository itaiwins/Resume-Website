import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitize, StreamGuard } from "../src/guard.ts";
import { ipKey } from "../src/ip.ts";
import { originAllowed } from "../src/origins.ts";

// A fake Google-key-shaped string, assembled so secret scanners don't flag the fixture itself.
const FAKE_KEY = "AIza" + "SyA1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q";

test("keeps pack links and the contact email", () => {
  const ok = "Email itairotem23@gmail.com, see https://getunskippable.com, https://www.mexant.com/tend, mcpsafe.org and https://apps.apple.com/us/app/tend-agentic-notes/id6815052928.";
  assert.deepEqual(sanitize(ok), { text: ok, hits: 0 });
});

test("drops keys, foreign links and emails", () => {
  const r = sanitize(`key ${FAKE_KEY} go https://evil.example.net/x or evil.io, mail bob@evil.com, sk-proj-abcdefghijklmnop1234`);
  assert.equal(r.hits, 5, r.text);
  for (const bad of ["AIza", "evil", "bob@", "sk-proj"]) assert.ok(!r.text.includes(bad), r.text);
});

test("a prefix lookalike is not allowed", () => {
  assert.equal(sanitize("https://github.com/itaiwinsevil/x").hits, 1);
  assert.equal(sanitize("https://mcpsafe.org.evil.com/").hits, 1);
});

test("stream guard catches a key and a URL split across chunks", () => {
  const g = new StreamGuard();
  let out = "";
  for (const c of [`here ${FAKE_KEY.slice(0, 20)}`, `${FAKE_KEY.slice(20)} and https://ev`, "il.example.net/x done"]) out += g.push(c);
  out += g.flush();
  assert.ok(!out.includes("AIza") && !out.includes("evil"), out);
  assert.equal(g.hits, 2);
});

test("ipv6 buckets by /64, ipv4 as-is", () => {
  assert.equal(ipKey("1.2.3.4"), "1.2.3.4");
  assert.equal(ipKey("2001:db8:0:1::5"), "2001:db8:0:1::/64");
  assert.equal(ipKey("2001:0db8:0000:0001:aaaa:bbbb:cccc:dddd"), "2001:db8:0:1::/64");
  assert.equal(ipKey("2001:db8::1"), "2001:db8:0:0::/64");
});

test("keeps the punctuation after a removed link", () => {
  assert.equal(sanitize("see https://evil.example.net/x, then").text, "see [link removed], then");
});

test("markdown links: allowed ones stay, foreign ones keep only the label", () => {
  const ok = "Try [getunskippable.com](https://getunskippable.com) or [Tend on the App Store](https://apps.apple.com/us/app/tend-agentic-notes/id6815052928).";
  assert.deepEqual(sanitize(ok), { text: ok, hits: 0 });
  assert.deepEqual(sanitize("see [the board](https://evil.example.net/x)."), { text: "see the board.", hits: 1 });
});

test("internal subdomains of allowed hosts are not allowed", () => {
  for (const s of ["ops.mexant.com", "https://ops.mexant.com/api", "admin.mexant.com", "x.itairotem23.workers.dev"]) assert.ok(sanitize(s).hits >= 1, s);
});

test("CORS allows exactly the site and the preview", () => {
  for (const o of ["https://itairotem.com", "https://www.itairotem.com", "https://itairotem-ai.itairotem23.workers.dev"]) assert.ok(originAllowed(o), o);
  for (const o of ["", "null", "http://itairotem.com", "https://evil.com", "https://itairotem.com.evil.com", "https://evilitairotem.com", "https://x.itairotem.com",
    "https://itairotem-ai-api.itairotem23.workers.dev", "https://attacker.itairotem23.workers.dev", "https://a.itairotem-ai.itairotem23.workers.dev", "https://itairotem.com:8443", "https://itairotem.com/"]) assert.ok(!originAllowed(o), o);
});
