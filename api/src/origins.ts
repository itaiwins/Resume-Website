// Exact origins only (Guts + Gojo, MEXA-2172): the real site and the one preview Worker.
// No wildcard: *.itairotem23.workers.dev would let every Worker on the account in.
const ALLOWED_ORIGINS = new Set([
  "https://itairotem.com",
  "https://www.itairotem.com",
  "https://itairotem-ai.itairotem23.workers.dev",
]);

export const originAllowed = (origin: string) => ALLOWED_ORIGINS.has(origin);
