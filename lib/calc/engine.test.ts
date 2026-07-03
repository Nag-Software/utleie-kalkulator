import { describe, expect, it } from "vitest";
import {
  buildAmortizationSchedule,
  calculate,
  resolveTransactionCosts,
} from "./engine";
import { type CalcInput, DEFAULT_INPUT, parseInputLenient } from "./schema";

function input(overrides: Partial<CalcInput> = {}): CalcInput {
  return { ...DEFAULT_INPUT, ...overrides };
}

describe("buildAmortizationSchedule", () => {
  it("beregner kjent annuitetstermin (3 mill., 6 %, 25 år ≈ 19 329 kr/mnd)", () => {
    const schedule = buildAmortizationSchedule(3_000_000, 6, 25, 0, "annuitet");
    expect(schedule).toHaveLength(300);
    expect(schedule[0].payment).toBeCloseTo(19_329.1, 0);
    // annuitet: konstant termin gjennom hele løpetiden
    expect(schedule[150].payment).toBeCloseTo(schedule[0].payment, 6);
    // nedbetalt til null, sum avdrag = lån
    expect(schedule[299].balance).toBeCloseTo(0, 6);
    const totalPrincipal = schedule.reduce((s, m) => s + m.principal, 0);
    expect(totalPrincipal).toBeCloseTo(3_000_000, 4);
  });

  it("serielån: konstant avdrag, fallende termin", () => {
    const schedule = buildAmortizationSchedule(2_400_000, 5, 20, 0, "serie");
    const monthlyPrincipal = 2_400_000 / 240;
    expect(schedule[0].principal).toBeCloseTo(monthlyPrincipal, 4);
    expect(schedule[100].principal).toBeCloseTo(monthlyPrincipal, 4);
    expect(schedule[0].payment).toBeCloseTo(monthlyPrincipal + 2_400_000 * (0.05 / 12), 4);
    expect(schedule[1].payment).toBeLessThan(schedule[0].payment);
    expect(schedule[239].balance).toBeCloseTo(0, 6);
  });

  it("håndterer 0 % rente uten divisjon på null", () => {
    const schedule = buildAmortizationSchedule(1_200_000, 0, 10, 0, "annuitet");
    expect(schedule[0].payment).toBeCloseTo(10_000, 6);
    expect(schedule[0].interest).toBe(0);
    expect(schedule[119].balance).toBeCloseTo(0, 6);
  });

  it("avdragsfri periode: kun renter, uendret saldo", () => {
    const schedule = buildAmortizationSchedule(2_000_000, 6, 25, 5, "annuitet");
    for (const m of schedule.slice(0, 60)) {
      expect(m.principal).toBe(0);
      expect(m.payment).toBeCloseTo(2_000_000 * 0.005, 6);
      expect(m.balance).toBe(2_000_000);
    }
    expect(schedule[60].principal).toBeGreaterThan(0);
    expect(schedule[299].balance).toBeCloseTo(0, 6);
  });

  it("avdragsfrihet hele løpetiden gir balloon", () => {
    const schedule = buildAmortizationSchedule(1_000_000, 5, 10, 10, "annuitet");
    expect(schedule[119].balance).toBe(1_000_000);
    expect(schedule.every((m) => m.principal === 0)).toBe(true);
  });
});

describe("resolveTransactionCosts", () => {
  it("selveier: 2,5 % dokumentavgift + tinglysingsgebyrer", () => {
    expect(resolveTransactionCosts(input({ purchasePrice: 4_000_000 }))).toBe(
      100_000 + 585 + 585,
    );
  });

  it("andel: kun eierskiftegebyr", () => {
    expect(resolveTransactionCosts(input({ ownershipType: "andel" }))).toBe(1_500);
  });

  it("manuell overstyring vinner", () => {
    expect(resolveTransactionCosts(input({ transactionCosts: 42_000 }))).toBe(42_000);
  });
});

describe("calculate", () => {
  it("brutto yield = årsleie / (kjøpesum + fellesgjeld)", () => {
    const result = calculate(input());
    expect(result.grossYieldPct).toBeCloseTo(((15_000 * 12) / 4_000_000) * 100, 6);

    const withDebt = calculate(input({ sharedDebt: 500_000 }));
    expect(withDebt.grossYieldPct).toBeCloseTo(((15_000 * 12) / 4_500_000) * 100, 6);
  });

  it("100 % egenkapital: intet lån, ingen lånebetjening, break-even rente er null", () => {
    const result = calculate(input({ equity: 10_000_000 }));
    expect(result.loanAmount).toBe(0);
    expect(result.monthlyPayment).toBe(0);
    expect(result.years[0].debtService).toBe(0);
    expect(result.breakEvenRatePct).toBeNull();
    expect(result.cashOnCashPct).not.toBeNull();
  });

  it("negativt skatteresultat gir fradragsfordel (CF etter skatt > CF før skatt)", () => {
    const result = calculate(input()); // default-caset er cash flow-negativt med høye renter
    expect(result.years[0].taxableIncome).toBeLessThan(0);
    expect(result.years[0].tax).toBeLessThan(0);
    expect(result.years[0].cashflowAfterTax).toBeGreaterThan(
      result.years[0].cashflowBeforeTax,
    );
    expect(result.warnings.join(" ")).toContain("fradragsfordel");
  });

  it("skattesats 0 gir lik CF før og etter skatt", () => {
    const result = calculate(input({ taxRate: 0 }));
    expect(result.years[0].cashflowAfterTax).toBeCloseTo(
      result.years[0].cashflowBeforeTax,
      6,
    );
  });

  it("break-even leie: å leie ut til break-even gir ~0 i CF etter skatt", () => {
    const base = calculate(input());
    expect(base.breakEvenRent).not.toBeNull();
    const atBreakEven = calculate(input({ monthlyRent: base.breakEvenRent! }));
    expect(atBreakEven.monthlyCashflowAfterTax).toBeCloseTo(0, 1);
  });

  it("break-even rente: å låne til break-even-renten gir ~0 i CF etter skatt", () => {
    // lav leie + mye EK → positiv CF ved 0 % som blir negativ ved høy rente
    const base = calculate(input({ monthlyRent: 20_000, equity: 1_500_000 }));
    expect(base.breakEvenRatePct).not.toBeNull();
    const atBreakEven = calculate(
      input({ monthlyRent: 20_000, equity: 1_500_000, interestRate: base.breakEvenRatePct! }),
    );
    expect(atBreakEven.monthlyCashflowAfterTax).toBeCloseTo(0, 1);
  });

  it("100 % ledighet: null leieinntekt, dypt negativ CF", () => {
    const result = calculate(input({ vacancyRate: 100 }));
    expect(result.years[0].effectiveRent).toBe(0);
    expect(result.monthlyCashflowBeforeTax).toBeLessThan(0);
  });

  it("leie- og verdivekst treffer projeksjonen", () => {
    const result = calculate(input({ rentGrowth: 2.5, valueGrowth: 3, horizonYears: 10 }));
    expect(result.years[1].grossRent).toBeCloseTo(result.years[0].grossRent * 1.025, 4);
    expect(result.years[0].propertyValue).toBeCloseTo(4_000_000 * 1.03, 4);
    expect(result.years).toHaveLength(10);
    // akkumulert CF er løpende sum
    const manualCum = result.years[0].cashflowAfterTax + result.years[1].cashflowAfterTax;
    expect(result.years[1].cumulativeCashflow).toBeCloseTo(manualCum, 4);
  });

  it("egenkapitalverdi = boligverdi − restgjeld − fellesgjeld", () => {
    const result = calculate(input({ sharedDebt: 300_000 }));
    const y = result.years[4];
    expect(y.equityValue).toBeCloseTo(y.propertyValue - y.loanBalance - 300_000, 4);
  });

  it("sensitivitetsmatrisens midtcelle er lik basisberegningen", () => {
    const result = calculate(input());
    expect(result.sensitivity.rateDeltas).toEqual([-2, -1, 0, 1, 2]);
    expect(result.sensitivity.cells[2][1]).toBeCloseTo(
      result.monthlyCashflowAfterTax,
      4,
    );
    // høyere rente => lavere CF, høyere leie => høyere CF
    expect(result.sensitivity.cells[4][1]).toBeLessThan(result.sensitivity.cells[0][1]);
    expect(result.sensitivity.cells[2][2]).toBeGreaterThan(result.sensitivity.cells[2][0]);
  });

  it("avdragsfrihet lenger enn løpetid clampes med balloon-advarsel", () => {
    const result = calculate(input({ interestOnlyYears: 40, loanTermYears: 20 }));
    expect(result.clampedInterestOnlyYears).toBe(20);
    expect(result.balloonAtEnd).toBe(true);
    expect(result.years[0].principalPaid).toBe(0);
  });

  it("lån nedbetalt før horisonten gir null gjeld og null lånebetjening etterpå", () => {
    const result = calculate(
      input({ loanTermYears: 5, horizonYears: 10, equity: 2_000_000 }),
    );
    expect(result.years[4].loanBalance).toBeCloseTo(0, 4);
    expect(result.years[5].debtService).toBe(0);
    expect(result.years[9].interestPaid).toBe(0);
  });
});

describe("parseInputLenient", () => {
  it("fyller manglende felt med defaults og forkaster ugyldige verdier", () => {
    const parsed = parseInputLenient({
      purchasePrice: 5_000_000,
      interestRate: 999, // ugyldig → default
      loanType: "serie",
      junk: "ignoreres",
    });
    expect(parsed.purchasePrice).toBe(5_000_000);
    expect(parsed.interestRate).toBe(DEFAULT_INPUT.interestRate);
    expect(parsed.loanType).toBe("serie");
    expect(parsed.monthlyRent).toBe(DEFAULT_INPUT.monthlyRent);
  });

  it("tåler null/undefined/søppel", () => {
    expect(parseInputLenient(null)).toEqual(DEFAULT_INPUT);
    expect(parseInputLenient("tekst")).toEqual(DEFAULT_INPUT);
    expect(parseInputLenient(undefined)).toEqual(DEFAULT_INPUT);
  });
});
