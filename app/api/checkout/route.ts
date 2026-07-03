import { NextResponse } from "next/server";
import { z } from "zod";
import {
  jsonError,
  paymentsUnavailable,
  readJsonBody,
  tooManyRequests,
} from "@/lib/api-helpers";
import { getConfig } from "@/lib/config";
import { getStripe } from "@/lib/payments/stripe";
import { checkRateLimit } from "@/lib/rate-limit";
import { PRICE_ORE } from "@/lib/site";

const bodySchema = z.object({
  finnkode: z.string().regex(/^\d{8,10}$/),
  consent: z.literal(true),
});

export async function POST(request: Request) {
  const config = getConfig();
  const stripe = getStripe();
  if (!config.features.payments || !stripe) return paymentsUnavailable();

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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "nb",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "nok",
            unit_amount: PRICE_ORE,
            product_data: {
              name: "FINN-beregning med KI-vurdering",
              description: `Automatisk utfylt lønnsomhetsberegning for FINN-kode ${finnkode}, inkludert objektiv KI-vurdering.`,
            },
          },
        },
      ],
      metadata: { finnkode },
      payment_intent_data: { metadata: { finnkode } },
      success_url: `${config.siteUrl}/beregning?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.siteUrl}/?betaling=avbrutt`,
      custom_text: {
        submit: {
          message:
            "Leveringen starter umiddelbart etter betaling. Ved å betale samtykker du til dette og til at angreretten bortfaller (angrerettloven § 22 n). Feiler hentingen fra FINN, refunderes beløpet automatisk.",
        },
      },
    });

    if (!session.url) throw new Error("session.url mangler");
    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error(
      "stripe checkout failed",
      error instanceof Error ? error.message : error,
    );
    return jsonError(500, "CHECKOUT_FAILED", "Kunne ikke starte betalingen.");
  }
}
