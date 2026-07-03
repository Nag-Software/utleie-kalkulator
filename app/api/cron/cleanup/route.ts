import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { getAdminClient } from "@/lib/supabase/admin";

/**
 * Daglig opprydding (Vercel Cron): rate limit-vinduer, FINN-cache,
 * utløpte ubetalte beregninger og gamle webhook-events.
 */
export async function GET(request: Request) {
  const { cronSecret } = getConfig();
  const authorization = request.headers.get("authorization");
  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const db = getAdminClient();
  if (!db) return NextResponse.json({ ok: true, skipped: "no db" });

  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  await db.from("rate_limits").delete().lt("window_start", dayAgo);
  await db.from("finn_cache").delete().lt("fetched_at", dayAgo);
  await db.from("stripe_events").delete().lt("received_at", monthAgo);
  await db
    .from("calculations")
    .update({ status: "failed", error_code: "PAYMENT_EXPIRED" })
    .eq("status", "pending_payment")
    .lt("created_at", dayAgo);

  return NextResponse.json({ ok: true });
}
