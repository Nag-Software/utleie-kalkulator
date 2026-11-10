import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { mergeAnalyses, offsetPages } from "./merge";
import type { AnalysisResult } from "./schema";
import { splitPdf } from "./split";

const none = { value: null, page: null };

function part(overrides: Partial<AnalysisResult> = {}): AnalysisResult {
  return {
    isProspectus: true,
    property: {
      address: null, postalCode: null, city: null, propertyType: null,
      ownership: "ukjent", areaSqm: null, rooms: null, bedrooms: null, buildYear: null,
    },
    numbers: {
      askingPrice: none, sharedDebt: none, transactionCosts: none, hoaFeesMonthly: none,
      municipalFeesYearly: none, propertyTaxYearly: none, currentMonthlyRent: none,
    },
    rental: { status: "ukjent", note: "", page: null },
    condition: [],
    findings: [],
    summary: "",
    ...overrides,
  };
}

const finding = (severity: "alvorlig" | "obs" | "bra", title: string, page: number) => ({
  severity, title, detail: "", page, costLow: null, costHigh: null,
});

describe("offsetPages", () => {
  it("regner sidetall i en del tilbake til originalen", () => {
    const shifted = offsetPages(
      part({
        numbers: { ...part().numbers, hoaFeesMonthly: { value: 3_000, page: 2 } },
        rental: { status: "tillatt", note: "", page: 5 },
        findings: [finding("obs", "Bad TG2", 1)],
      }),
      41,
    );
    expect(shifted.numbers.hoaFeesMonthly.page).toBe(42);
    expect(shifted.rental.page).toBe(45);
    expect(shifted.findings[0].page).toBe(41);
    expect(shifted.numbers.askingPrice.page).toBeNull();
  });
});

describe("mergeAnalyses", () => {
  it("tar tall fra delen som fant dem, og samler funnene etter alvor", () => {
    const merged = mergeAnalyses([
      part({
        property: { ...part().property, address: "Testveien 1", ownership: "andel" },
        numbers: { ...part().numbers, askingPrice: { value: 3_000_000, page: 2 } },
        findings: [finding("bra", "Utleid i dag", 3)],
        summary: "Første del.",
      }),
      part({
        isProspectus: false,
        property: { ...part().property, buildYear: 1960, ownership: "selveier" },
        numbers: { ...part().numbers, sharedDebt: { value: 400_000, page: 44 } },
        rental: { status: "krever_samtykke", note: "Styret må samtykke.", page: 60 },
        condition: [
          { part: "Bad", grade: 2, note: "", page: 12, costLow: null, costHigh: null },
          { part: "Bad/vaskerom", grade: 3, note: "Må renoveres.", page: 59, costLow: 200_000, costHigh: 500_000 },
          { part: "Tak", grade: 1, note: "", page: 61, costLow: null, costHigh: null },
        ],
        findings: [finding("alvorlig", "Bad TG3", 47), finding("bra", "utleid i dag", 50)],
        summary: "Andre del.",
      }),
    ]);
    expect(merged.isProspectus).toBe(true);
    expect(merged.property.address).toBe("Testveien 1");
    expect(merged.property.ownership).toBe("andel");
    expect(merged.property.buildYear).toBe(1960);
    expect(merged.numbers.askingPrice.value).toBe(3_000_000);
    expect(merged.numbers.sharedDebt).toEqual({ value: 400_000, page: 44 });
    expect(merged.rental.status).toBe("krever_samtykke");
    expect(merged.findings.map((f) => f.title)).toEqual(["Bad TG3", "Utleid i dag"]);
    expect(merged.summary).toBe("Første del. Andre del.");
    // Samme bygningsdel én gang, med strengeste grad, verst først.
    expect(merged.condition.map((c) => [c.part, c.grade])).toEqual([
      ["Bad/vaskerom", 3],
      ["Tak", 1],
    ]);
  });
});

describe("splitPdf", () => {
  it("lar en liten fil være urørt", async () => {
    const bytes = Buffer.from("ikke engang en pdf");
    const parts = await splitPdf(bytes, 1_000);
    expect(parts).toEqual([{ bytes, firstPage: 1, pageCount: 0 }]);
  });

  it("deler en stor fil i sidebolker som dekker alle sidene én gang", async () => {
    const doc = await PDFDocument.create();
    for (let i = 0; i < 7; i += 1) doc.addPage([595, 842]).drawText(`Side ${i + 1} `.repeat(40));
    const bytes = Buffer.from(await doc.save());
    const max = Math.ceil(bytes.byteLength / 2);
    const parts = await splitPdf(bytes, max);
    expect(parts.length).toBeGreaterThan(1);
    expect(parts.every((p) => p.bytes.byteLength <= max)).toBe(true);
    expect(parts.reduce((sum, p) => sum + p.pageCount, 0)).toBe(7);
    let next = 1;
    for (const p of parts) {
      expect(p.firstPage).toBe(next);
      expect((await PDFDocument.load(p.bytes)).getPageCount()).toBe(p.pageCount);
      next += p.pageCount;
    }
  });
});
