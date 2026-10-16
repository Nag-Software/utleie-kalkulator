import { NextResponse } from "next/server";
import { claimPendingPayment } from "@/lib/auth/payment-cookie";
import { readSession, writeSession } from "@/lib/auth/session";
import { getConfig } from "@/lib/config";
import { unlockFinn } from "@/lib/klippekort/unlock";
import { REFERENCE_PATTERN, settlePurchase } from "@/lib/vipps/settle";

/**
 * Retur-URL-en fra Vipps ePayment.
 *
 * Retur-kallet er bare et signal om at brukeren er tilbake — det beviser
 * ingenting. Selve oppgjøret (status fra Vipps, capture, kreditering) ligger
 * i `settlePurchase`, som også webhooken og den daglige avstemmingen bruker.
 * Det som er spesielt for retur-veien, er at kunden sitter foran skjermen:
 * han kan logges inn og sendes rett til annonsen han kjøpte for.
 *
 * Innlogging skjer kun når `uk_pay`-kapselen viser at dette er samme
 * nettleser som startet betalingen — se `lib/auth/payment-cookie.ts`.
 * Klippene krediteres uansett riktig eier, siden eierskapet kommer fra
 * Vipps og ikke fra referansen i URL-en.
 */

// Første besøk kan hente FINN-annonsen — gi god tid.
export const maxDuration = 60;

/**
 * Hvor mange ganger klippekortsiden sender kunden tilbake hit mens Vipps
 * ennå ikke har registrert godkjenningen. Med 3 sekunder mellom forsøkene
 * venter vi i underkant av et halvt minutt.
 */
const MAX_ATTEMPTS = 8;

function redirect(path: string) {
  return NextResponse.redirect(new URL(path, getConfig().siteUrl));
}

export async function GET(request: Request) {
  const config = getConfig();
  if (!config.features.payments) return redirect("/klippekort?kjop=feilet");

  const params = new URL(request.url).searchParams;
  const reference = params.get("ref");
  if (!reference || !REFERENCE_PATTERN.test(reference)) {
    return redirect("/klippekort?kjop=feilet");
  }
  const attempt = Math.max(0, Number.parseInt(params.get("forsok") ?? "0", 10) || 0);

  try {
    const session = await readSession();
    const result = await settlePurchase(reference, session);

    switch (result.state) {
      case "aborted":
        return redirect("/klippekort?kjop=avbrutt");

      case "pending":
        // Brukeren er tilbake før Vipps rakk å registrere godkjenningen.
        // Klippekortsiden sender ham hit igjen om litt; webhooken fullfører
        // kjøpet uansett hvis han gir opp.
        return attempt < MAX_ATTEMPTS
          ? redirect(`/klippekort?kjop=venter&ref=${reference}&forsok=${attempt + 1}`)
          : redirect("/klippekort?kjop=sen");

      case "no_owner":
        console.error("vipps retur: fant ingen eier for", reference);
        return redirect("/klippekort?kjop=feilet");

      case "paid":
        break;
    }

    const { purchase, ownerSub } = result;

    // Logg ham inn, så klippene er hans neste gang også — men bare hvis
    // dette er nettleseren som startet betalingen. Ellers ville referansen
    // i retur-URL-en fungert som et passord for hvem som helst som fikk
    // tak i den. Klippene er uansett kreditert riktig eier.
    const sameBrowser = await claimPendingPayment(reference);
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
