import { resolveTransactionCosts } from "@/lib/calc/engine";
import {
  type CalcInput,
  DEFAULT_INPUT,
  parseInputLenient,
} from "@/lib/calc/schema";
import type { FinnParsedData } from "./types";
import type { ListingResearch } from "@/lib/research/enrich";

/**
 * FINN-data → kalkulatorinputs. Leie, eiendomsskatt, forsikring og
 * vedlikehold fylles fra research-anslag når de finnes; egenkapital settes
 * til 15 % av prosjektet som startpunkt.
 */
export function mapFinnToInputs(
  finn: FinnParsedData,
  research?: ListingResearch,
): CalcInput {
  const ownershipType = /andel|aksje/i.test(finn.ownershipTypeRaw ?? "")
    ? "andel"
    : "selveier";

  const fillPropertyTax =
    research &&
    (research.propertyTax.status === "estimated" ||
      research.propertyTax.status === "from_listing");

  const base: CalcInput = {
    ...DEFAULT_INPUT,
    purchasePrice: finn.askingPrice ?? DEFAULT_INPUT.purchasePrice,
    ownershipType,
    transactionCosts: finn.transactionCosts,
    sharedDebt: finn.sharedDebt ?? 0,
    hoaFeesMonthly: finn.hoaFeesMonthly ?? 0,
    municipalFeesYearly:
      finn.municipalFeesYearly ??
      (finn.hoaFeesMonthly ? 0 : DEFAULT_INPUT.municipalFeesYearly),
    propertyTaxYearly: fillPropertyTax
      ? (research?.propertyTax.yearly ?? 0)
      : (finn.propertyTaxYearly ?? 0),
    monthlyRent: research?.marketRent.monthly ?? DEFAULT_INPUT.monthlyRent,
    insuranceYearly: research?.insurance.yearly ?? DEFAULT_INPUT.insuranceYearly,
    maintenancePctOfRent:
      research?.maintenance.pct ?? DEFAULT_INPUT.maintenancePctOfRent,
  };

  const projectCost =
    base.purchasePrice +
    resolveTransactionCosts(base) +
    base.renovationCost +
    base.otherPurchaseCosts;
  base.equity = Math.round((projectCost * 0.15) / 10_000) * 10_000;

  return parseInputLenient(base);
}
