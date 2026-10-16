import "server-only";
import {
  abortPurchase,
  type CompletedPurchase,
  completePurchase,
  upsertVippsUser,
} from "@/lib/db/klippekort";
import {
  captureVippsPayment,
  getVippsPayment,
  getVippsUserinfo,
} from "@/lib/vipps/epayment";

/**
 * Gjør opp ett kjøp mot Vipps: leser statusen derfra, trekker beløpet og
 * krediterer klippene. Delt av de tre veiene et kjøp kan bli fullført på:
 *
 *  - retur-URL-en, når kunden kommer tilbake til nettleseren,
 *  - Vipps-webhooken, når kunden godkjenner i appen men aldri kommer
 *    tilbake (lukket fane, appbytte som havnet i en annen nettleser),
 *  - den daglige avstemmingen, som sikkerhetsnett hvis webhooken uteble.
 *
 * Alt her er idempotent: capture er bundet til referanse + beløp, og
 * `complete_purchase` krediterer bare én gang. Det er derfor trygt at to
 * av veiene treffer samme kjøp samtidig.
 */
export const REFERENCE_PATTERN = /^uk-[0-9a-f]{32}$/;

export type SettleResult =
  | { state: "paid"; purchase: CompletedPurchase; ownerSub: string | null }
  /** Vipps har ikke registrert godkjenningen ennå. */
  | { state: "pending" }
  | { state: "aborted" }
  /** Godkjent, men vi vet ikke hvem som eier kjøpet. */
  | { state: "no_owner" };

export async function settlePurchase(
  reference: string,
  /** Den innloggede brukeren, når oppgjøret skjer i kundens nettleser. */
  session: { userId: string; vippsSub: string | null } | null = null,
): Promise<SettleResult> {
  const payment = await getVippsPayment(reference);

  switch (payment.state) {
    case "ABORTED":
    case "EXPIRED":
    case "TERMINATED":
      await abortPurchase(
        reference,
        payment.state === "EXPIRED" ? "expired" : "aborted",
      );
      return { state: "aborted" };

    case "CREATED":
      return { state: "pending" };

    case "AUTHORIZED":
      break;
  }

  // `aggregate` er ikke alltid utfylt; da er beløpet på betalingen selv
  // det brukeren godkjente. Uten dette fallbacket ville vi trukket 0 og
  // fått avvik i `complete_purchase`.
  const amountOre = payment.authorizedOre || payment.amountOre;
  if (amountOre <= 0) {
    throw new Error(`fant ikke beløpet for ${reference}`);
  }

  // Trekk beløpet før klippene krediteres: feiler trekket, skal brukeren
  // ikke få et klippekort vi aldri får betalt for. Kjøpet blir stående som
  // «pending», og neste forsøk prøver igjen.
  if (payment.capturedOre < amountOre) {
    await captureVippsPayment(reference, amountOre);
  }

  // Profildelingen forteller oss hvem som betalte. Startet kjøpet uten
  // eier, opprettes kontoen her — det er dette som lar kunden kjøpe uten
  // å logge inn først.
  let ownerId = session?.userId ?? null;
  let ownerSub = session?.vippsSub ?? null;

  if (payment.profileSub) {
    const profile = await getVippsUserinfo(payment.profileSub);
    ownerId = await upsertVippsUser({
      vippsSub: payment.profileSub,
      name: profile.name,
      phoneNumber: profile.phoneNumber,
      source: "payment",
      // Er han allerede innlogget, skal betalings-sub-en peke på den
      // brukeren i stedet for å lage en ny konto ved siden av.
      linkUserId: session?.userId ?? null,
    });
    ownerSub = payment.profileSub;
  }

  // Uten innlogging og uten profildeling kan kjøpet likevel ha en eier fra
  // før (startet innlogget) — da fester `complete_purchase` den selv.
  try {
    const purchase = await completePurchase({
      reference,
      amountOre,
      userId: ownerId,
    });
    return { state: "paid", purchase, ownerSub };
  } catch (error) {
    if (!ownerId && error instanceof Error && /ingen eier/.test(error.message)) {
      return { state: "no_owner" };
    }
    throw error;
  }
}
