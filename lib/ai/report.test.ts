import { describe, expect, it } from "vitest";
import { calculate } from "@/lib/calc/engine";
import { buildReport, findBreakEvenPrice, REPORT_EQUITY_SHARE } from "./report";
import type { AnalysisResult } from "./schema";

const none = { value: null, page: null };

function analysis(overrides: Partial<AnalysisResult["numbers"]> = {}): AnalysisResult {
  return {
    isProspectus: true,
    property: {
      address: "Testveien 1",
      postalCode: "0550",
      city: "Oslo",
      propertyType: "Leilighet",
      ownership: "andel",
      areaSqm: 52,
      rooms: 2,
      bedrooms: 1,
      buildYear: 1960,
    },
    numbers: {
      askingPrice: { value: 3_000_000, page: 2 },
      sharedDebt: { value: 400_000, page: 2 },
      transactionCosts: none,
      hoaFeesMonthly: { value: 4_500, page: 3 },
      municipalFeesYearly: none,
      propertyTaxYearly: none,
      currentMonthlyRent: none,
      ...overrides,
    },
    rental: { status: "krever_samtykke", note: "", page: null },
    condition: [],
    findings: [],
    summary: "",
  };
}

describe("buildReport", () => {
  it("setter tallene fra salgsoppgaven inn i kalkulatoren", () => {
    const report = buildReport(analysis());
    expect(report).not.toBeNull();
    expect(report!.input.purchasePrice).toBe(3_000_000);
    expect(report!.input.ownershipType).toBe("andel");
    expect(report!.input.sharedDebt).toBe(400_000);
    expect(report!.input.hoaFeesMonthly).toBe(4_500);
    expect(report!.input.equity).toBe(3_000_000 * REPORT_EQUITY_SHARE);
    // Ikke oppgitt i dokumentet: motoren regner omkostningene selv.
    expect(report!.input.transactionCosts).toBeNull();
    expect(report!.input.municipalFeesYearly).toBe(0);
  });

  it("bruker dagens leie når boligen er utleid", () => {
    const report = buildReport(
      analysis({ currentMonthlyRent: { value: 16_200, page: 5 } }),
    );
    expect(report!.input.monthlyRent).toBe(16_200);
    expect(report!.rent.source).toBe("listing");
  });

  it("gir ingen rapport uten prisantydning", () => {
    expect(buildReport(analysis({ askingPrice: none }))).toBeNull();
  });
});

describe("findBreakEvenPrice", () => {
  it("finner kjøpesummen der kontantstrømmen går i null", () => {
    const { input } = buildReport(analysis())!;
    const price = findBreakEvenPrice(input);
    expect(price).not.toBeNull();
    const share = input.equity / input.purchasePrice;
    const at = (p: number) =>
      calculate({ ...input, purchasePrice: p, equity: p * share })
        .monthlyCashflowAfterTax;
    expect(at(price!)).toBeGreaterThanOrEqual(0);
    expect(at(price! + 20_000)).toBeLessThan(0);
  });
});
