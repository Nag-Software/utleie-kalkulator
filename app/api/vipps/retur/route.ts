import { NextResponse } from "next/server";
import { claimPendingPayment } from "@/lib/auth/payment-cookie";
import { readSession, writeSession } from "@/lib/auth/session";
import { getConfig } from "@/lib/config";
import {
  abortPurchase,
  completePurchase,
  upsertVippsUser,
} from "@/lib/db/klippekort";
import { unlockFinn } from "@/lib/klippekort/unlock";
import {
  captureVippsPayment,
  getVippsPayment,
  getVippsUserinfo,
} from "@/lib/vipps/epayment";

/**
 * Retur-URL-en fra Vipps ePayment.
 *
 * Retur-kallet er bare et signal om at brukeren er tilbake — det beviser
 * ingenting. Derfor leses status alltid fra Vipps, og beløpet verifiseres
 * mot det vi lagret da kjøpet startet (`complete_purchase` avviser avvik).
 *
 * Her opprettes også kontoen: ba vi om profildeling, gir Vipps oss
 * `profile.sub` når betalingen er godkjent, og da kan kunden ha kjøpt uten
 * å logge inn først.
 *
 * Innlogging skjer kun når `uk_pay`-kapselen viser at dette er samme
 * nettleser som startet betalingen — se `lib/auth/payment-cookie.ts`.
 * Klippene krediteres uansett riktig eier, siden eierskapet kommer fra
 * Vipps og ikke fra referansen i URL-en.
 */
const REFERENCE_PATTERN = /^uk-[0-9a-f]{32}$/;

// Første besøk kan hente FINN-annonsen — gi god tid.
export const maxDuration = 60;

function redirect(path: string) {
  return NextResponse.redirect(new URL(path, getConfig().siteUrl));
}

export async function GET(request: Request) {
  const config = getConfig();
  if (!config.features.payments) return redirect("/klippekort?kjop=feilet");

  const reference = new URL(request.url).searchParams.get("ref");
  if (!reference || !REFERENCE_PATTERN.test(reference)) {
    return redirect("/klippekort?kjop=feilet");
  }

  try {
    const payment = await getVippsPayment(reference);

    switch (payment.state) {
      case "ABORTED":
      case "EXPIRED":
      case "TERMINATED": {
        await abortPurchase(
          reference,
          payment.state === "EXPIRED" ? "expired" : "aborted",
        );
        return redirect("/klippekort?kjop=avbrutt");
      }

      case "CREATED":
        // Brukeren er tilbake før Vipps rakk å registrere godkjenningen.
        return redirect("/klippekort?kjop=venter");

      case "AUTHORIZED":
        break;
    }

    // `aggregate` er ikke alltid utfylt; da er beløpet på betalingen selv
    // det brukeren godkjente. Uten dette fallbacket ville vi trukket 0 og
    // fått avvik i `complete_purchase`.
    const amountOre = payment.authorizedOre || payment.amountOre;
    if (amountOre <= 0) {
      console.error("vipps retur: fant ikke beløpet for", reference);
      return redirect("/klippekort?kjop=feilet");
    }

    // Trekk beløpet før klippene krediteres: feiler trekket, skal brukeren
    // ikke få et klippekort vi aldri får betalt for. Kjøpet blir stående som
    // «pending», og et nytt treff på denne URL-en prøver igjen (capture er
    // idempotent på referanse + beløp).
    if (payment.capturedOre < amountOre) {
      await captureVippsPayment(reference, amountOre);
    }

    // Profildelingen forteller oss hvem som betalte. Startet kjøpet uten
    // eier, opprettes kontoen her — det er dette som lar kunden kjøpe uten
    // å logge inn først.
    const sameBrowser = await claimPendingPayment(reference);
    const session = await readSession();
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

    if (!ownerId) {
      console.error("vipps retur: fant ingen eier for", reference);
      return redirect("/klippekort?kjop=feilet");
    }

    const purchase = await completePurchase({
      reference,
      amountOre,
      userId: ownerId,
    });

    // Logg ham inn, så klippene er hans neste gang også — men bare hvis
    // dette er nettleseren som startet betalingen. Ellers ville referansen
    // i retur-URL-en fungert som et passord for hvem som helst som fikk
    // tak i den. Klippene er uansett kreditert riktig eier.
    if (ownerSub && sameBrowser && session?.userId !== purchase.userId) {
      await writeSession({
        userId: purchase.userId,
        vippsSub: ownerSub,
        name: session?.name ?? null,
      });
    }

    // Kjøpte han for å åpne en bestemt annonse, send ham rett dit.
    if (purchase.pendingFinnkode) {
      const unlocked = await unlockFinn(
        purchase.userId,
        purchase.pendingFinnkode,
      );
      if (unlocked.ok) return redirect(unlocked.calculationUrl);
      return redirect(`/klippekort?kjop=ok&import=${unlocked.reason}`);
    }

    return redirect("/klippekort?kjop=ok");
  } catch (error) {
    console.error(
      "vipps retur feilet",
      error instanceof Error ? error.message : error,
    );
    return redirect("/klippekort?kjop=feilet");
  }
}
