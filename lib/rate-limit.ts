import "server-only";
import { createHash } from "node:crypto";
import { getConfig } from "@/lib/config";
import { getAdminClient } from "@/lib/supabase/admin";

/**
 * Fixed-window rate limiting per (hashet IP, rute) i Postgres.
 * Ingen rå IP-er lagres. Feiler åpent: en DB-hikke skal ikke ta ned tjenesten.
 */
export async function checkRateLimit(
  request: Request,
  route: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean }> {
  const db = getAdminClient();
  if (!db) return { allowed: true };

  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const { rateLimitSalt } = getConfig();
  const hashed = createHash("sha256").update(ip + rateLimitSalt).digest("hex");
  const windowStart = new Date(
    Math.floor(Date.now() / (windowSeconds * 1000)) * windowSeconds * 1000,
  );

  const { data, error } = await db.rpc("bump_rate_limit", {
    p_key: `${hashed}:${route}`,
    p_window_start: windowStart.toISOString(),
  });
  if (error) {
    console.error("rate_limit rpc failed", error.message);
    return { allowed: true };
  }
  return { allowed: (data as number) <= limit };
}
