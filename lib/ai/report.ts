import { calculate } from "@/lib/calc/engine";
import { type CalcInput, DEFAULT_INPUT } from "@/lib/calc/schema";
import { resolveMunicipality } from "@/lib/research/location";
import { estimateMarketRent, type MarketRentEstimate } from "@/lib/research/market-rent";
import type { AnalysisResult } from "./schema";

/** Egenkapitalandelen rapporten starter på. Kunden justerer i kalkulatoren. */
export const REPORT_EQUITY_SHARE = 0.25;

export interface Report {
  input: CalcInput;
  rent: MarketRentEstimate;
  /** Høyeste kjøpesum som går i null etter skatt, med samme egenkapitalandel. */
  breakEvenPrice: number | null;
}

/**
 * Gjør KI-funnene om til et regnestykke. KI-en har bare hentet ut tall;
 * leieanslaget og all regning kommer fra vår egen kode, så samme
 * salgsoppgave alltid gir samme svar.
 */
export function buildReport(analysis: AnalysisResult): Report | null {
  const price = analysis.numbers.askingPrice.value;
  if (!price || price <= 0) return null;

  const { property, numbers } = analysis;
  const rent = estimateMarketRent({
    municipality: resolveMunicipality({
      city: property.city,
      postalCode: property.postalCode,
    }),
    city: property.city,
    rooms: property.rooms,
    bedrooms: property.bedrooms,
    area: property.areaSqm,
    statedMonthlyRent: numbers.currentMonthlyRent.value,
  });

  const input: CalcInput = {
    ...DEFAULT_INPUT,
    purchasePrice: Math.round(price),
    ownershipType: property.ownership === "selveier" || property.ownership === "ukjent" ? "selveier" : "andel",
    sharedDebt: Math.max(0, Math.round(numbers.sharedDebt.value ?? 0)),
    // null = la motoren regne dokumentavgift og gebyrer ut fra eieform.
    transactionCosts:
      numbers.transactionCosts.value && numbers.transactionCosts.value > 0
        ? Math.round(numbers.transactionCosts.value)
        : null,
    equity: Math.round(price * REPORT_EQUITY_SHARE),
    monthlyRent: rent.monthly,
    hoaFeesMonthly: Math.max(0, Math.round(numbers.hoaFeesMonthly.value ?? 0)),
    municipalFeesYearly: Math.max(0, Math.round(numbers.municipalFeesYearly.value ?? 0)),
    propertyTaxYearly: Math.max(0, Math.round(numbers.propertyTaxYearly.value ?? 0)),
  };

  return { input, rent, breakEvenPrice: findBreakEvenPrice(input) };
}

/** Halveringssøk: kontantstrømmen faller når prisen stiger. */
export function findBreakEvenPrice(input: CalcInput): number | null {
  const share = input.purchasePrice > 0 ? input.equity / input.purchasePrice : 0;
  const cashflowAt = (price: number) =>
    calculate({ ...input, purchasePrice: price, equity: price * share })
      .monthlyCashflowAfterTax;

  let low = 0;
  let high = input.purchasePrice * 3;
  if (cashflowAt(low) < 0) return null;
  if (cashflowAt(high) >= 0) return null;
  for (let step = 0; step < 50; step += 1) {
    const mid = (low + high) / 2;
    if (cashflowAt(mid) >= 0) low = mid;
    else high = mid;
  }
  return Math.floor(low / 10_000) * 10_000;
}
