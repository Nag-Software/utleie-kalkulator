import "server-only";
import { encodeInputToParams } from "@/components/calculator/url-state";
import { fetchFinnListing, FinnError } from "@/lib/finn/fetch";
import { mapFinnToInputs } from "@/lib/finn/map-to-inputs";
import { consumeKlipp } from "@/lib/payments/klippekort-core";
import {
  loadByCustomerId,
  saveKort,
} from "@/lib/payments/klippekort";

export type UnlockResult =
  | {
      ok: true;
      calculationUrl: string;
      alreadyUnlocked: boolean;
    }
  | {
      ok: false;
      reason:
        | "expired"
        | "empty"
        | "not_found"
        | "blocked"
        | "timeout"
        | "parse_failed";
    };

export async function unlockFinn(
  customerId: string,
  finnkode: string,
): Promise<UnlockResult> {
  const beforeFetch = consumeKlipp(
    await loadByCustomerId(customerId),
    finnkode,
  );
  if (!beforeFetch.ok) return { ok: false, reason: beforeFetch.reason };

  let outcome;
  try {
    outcome = await fetchFinnListing(finnkode);
  } catch (error) {
    if (error instanceof FinnError) {
      switch (error.code) {
        case "NOT_FOUND":
          return { ok: false, reason: "not_found" };
        case "BLOCKED":
          return { ok: false, reason: "blocked" };
        case "TIMEOUT":
          return { ok: false, reason: "timeout" };
        default:
          return { ok: false, reason: "parse_failed" };
      }
    }
    console.error("unlock: FINN-henting feilet", error);
    return { ok: false, reason: "parse_failed" };
  }

  // Last inn saldoen på nytt etter nettverkskallet for å redusere
  // sannsynligheten for at parallelle forespørsler overskriver hverandre.
  const consumed = consumeKlipp(
    await loadByCustomerId(customerId),
    finnkode,
  );
  if (!consumed.ok) return { ok: false, reason: consumed.reason };
  if (!consumed.alreadyUnlocked) {
    await saveKort(customerId, consumed.kort);
  }

  const params = encodeInputToParams(mapFinnToInputs(outcome.parsed));
  params.set("kilde", "finn");
  return {
    ok: true,
    calculationUrl: `/beregning?${params.toString()}`,
    alreadyUnlocked: consumed.alreadyUnlocked,
  };
}
