import "server-only";

/**
 * Best-effort fixed-window rate limiting i minnet, per serverless-instans.
 * Uten database er dette et naivt vern mot enkle løkker — ikke mot
 * distribuerte angrep. De dyre operasjonene ligger uansett bak betaling.
 */
const buckets = new Map<string, { windowStart: number; count: number }>();
const MAX_BUCKETS = 10_000;

export async function checkRateLimit(
  request: Request,
  route: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean }> {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const windowMs = windowSeconds * 1000;
  const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
  const key = `${ip}:${route}`;

  if (buckets.size > MAX_BUCKETS) {
    for (const [k, v] of buckets) {
      if (v.windowStart < windowStart) buckets.delete(k);
    }
  }

  const entry = buckets.get(key);
  if (!entry || entry.windowStart !== windowStart) {
    buckets.set(key, { windowStart, count: 1 });
    return { allowed: limit >= 1 };
  }
  entry.count += 1;
  return { allowed: entry.count <= limit };
}
