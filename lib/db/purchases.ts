import "server-only";
import { rpc } from "@/lib/db/client";

/**
 * Kjøp og brukere slik databasen ser dem. Alle skrivinger går gjennom
 * databasefunksjoner som holder invariantene atomisk: ett kjøp krediteres
 * bare én gang (`complete_purchase` er idempotent på Vipps-referansen),
 * uansett hvor mange ganger retur-URL-en, webhooken eller avstemmingen
 * treffer det.
 */

/**
 * Finner eller oppretter brukeren bak en Vipps-identitet.
 *
 * En bruker kan ha flere `sub`-er: Vipps garanterer ikke skriftlig at
 * `sub` fra Login er den samme som `sub` fra profildeling i ePayment.
 * `linkUserId` knytter en ny sub til en bruker vi allerede kjenner, slik at
 * kjøpene følger personen og ikke identifikatoren.
 */
export async function upsertVippsUser(options: {
  vippsSub: string;
  name?: string | null;
  phoneNumber?: string | null;
  source: "login" | "payment";
  linkUserId?: string | null;
}): Promise<string> {
  return rpc<string>("upsert_vipps_user", {
    p_vipps_sub: options.vippsSub,
    p_name: options.name ?? null,
    p_phone: options.phoneNumber ?? null,
    p_source: options.source,
    p_link_user_id: options.linkUserId ?? null,
  });
}

/** Reserverer en kjøpsreferanse før brukeren sendes til Vipps. */
export async function startPurchase(options: {
  /** null når kjøpet starter før innlogging — eieren festes ved betaling. */
  userId: string | null;
  productId: string;
  reference: string;
}): Promise<string> {
  return rpc<string>("start_purchase", {
    p_user_id: options.userId,
    p_product_id: options.productId,
    p_reference: options.reference,
    p_finnkode: null,
  });
}

export interface CompletedPurchase {
  userId: string;
  status: string;
  /** Antall analyser kjøpet ga. */
  clips: number;
  expiresAt: string | null;
}

/**
 * Krediterer et bekreftet kjøp. Idempotent: kalles den to ganger for samme
 * referanse, krediteres det bare én gang.
 */
export async function completePurchase(options: {
  reference: string;
  amountOre: number;
  /** Eieren, når kjøpet startet anonymt. Ignoreres hvis eier alt er satt. */
  userId?: string | null;
}): Promise<CompletedPurchase> {
  const rows = await rpc<
    { user_id: string; status: string; clips: number; expires_at: string | null }[]
  >("complete_purchase", {
    p_reference: options.reference,
    p_amount_ore: options.amountOre,
    p_user_id: options.userId ?? null,
  });

  const row = rows?.[0];
  if (!row) throw new Error(`complete_purchase ga ingen rad for ${options.reference}`);

  return {
    userId: row.user_id,
    status: row.status,
    clips: Number(row.clips),
    expiresAt: row.expires_at,
  };
}

/** Markerer et kjøp som ikke gjennomført. Rører aldri et betalt kjøp. */
export async function abortPurchase(
  reference: string,
  status: "aborted" | "expired" | "failed",
): Promise<void> {
  await rpc<null>("abort_purchase", { p_reference: reference, p_status: status });
}

/**
 * Referansene til kjøp som fortsatt venter på oppgjør, eldste først. Brukes
 * av avstemmingen til å fange betalinger som verken retur-URL-en eller
 * webhooken fikk fullført.
 */
export async function listPendingPurchases(minAgeSeconds: number): Promise<string[]> {
  const rows = await rpc<string[] | null>("pending_purchase_references", {
    p_min_age_seconds: minAgeSeconds,
  });
  return rows ?? [];
}
