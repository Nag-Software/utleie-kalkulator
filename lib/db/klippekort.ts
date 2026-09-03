import "server-only";
import { rpc } from "@/lib/db/client";

/**
 * Klippekortet slik databasen ser det. Alle skrivinger går gjennom
 * databasefunksjoner som holder invariantene atomisk:
 *
 *  1. Ett klipp per FINN-kode — primærnøkkelen på `unlocks` gjør innløsning
 *     idempotent, så en annonse kan åpnes igjen gratis.
 *  2. Ett kjøp krediteres bare én gang — `complete_purchase` er idempotent
 *     på Vipps-referansen, uansett hvor mange ganger retur-URL-en treffes.
 *  3. Klipp trekkes under radlås, så to samtidige innløsninger ikke kan
 *     bruke samme klipp.
 */
export interface KlippekortStatus {
  remaining: number;
  total: number;
  used: number;
  expiredClips: number;
  expiresAt: string | null;
  expired: boolean;
  unlocked: string[];
}

export const EMPTY_STATUS: KlippekortStatus = {
  remaining: 0,
  total: 0,
  used: 0,
  expiredClips: 0,
  expiresAt: null,
  expired: false,
  unlocked: [],
};

/** Finner eller oppretter brukeren bak en Vipps-identitet. */
export async function upsertVippsUser(options: {
  vippsSub: string;
  name?: string | null;
  phoneNumber?: string | null;
}): Promise<string> {
  return rpc<string>("upsert_vipps_user", {
    p_vipps_sub: options.vippsSub,
    p_name: options.name ?? null,
    p_phone: options.phoneNumber ?? null,
  });
}

export async function loadStatus(
  userId: string | null | undefined,
): Promise<KlippekortStatus> {
  if (!userId) return EMPTY_STATUS;

  const raw = await rpc<Omit<KlippekortStatus, "expired"> | null>(
    "klippekort_status",
    { p_user_id: userId },
  );
  if (!raw) return EMPTY_STATUS;

  return {
    remaining: Number(raw.remaining ?? 0),
    total: Number(raw.total ?? 0),
    used: Number(raw.used ?? 0),
    expiredClips: Number(raw.expiredClips ?? 0),
    expiresAt: raw.expiresAt ?? null,
    expired: Number(raw.remaining ?? 0) === 0 && Number(raw.expiredClips ?? 0) > 0,
    unlocked: raw.unlocked ?? [],
  };
}

/**
 * Reserverer en kjøpsreferanse før brukeren sendes til Vipps. Gjaldt kjøpet
 * en bestemt annonse, lagres FINN-koden på raden — da slipper retur-
 * handleren å stole på spørrestrengen i retur-URL-en.
 */
export async function startPurchase(options: {
  userId: string;
  productId: string;
  reference: string;
  finnkode?: string | null;
}): Promise<string> {
  return rpc<string>("start_purchase", {
    p_user_id: options.userId,
    p_product_id: options.productId,
    p_reference: options.reference,
    p_finnkode: options.finnkode ?? null,
  });
}

export interface CompletedPurchase {
  userId: string;
  status: string;
  clips: number;
  remainingClips: number;
  expiresAt: string | null;
  pendingFinnkode: string | null;
}

/**
 * Krediterer klippene for et bekreftet kjøp. Idempotent: kalles den to
 * ganger for samme referanse, krediteres klippene bare én gang.
 */
export async function completePurchase(options: {
  reference: string;
  amountOre: number;
}): Promise<CompletedPurchase> {
  const rows = await rpc<
    {
      user_id: string;
      status: string;
      clips: number;
      remaining_clips: number;
      expires_at: string | null;
      pending_finnkode: string | null;
    }[]
  >("complete_purchase", {
    p_reference: options.reference,
    p_amount_ore: options.amountOre,
  });

  const row = rows?.[0];
  if (!row) throw new Error(`complete_purchase ga ingen rad for ${options.reference}`);

  return {
    userId: row.user_id,
    status: row.status,
    clips: Number(row.clips),
    remainingClips: Number(row.remaining_clips),
    expiresAt: row.expires_at,
    pendingFinnkode: row.pending_finnkode,
  };
}

/** Markerer et kjøp som ikke gjennomført. Rører aldri et betalt kjøp. */
export async function abortPurchase(
  reference: string,
  status: "aborted" | "expired" | "failed",
): Promise<void> {
  await rpc<null>("abort_purchase", {
    p_reference: reference,
    p_status: status,
  });
}

export type ConsumeOutcome = "ok" | "already_unlocked" | "expired" | "empty";

/** Trekker ett klipp for én FINN-annonse, atomisk. */
export async function consumeClip(
  userId: string,
  finnkode: string,
): Promise<{ outcome: ConsumeOutcome; remaining: number }> {
  const rows = await rpc<{ outcome: ConsumeOutcome; remaining_clips: number }[]>(
    "consume_clip",
    { p_user_id: userId, p_finnkode: finnkode },
  );

  const row = rows?.[0];
  if (!row) throw new Error("consume_clip ga ingen rad");
  return { outcome: row.outcome, remaining: Number(row.remaining_clips) };
}
