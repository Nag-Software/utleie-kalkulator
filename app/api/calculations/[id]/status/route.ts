import { NextResponse } from "next/server";
import { after } from "next/server";
import { dbUnavailable, jsonError, tooManyRequests } from "@/lib/api-helpers";
import { getCalculation, isUuid } from "@/lib/calculations/store";
import { getConfig } from "@/lib/config";
import { ensureAiAssessment, handlePaidSession } from "@/lib/payments/fulfill";
import { getStripe } from "@/lib/payments/stripe";
import { checkRateLimit } from "@/lib/rate-limit";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Poll-endepunkt for resultatsiden. Fungerer også som fallback-fulfillment
 * når Stripe-webhooken henger: med session_id verifiseres betalingen direkte
 * mot Stripe og fulfillment trigges (første claimer vinner).
 */
export async function GET(request: Request, context: RouteContext) {
  if (!getConfig().features.db) return dbUnavailable();
  const { id } = await context.params;
  if (!isUuid(id)) return jsonError(404, "NOT_FOUND", "Fant ikke beregningen.");

  const { allowed } = await checkRateLimit(request, "calc-status", 120, 600);
  if (!allowed) return tooManyRequests();

  let row = await getCalculation(id);
  if (!row) return jsonError(404, "NOT_FOUND", "Fant ikke beregningen.");

  const sessionId = new URL(request.url).searchParams.get("session_id");
  const stripe = getStripe();

  if (
    row.status === "pending_payment" &&
    sessionId &&
    /^cs_[a-zA-Z0-9_]+$/.test(sessionId) &&
    stripe
  ) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (
        session.metadata?.calculation_id === id &&
        session.payment_status === "paid"
      ) {
        await handlePaidSession({
          id: session.id,
          payment_intent:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : (session.payment_intent?.id ?? null),
          calculationId: id,
        });
        row = (await getCalculation(id)) ?? row;
      }
    } catch (error) {
      console.error(
        "status fallback verification failed",
        error instanceof Error ? error.message : error,
      );
    }
  }

  // Retry av manglende KI-vurdering (f.eks. hvis kallet feilet ved fulfillment)
  if (
    row.status === "paid" &&
    row.kind === "finn" &&
    !row.ai_assessment &&
    getConfig().features.ai
  ) {
    after(() => ensureAiAssessment(id));
  }

  return NextResponse.json({
    status: row.status,
    errorCode: row.error_code,
    hasAi: Boolean(row.ai_assessment),
  });
}
