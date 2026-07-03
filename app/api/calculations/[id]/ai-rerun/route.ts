import { NextResponse } from "next/server";
import { hashInputs, runAssessment } from "@/lib/ai/assess";
import { dbUnavailable, jsonError, tooManyRequests } from "@/lib/api-helpers";
import { parseInputLenient } from "@/lib/calc/schema";
import { getCalculation, isUuid } from "@/lib/calculations/store";
import { getConfig } from "@/lib/config";
import { checkRateLimit } from "@/lib/rate-limit";
import { getAdminClient } from "@/lib/supabase/admin";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Én inkludert re-kjøring av KI-vurderingen etter at brukeren har justert
 * tallene (maks 2 kjøringer totalt, og kun når inputs faktisk er endret).
 */
export async function POST(request: Request, context: RouteContext) {
  const config = getConfig();
  if (!config.features.db) return dbUnavailable();
  if (!config.features.ai) {
    return jsonError(503, "AI_DISABLED", "KI-vurdering er ikke tilgjengelig ennå.");
  }

  const { id } = await context.params;
  if (!isUuid(id)) return jsonError(404, "NOT_FOUND", "Fant ikke beregningen.");

  const { allowed } = await checkRateLimit(request, "ai-rerun", 5, 3600);
  if (!allowed) return tooManyRequests();

  const row = await getCalculation(id);
  if (!row) return jsonError(404, "NOT_FOUND", "Fant ikke beregningen.");
  if (row.kind !== "finn" || row.status !== "paid") {
    return jsonError(409, "NOT_ELIGIBLE", "KI-vurdering gjelder betalte FINN-beregninger.");
  }
  if (row.ai_runs >= 2) {
    return jsonError(
      409,
      "RERUN_LIMIT",
      "Beregningen har brukt begge KI-vurderingene sine.",
    );
  }

  const inputs = parseInputLenient(row.inputs);
  const newHash = hashInputs(inputs);
  if (row.inputs_hash === newHash && row.ai_assessment) {
    return jsonError(
      409,
      "UNCHANGED",
      "Tallene er uendret siden forrige vurdering.",
    );
  }

  const assessment = await runAssessment(inputs, row.finn_raw?.parsed ?? null);
  if (!assessment) {
    return jsonError(502, "AI_FAILED", "KI-vurderingen feilet. Prøv igjen om litt.");
  }

  const db = getAdminClient();
  if (!db) return dbUnavailable();
  await db
    .from("calculations")
    .update({
      ai_assessment: assessment,
      inputs_hash: newHash,
      ai_runs: row.ai_runs + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  return NextResponse.json({ aiAssessment: assessment });
}
