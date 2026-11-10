import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  jsonError,
  paymentsUnavailable,
  readJsonBody,
  tooManyRequests,
} from "@/lib/api-helpers";
import { rememberPendingPayment } from "@/lib/auth/payment-cookie";
import { readSession } from "@/lib/auth/session";
import { getConfig } from "@/lib/config";
import { attachAnalysisPurchase, getAnalysis } from "@/lib/db/analyses";
import { completePurchase, startPurchase } from "@/lib/db/purchases";
import { checkRateLimit } from "@/lib/rate-limit";
import { KI_PRODUCTS } from "@/lib/site";
import { createVippsPayment } from "@/lib/vipps/epayment";

const bodySchema = z.object({
  consent: z.literal(true),
  product: z.enum(["ki-analyse-1", "ki-analyse-5"]),
});

/**
 * Starter Vipps-betalingen for en opplastet salgsoppgave. Som for
 * klippekortet kreves ingen innlogging: profildelingen i betalingen
 * forteller oss hvem som eier kjøpet.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const config = getConfig();
  if (!config.features.payments) return paymentsUnavailable();

  const { allowed } = await checkRateLimit(request, "analyse-checkout", 5, 600);
  if (!allowed) return tooManyRequests();

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;
  const parsed = bodySchema.safeParse(body.body);
  if (!parsed.success) {
    return jsonError(400, "INVALID_REQUEST", "Ugyldig forespørsel.");
  }

  const { id } = await params;
  const analysis = await getAnalysis(id).catch(() => null);
  if (!analysis) return jsonError(404, "NOT_FOUND", "Fant ikke analysen.");
  if (analysis.status === "created") {
    return jsonError(409, "NOT_UPLOADED", "Salgsoppgaven er ikke lastet opp ennå.");
  }
  if (analysis.status === "done" || analysis.paid) {
    return NextResponse.json({ redirectUrl: `${config.siteUrl}/analyse/${id}` });
  }

  const productId = parsed.data.product;
  const product = KI_PRODUCTS[productId];
  const session = await readSession();
  const reference = `uk-${randomUUID().replaceAll("-", "")}`;

  try {
    await startPurchase({ userId: session?.userId ?? null, productId, reference });
    await attachAnalysisPurchase(id, reference);

    // Lokal utvikling uten Vipps-nøkler (DEV_FAKE_PAYMENTS=1).
    if (config.devFakePayments) {
      if (!session) {
        return jsonError(401, "LOGIN_REQUIRED", "DEV_FAKE_PAYMENTS krever innlogging.");
      }
      await completePurchase({ reference, amountOre: product.priceOre });
      return NextResponse.json({ redirectUrl: `${config.siteUrl}/analyse/${id}?kjop=ok` });
    }

    const { redirectUrl } = await createVippsPayment({
      reference,
      amountOre: product.priceOre,
      description:
        product.analyses === 1
          ? "KI-analyse av salgsoppgave"
          : `KI-analyse av salgsoppgave – ${product.analyses} boliger`,
      returnUrl: `${config.siteUrl}/api/vipps/retur?ref=${reference}`,
      profileScope: "name",
    });
    await rememberPendingPayment(reference);
    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error("analyse: checkout feilet", error instanceof Error ? error.message : error);
    return jsonError(500, "CHECKOUT_FAILED", "Kunne ikke starte betalingen.");
  }
}
