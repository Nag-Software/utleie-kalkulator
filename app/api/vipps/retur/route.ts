import { NextResponse } from "next/server";
import { claimPendingPayment } from "@/lib/auth/payment-cookie";
import { readSession, writeSession } from "@/lib/auth/session";
import { getConfig } from "@/lib/config";
import { analysisForReference, claimAnalysis } from "@/lib/db/analyses";
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
 * Analysene krediteres uansett riktig eier, siden eierskapet kommer fra
 * Vipps og ikke fra referansen i URL-en.
 */

export const maxDuration = 60;

/**
 * Hvor mange ganger rapportsiden sender kunden tilbake hit mens Vipps
 * ennå ikke har registrert godkjenningen. Med 3 sekunder mellom forsøkene
 * venter vi i underkant av et halvt minutt.
 */
const MAX_ATTEMPTS = 8;

function redirect(path: string) {
  return NextResponse.redirect(new URL(path, getConfig().siteUrl));
}

export async function GET(request: Request) {
  const config = getConfig();
  if (!config.features.payments) return redirect("/analyser?kjop=feilet");

  const params = new URL(request.url).searchParams;
  const reference = params.get("ref");
  if (!reference || !REFERENCE_PATTERN.test(reference)) {
    return redirect("/analyser?kjop=feilet");
  }
  const attempt = Math.max(0, Number.parseInt(params.get("forsok") ?? "0", 10) || 0);

  // Gjaldt kjøpet en KI-analyse, skal kunden tilbake til rapportsiden –
  // ikke rapportsiden. Koblingen ligger i databasen, ikke i URL-en.
  const analysisId = await analysisForReference(reference).catch(() => null);
  const base = analysisId ? `/analyse/${analysisId}` : "/analyser";

  try {
    const session = await readSession();
    const result = await settlePurchase(reference, session);

    switch (result.state) {
      case "aborted":
        return redirect(`${base}?kjop=avbrutt`);

      case "pending":
        // Brukeren er tilbake før Vipps rakk å registrere godkjenningen.
        // Rapportsiden sender ham hit igjen om litt; webhooken fullfører
        // kjøpet uansett hvis han gir opp.
        return attempt < MAX_ATTEMPTS
          ? redirect(`${base}?kjop=venter&ref=${reference}&forsok=${attempt + 1}`)
          : redirect(`${base}?kjop=sen`);

      case "no_owner":
        console.error("vipps retur: fant ingen eier for", reference);
        return redirect(`${base}?kjop=feilet`);

      case "paid":
        break;
    }

    const { purchase, ownerSub } = result;

    // Logg ham inn, så analysene er hans neste gang også — men bare hvis
    // dette er nettleseren som startet betalingen. Ellers ville referansen
    // i retur-URL-en fungert som et passord for hvem som helst som fikk
    // tak i den. Analysene er uansett kreditert riktig eier.
    const sameBrowser = await claimPendingPayment(reference);
    if (ownerSub && sameBrowser && session?.userId !== purchase.userId) {
      await writeSession({
        userId: purchase.userId,
        vippsSub: ownerSub,
        name: session?.name ?? null,
      });
    }

    if (analysisId) {
      // Fest kjøperen på analysen, så den er hans også om han senere
      // starter et nytt kjøp for den samme salgsoppgaven.
      await claimAnalysis(analysisId, purchase.userId).catch(() => {});
      return redirect(`/analyse/${analysisId}?kjop=ok`);
    }

    return redirect("/analyser?kjop=ok");
  } catch (error) {
    console.error(
      "vipps retur feilet",
      error instanceof Error ? error.message : error,
    );
    return redirect("/analyser?kjop=feilet");
  }
}
