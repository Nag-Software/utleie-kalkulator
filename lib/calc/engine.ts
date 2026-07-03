import {
  type CalcInput,
  DOCUMENT_TAX_RATE,
  REGISTRATION_FEE_DEED,
  REGISTRATION_FEE_MORTGAGE,
  SHARE_TRANSFER_FEE,
} from "./schema";

export interface YearRow {
  year: number;
  grossRent: number;
  effectiveRent: number;
  opex: number;
  noi: number;
  debtService: number;
  interestPaid: number;
  principalPaid: number;
  /** restgjeld ved årets slutt */
  loanBalance: number;
  taxableIncome: number;
  /** negativ verdi = fradragsfordel (forutsetter annen inntekt å føre fradraget mot) */
  tax: number;
  cashflowBeforeTax: number;
  cashflowAfterTax: number;
  propertyValue: number;
  /** boligverdi − restgjeld − fellesgjeld */
  equityValue: number;
  cumulativeCashflow: number;
  /** (equityValue − innskutt EK) + akkumulert kontantstrøm */
  totalReturn: number;
  annualizedReturnPct: number | null;
}

export interface SensitivityResult {
  /** prosentpoeng-endringer i rente, f.eks. [-2,-1,0,1,2] (floored til 0 % effektiv rente) */
  rateDeltas: number[];
  /** multiplikatorer på leie, f.eks. [0.9, 1, 1.1] */
  rentFactors: number[];
  /** cells[rateIdx][rentIdx] = månedlig kontantstrøm etter skatt, år 1 */
  cells: number[][];
}

export interface CalcResult {
  resolvedTransactionCosts: number;
  totalPropertyCost: number;
  totalProjectCost: number;
  loanAmount: number;
  /** lån / (kjøpesum + fellesgjeld), null når totalPropertyCost = 0 */
  ltvPct: number | null;
  clampedInterestOnlyYears: number;
  /** true når hele løpetiden er avdragsfri — restgjeld forfaller ved slutt */
  balloonAtEnd: boolean;

  /** første måneds terminbeløp */
  monthlyPayment: number;
  monthlyOpex: number;
  monthlyCashflowBeforeTax: number;
  monthlyCashflowAfterTax: number;

  grossYieldPct: number | null;
  netYieldPct: number | null;
  cashOnCashPct: number | null;
  breakEvenRent: number | null;
  breakEvenRatePct: number | null;

  years: YearRow[];
  sensitivity: SensitivityResult;
  warnings: string[];
}

export function resolveTransactionCosts(input: CalcInput): number {
  if (input.transactionCosts !== null) return input.transactionCosts;
  if (input.ownershipType === "selveier") {
    return (
      Math.round(input.purchasePrice * DOCUMENT_TAX_RATE) +
      REGISTRATION_FEE_DEED +
      REGISTRATION_FEE_MORTGAGE
    );
  }
  return SHARE_TRANSFER_FEE;
}

interface MonthEntry {
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

/**
 * Månedlig amortiseringsplan for hele løpetiden.
 * Avdragsfri periode først (kun renter), deretter annuitet eller serie over resten.
 * interestOnlyMonths >= termMonths => avdragsfritt hele løpetiden (balloon).
 */
export function buildAmortizationSchedule(
  loanAmount: number,
  annualRatePct: number,
  termYears: number,
  interestOnlyYears: number,
  loanType: "annuitet" | "serie",
): MonthEntry[] {
  const months = Math.round(termYears * 12);
  const interestOnlyMonths = Math.min(Math.round(interestOnlyYears * 12), months);
  const amortizingMonths = months - interestOnlyMonths;
  const r = annualRatePct / 100 / 12;
  const schedule: MonthEntry[] = [];
  if (loanAmount <= 0) return schedule;

  let balance = loanAmount;
  const annuityPayment =
    amortizingMonths === 0
      ? 0
      : r === 0
        ? loanAmount / amortizingMonths
        : (loanAmount * r) / (1 - Math.pow(1 + r, -amortizingMonths));
  const seriesPrincipal = amortizingMonths === 0 ? 0 : loanAmount / amortizingMonths;

  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    let principal: number;
    if (m <= interestOnlyMonths) {
      principal = 0;
    } else if (loanType === "annuitet") {
      principal = Math.min(annuityPayment - interest, balance);
    } else {
      principal = Math.min(seriesPrincipal, balance);
    }
    // siste termin: rydd opp flyttallsrest
    if (m === months && m > interestOnlyMonths) principal = balance;
    balance = Math.max(0, balance - principal);
    schedule.push({ payment: interest + principal, interest, principal, balance });
  }
  return schedule;
}

interface YearOneCore {
  effectiveRent: number;
  opex: number;
  noi: number;
  debtService: number;
  interestPaid: number;
  taxableIncome: number;
  tax: number;
  cashflowBeforeTax: number;
  cashflowAfterTax: number;
}

function yearlyOpex(input: CalcInput, grossRent: number, growthFactor: number): number {
  const fixed =
    input.hoaFeesMonthly * 12 +
    input.municipalFeesYearly +
    input.propertyTaxYearly +
    input.insuranceYearly +
    input.utilitiesYearly +
    input.accountingYearly +
    input.otherOpexYearly;
  const rentLinked =
    ((input.maintenancePctOfRent + input.managementPctOfRent) / 100) * grossRent;
  return fixed * growthFactor + rentLinked;
}

function computeYearOne(
  input: CalcInput,
  monthlyRent: number,
  annualRatePct: number,
): YearOneCore {
  const schedule = buildAmortizationSchedule(
    Math.max(0, totalProjectCost(input) - input.equity),
    annualRatePct,
    input.loanTermYears,
    input.interestOnlyYears,
    input.loanType,
  );
  const firstYear = schedule.slice(0, 12);
  const debtService = firstYear.reduce((s, m) => s + m.payment, 0);
  const interestPaid = firstYear.reduce((s, m) => s + m.interest, 0);

  const grossRent = monthlyRent * 12;
  const effectiveRent = grossRent * (1 - input.vacancyRate / 100);
  const opex = yearlyOpex(input, grossRent, 1);
  const noi = effectiveRent - opex;
  const cashflowBeforeTax = noi - debtService;
  const taxableIncome =
    effectiveRent - opex - (input.interestDeduction ? interestPaid : 0);
  const tax = (input.taxRate / 100) * taxableIncome;
  return {
    effectiveRent,
    opex,
    noi,
    debtService,
    interestPaid,
    taxableIncome,
    tax,
    cashflowBeforeTax,
    cashflowAfterTax: cashflowBeforeTax - tax,
  };
}

function totalProjectCost(input: CalcInput): number {
  return (
    input.purchasePrice +
    resolveTransactionCosts(input) +
    input.renovationCost +
    input.otherPurchaseCosts
  );
}

/** Biseksjon: finn x i [lo, hi] der f(x) = 0. f må være monoton. */
function bisect(
  f: (x: number) => number,
  lo: number,
  hi: number,
  iterations = 80,
): number | null {
  let fLo = f(lo);
  const fHi = f(hi);
  if (fLo === 0) return lo;
  if (fHi === 0) return hi;
  if (fLo * fHi > 0) return null; // ingen fortegnsskifte i intervallet
  for (let i = 0; i < iterations; i++) {
    const mid = (lo + hi) / 2;
    const fMid = f(mid);
    if (fMid === 0) return mid;
    if (fLo * fMid < 0) {
      hi = mid;
    } else {
      lo = mid;
      fLo = fMid;
    }
  }
  return (lo + hi) / 2;
}

export function calculate(input: CalcInput): CalcResult {
  const warnings: string[] = [];

  const resolvedCosts = resolveTransactionCosts(input);
  const totalProperty = input.purchasePrice + input.sharedDebt;
  const totalProject = totalProjectCost(input);
  const loanAmount = Math.max(0, totalProject - input.equity);
  const clampedInterestOnlyYears = Math.min(
    input.interestOnlyYears,
    input.loanTermYears,
  );
  const balloonAtEnd =
    loanAmount > 0 && clampedInterestOnlyYears >= input.loanTermYears;
  if (input.interestOnlyYears > input.loanTermYears) {
    warnings.push("Avdragsfrihet er begrenset til lånets løpetid.");
  }
  if (balloonAtEnd) {
    warnings.push(
      "Hele løpetiden er avdragsfri — restgjelden forfaller i sin helhet ved slutten.",
    );
  }
  if (input.equity >= totalProject && totalProject > 0) {
    warnings.push("Egenkapitalen dekker hele prosjektet — ingen lånefinansiering.");
  }
  if (input.sharedDebt > 0) {
    warnings.push(
      "Fellesgjeld antas betjent gjennom felleskostnadene og legges ikke på lånet.",
    );
  }

  const schedule = buildAmortizationSchedule(
    loanAmount,
    input.interestRate,
    input.loanTermYears,
    clampedInterestOnlyYears,
    input.loanType,
  );

  // Årsprojeksjon
  const years: YearRow[] = [];
  let cumulativeCashflow = 0;
  for (let t = 1; t <= input.horizonYears; t++) {
    const growthFactor = Math.pow(1 + input.rentGrowth / 100, t - 1);
    const opexFactor = Math.pow(1 + input.opexGrowth / 100, t - 1);
    const grossRent = input.monthlyRent * 12 * growthFactor;
    const effectiveRent = grossRent * (1 - input.vacancyRate / 100);
    const opex = yearlyOpex(input, grossRent, opexFactor);
    const noi = effectiveRent - opex;

    const yearMonths = schedule.slice((t - 1) * 12, t * 12);
    const debtService = yearMonths.reduce((s, m) => s + m.payment, 0);
    const interestPaid = yearMonths.reduce((s, m) => s + m.interest, 0);
    const principalPaid = yearMonths.reduce((s, m) => s + m.principal, 0);
    // tom slice = året ligger etter lånets løpetid → nedbetalt
    const loanBalance =
      yearMonths.length > 0 ? yearMonths[yearMonths.length - 1].balance : 0;

    const cashflowBeforeTax = noi - debtService;
    const taxableIncome =
      effectiveRent - opex - (input.interestDeduction ? interestPaid : 0);
    const tax = (input.taxRate / 100) * taxableIncome;
    const cashflowAfterTax = cashflowBeforeTax - tax;
    cumulativeCashflow += cashflowAfterTax;

    const propertyValue =
      totalProperty * Math.pow(1 + input.valueGrowth / 100, t);
    const equityValue = propertyValue - loanBalance - input.sharedDebt;
    const totalReturn = equityValue - input.equity + cumulativeCashflow;
    const annualizedReturnPct =
      input.equity > 0 && equityValue + cumulativeCashflow > 0
        ? (Math.pow(
            (equityValue + cumulativeCashflow) / input.equity,
            1 / t,
          ) -
            1) *
          100
        : null;

    years.push({
      year: t,
      grossRent,
      effectiveRent,
      opex,
      noi,
      debtService,
      interestPaid,
      principalPaid,
      loanBalance,
      taxableIncome,
      tax,
      cashflowBeforeTax,
      cashflowAfterTax,
      propertyValue,
      equityValue,
      cumulativeCashflow,
      totalReturn,
      annualizedReturnPct,
    });
  }

  const y1 = years[0];

  // Nøkkeltall år 1
  const grossYieldPct =
    totalProperty > 0 ? ((input.monthlyRent * 12) / totalProperty) * 100 : null;
  const investedCapital = totalProject + input.sharedDebt;
  const netYieldPct = investedCapital > 0 ? (y1.noi / investedCapital) * 100 : null;
  const cashOnCashPct =
    input.equity > 0 ? (y1.cashflowAfterTax / input.equity) * 100 : null;

  // Break-even månedsleie (CF etter skatt år 1 = 0)
  const cfAtRent = (rent: number) =>
    computeYearOne(input, rent, input.interestRate).cashflowAfterTax;
  let breakEvenRent: number | null;
  if (cfAtRent(0) >= 0) {
    breakEvenRent = 0;
  } else {
    const hi = Math.max(input.monthlyRent * 10, 200_000);
    breakEvenRent = bisect(cfAtRent, 0, hi);
  }

  // Break-even rente (CF etter skatt år 1 = 0)
  let breakEvenRatePct: number | null = null;
  if (loanAmount > 0) {
    const cfAtRate = (rate: number) =>
      computeYearOne(input, input.monthlyRent, rate).cashflowAfterTax;
    if (cfAtRate(0) > 0 && cfAtRate(30) < 0) {
      breakEvenRatePct = bisect(cfAtRate, 0, 30);
    }
  }

  // Sensitivitet: rente ±2 pp × leie ±10 %
  const rateDeltas = [-2, -1, 0, 1, 2];
  const rentFactors = [0.9, 1, 1.1];
  const cells = rateDeltas.map((delta) => {
    const rate = Math.max(0, input.interestRate + delta);
    return rentFactors.map(
      (factor) =>
        computeYearOne(input, input.monthlyRent * factor, rate)
          .cashflowAfterTax / 12,
    );
  });

  if (y1.taxableIncome < 0 && input.taxRate > 0) {
    warnings.push(
      "Negativt skattemessig resultat gir fradragsfordel — forutsetter annen alminnelig inntekt å føre fradraget mot.",
    );
  }

  return {
    resolvedTransactionCosts: resolvedCosts,
    totalPropertyCost: totalProperty,
    totalProjectCost: totalProject,
    loanAmount,
    ltvPct: totalProperty > 0 ? (loanAmount / totalProperty) * 100 : null,
    clampedInterestOnlyYears,
    balloonAtEnd,

    monthlyPayment: schedule.length > 0 ? schedule[0].payment : 0,
    monthlyOpex: y1.opex / 12,
    monthlyCashflowBeforeTax: y1.cashflowBeforeTax / 12,
    monthlyCashflowAfterTax: y1.cashflowAfterTax / 12,

    grossYieldPct,
    netYieldPct,
    cashOnCashPct,
    breakEvenRent,
    breakEvenRatePct,

    years,
    sensitivity: { rateDeltas, rentFactors, cells },
    warnings,
  };
}
