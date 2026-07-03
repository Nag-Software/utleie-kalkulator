import "server-only";
import { hashInputs, runAssessment } from "@/lib/ai/assess";
import { parseInputLenient } from "@/lib/calc/schema";
import { getCachedFinn, setCachedFinn } from "@/lib/finn/cache";
import { fetchFinnListing, FinnError } from "@/lib/finn/fetch";
import { mapFinnToInputs } from "@/lib/finn/map-to-inputs";
import type { FinnParseOutcome } from "@/lib/finn/parse";
import { getStripe } from "@/lib/payments/stripe";
import { getAdminClient } from "@/lib/supabase/admin";

/**
 * Fulfillment av en betalt FINN-beregning. Kjøres nøyaktig én gang per
 * beregning (atomisk claim i Postgres). Kalles både fra Stripe-webhooken og
 * fra status-pollingens fallback — første claimer vinner.
 *
 * Hard FINN-feil etter betaling → automatisk refusjon.
 * KI-feil alene → beregningen leveres, vurderingen retries via status-ruten.
 */
export async function fulfillCalculation(calculationId: string): Promise<void> {
  const db = getAdminClient();
  if (!db) return;

  const { data: claimed, error: claimError } = await db.rpc(
    "claim_calculation",
    { p_id: calculationId },
  );
  if (claimError) {
    console.error("claim_calculation failed", claimError.message);
    return;
  }
  if (!claimed) return; // allerede behandlet eller under behandling

  const { data: row } = await db
    .from("calculations")
    .select("finnkode")
    .eq("id", calculationId)
    .single();
  const finnkode = (row as { finnkode: string | null } | null)?.finnkode;

  if (!finnkode) {
    await failAndRefund(calculationId, "PARSE_FAIL");
    return;
  }

  let outcome: FinnParseOutcome;
  try {
    const cached = await getCachedFinn(finnkode);
    if (cached) {
      outcome = cached;
    } else {
      outcome = await fetchFinnListing(finnkode);
      await setCachedFinn(finnkode, outcome);
    }
  } catch (error) {
    const code = error instanceof FinnError ? error.code : "PARSE_FAIL";
    console.error(`FINN fetch failed for ${calculationId}: ${code}`);
    await failAndRefund(calculationId, code);
    return;
  }

  const inputs = mapFinnToInputs(outcome.parsed);
  await db
    .from("calculations")
    .update({
      status: "paid",
      inputs,
      finn_raw: {
        fetchedAt: new Date().toISOString(),
        url: outcome.parsed.url,
        labels: outcome.labels,
        parsed: outcome.parsed,
        warnings: outcome.warnings,
      },
      error_code: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", calculationId);
}

/**
 * Kjører KI-vurderingen for en betalt beregning som mangler den.
 * Idempotent og trygg å kalle gjentatte ganger (f.eks. fra status-polling).
 */
export async function ensureAiAssessment(calculationId: string): Promise<void> {
  const db = getAdminClient();
  if (!db) return;

  const { data } = await db
    .from("calculations")
    .select("kind, status, inputs, finn_raw, ai_assessment, ai_runs")
    .eq("id", calculationId)
    .single();
  const row = data as {
    kind: string;
    status: string;
    inputs: Record<string, unknown>;
    finn_raw: { parsed: Parameters<typeof runAssessment>[1] } | null;
    ai_assessment: unknown;
    ai_runs: number;
  } | null;

  if (!row || row.kind !== "finn" || row.status !== "paid") return;
  if (row.ai_assessment) return;

  const inputs = parseInputLenient(row.inputs);
  const assessment = await runAssessment(inputs, row.finn_raw?.parsed ?? null);
  if (!assessment) return;

  await db
    .from("calculations")
    .update({
      ai_assessment: assessment,
      inputs_hash: hashInputs(inputs),
      ai_runs: Math.max(1, row.ai_runs),
      updated_at: new Date().toISOString(),
    })
    .eq("id", calculationId)
    .is("ai_assessment", null); // ikke overskriv en parallell kjøring
}

async function failAndRefund(
  calculationId: string,
  errorCode: string,
): Promise<void> {
  const db = getAdminClient();
  if (!db) return;

  await db
    .from("calculations")
    .update({
      status: "failed",
      error_code: errorCode,
      updated_at: new Date().toISOString(),
    })
    .eq("id", calculationId);

  const { data } = await db
    .from("payments")
    .select("id, stripe_payment_intent_id, status")
    .eq("calculation_id", calculationId)
    .eq("status", "completed")
    .maybeSingle();
  const payment = data as {
    id: string;
    stripe_payment_intent_id: string | null;
    status: string;
  } | null;

  const stripe = getStripe();
  if (!payment?.stripe_payment_intent_id || !stripe) return;

  try {
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripe_payment_intent_id,
    });
    await db
      .from("payments")
      .update({
        status: "refunded",
        stripe_refund_id: refund.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);
    await db
      .from("calculations")
      .update({ status: "refunded", updated_at: new Date().toISOString() })
      .eq("id", calculationId);
  } catch (error) {
    console.error(
      `refund failed for ${calculationId}`,
      error instanceof Error ? error.message : error,
    );
    await db
      .from("payments")
      .update({ status: "refund_failed", updated_at: new Date().toISOString() })
      .eq("id", payment.id);
  }
}

/**
 * Registrerer at en Checkout-session er betalt og trigger fulfillment.
 * Kalles fra webhook og fra status-fallback (session verifisert mot Stripe).
 */
export async function handlePaidSession(session: {
  id: string;
  payment_intent: string | null;
  calculationId: string;
}): Promise<void> {
  const db = getAdminClient();
  if (!db) return;

  await db
    .from("payments")
    .update({
      status: "completed",
      stripe_payment_intent_id: session.payment_intent,
      angrerett_consent: true,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_session_id", session.id)
    .eq("status", "created");

  await fulfillCalculation(session.calculationId);
}
