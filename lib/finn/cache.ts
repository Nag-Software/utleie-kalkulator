import "server-only";
import { getAdminClient } from "@/lib/supabase/admin";
import type { FinnParseOutcome } from "./parse";

const MAX_AGE_MS = 15 * 60 * 1000;

/** Gjenbruk preview-hentingen ved fulfillment — én FINN-henting per kjøp. */
export async function getCachedFinn(
  finnkode: string,
): Promise<FinnParseOutcome | null> {
  const db = getAdminClient();
  if (!db) return null;
  const { data } = await db
    .from("finn_cache")
    .select("data, fetched_at")
    .eq("finnkode", finnkode)
    .maybeSingle();
  if (!data) return null;
  if (Date.now() - new Date(data.fetched_at as string).getTime() > MAX_AGE_MS) {
    return null;
  }
  return data.data as FinnParseOutcome;
}

export async function setCachedFinn(
  finnkode: string,
  outcome: FinnParseOutcome,
): Promise<void> {
  const db = getAdminClient();
  if (!db) return;
  await db.from("finn_cache").upsert({
    finnkode,
    data: outcome,
    fetched_at: new Date().toISOString(),
  });
}
