import { describe, expect, it } from "vitest";
import { parseListingAddress } from "./address";
import { extractStatedMonthlyRent, listingMentionsRented } from "./rent-from-text";

describe("parseListingAddress", () => {
  it("plukker postnummer og poststed fra FINN-adresse", () => {
    expect(parseListingAddress("Nordlisletta 22, 0952 Oslo")).toEqual({
      postalCode: "0952",
      city: "Oslo",
    });
  });

  it("tåler manglende adresse", () => {
    expect(parseListingAddress(null)).toEqual({
      postalCode: null,
      city: null,
    });
  });
});

describe("extractStatedMonthlyRent", () => {
  it("finner månedsleie i brødtekst", () => {
    expect(
      extractStatedMonthlyRent("Boligen er utleid for 16 500 kr per måned."),
    ).toBe(16_500);
  });

  it("finner årlig leieinntekt", () => {
    expect(extractStatedMonthlyRent("Leieinntekt: 180 000 kr")).toBe(15_000);
  });

  it("ignorerer tilfeldig chrome uten beløp", () => {
    expect(extractStatedMonthlyRent("Les mer om leieinntekt i guiden.")).toBeNull();
  });
});

describe("listingMentionsRented", () => {
  it("kjenner igjen utleid", () => {
    expect(listingMentionsRented("Leiligheten er utleid.")).toBe(true);
    expect(listingMentionsRented("Lys stue med balkong.")).toBe(false);
  });
});
