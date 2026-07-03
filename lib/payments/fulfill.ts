import "server-only";
import type Stripe from "stripe";
import { fetchFinnListing, FinnError } from "@/lib/finn/fetch";
import {
  chunkValue,
  type PaidCalculation,
  parsePaidMetadata,
  type StoredFinn,
} from "@/lib/payments/metadata";
import { getStripe } from "@/lib/payments/stripe";

export type PaidLookup =
  | { kind: "unavailable" } // Stripe ikke konfigurert
  | { kind: "not_found" } // ugyldig/ukjent session
  | { kind: "unpaid" }
  | { kind: "failed"; code: string; refunded: boolean }
  | {
      kind: "ready";
      finn: StoredFinn;
      calculation: PaidCalculation;
      paymentIntentId: string;
      /** rå PI-metadata — trengs for å nullstille gamle chunks ved omskriving */
      piMetadata: Record<string, string>;
      sessionId: string;
    };

const SESSION_ID_PATTERN = /^cs_[a-zA-Z0-9_]+$/;

/**
 * Slår opp en betalt beregning med Stripe som eneste sannhetskilde, og
 * fullfører den ved første besøk (henter FINN-data inn i PaymentIntent-
 * metadata). Hard FINN-feil → automatisk refusjon. Trygg å kalle gjentatte
 * ganger: samtidige kall kan i verste fall hente FINN dobbelt (ufarlig) —
 * dobbel refusjon avvises av Stripe og behandles som allerede refundert.
 */
export async function loadOrFulfill(sessionId: string): Promise<PaidLookup> {
  const stripe = getStripe();
  if (!stripe) return { kind: "unavailable" };
  if (!SESSION_ID_PATTERN.test(sessionId)) return { kind: "not_found" };

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
  } catch {
    return { kind: "not_found" };
  }

  if (session.payment_status !== "paid") return { kind: "unpaid" };
  const paymentIntent = session.payment_intent;
  if (!paymentIntent || typeof paymentIntent === "string") {
    return { kind: "not_found" };
  }

  let calculation = parsePaidMetadata(paymentIntent.metadata);

  if (calculation.state.kind === "failed") {
    return {
      kind: "failed",
      code: calculation.state.code,
      refunded: calculation.state.refunded,
    };
  }

  if (calculation.state.kind === "fulfilled" && calculation.finn) {
    return {
      kind: "ready",
      finn: calculation.finn,
      calculation,
      paymentIntentId: paymentIntent.id,
      piMetadata: paymentIntent.metadata,
      sessionId,
    };
  }

  // Første besøk (eller korrupt lagring): hent fra FINN nå.
  const finnkode =
    paymentIntent.metadata.finnkode ?? session.metadata?.finnkode ?? null;
  if (!finnkode) return { kind: "not_found" };

  try {
    const outcome = await fetchFinnListing(finnkode);
    const stored: StoredFinn = { p: outcome.parsed, w: outcome.warnings };
    const metadata = {
      state: "fulfilled",
      finnkode,
      consent: "true",
      ...chunkValue("finn", stored, paymentIntent.metadata),
    };
    await stripe.paymentIntents.update(paymentIntent.id, { metadata });
    const merged = { ...paymentIntent.metadata, ...metadata };
    calculation = parsePaidMetadata(merged);
    return {
      kind: "ready",
      finn: stored,
      calculation,
      paymentIntentId: paymentIntent.id,
      piMetadata: merged,
      sessionId,
    };
  } catch (error) {
    const code = error instanceof FinnError ? error.code : "PARSE_FAIL";
    console.error(`fulfillment failed for ${sessionId}: ${code}`);
    const refunded = await refundOnce(stripe, paymentIntent.id);
    await stripe.paymentIntents
      .update(paymentIntent.id, {
        metadata: { state: `${refunded ? "refunded" : "failed"}:${code}` },
      })
      .catch(() => undefined);
    return { kind: "failed", code, refunded };
  }
}

async function refundOnce(
  stripe: Stripe,
  paymentIntentId: string,
): Promise<boolean> {
  try {
    await stripe.refunds.create({ payment_intent: paymentIntentId });
    return true;
  } catch (error) {
    const stripeError = error as { code?: string; message?: string };
    if (stripeError.code === "charge_already_refunded") return true;
    console.error(
      `refund failed for ${paymentIntentId}`,
      stripeError.message ?? error,
    );
    return false;
  }
}
