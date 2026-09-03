import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { abortPurchase, completePurchase } from "@/lib/db/klippekort";
import { unlockFinn } from "@/lib/klippekort/unlock";
import {
  captureVippsPayment,
  getVippsPayment,
} from "@/lib/vipps/epayment";

/**
 * Retur-URL-en fra Vipps ePayment.
 *
 * Retur-kallet er bare et signal om at brukeren er tilbake — det beviser
 * ingenting. Derfor leses status alltid fra Vipps, og beløpet verifiseres
 * mot det vi lagret da kjøpet startet (`complete_purchase` avviser avvik).
 *
 * Handleren skriver aldri sesjonskapselen: referansen står i en URL, og en
 * URL som kunne gi innlogging ville vært en innloggingsomvei. Har brukeren
 * mistet kapselen underveis, krediteres klippene likevel på riktig bruker i
 * databasen, og han finner dem igjen ved å logge inn med Vipps.
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

    // Trekk beløpet før klippene krediteres: feiler trekket, skal brukeren
    // ikke få et klippekort vi aldri får betalt for. Kjøpet blir stående som
    // «pending», og et nytt treff på denne URL-en prøver igjen (capture er
    // idempotent på referanse + beløp).
    if (payment.capturedOre < payment.authorizedOre) {
      await captureVippsPayment(reference, payment.authorizedOre);
    }

    const purchase = await completePurchase({
      reference,
      amountOre: payment.authorizedOre,
    });

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
