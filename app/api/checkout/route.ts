import { NextResponse } from "next/server";
import { z } from "zod";
import { readSession, writeSession } from "@/lib/auth/session";
import {
  jsonError,
  paymentsUnavailable,
  readJsonBody,
  tooManyRequests,
} from "@/lib/api-helpers";
import { getConfig } from "@/lib/config";
import { getOrCreateCustomer, grantKlipp } from "@/lib/payments/klippekort";
import { getStripe } from "@/lib/payments/stripe";
import { unlockFinn } from "@/lib/payments/unlock";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  KLIPP_GYLDIGHET_MANEDER,
  KLIPP_PER_KJOP,
  KLIPP_PRIS_ORE,
} from "@/lib/site";

const bodySchema = z.object({
  consent: z.literal(true),
  finnkode: z.string().regex(/^\d{8,10}$/).optional(),
});

export async function POST(request: Request) {
  const config = getConfig();
  const stripe = getStripe();
  if (!config.features.payments) return paymentsUnavailable();

  const { allowed } = await checkRateLimit(request, "checkout", 5, 600);
  if (!allowed) return tooManyRequests();

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const parsed = bodySchema.safeParse(body.body);
  if (!parsed.success) {
    return jsonError(
      400,
      "INVALID_REQUEST",
      "Ugyldig forespørsel. Bekreft vilkårene og prøv igjen.",
    );
  }
  const { finnkode } = parsed.data;
  const appSession = await readSession();

  // Lokal utvikling uten Stripe: krediter kortet direkte.
  if (config.devBypassPayments && !stripe) {
    const customerId = await getOrCreateCustomer({
      customerId: appSession?.customerId,
      name: appSession?.name,
    });
    await grantKlipp(customerId, `dev_${crypto.randomUUID()}`);
    await writeSession({ ...appSession, customerId });
    const unlocked = finnkode
      ? await unlockFinn(customerId, finnkode)
      : null;
    return NextResponse.json({
      checkoutUrl:
        unlocked?.ok
          ? `${config.siteUrl}${unlocked.calculationUrl}`
          : `${config.siteUrl}/klippekort?kjop=ok`,
    });
  }
  if (!stripe) return paymentsUnavailable();

  try {
    const customerId = await getOrCreateCustomer({
      customerId: appSession?.customerId,
      name: appSession?.name,
    });
    await writeSession({ ...appSession, customerId });

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "nb",
      customer: customerId,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "nok",
            unit_amount: KLIPP_PRIS_ORE,
            product_data: {
              name: `Klippekort – ${KLIPP_PER_KJOP} FINN-importer`,
              description: `Gyldig i ${KLIPP_GYLDIGHET_MANEDER} måneder. Ingen abonnement.`,
            },
          },
        },
      ],
      metadata: {
        kind: "klippekort",
        customerId,
        ...(finnkode ? { finnkode } : {}),
      },
      payment_intent_data: {
        metadata: { kind: "klippekort", customerId },
      },
      success_url: `${config.siteUrl}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.siteUrl}/?betaling=avbrutt`,
      custom_text: {
        submit: {
          message:
            "Klippekortet krediteres umiddelbart etter betaling. Ved å betale samtykker du til dette og til at angreretten bortfaller (angrerettloven § 22 n).",
        },
      },
    });

    if (!checkout.url) throw new Error("session.url mangler");
    return NextResponse.json({ checkoutUrl: checkout.url });
  } catch (error) {
    console.error(
      "stripe checkout failed",
      error instanceof Error ? error.message : error,
    );
    return jsonError(500, "CHECKOUT_FAILED", "Kunne ikke starte betalingen.");
  }
}
