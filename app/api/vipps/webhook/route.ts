import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { REFERENCE_PATTERN, settlePurchase } from "@/lib/vipps/settle";

/**
 * Mottar ePayment-hendelser fra Vipps.
 *
 * Dette er veien som fullfører et kjøp når kunden godkjente i Vipps-appen
 * men aldri kom tilbake til nettleseren. Uten den ble betalingen stående
 * reservert uten å bli trukket, og kunden fikk ingen klipp.
 *
 * Innholdet brukes bare til å finne referansen; statusen leses alltid fra
 * Vipps i `settlePurchase` (se `lib/vipps/webhooks.ts` for hvorfor vi
 * ikke verifiserer signaturen). Kunden logges ikke inn herfra — han er
 * ikke til stede — men klippene krediteres Vipps-brukeren hans og venter
 * på ham neste gang han logger inn.
 */
export const maxDuration = 30;

export async function POST(request: Request) {
  if (!getConfig().features.payments) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  let reference: unknown;
  try {
    ({ reference } = (await request.json()) as { reference?: unknown });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Andre salgs referanser på samme MSN er ikke våre — kvitter og gå videre,
  // ellers prøver Vipps å levere dem på nytt i det uendelige.
  if (typeof reference !== "string" || !REFERENCE_PATTERN.test(reference)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    const result = await settlePurchase(reference);
    if (result.state === "no_owner") {
      console.error("vipps webhook: fant ingen eier for", reference);
    }
    return NextResponse.json({ ok: true, state: result.state });
  } catch (error) {
    // 5xx får Vipps til å prøve igjen senere — det er det vi vil ved
    // forbigående feil hos oss, i databasen eller hos Vipps.
    console.error(
      "vipps webhook feilet for",
      reference,
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
