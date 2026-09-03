import { describe, expect, it } from "vitest";
import { encodeInputToParams } from "@/components/calculator/url-state";
import type { FinnParsedData } from "@/lib/finn/types";
import { mapFinnToInputs } from "@/lib/finn/map-to-inputs";
import { decodeDossier, encodeDossier } from "./dossier";
import { enrichListing } from "./enrich";
import { resolveMunicipality } from "./location";
import { estimateMarketRent } from "./market-rent";
import { computePropertyTax, estimatePropertyTax } from "./property-tax";

function listing(overrides: Partial<FinnParsedData> = {}): FinnParsedData {
  return {
    finnkode: "468777164",
    url: "https://www.finn.no/realestate/homes/ad.html?finnkode=468777164",
    title: "3-roms",
    address: "Nordlisletta 22, 0952 Oslo",
    postalCode: "0952",
    city: "Oslo",
    imageUrl: null,
    imageUrls: [],
    askingPrice: 4_300_000,
    totalPrice: 4_550_668,
    sharedDebt: 249_278,
    hoaFeesMonthly: 6_811,
    hoaAssets: 135_367,
    transactionCosts: 1_390,
    taxValue: 1_083_794,
    propertyType: "Leilighet",
    ownershipTypeRaw: "Andel",
    bedrooms: 2,
    rooms: 3,
    internalArea: 66,
    usableArea: 77,
    externalArea: 11,
    balconyArea: 7,
    floor: 2,
    buildYear: 1957,
    municipalFeesYearly: null,
    propertyTaxYearly: null,
    energyLabel: null,
    plotArea: 26_777,
    plotOwnership: null,
    currentlyRented: null,
    statedMonthlyRent: null,
    ...overrides,
  };
}

describe("resolveMunicipality", () => {
  it("slår opp Oslo fra poststed og postnummer", () => {
    expect(resolveMunicipality({ city: "Oslo", postalCode: "0952" })).toBe("Oslo");
    expect(resolveMunicipality({ city: null, postalCode: "5003" })).toBe("Bergen");
  });
});

describe("computePropertyTax", () => {
  it("Oslo 4,3 mill: under bunnfradraget → 0", () => {
    expect(
      computePropertyTax({
        marketValue: 4_300_000,
        ratePromille: 1.7,
        bunnfradrag: 4_900_000,
      }),
    ).toBe(0);
  });

  it("Bergen 4 mill: treffer Utleio-eksemplet", () => {
    expect(
      computePropertyTax({
        marketValue: 4_000_000,
        ratePromille: 2.6,
        bunnfradrag: 750_000,
      }),
    ).toBe(5_330);
  });
});

describe("estimatePropertyTax", () => {
  it("andelsleilighet: ikke auto-fyll, sannsynligvis i felleskost", () => {
    const result = estimatePropertyTax({
      municipality: "Oslo",
      marketValue: 4_300_000,
      listingAmount: null,
      ownershipIsShare: true,
    });
    expect(result.status).toBe("likely_in_hoa");
    expect(result.yearly).toBe(0);
  });

  it("selveier i Bergen får estimat", () => {
    const result = estimatePropertyTax({
      municipality: "Bergen",
      marketValue: 4_000_000,
      listingAmount: null,
      ownershipIsShare: false,
    });
    expect(result.status).toBe("estimated");
    expect(result.yearly).toBe(5_330);
  });

  it("Drammen har ikke eiendomsskatt på bolig", () => {
    const result = estimatePropertyTax({
      municipality: "Drammen",
      marketValue: 4_000_000,
      listingAmount: null,
      ownershipIsShare: false,
    });
    expect(result.status).toBe("none");
    expect(result.yearly).toBe(0);
  });
});

describe("estimateMarketRent", () => {
  it("Oslo 3-roms treffer byguidens sjikt", () => {
    const result = estimateMarketRent({
      municipality: "Oslo",
      city: "Oslo",
      rooms: 3,
      bedrooms: 2,
      area: 66,
      statedMonthlyRent: null,
    });
    expect(result.source).toBe("estimate");
    expect(result.monthly).toBeGreaterThanOrEqual(19_000);
    expect(result.monthly).toBeLessThanOrEqual(26_000);
  });

  it("oppgitt leie i annonsen vinner", () => {
    const result = estimateMarketRent({
      municipality: "Oslo",
      city: "Oslo",
      rooms: 3,
      bedrooms: 2,
      area: 66,
      statedMonthlyRent: 14_000,
    });
    expect(result.source).toBe("listing");
    expect(result.monthly).toBe(14_000);
  });
});

describe("enrichListing + dossier", () => {
  it("andelsleilighet i Oslo: leie og forsikring fylles, ikke eiendomsskatt", () => {
    const research = enrichListing(listing());
    expect(research.municipality).toBe("Oslo");
    expect(research.marketRent.monthly).toBeGreaterThan(15_000);
    expect(research.propertyTax.status).toBe("likely_in_hoa");
    expect(research.estimatedFields).toContain("monthlyRent");
    expect(research.estimatedFields).not.toContain("propertyTaxYearly");
    expect(research.maintenance.pct).toBe(8);
  });

  it("overlever en runde i URL-dossieret", () => {
    const finn = listing({ energyLabel: "G - Oransje" });
    const research = enrichListing(finn);
    const encoded = encodeDossier({ finn, research, warnings: ["test"] });
    const decoded = decodeDossier(encoded);
    expect(decoded?.finn.finnkode).toBe(finn.finnkode);
    expect(decoded?.finn.hoaAssets).toBe(135_367);
    expect(decoded?.finn.imageUrls).toEqual([]);
    expect(decoded?.research.municipality).toBe("Oslo");
    expect(decoded?.warnings).toEqual(["test"]);
    const params = encodeInputToParams(mapFinnToInputs(finn, research));
    params.set("kilde", "finn");
    params.set("d", encoded);
    expect(params.toString().length).toBeLessThan(12_000);
  });
});
