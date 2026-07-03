import { resolveTransactionCosts } from "@/lib/calc/engine";
import {
  type CalcInput,
  DEFAULT_INPUT,
  parseInputLenient,
} from "@/lib/calc/schema";
import type { FinnParsedData } from "./types";

/**
 * FINN-data → kalkulatorinputs. Leie må brukeren selv sette (salgsannonser
 * oppgir den ikke); egenkapital settes til 15 % av prosjektet som startpunkt.
 */
export function mapFinnToInputs(finn: FinnParsedData): CalcInput {
  const ownershipType = /andel|aksje/i.test(finn.ownershipTypeRaw ?? "")
    ? "andel"
    : "selveier";

  const base: CalcInput = {
    ...DEFAULT_INPUT,
    purchasePrice: finn.askingPrice ?? DEFAULT_INPUT.purchasePrice,
    ownershipType,
    // parsede omkostninger vinner; null → auto fra eieform
    transactionCosts: finn.transactionCosts,
    sharedDebt: finn.sharedDebt ?? 0,
    hoaFeesMonthly: finn.hoaFeesMonthly ?? 0,
    // med felleskostnader er kommunale avgifter normalt inkludert
    municipalFeesYearly:
      finn.municipalFeesYearly ??
      (finn.hoaFeesMonthly ? 0 : DEFAULT_INPUT.municipalFeesYearly),
    propertyTaxYearly: finn.propertyTaxYearly ?? 0,
  };

  const projectCost =
    base.purchasePrice +
    resolveTransactionCosts(base) +
    base.renovationCost +
    base.otherPurchaseCosts;
  base.equity = Math.round((projectCost * 0.15) / 10_000) * 10_000;

  return parseInputLenient(base);
}
