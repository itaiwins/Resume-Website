// Production front door (wrangler.prod.jsonc, MEXA-2172). Serves public/ as before, but
// only itairotem.com and www.itairotem.com may be indexed. Every other host (the
// workers.dev preview included) stays noindex: X-Robots-Tag, the robots meta and robots.txt.
// The headers are set here rather than trusted from _headers, so neither host depends on
// whether _headers applies to responses that pass through a Worker.
export const INDEXED_HOSTS = new Set(["itairotem.com", "www.itairotem.com"]);

const BASE_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

const ROBOTS_OPEN = "User-agent: *\nAllow: /\n";
const ROBOTS_META = /<meta name="robots"[^>]*>\n?/;

export async function serve(req, assets) {
  const indexed = INDEXED_HOSTS.has(new URL(req.url).hostname);
  if (indexed && new URL(req.url).pathname === "/robots.txt") {
    return new Response(ROBOTS_OPEN, { headers: { ...BASE_HEADERS, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
  }
  const res = await assets.fetch(req);
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(BASE_HEADERS)) headers.set(k, v);
  if (indexed) headers.delete("X-Robots-Tag");
  else headers.set("X-Robots-Tag", "noindex, nofollow");
  if (indexed && (headers.get("Content-Type") || "").startsWith("text/html")) {
    const html = (await res.text()).replace(ROBOTS_META, "");
    headers.delete("Content-Length");
    headers.delete("ETag");
    return new Response(html, { status: res.status, statusText: res.statusText, headers });
  }
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

export default { fetch: (req, env) => serve(req, env.ASSETS) };
