import { describe, expect, it } from "vitest";
import {
  consumeKlipp,
  emptyKort,
  grantKlipp,
  statusOf,
} from "./klippekort-core";

const NOW = new Date("2026-09-03T10:00:00.000Z");

describe("klippekort", () => {
  it("gir 20 klipp i 12 måneder", () => {
    const kort = grantKlipp(emptyKort(), "payment-1", NOW);
    expect(statusOf(kort, NOW)).toMatchObject({
      remaining: 20,
      total: 20,
      used: 0,
      expiresAt: "2027-09-03T10:00:00.000Z",
    });
  });

  it("krediterer samme betaling bare én gang", () => {
    const first = grantKlipp(emptyKort(), "payment-1", NOW);
    expect(grantKlipp(first, "payment-1", NOW)).toEqual(first);
  });

  it("trekker ett klipp og åpner samme annonse gratis igjen", () => {
    const kort = grantKlipp(emptyKort(), "payment-1", NOW);
    const first = consumeKlipp(kort, "123456789", NOW);
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(statusOf(first.kort, NOW).remaining).toBe(19);

    const reopened = consumeKlipp(first.kort, "123456789", NOW);
    expect(reopened.ok).toBe(true);
    if (!reopened.ok) return;
    expect(reopened.alreadyUnlocked).toBe(true);
    expect(statusOf(reopened.kort, NOW).remaining).toBe(19);
  });

  it("lar hvert kjøp beholde sin egen utløpsdato", () => {
    const first = grantKlipp(emptyKort(), "payment-1", NOW);
    const later = new Date("2027-08-01T10:00:00.000Z");
    const second = grantKlipp(first, "payment-2", later);
    const afterFirstExpiry = new Date("2027-10-01T10:00:00.000Z");

    expect(statusOf(second, afterFirstExpiry)).toMatchObject({
      remaining: 20,
      total: 40,
      expiredClips: 20,
      expiresAt: "2028-08-01T10:00:00.000Z",
    });
  });

  it("avviser nye annonser når alle gjenværende klipp er utløpt", () => {
    const kort = grantKlipp(emptyKort(), "payment-1", NOW);
    const afterExpiry = new Date("2027-10-01T10:00:00.000Z");
    expect(consumeKlipp(kort, "123456789", afterExpiry)).toEqual({
      ok: false,
      reason: "expired",
    });
  });
});
