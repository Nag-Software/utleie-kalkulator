import * as cheerio from "cheerio";
import { parseFinnNumber } from "./numbers";
import type { FinnParsedData } from "./types";

export interface FinnParseOutcome {
  parsed: FinnParsedData;
  /** normalisert label → råtekst, for feilsøking */
  labels: Record<string, string>;
  warnings: string[];
  /** true når kjernedata (pris) mangler — kan ikke fylle kalkulatoren */
  parseFailed: boolean;
}

function normalizeLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/[.:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Label-basert parsing (aldri CSS-klasser): alle dt/dd-par høstes til et
 * oppslagskart. FINN kan endre styling uten å knekke oss; endrer de
 * label-tekstene får feltene null + warning og brukeren fyller inn selv.
 */
export function parseFinnListing(
  html: string,
  finnkode: string,
): FinnParseOutcome {
  const $ = cheerio.load(html);
  const warnings: string[] = [];
  const labels: Record<string, string> = {};

  $("dt").each((_, dt) => {
    const $dt = $(dt);
    const $dd = $dt.next("dd");
    if (!$dd.length) return;
    const key = normalizeLabel($dt.text());
    const value = $dd.text().trim();
    if (key && value && !(key in labels)) labels[key] = value;
  });

  const label = (...candidates: string[]): string | null => {
    for (const candidate of candidates) {
      if (candidate in labels) return labels[candidate];
    }
    return null;
  };
  const numberFrom = (...candidates: string[]): number | null =>
    parseFinnNumber(label(...candidates));

  // Prisantydning står utenfor dt/dd: <span>Prisantydning</span><span>4 300 000 kr</span>
  let askingPrice: number | null = null;
  const priceContainer = $('[data-testid="pricing-incicative-price"]');
  if (priceContainer.length) {
    askingPrice = parseFinnNumber(priceContainer.text());
  }
  if (askingPrice === null) {
    $("span, div, dt").each((_, el) => {
      if (askingPrice !== null) return;
      const $el = $(el);
      if (normalizeLabel($el.text()) === "prisantydning") {
        askingPrice =
          parseFinnNumber($el.next().text()) ??
          parseFinnNumber($el.parent().text());
      }
    });
  }

  const totalPrice = numberFrom("totalpris");
  const sharedDebt = numberFrom("fellesgjeld");
  const transactionCosts = numberFrom("omkostninger");

  // Enkelte annonser viser ikke prisantydning eksplisitt — utled fra totalpris.
  if (askingPrice === null && totalPrice !== null) {
    askingPrice = totalPrice - (transactionCosts ?? 0) - (sharedDebt ?? 0);
    warnings.push("Prisantydning utledet fra totalpris.");
  }
  if (askingPrice === null) {
    warnings.push("Fant ikke prisantydning i annonsen.");
  }

  const address =
    $('[data-testid="object-address"]').first().text().trim() ||
    $('meta[property="og:street-address"]').attr("content")?.trim() ||
    null;
  if (!address) warnings.push("Fant ikke adresse.");

  const title =
    $("h1").first().text().trim() ||
    $('meta[property="og:title"]').attr("content")?.trim() ||
    null;

  const imageUrl = $('meta[property="og:image"]').attr("content")?.trim() || null;

  const energyRaw = label("energimerking");

  const parsed: FinnParsedData = {
    finnkode,
    url: `https://www.finn.no/realestate/homes/ad.html?finnkode=${finnkode}`,
    title,
    address,
    imageUrl,
    askingPrice,
    totalPrice,
    sharedDebt,
    hoaFeesMonthly: numberFrom("felleskost/mnd", "felleskostnader/mnd", "felleskostnader"),
    transactionCosts,
    taxValue: numberFrom("formuesverdi"),
    propertyType: label("boligtype"),
    ownershipTypeRaw: label("eieform"),
    bedrooms: numberFrom("soverom"),
    rooms: numberFrom("rom"),
    internalArea: numberFrom("internt bruksareal", "bra-i", "primærrom"),
    usableArea: numberFrom("bruksareal"),
    floor: numberFrom("etasje"),
    buildYear: numberFrom("byggeår"),
    municipalFeesYearly: numberFrom("kommunale avg", "kommunale avgifter", "kommunale utgifter"),
    propertyTaxYearly: numberFrom("eiendomsskatt"),
    energyLabel: energyRaw && energyRaw.length <= 40 ? energyRaw : null,
    plotArea: numberFrom("tomteareal"),
  };

  for (const [field, labelText] of [
    ["hoaFeesMonthly", "felleskostnader"],
    ["ownershipTypeRaw", "eieform"],
    ["buildYear", "byggeår"],
  ] as const) {
    if (parsed[field] === null) warnings.push(`Fant ikke ${labelText}.`);
  }

  return {
    parsed,
    labels,
    warnings,
    parseFailed: parsed.askingPrice === null,
  };
}
