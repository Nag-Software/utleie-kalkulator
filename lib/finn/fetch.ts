import "server-only";
import { getConfig } from "@/lib/config";
import { buildFinnUrl } from "./finnkode";
import { type FinnParseOutcome, parseFinnListing } from "./parse";
import type { FinnErrorCode } from "./types";

export class FinnError extends Error {
  constructor(
    public readonly code: FinnErrorCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = "FinnError";
  }
}

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const REMOVED_MARKERS = [
  "annonsen er slettet",
  "annonsen er fjernet",
  "annonsen finnes ikke",
  "fant ikke siden",
];

async function fetchOnce(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "nb-NO,nb;q=0.9,en;q=0.5",
    },
    signal: AbortSignal.timeout(10_000),
    redirect: "follow",
    cache: "no-store",
  });
}

/** Henter og parser en FINN-annonse. Kaster FinnError med feiltaksonomi. */
export async function fetchFinnListing(
  finnkode: string,
): Promise<FinnParseOutcome> {
  const { finnForceError } = getConfig();
  if (finnForceError) {
    throw new FinnError(finnForceError as FinnErrorCode, "FINN_FORCE_ERROR aktiv");
  }

  const url = buildFinnUrl(finnkode);
  let response: Response;
  try {
    response = await fetchOnce(url);
    if (response.status >= 500) {
      response = await fetchOnce(url);
    }
  } catch (firstError) {
    try {
      response = await fetchOnce(url);
    } catch {
      throw new FinnError(
        "TIMEOUT",
        firstError instanceof Error ? firstError.message : "nettverksfeil",
      );
    }
  }

  if (response.status === 404 || response.status === 410) {
    throw new FinnError("NOT_FOUND");
  }
  if (response.status === 403 || response.status === 429) {
    throw new FinnError("BLOCKED", `HTTP ${response.status}`);
  }
  if (!response.ok) {
    throw new FinnError("BLOCKED", `HTTP ${response.status}`);
  }

  const html = await response.text();
  const lowered = html.slice(0, 100_000).toLowerCase();
  if (REMOVED_MARKERS.some((marker) => lowered.includes(marker))) {
    throw new FinnError("NOT_FOUND", "annonsen er fjernet");
  }
  if (lowered.includes("captcha") && !lowered.includes("prisantydning")) {
    throw new FinnError("BLOCKED", "captcha");
  }

  const outcome = parseFinnListing(html, finnkode);
  if (outcome.parseFailed) {
    throw new FinnError("PARSE_FAIL", outcome.warnings.join("; "));
  }
  return outcome;
}
