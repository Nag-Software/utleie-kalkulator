import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  jsonError,
  paymentsUnavailable,
  readJsonBody,
  tooManyRequests,
} from "@/lib/api-helpers";
import { readSession } from "@/lib/auth/session";
import { getConfig } from "@/lib/config";
import { completePurchase, startPurchase } from "@/lib/db/klippekort";
import { unlockFinn } from "@/lib/klippekort/unlock";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  KLIPP_PER_KJOP,
  KLIPP_PRIS_ORE,
  KLIPP_PRODUCT_ID,
} from "@/lib/site";
import { createVippsPayment } from "@/lib/vipps/epayment";

const bodySchema = z.object({
  consent: z.literal(true),
  /** Annonsen brukeren vil åpne rett etter kjøpet. */
  finnkode: z.string().regex(/^\d{8,10}$/).optional(),
});

/**
 * Vipps' referanse må være 8–50 tegn, kun a-z, A-Z, 0-9 og bindestrek.
 * `uk-` + 32 heksadesimaler = 35 tegn.
 */
function newReference(): string {
  return `uk-${randomUUID().replaceAll("-", "")}`;
}

export async function POST(request: Request) {
  const config = getConfig();
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

  // Klippekortet eies av en Vipps-bruker, så innlogging må skje først.
  const session = await readSession();
  if (!session) {
    return jsonError(
      401,
      "LOGIN_REQUIRED",
      "Logg inn med Vipps for å kjøpe klippekort.",
    );
  }

  const reference = newReference();

  try {
    await startPurchase({
      userId: session.userId,
      productId: KLIPP_PRODUCT_ID,
      reference,
      finnkode,
    });

    // Lokal utvikling uten Vipps-nøkler (DEV_FAKE_PAYMENTS=1).
    if (config.devFakePayments) {
      await completePurchase({ reference, amountOre: KLIPP_PRIS_ORE });
      const unlocked = finnkode
        ? await unlockFinn(session.userId, finnkode)
        : null;
      return NextResponse.json({
        redirectUrl:
          unlocked?.ok && unlocked.calculationUrl
            ? `${config.siteUrl}${unlocked.calculationUrl}`
            : `${config.siteUrl}/klippekort?kjop=ok`,
      });
    }

    const { redirectUrl } = await createVippsPayment({
      reference,
      amountOre: KLIPP_PRIS_ORE,
      description: `Klippekort – ${KLIPP_PER_KJOP} FINN-importer`,
      returnUrl: `${config.siteUrl}/api/vipps/retur?ref=${reference}`,
    });

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error(
      "vipps checkout feilet",
      error instanceof Error ? error.message : error,
    );
    return jsonError(500, "CHECKOUT_FAILED", "Kunne ikke starte betalingen.");
  }
}
