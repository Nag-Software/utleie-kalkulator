import type { FinnParsedData } from "@/lib/finn/types";
import type { ListingResearch } from "./enrich";

/** Alt som skal følge beregningslenken etter et klipp. */
export interface ListingDossier {
  finn: FinnParsedData;
  research: ListingResearch;
  warnings: string[];
}

export const DOSSIER_PARAM = "d";

function dropNulls(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(dropNulls);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      if (nested === null || nested === undefined) continue;
      out[key] = dropNulls(nested);
    }
    return out;
  }
  return value;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * Dossieret kommer fra spørrestrengen og kan altså være preparert.
 * `extractListingImages` låser bildene til FINNs CDN når vi henter dem, og
 * her holder vi samme grense ved gjenoppretting — ellers kunne en delt
 * lenke fått nettleseren til å laste bilder fra en vilkårlig vert.
 */
function asFinnImage(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0) return null;
  return /^https:\/\/images\.finncdn\.no\//i.test(value) ? value : null;
}

function hydrateFinn(raw: Partial<FinnParsedData> | undefined): FinnParsedData | null {
  if (!raw?.finnkode) return null;
  return {
    finnkode: raw.finnkode,
    url:
      raw.url ??
      `https://www.finn.no/realestate/homes/ad.html?finnkode=${raw.finnkode}`,
    title: asString(raw.title),
    address: asString(raw.address),
    postalCode: asString(raw.postalCode),
    city: asString(raw.city),
    imageUrl: asFinnImage(raw.imageUrl),
    imageUrls: Array.isArray(raw.imageUrls)
      ? raw.imageUrls
          .map(asFinnImage)
          .filter((url): url is string => url !== null)
      : asFinnImage(raw.imageUrl)
        ? [asFinnImage(raw.imageUrl) as string]
        : [],
    askingPrice: asNumber(raw.askingPrice),
    totalPrice: asNumber(raw.totalPrice),
    sharedDebt: asNumber(raw.sharedDebt),
    hoaFeesMonthly: asNumber(raw.hoaFeesMonthly),
    hoaAssets: asNumber(raw.hoaAssets),
    transactionCosts: asNumber(raw.transactionCosts),
    taxValue: asNumber(raw.taxValue),
    propertyType: asString(raw.propertyType),
    ownershipTypeRaw: asString(raw.ownershipTypeRaw),
    bedrooms: asNumber(raw.bedrooms),
    rooms: asNumber(raw.rooms),
    internalArea: asNumber(raw.internalArea),
    usableArea: asNumber(raw.usableArea),
    externalArea: asNumber(raw.externalArea),
    balconyArea: asNumber(raw.balconyArea),
    floor: asNumber(raw.floor),
    buildYear: asNumber(raw.buildYear),
    municipalFeesYearly: asNumber(raw.municipalFeesYearly),
    propertyTaxYearly: asNumber(raw.propertyTaxYearly),
    energyLabel: asString(raw.energyLabel),
    plotArea: asNumber(raw.plotArea),
    plotOwnership:
      raw.plotOwnership === "eiet" || raw.plotOwnership === "festet"
        ? raw.plotOwnership
        : null,
    currentlyRented:
      typeof raw.currentlyRented === "boolean" ? raw.currentlyRented : null,
    statedMonthlyRent: asNumber(raw.statedMonthlyRent),
  };
}

export function encodeDossier(dossier: ListingDossier): string {
  const json = JSON.stringify(dropNulls(dossier));
  return Buffer.from(json, "utf8").toString("base64url");
}

export function decodeDossier(raw: string | null | undefined): ListingDossier | null {
  if (!raw) return null;
  try {
    const json = Buffer.from(raw, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as {
      finn?: Partial<FinnParsedData>;
      research?: ListingResearch;
      warnings?: string[];
    };
    const finn = hydrateFinn(parsed.finn);
    if (!finn || !parsed.research?.marketRent) return null;
    return {
      finn,
      research: parsed.research,
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
    };
  } catch {
    return null;
  }
}
