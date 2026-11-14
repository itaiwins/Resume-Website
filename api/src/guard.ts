// Output guard: drops anything that looks like a secret, and any link or email
// that isn't in the pack's allowlist. Runs on complete words only, so a URL
// split across two stream chunks is still caught (see StreamGuard).

export const ALLOWED_URL_PREFIXES = [
  "https://itairotem.com",
  "https://www.itairotem.com",
  "https://www.mexant.com",
  "https://mexant.com",
  "https://getunskippable.com",
  "https://mcpsafe.org",
  "https://walleto.ai",
  "https://whop.com/alphahq",
  "https://github.com/itaiwins",
  "https://www.linkedin.com/in/itai-rotem23",
  "https://linkedin.com/in/itai-rotem23",
  "https://twitter.com/itaiwins",
  "https://x.com/itaiwins",
  "https://apps.apple.com/us/app/tend-agentic-notes/id6815052928",
];
const ALLOWED_HOSTS = new Set([
  "itairotem.com", "www.itairotem.com", "mexant.com", "www.mexant.com", "getunskippable.com",
  "mcpsafe.org", "walleto.ai", "fsu.edu",
]);
const ALLOWED_EMAILS = new Set(["itairotem23@gmail.com"]);

const SECRET_PATTERNS = [
  /AIza[0-9A-Za-z_\-]{20,}/g, // Google API key
  /\b(?:sk|pk|rk)[-_](?:live|test|proj|ant)?[-_]?[0-9A-Za-z_\-]{16,}/g, // OpenAI/Stripe/Anthropic style
  /\bgh[pousr]_[0-9A-Za-z]{20,}/g, // GitHub tokens
  /\bey[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}/g, // JWT
  /\b[0-9a-fA-F]{32,}\b/g, // long hex
  /\b(?=[A-Za-z0-9+\/_\-]*\d)(?=[A-Za-z0-9+\/_\-]*[A-Z])(?=[A-Za-z0-9+\/_\-]*[a-z])[A-Za-z0-9+\/_\-]{32,}={0,2}/g, // long mixed token
];

const MD_LINK_RE = /\[([^\]\n]{1,80})\]\((https?:\/\/[^\s)]+)\)/gi;
const URL_RE = /\bhttps?:\/\/[^\s<>()"'`\]]+/gi;
const BARE_DOMAIN_RE = /\b(?:[a-z0-9-]+\.)+(?:com|org|net|io|ai|dev|app|co|xyz|me|gg|so|sh|ly|info|biz)\b(?:\/[^\s<>()"'`\]]*)?/gi;
const EMAIL_RE = /\b[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}\b/gi;

const trimPunct = (s: string) => s.replace(/[.,;:!?*_)]+$/, "");

function urlAllowed(raw: string): boolean {
  const u = trimPunct(raw).replace(/^http:\/\//i, "https://");
  return ALLOWED_URL_PREFIXES.some((p) => u === p || u.startsWith(p + "/") || u.startsWith(p + "?") || u.startsWith(p + "#"));
}

export function sanitize(text: string): { text: string; hits: number } {
  let hits = 0;
  let out = text;
  for (const re of SECRET_PATTERNS) out = out.replace(re, () => (hits++, "[removed]"));
  out = out.replace(EMAIL_RE, (m) => (ALLOWED_EMAILS.has(m.toLowerCase()) ? m : (hits++, "[removed]")));
  // A markdown link to a foreign URL keeps its label as plain text, so no "[x]([link removed])"
  out = out.replace(MD_LINK_RE, (m, label: string, url: string) => (urlAllowed(url) ? m : (hits++, label)));
  out = out.replace(URL_RE, (m) => (urlAllowed(m) ? m : (hits++, "[link removed]" + m.slice(trimPunct(m).length))));
  out = out.replace(BARE_DOMAIN_RE, (m, offset: number, whole: string) => {
    const before = whole.slice(Math.max(0, offset - 8), offset);
    if (/:\/\/[^\s]*$/.test(before) || before.endsWith("@") || before.endsWith("/")) return m; // part of a URL/email already checked
    const host = trimPunct(m).split("/")[0].toLowerCase();
    if (ALLOWED_HOSTS.has(host) || urlAllowed("https://" + trimPunct(m))) return m;
    hits++;
    return "[link removed]" + m.slice(trimPunct(m).length);
  });
  return { text: out, hits };
}

// Holds back the last unfinished word so patterns never straddle a chunk edge.
export class StreamGuard {
  private buf = "";
  hits = 0;
  push(chunk: string): string {
    this.buf += chunk;
    const cut = Math.max(this.buf.lastIndexOf(" "), this.buf.lastIndexOf("\n"));
    // A single run of 400+ chars with no whitespace is never a legit word; flush it through the guard
    if (cut < 0 && this.buf.length < 400) return "";
    const end = cut < 0 ? this.buf.length : cut + 1;
    const ready = this.buf.slice(0, end);
    this.buf = this.buf.slice(end);
    const s = sanitize(ready);
    this.hits += s.hits;
    return s.text;
  }
  flush(): string {
    const s = sanitize(this.buf);
    this.buf = "";
    this.hits += s.hits;
    return s.text;
  }
}
