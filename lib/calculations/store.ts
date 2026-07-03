import "server-only";
import type { StoredAiAssessment } from "@/lib/ai/types";
import type { CalcInput } from "@/lib/calc/schema";
import type {
  CalculationStatus,
  PublicCalculation,
} from "@/lib/calculations/types";
import type { FinnParsedData } from "@/lib/finn/types";
import { getAdminClient } from "@/lib/supabase/admin";

export interface CalculationRow {
  id: string;
  kind: "manual" | "finn";
  status: CalculationStatus;
  finnkode: string | null;
  finn_raw: {
    fetchedAt: string;
    url: string;
    labels: Record<string, string>;
    parsed: FinnParsedData;
    warnings: string[];
  } | null;
  inputs: Record<string, unknown>;
  inputs_hash: string | null;
  ai_assessment: StoredAiAssessment | null;
  ai_runs: number;
  error_code: string | null;
  created_at: string;
  updated_at: string;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export async function getCalculation(id: string): Promise<CalculationRow | null> {
  const db = getAdminClient();
  if (!db || !isUuid(id)) return null;
  const { data, error } = await db
    .from("calculations")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("getCalculation failed", error.message);
    return null;
  }
  return data as CalculationRow | null;
}

export async function insertManualCalculation(
  inputs: CalcInput,
): Promise<string | null> {
  const db = getAdminClient();
  if (!db) return null;
  const { data, error } = await db
    .from("calculations")
    .insert({ kind: "manual", status: "draft", inputs })
    .select("id")
    .single();
  if (error) {
    console.error("insertManualCalculation failed", error.message);
    return null;
  }
  return (data as { id: string }).id;
}

export async function updateCalculationInputs(
  id: string,
  inputs: CalcInput,
): Promise<boolean> {
  const db = getAdminClient();
  if (!db || !isUuid(id)) return false;
  const { error } = await db
    .from("calculations")
    .update({ inputs, updated_at: new Date().toISOString() })
    .eq("id", id)
    .in("status", ["draft", "paid"]);
  if (error) {
    console.error("updateCalculationInputs failed", error.message);
    return false;
  }
  return true;
}

/** Offentlig visning av en beregning — det klienten får se. */
export function toPublicCalculation(row: CalculationRow): PublicCalculation {
  return {
    id: row.id,
    kind: row.kind,
    status: row.status,
    inputs: row.inputs,
    finn: row.finn_raw
      ? { ...row.finn_raw.parsed, warnings: row.finn_raw.warnings }
      : null,
    aiAssessment: row.ai_assessment,
    aiRuns: row.ai_runs,
    errorCode: row.error_code,
    createdAt: row.created_at,
  };
}
