import "server-only";
import type { AnalysisResult } from "@/lib/ai/schema";
import { rpc } from "@/lib/db/client";

/**
 * KI-analysene slik databasen ser dem. Som for kjøpene går alt
 * gjennom databasefunksjoner: start av kjøring og trekk av kreditt skjer
 * under radlås, og kreditten trekkes først når resultatet lagres.
 */
export type AnalysisStatus = "created" | "uploaded" | "running" | "done" | "failed";

export interface AnalysisRow {
  id: string;
  status: AnalysisStatus;
  filename: string;
  sizeBytes: number;
  result: AnalysisResult | null;
  error: string | null;
  /** Kan kjøres (eller er kjørt) uten ny betaling. */
  paid: boolean;
  createdAt: string;
}

export const ANALYSIS_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export async function createAnalysis(options: {
  id: string;
  userId: string | null;
  storagePath: string;
  filename: string;
  sizeBytes: number;
}): Promise<void> {
  await rpc<null>("create_analysis", {
    p_id: options.id,
    p_user_id: options.userId,
    p_storage_path: options.storagePath,
    p_filename: options.filename,
    p_size_bytes: options.sizeBytes,
  });
}

export async function getAnalysis(id: string): Promise<AnalysisRow | null> {
  if (!ANALYSIS_ID_PATTERN.test(id)) return null;
  return rpc<AnalysisRow | null>("get_analysis", { p_id: id });
}

export async function markAnalysisUploaded(id: string): Promise<void> {
  await rpc<null>("mark_analysis_uploaded", { p_id: id });
}

export async function attachAnalysisPurchase(
  id: string,
  reference: string,
): Promise<void> {
  await rpc<null>("attach_analysis_purchase", { p_id: id, p_reference: reference });
}

export async function analysisForReference(
  reference: string,
): Promise<string | null> {
  return rpc<string | null>("analysis_for_reference", { p_reference: reference });
}

export async function claimAnalysis(id: string, userId: string): Promise<void> {
  await rpc<null>("claim_analysis", { p_id: id, p_user_id: userId });
}

export type BeginOutcome = "ok" | "done" | "running" | "not_uploaded" | "unpaid";

export async function beginAnalysis(
  id: string,
): Promise<{ outcome: BeginOutcome; storagePath: string | null }> {
  const rows = await rpc<{ outcome: BeginOutcome; storage_path: string | null }[]>(
    "begin_analysis",
    { p_id: id },
  );
  const row = rows?.[0];
  if (!row) throw new Error("begin_analysis ga ingen rad");
  return { outcome: row.outcome, storagePath: row.storage_path };
}

/** Lagrer resultatet og trekker én kreditt, atomisk. */
export async function completeAnalysis(
  id: string,
  result: AnalysisResult,
): Promise<"ok" | "done" | "no_credit"> {
  return rpc<"ok" | "done" | "no_credit">("complete_analysis", {
    p_id: id,
    p_result: result,
  });
}

export async function failAnalysis(id: string, error: string): Promise<void> {
  await rpc<null>("fail_analysis", { p_id: id, p_error: error });
}

export interface KiStatus {
  remaining: number;
  expiresAt: string | null;
  analyses: {
    id: string;
    status: AnalysisStatus;
    filename: string;
    address: string | null;
    createdAt: string;
  }[];
}

/** Antall analyser igjen og rapportene brukeren eier. */
export async function loadKiStatus(userId: string): Promise<KiStatus> {
  const raw = await rpc<KiStatus | null>("ki_status", { p_user_id: userId });
  return {
    remaining: Number(raw?.remaining ?? 0),
    expiresAt: raw?.expiresAt ?? null,
    analyses: raw?.analyses ?? [],
  };
}

/** Analyser som fortsatt har en fil i lagringen etter `minAgeHours` timer. */
export async function listStaleAnalysisFiles(
  minAgeHours: number,
): Promise<{ id: string; storagePath: string }[]> {
  const rows = await rpc<{ id: string; storage_path: string }[] | null>(
    "stale_analysis_files",
    { p_min_age_hours: minAgeHours },
  );
  return (rows ?? []).map((row) => ({ id: row.id, storagePath: row.storage_path }));
}

export async function markAnalysisFileDeleted(id: string): Promise<void> {
  await rpc<null>("mark_analysis_file_deleted", { p_id: id });
}
