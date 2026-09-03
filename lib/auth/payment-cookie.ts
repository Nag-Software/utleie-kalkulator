import "server-only";
import { cookies } from "next/headers";

/**
 * Binder en betaling til nettleseren som startet den.
 *
 * Retur-URL-en fra Vipps inneholder kjøpsreferansen, og retur-handleren
 * logger kunden inn på grunnlag av profildelingen. Uten denne bindingen
 * ville referansen i praksis vært et passord: den som fikk tak i URL-en
 * — fra historikk, en delt skjerm, en referrer-header — kunne åpnet den og
 * blitt logget inn som kjøperen.
 *
 * Klippene krediteres uansett riktig eier, siden eierskapet kommer fra
 * Vipps. Det er kun innloggingen som krever at det er samme nettleser.
 */
const COOKIE_NAME = "uk_pay";
const MAX_AGE_SECONDS = 60 * 60;

export async function rememberPendingPayment(
  reference: string,
): Promise<void> {
  (await cookies()).set(COOKIE_NAME, reference, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Sjekker og forbruker bindingen. Engangsbruk. */
export async function claimPendingPayment(
  reference: string,
): Promise<boolean> {
  const store = await cookies();
  const stored = store.get(COOKIE_NAME)?.value;
  if (stored) store.delete(COOKIE_NAME);
  return stored === reference;
}
