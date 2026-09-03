import { parseFinnNumber } from "./numbers";

/**
 * Leter etter oppgitt leie i tittel, metabeskrivelse og nøkkelfelt – ikke i
 * hele HTML-dokumentet, der «leieinntekt» ofte dukker opp i sidens chrome.
 */
export function extractStatedMonthlyRent(blob: string): number | null {
  const text = blob.replace(/\s+/g, " ").trim();
  if (!text) return null;

  const monthly = text.match(
    /(?:månedsleie|husleie|utleid(?:\s+for)?|leid ut(?:\s+for)?|leie(?:s?\s+ut)?(?:\s+for)?)\s*(?:på|er|:)?\s*(\d[\d\s]{2,})\s*kr(?:\s*(?:\/|per)\s*(?:mnd|måned))?/i,
  );
  if (monthly) {
    const value = parseFinnNumber(monthly[1]);
    if (value && value >= 2_000 && value <= 80_000) return value;
  }

  const yearly = text.match(
    /(?:årlig\s+leieinntekt|leieinntekt)\s*(?:på|er|:)?\s*(\d[\d\s]{3,})\s*kr/i,
  );
  if (yearly) {
    const value = parseFinnNumber(yearly[1]);
    if (value && value >= 24_000 && value <= 960_000) {
      return Math.round(value / 12);
    }
  }

  return null;
}

export function listingMentionsRented(blob: string): boolean {
  return /\b(utleid|leid ut|allerede utleid)\b/i.test(blob);
}
