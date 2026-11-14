import { DurableObject } from "cloudflare:workers";

// One named SQLite Durable Object holds every limit (MEXA-1425: in-memory
// counters don't hold across Worker isolates). All methods run single-threaded
// inside the object, so check-and-reserve is atomic.

export type Limits = { perHour: number; perDay: number; capUsd: number };
export type Admit =
  | { ok: true; id: string }
  | { ok: false; reason: "rate_limited"; retryAfter: number }
  | { ok: false; reason: "daily_cap" };

const HOUR = 3600_000;
const DAY = 24 * HOUR;
const STALE_RESERVATION = 5 * 60_000; // a request that never settled is charged in full after this

const utcDay = (t: number) => new Date(t).toISOString().slice(0, 10);
const nextUtcMidnight = (t: number) => Math.ceil((t + 1) / DAY) * DAY;

export class LimitsDO extends DurableObject {
  private sql: SqlStorage;

  constructor(ctx: DurableObjectState, env: unknown) {
    super(ctx, env as never);
    this.sql = ctx.storage.sql;
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS hits (ip TEXT NOT NULL, ts INTEGER NOT NULL);
      CREATE INDEX IF NOT EXISTS hits_ip_ts ON hits (ip, ts);
      CREATE TABLE IF NOT EXISTS spend (day TEXT PRIMARY KEY, usd REAL NOT NULL DEFAULT 0, requests INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS pending (id TEXT PRIMARY KEY, day TEXT NOT NULL, usd REAL NOT NULL, ts INTEGER NOT NULL);
    `);
  }

  private charge(day: string, usd: number) {
    this.sql.exec(
      `INSERT INTO spend (day, usd, requests) VALUES (?, ?, 1)
       ON CONFLICT(day) DO UPDATE SET usd = usd + excluded.usd, requests = requests + 1`,
      day, usd
    );
  }

  private sweep(now: number) {
    this.sql.exec(`DELETE FROM hits WHERE ts < ?`, now - DAY);
    for (const r of this.sql.exec<{ id: string; day: string; usd: number }>(`SELECT id, day, usd FROM pending WHERE ts < ?`, now - STALE_RESERVATION).toArray()) {
      this.charge(r.day, r.usd);
      this.sql.exec(`DELETE FROM pending WHERE id = ?`, r.id);
    }
  }

  // Counts the question against the IP, then reserves the worst-case cost of
  // this request against today's cap so parallel requests can't overshoot it.
  admit(ipHash: string, reserveUsd: number, lim: Limits): Admit {
    const now = Date.now();
    this.sweep(now);
    const day = utcDay(now);

    const spent = this.sql.exec<{ usd: number }>(`SELECT usd FROM spend WHERE day = ?`, day).toArray()[0]?.usd ?? 0;
    const held = this.sql.exec<{ s: number }>(`SELECT COALESCE(SUM(usd), 0) AS s FROM pending WHERE day = ?`, day).one().s;
    if (spent + held + reserveUsd > lim.capUsd) return { ok: false, reason: "daily_cap" };

    const hour = this.sql.exec<{ n: number; first: number | null }>(
      `SELECT COUNT(*) AS n, MIN(ts) AS first FROM hits WHERE ip = ? AND ts > ?`, ipHash, now - HOUR).one();
    if (hour.n >= lim.perHour) return { ok: false, reason: "rate_limited", retryAfter: Math.ceil(((hour.first ?? now) + HOUR - now) / 1000) };
    const dayHits = this.sql.exec<{ n: number; first: number | null }>(
      `SELECT COUNT(*) AS n, MIN(ts) AS first FROM hits WHERE ip = ? AND ts > ?`, ipHash, now - DAY).one();
    if (dayHits.n >= lim.perDay) return { ok: false, reason: "rate_limited", retryAfter: Math.ceil(((dayHits.first ?? now) + DAY - now) / 1000) };

    this.sql.exec(`INSERT INTO hits (ip, ts) VALUES (?, ?)`, ipHash, now);
    const id = crypto.randomUUID();
    this.sql.exec(`INSERT INTO pending (id, day, usd, ts) VALUES (?, ?, ?, ?)`, id, day, reserveUsd, now);
    return { ok: true, id };
  }

  // Swaps the reservation for the real cost. usd = null means the provider
  // gave no usage (stream died): the reservation is charged in full.
  settle(id: string, usd: number | null) {
    const r = this.sql.exec<{ day: string; usd: number }>(`SELECT day, usd FROM pending WHERE id = ?`, id).toArray()[0];
    if (!r) return;
    this.sql.exec(`DELETE FROM pending WHERE id = ?`, id);
    this.charge(r.day, usd ?? r.usd);
  }

  // A request that was admitted but never reached the provider costs nothing.
  release(id: string) {
    this.sql.exec(`DELETE FROM pending WHERE id = ?`, id);
  }

  status(capUsd: number) {
    const now = Date.now();
    const day = utcDay(now);
    const row = this.sql.exec<{ usd: number; requests: number }>(`SELECT usd, requests FROM spend WHERE day = ?`, day).toArray()[0];
    const held = this.sql.exec<{ s: number }>(`SELECT COALESCE(SUM(usd), 0) AS s FROM pending WHERE day = ?`, day).one().s;
    return { day, spentUsd: row?.usd ?? 0, heldUsd: held, requests: row?.requests ?? 0, capUsd, resetsAt: new Date(nextUtcMidnight(now)).toISOString() };
  }
}
