import "server-only";
import { encodeInputToParams } from "@/components/calculator/url-state";
import { consumeClip, loadStatus } from "@/lib/db/klippekort";
import { fetchFinnListing, FinnError } from "@/lib/finn/fetch";
import { mapFinnToInputs } from "@/lib/finn/map-to-inputs";

export type UnlockResult =
  | { ok: true; calculationUrl: string; alreadyUnlocked: boolean; remaining: number }
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

/**
 * Låser opp én FINN-annonse.
 *
 * Rekkefølgen er bevisst: annonsen hentes FØR klippet trekkes, så en solgt
 * eller fjernet annonse aldri koster brukeren et klipp. Saldoen sjekkes
 * likevel først, slik at vi ikke belaster FINN for en bruker som ikke har
 * klipp å bruke.
 */
export async function unlockFinn(
  userId: string,
  finnkode: string,
): Promise<UnlockResult> {
  const status = await loadStatus(userId);
  const alreadyUnlocked = status.unlocked.includes(finnkode);
  if (!alreadyUnlocked && status.remaining <= 0) {
    return { ok: false, reason: status.expired ? "expired" : "empty" };
  }

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

  // Annonsen finnes: nå er det trygt å trekke klippet.
  const consumed = await consumeClip(userId, finnkode);
  if (consumed.outcome === "expired" || consumed.outcome === "empty") {
    return { ok: false, reason: consumed.outcome };
  }

  const params = encodeInputToParams(mapFinnToInputs(outcome.parsed));
  params.set("kilde", "finn");
  return {
    ok: true,
    calculationUrl: `/beregning?${params.toString()}`,
    alreadyUnlocked: consumed.outcome === "already_unlocked",
    remaining: consumed.remaining,
  };
}
