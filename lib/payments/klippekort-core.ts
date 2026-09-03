import {
  KLIPP_GYLDIGHET_MANEDER,
  KLIPP_PER_KJOP,
} from "@/lib/site";

export interface KlippGrant {
  id: string;
  clips: number;
  remaining: number;
  purchasedAt: string;
  expiresAt: string;
}

export interface KlippekortState {
  grants: KlippGrant[];
  /** FINN-koder som allerede er låst opp og derfor kan åpnes uten nytt klipp. */
  unlocked: string[];
}

export interface KlippekortStatus {
  remaining: number;
  total: number;
  used: number;
  expiredClips: number;
  expiresAt: string | null;
  expired: boolean;
  unlocked: string[];
}

export function emptyKort(): KlippekortState {
  return { grants: [], unlocked: [] };
}

export function addMonths(from: Date, months: number): Date {
  const next = new Date(from.getTime());
  next.setMonth(next.getMonth() + months);
  return next;
}

export function statusOf(
  kort: KlippekortState | null | undefined,
  now: Date = new Date(),
): KlippekortStatus {
  const state = kort ?? emptyKort();
  const nowMs = now.getTime();
  const active = state.grants.filter(
    (grant) =>
      grant.remaining > 0 && new Date(grant.expiresAt).getTime() > nowMs,
  );
  const remaining = active.reduce((sum, grant) => sum + grant.remaining, 0);
  const total = state.grants.reduce((sum, grant) => sum + grant.clips, 0);
  const used = state.grants.reduce(
    (sum, grant) => sum + Math.max(0, grant.clips - grant.remaining),
    0,
  );
  const expiredClips = state.grants
    .filter((grant) => new Date(grant.expiresAt).getTime() <= nowMs)
    .reduce((sum, grant) => sum + grant.remaining, 0);
  const nextExpiry = active
    .map((grant) => grant.expiresAt)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];

  return {
    remaining,
    total,
    used,
    expiredClips,
    expiresAt: nextExpiry ?? null,
    expired: remaining === 0 && expiredClips > 0,
    unlocked: state.unlocked,
  };
}

/** Krediterer et kjøp. Samme betalingsreferanse kan bare krediteres én gang. */
export function grantKlipp(
  kort: KlippekortState,
  paymentId: string,
  now: Date = new Date(),
  clips: number = KLIPP_PER_KJOP,
  months: number = KLIPP_GYLDIGHET_MANEDER,
): KlippekortState {
  if (kort.grants.some((grant) => grant.id === paymentId)) return kort;

  return {
    ...kort,
    grants: [
      ...kort.grants,
      {
        id: paymentId,
        clips,
        remaining: clips,
        purchasedAt: now.toISOString(),
        expiresAt: addMonths(now, months).toISOString(),
      },
    ],
  };
}

export type ConsumeResult =
  | { ok: true; kort: KlippekortState; alreadyUnlocked: boolean }
  | { ok: false; reason: "expired" | "empty" };

/** Bruker det eldste gyldige klippet. Allerede opplåste annonser er gratis. */
export function consumeKlipp(
  kort: KlippekortState,
  finnkode: string,
  now: Date = new Date(),
): ConsumeResult {
  if (kort.unlocked.includes(finnkode)) {
    return { ok: true, kort, alreadyUnlocked: true };
  }

  const nowMs = now.getTime();
  const grantIndex = kort.grants.findIndex(
    (grant) =>
      grant.remaining > 0 && new Date(grant.expiresAt).getTime() > nowMs,
  );
  if (grantIndex < 0) {
    const hasExpiredClips = kort.grants.some(
      (grant) =>
        grant.remaining > 0 && new Date(grant.expiresAt).getTime() <= nowMs,
    );
    return { ok: false, reason: hasExpiredClips ? "expired" : "empty" };
  }

  return {
    ok: true,
    alreadyUnlocked: false,
    kort: {
      grants: kort.grants.map((grant, index) =>
        index === grantIndex
          ? { ...grant, remaining: grant.remaining - 1 }
          : grant,
      ),
      unlocked: [...kort.unlocked, finnkode],
    },
  };
}
