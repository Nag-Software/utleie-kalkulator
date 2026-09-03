import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { extractFinnkode } from "./finnkode";
import { mapFinnToInputs } from "./map-to-inputs";
import { parseFinnListing } from "./parse";
import { enrichListing } from "@/lib/research/enrich";

function fixture(finnkode: string): string {
  return readFileSync(join(__dirname, "__fixtures__", `${finnkode}.html`), "utf8");
}

describe("parseFinnListing", () => {
  it("parser andelsleilighet (fellesgjeld, felleskost, eieform)", () => {
    const { parsed, parseFailed, warnings } = parseFinnListing(
      fixture("468777164"),
      "468777164",
    );
    expect(parseFailed).toBe(false);
    expect(parsed.askingPrice).toBe(4_300_000);
    expect(parsed.totalPrice).toBe(4_550_668);
    expect(parsed.sharedDebt).toBe(249_278);
    expect(parsed.hoaFeesMonthly).toBe(6_811);
    expect(parsed.transactionCosts).toBe(1_390);
    expect(parsed.ownershipTypeRaw).toBe("Andel");
    expect(parsed.propertyType).toBe("Leilighet");
    expect(parsed.bedrooms).toBe(2);
    expect(parsed.internalArea).toBe(66);
    expect(parsed.buildYear).toBe(1957);
    expect(parsed.address).toContain("Oslo");
    expect(parsed.city).toBe("Oslo");
    expect(parsed.postalCode).toBe("0952");
    expect(parsed.hoaAssets).toBe(135_367);
    expect(parsed.externalArea).toBe(11);
    expect(parsed.balconyArea).toBe(7);
    expect(parsed.taxValue).toBe(1_083_794);
    expect(parsed.imageUrls.length).toBeGreaterThanOrEqual(8);
    expect(parsed.imageUrls[0]).toContain("finncdn");
    expect(new Set(parsed.imageUrls).size).toBe(parsed.imageUrls.length);
    expect(warnings).not.toContain("Fant ikke prisantydning i annonsen.");
  });

  it("parser selveierleilighet", () => {
    const { parsed, parseFailed } = parseFinnListing(
      fixture("468037005"),
      "468037005",
    );
    expect(parseFailed).toBe(false);
    expect(parsed.askingPrice).toBe(2_990_000);
    expect(parsed.ownershipTypeRaw).toBe("Selveier");
    expect(parsed.transactionCosts).toBe(74_750);
    expect(parsed.hoaFeesMonthly).toBe(2_673);
    expect(parsed.imageUrl).toContain("finncdn");
    expect(parsed.title).toBeTruthy();
    expect(parsed.plotOwnership).toBe("eiet");
    expect(parsed.city).toBe("Oslo");
  });

  it("finner pris også når prisantydning ikke står i dt/dd (totalpris-fallback)", () => {
    const { parsed, parseFailed } = parseFinnListing(
      fixture("468700535"),
      "468700535",
    );
    expect(parseFailed).toBe(false);
    // totalpris 5 809 024 − omkostninger 159 024 = 5 650 000
    expect(parsed.askingPrice).toBe(5_650_000);
    expect(parsed.energyLabel).toMatch(/G/i);
    expect(parsed.plotOwnership).toBe("eiet");
  });

  it("utleder prisantydning fra totalpris når den mangler helt", () => {
    const html = `<html><body><dl>
      <dt>Totalpris</dt><dd>3 100 000 kr</dd>
      <dt>Omkostninger</dt><dd>80 000 kr</dd>
      <dt>Fellesgjeld</dt><dd>20 000 kr</dd>
      <dt>Eieform</dt><dd>Selveier</dd>
    </dl></body></html>`;
    const { parsed, parseFailed, warnings } = parseFinnListing(html, "99999999");
    expect(parseFailed).toBe(false);
    expect(parsed.askingPrice).toBe(3_000_000);
    expect(warnings).toContain("Prisantydning utledet fra totalpris.");
  });

  it("tåler tomt dokument uten å kaste", () => {
    const { parseFailed, warnings } = parseFinnListing(
      "<html><body>ingenting</body></html>",
      "12345678",
    );
    expect(parseFailed).toBe(true);
    expect(warnings.length).toBeGreaterThan(0);
  });
});

describe("mapFinnToInputs", () => {
  it("mapper andel: dokumentavgift-fri, fellesgjeld separat, parsede omkostninger vinner", () => {
    const { parsed } = parseFinnListing(fixture("468777164"), "468777164");
    const input = mapFinnToInputs(parsed);
    expect(input.purchasePrice).toBe(4_300_000);
    expect(input.ownershipType).toBe("andel");
    expect(input.transactionCosts).toBe(1_390);
    expect(input.sharedDebt).toBe(249_278);
    expect(input.hoaFeesMonthly).toBe(6_811);
    expect(input.municipalFeesYearly).toBe(0);
    // 15 % av (4 300 000 + 1 390), rundet til 10 000
    expect(input.equity).toBe(650_000);
  });

  it("mapper selveier med parsede omkostninger", () => {
    const { parsed } = parseFinnListing(fixture("468037005"), "468037005");
    const input = mapFinnToInputs(parsed);
    expect(input.ownershipType).toBe("selveier");
    expect(input.transactionCosts).toBe(74_750);
    expect(input.sharedDebt).toBe(89_456);
  });

  it("fyller leie, forsikring og vedlikehold fra research", () => {
    const { parsed } = parseFinnListing(fixture("468777164"), "468777164");
    const research = enrichListing(parsed);
    const input = mapFinnToInputs(parsed, research);
    expect(input.monthlyRent).toBe(research.marketRent.monthly);
    expect(input.insuranceYearly).toBe(research.insurance.yearly);
    expect(input.maintenancePctOfRent).toBe(8);
    expect(input.propertyTaxYearly).toBe(0);
  });
});

describe("extractFinnkode", () => {
  it("godtar rå finnkode og FINN-URLer, avviser andre hoster", () => {
    expect(extractFinnkode("468777164")).toBe("468777164");
    expect(
      extractFinnkode("https://www.finn.no/realestate/homes/ad.html?finnkode=468777164"),
    ).toBe("468777164");
    expect(
      extractFinnkode("https://finn.no/realestate/homes/ad.html?finnkode=468777164&ref=x"),
    ).toBe("468777164");
    expect(extractFinnkode("https://evil.com/?finnkode=468777164")).toBeNull();
    expect(extractFinnkode("https://www.finn.no/whatever")).toBeNull();
    expect(extractFinnkode("ikke en kode")).toBeNull();
  });
});
