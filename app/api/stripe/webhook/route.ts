import { NextResponse } from "next/server";
import { after } from "next/server";
import type Stripe from "stripe";
import { getConfig } from "@/lib/config";
import { ensureAiAssessment, handlePaidSession } from "@/lib/payments/fulfill";
import { getStripe } from "@/lib/payments/stripe";
import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { stripeWebhookSecret } = getConfig();
  const stripe = getStripe();
  const db = getAdminClient();
  if (!stripe || !stripeWebhookSecret || !db) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      stripeWebhookSecret,
    );
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  // Idempotens: hvert event behandles nøyaktig én gang.
  const { error: dedupError } = await db
    .from("stripe_events")
    .insert({ id: event.id, type: event.type });
  if (dedupError) {
    if (dedupError.code === "23505") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error("stripe_events insert failed", dedupError.message);
    return NextResponse.json({ error: "storage failed" }, { status: 500 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const calculationId = session.metadata?.calculation_id;
    if (calculationId && session.payment_status === "paid") {
      await handlePaidSession({
        id: session.id,
        payment_intent:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent?.id ?? null),
        calculationId,
      });
      // KI-vurderingen kjører etter at svaret er sendt (unngår webhook-timeout)
      after(() => ensureAiAssessment(calculationId));
    }
  }

  return NextResponse.json({ received: true });
}
