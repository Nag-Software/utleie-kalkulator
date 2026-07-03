import { z } from "zod";

export const ownershipTypes = ["selveier", "andel"] as const;
export const loanTypes = ["annuitet", "serie"] as const;

export type OwnershipType = (typeof ownershipTypes)[number];
export type LoanType = (typeof loanTypes)[number];

// Tinglysingsgebyr 2026: skjøte + pantedokument (Kartverket)
export const REGISTRATION_FEE_DEED = 585;
export const REGISTRATION_FEE_MORTGAGE = 585;
export const SHARE_TRANSFER_FEE = 1500; // typisk eierskifte-/noteringsgebyr borettslag
export const DOCUMENT_TAX_RATE = 0.025; // dokumentavgift, kun selveier

export const calcInputSchema = z.object({
  // Kjøp
  purchasePrice: z.number().min(0).max(100_000_000),
  ownershipType: z.enum(ownershipTypes),
  /** null = beregnes automatisk fra eieform */
  transactionCosts: z.number().min(0).max(10_000_000).nullable(),
  sharedDebt: z.number().min(0).max(50_000_000),
  renovationCost: z.number().min(0).max(50_000_000),
  otherPurchaseCosts: z.number().min(0).max(10_000_000),

  // Finansiering
  equity: z.number().min(0).max(100_000_000),
  interestRate: z.number().min(0).max(30),
  loanTermYears: z.number().min(1).max(40),
  interestOnlyYears: z.number().min(0).max(40),
  loanType: z.enum(loanTypes),

  // Leieinntekter
  monthlyRent: z.number().min(0).max(1_000_000),
  vacancyRate: z.number().min(0).max(100),
  rentGrowth: z.number().min(-10).max(20),

  // Driftskostnader
  hoaFeesMonthly: z.number().min(0).max(100_000),
  municipalFeesYearly: z.number().min(0).max(500_000),
  propertyTaxYearly: z.number().min(0).max(1_000_000),
  insuranceYearly: z.number().min(0).max(500_000),
  maintenancePctOfRent: z.number().min(0).max(100),
  managementPctOfRent: z.number().min(0).max(100),
  utilitiesYearly: z.number().min(0).max(500_000),
  accountingYearly: z.number().min(0).max(200_000),
  otherOpexYearly: z.number().min(0).max(1_000_000),
  opexGrowth: z.number().min(-10).max(20),

  // Skatt
  taxRate: z.number().min(0).max(60),
  interestDeduction: z.boolean(),

  // Marked/prognose
  valueGrowth: z.number().min(-10).max(20),
  horizonYears: z.number().min(1).max(30),
});

export type CalcInput = z.infer<typeof calcInputSchema>;

export const DEFAULT_INPUT: CalcInput = {
  purchasePrice: 4_000_000,
  ownershipType: "selveier",
  transactionCosts: null,
  sharedDebt: 0,
  renovationCost: 0,
  otherPurchaseCosts: 0,

  equity: 600_000,
  interestRate: 5.5,
  loanTermYears: 25,
  interestOnlyYears: 0,
  loanType: "annuitet",

  monthlyRent: 15_000,
  vacancyRate: 5,
  rentGrowth: 2.5,

  hoaFeesMonthly: 3_500,
  municipalFeesYearly: 12_000,
  propertyTaxYearly: 0,
  insuranceYearly: 4_000,
  maintenancePctOfRent: 5,
  managementPctOfRent: 0,
  utilitiesYearly: 0,
  accountingYearly: 0,
  otherOpexYearly: 0,
  opexGrowth: 2.5,

  taxRate: 22,
  interestDeduction: true,

  valueGrowth: 3,
  horizonYears: 10,
};

/** Parser ukjent input (f.eks. fra URL/DB) mot skjemaet med defaults som fallback per felt. */
export function parseInputLenient(raw: unknown): CalcInput {
  if (typeof raw !== "object" || raw === null) return { ...DEFAULT_INPUT };
  const merged: Record<string, unknown> = { ...DEFAULT_INPUT };
  for (const key of Object.keys(calcInputSchema.shape) as (keyof CalcInput)[]) {
    const candidate = (raw as Record<string, unknown>)[key];
    if (candidate === undefined) continue;
    const fieldSchema = calcInputSchema.shape[key];
    const result = fieldSchema.safeParse(candidate);
    if (result.success) merged[key] = result.data;
  }
  return calcInputSchema.parse(merged);
}
