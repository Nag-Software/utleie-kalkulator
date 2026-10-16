import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { listPendingPurchases } from "@/lib/db/klippekort";
import { settlePurchase } from "@/lib/vipps/settle";
import { ensureWebhookRegistered } from "@/lib/vipps/webhooks";

/**
 * Daglig avstemming, kjørt av Vercel Cron (se `vercel.json`).
 *
 * Sikkerhetsnettet bak webhooken: alle kjøp som fortsatt står som
 * «pending», sjekkes mot Vipps og gjøres opp. En godkjent reservasjon
 * holder i flere dager, så én kjøring i døgnet rekker å trekke beløpet og
 * kreditere klippene selv om både retur-URL-en og webhooken uteble.
 *
 * Den sørger også for at webhooken er registrert hos Vipps.
 *
 * Vercel sender `Authorization: Bearer $CRON_SECRET`. Uten `CRON_SECRET`
 * er endepunktet stengt.
 */
export const maxDuration = 60;

/** Ferske kjøp lar vi være — kunden er sannsynligvis midt i betalingen. */
const MIN_AGE_SECONDS = 10 * 60;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!getConfig().features.payments) {
    return NextResponse.json({ ok: false, reason: "payments_off" }, { status: 503 });
  }

  let webhook: string;
  try {
    webhook = await ensureWebhookRegistered();
  } catch (error) {
    webhook = "failed";
    console.error(
      "avstemming: kunne ikke registrere webhooken",
      error instanceof Error ? error.message : error,
    );
  }

  let references: string[];
  try {
    references = await listPendingPurchases(MIN_AGE_SECONDS);
  } catch (error) {
    // Typisk at `pending_purchase_references` ikke er opprettet ennå
    // (se supabase/schema.sql). Webhooken er uansett registrert over.
    console.error(
      "avstemming: kunne ikke liste ventende kjøp",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ ok: false, webhook, reason: "db" }, { status: 500 });
  }
  const outcomes: Record<string, string> = {};

  // Én og én: det er sjelden mer enn en håndfull, og Vipps setter pris på
  // at vi ikke hamrer løs.
  for (const reference of references) {
    try {
      outcomes[reference] = (await settlePurchase(reference)).state;
    } catch (error) {
      outcomes[reference] = "error";
      console.error(
        "avstemming feilet for",
        reference,
        error instanceof Error ? error.message : error,
      );
    }
  }

  const settled = Object.values(outcomes).filter((state) => state === "paid").length;
  if (settled > 0) {
    console.warn(`avstemming: fullførte ${settled} kjøp som retur og webhook gikk glipp av`);
  }

  return NextResponse.json({ ok: true, webhook, outcomes });
}
