/**
 * Eiendomsskatt 2026 for bolig, grovt anslag.
 *
 * Formelen kommunene bruker: (markedsverdi × 0,7 − bunnfradrag) × promille.
 * Takstgrunnlaget er i praksis kommunal takst eller Skatteetatens beregnede
 * markedsverdi, så tallet er et estimat – ikke skatteseddelen.
 *
 * Satser: kommunenes egne vedtak for 2026 (Oslo, Bergen, Trondheim m.fl.).
 */

export type PropertyTaxStatus =
  | "from_listing"
  | "estimated"
  | "none"
  | "unknown"
  | "likely_in_hoa";

export interface MunicipalityTaxRule {
  name: string;
  /** false = kommunen krever ikke eiendomsskatt på bolig */
  hasTax: boolean;
  /** promille for bolig, f.eks. 1.7 */
  ratePromille: number;
  bunnfradrag: number;
}

export interface PropertyTaxEstimate {
  status: PropertyTaxStatus;
  yearly: number;
  municipality: string | null;
  ratePromille: number | null;
  bunnfradrag: number | null;
  note: string;
}

const REDUCTION = 0.7;

/** Kommuner vi har 2026-satser for. Øvrige blir «unknown». */
export const MUNICIPALITY_TAX_2026: Record<string, MunicipalityTaxRule> = {
  Oslo: { name: "Oslo", hasTax: true, ratePromille: 1.7, bunnfradrag: 4_900_000 },
  Bergen: { name: "Bergen", hasTax: true, ratePromille: 2.6, bunnfradrag: 750_000 },
  Trondheim: {
    name: "Trondheim",
    hasTax: true,
    ratePromille: 2.65,
    bunnfradrag: 700_000,
  },
  Stavanger: { name: "Stavanger", hasTax: true, ratePromille: 1.0, bunnfradrag: 0 },
  Kristiansand: {
    name: "Kristiansand",
    hasTax: true,
    ratePromille: 1.96,
    bunnfradrag: 0,
  },
  Tromsø: { name: "Tromsø", hasTax: true, ratePromille: 4.0, bunnfradrag: 0 },
  Drammen: { name: "Drammen", hasTax: false, ratePromille: 0, bunnfradrag: 0 },
  Bærum: { name: "Bærum", hasTax: false, ratePromille: 0, bunnfradrag: 0 },
};

export function computePropertyTax(options: {
  marketValue: number;
  ratePromille: number;
  bunnfradrag: number;
}): number {
  const base = Math.max(0, options.marketValue * REDUCTION - options.bunnfradrag);
  return Math.round(base * (options.ratePromille / 1000));
}

export function estimatePropertyTax(options: {
  municipality: string | null;
  marketValue: number | null;
  listingAmount: number | null;
  /** Andel/borettslag: skatten ligger ofte i felleskostnadene. */
  ownershipIsShare: boolean;
}): PropertyTaxEstimate {
  if (options.listingAmount != null && options.listingAmount > 0) {
    return {
      status: "from_listing",
      yearly: Math.round(options.listingAmount),
      municipality: options.municipality,
      ratePromille: null,
      bunnfradrag: null,
      note: "Tallet er hentet fra FINN-annonsen. Kontroller mot skatteseddelen.",
    };
  }

  if (options.ownershipIsShare) {
    const rule = options.municipality
      ? MUNICIPALITY_TAX_2026[options.municipality]
      : null;
    return {
      status: "likely_in_hoa",
      yearly: 0,
      municipality: options.municipality,
      ratePromille: rule?.ratePromille ?? null,
      bunnfradrag: rule?.bunnfradrag ?? null,
      note: options.municipality
        ? `I borettslag og andelslag ligger eiendomsskatt vanligvis i felleskostnadene. ${options.municipality} ${rule?.hasTax ? `har ${rule.ratePromille.toLocaleString("nb-NO")} ‰ for bolig i 2026` : "krever ikke eiendomsskatt på bolig"}.`
        : "I borettslag og andelslag ligger eiendomsskatt vanligvis i felleskostnadene.",
    };
  }

  if (!options.municipality) {
    return {
      status: "unknown",
      yearly: 0,
      municipality: null,
      ratePromille: null,
      bunnfradrag: null,
      note: "Vi fant ikke kommunen i adressen, så eiendomsskatt er ikke fylt inn. Sjekk kommunens satser.",
    };
  }

  const rule = MUNICIPALITY_TAX_2026[options.municipality];
  if (!rule) {
    return {
      status: "unknown",
      yearly: 0,
      municipality: options.municipality,
      ratePromille: null,
      bunnfradrag: null,
      note: `Vi har ikke 2026-sats for ${options.municipality}. Sjekk kommunens sider – rundt 40 % av kommunene har eiendomsskatt på bolig.`,
    };
  }

  if (!rule.hasTax) {
    return {
      status: "none",
      yearly: 0,
      municipality: rule.name,
      ratePromille: 0,
      bunnfradrag: 0,
      note: `${rule.name} krever ikke eiendomsskatt på bolig i 2026.`,
    };
  }

  if (options.marketValue == null || options.marketValue <= 0) {
    return {
      status: "unknown",
      yearly: 0,
      municipality: rule.name,
      ratePromille: rule.ratePromille,
      bunnfradrag: rule.bunnfradrag,
      note: `${rule.name} har ${rule.ratePromille.toLocaleString("nb-NO")} ‰ eiendomsskatt, men vi mangler pris å regne av.`,
    };
  }

  const yearly = computePropertyTax({
    marketValue: options.marketValue,
    ratePromille: rule.ratePromille,
    bunnfradrag: rule.bunnfradrag,
  });

  const thresholdNote =
    yearly === 0 && rule.bunnfradrag > 0
      ? `Bunnfradraget på ${rule.bunnfradrag.toLocaleString("nb-NO")} kr gjør at denne boligen trolig slipper eiendomsskatt.`
      : `Anslag: 70 % av prisantydning minus bunnfradrag ${rule.bunnfradrag.toLocaleString("nb-NO")} kr, ganger ${rule.ratePromille.toLocaleString("nb-NO")} ‰.`;

  return {
    status: "estimated",
    yearly,
    municipality: rule.name,
    ratePromille: rule.ratePromille,
    bunnfradrag: rule.bunnfradrag,
    note: `${rule.name}: ${thresholdNote} Faktisk beløp står på kommunens skatteseddel.`,
  };
}
