import { type CalcInput, DEFAULT_INPUT } from "@/lib/calc/schema";

export interface CalcPreset {
  label: string;
  input: CalcInput;
}

/**
 * Realistiske eksempler (2026-nivå) som fyller kalkulatoren med ett klikk.
 * Tallene er startpunkter for utforsking, ikke anbefalinger.
 */
export const EXAMPLE_PRESETS: CalcPreset[] = [
  {
    label: "2-roms i Oslo",
    input: {
      ...DEFAULT_INPUT,
      purchasePrice: 4_800_000,
      ownershipType: "selveier",
      equity: 720_000,
      interestRate: 5.2,
      monthlyRent: 17_500,
      hoaFeesMonthly: 4_200,
      municipalFeesYearly: 0,
      insuranceYearly: 2_000,
    },
  },
  {
    label: "Andelsleilighet i Trondheim",
    input: {
      ...DEFAULT_INPUT,
      purchasePrice: 2_950_000,
      ownershipType: "andel",
      sharedDebt: 400_000,
      equity: 500_000,
      interestRate: 5.2,
      monthlyRent: 13_500,
      hoaFeesMonthly: 5_500,
      municipalFeesYearly: 0,
      insuranceYearly: 1_500,
    },
  },
  {
    label: "Hybel i egen bolig (skattefritt)",
    input: {
      ...DEFAULT_INPUT,
      purchasePrice: 0,
      ownershipType: "selveier",
      transactionCosts: 0,
      renovationCost: 300_000,
      equity: 0,
      interestRate: 5.2,
      loanTermYears: 15,
      monthlyRent: 8_500,
      hoaFeesMonthly: 0,
      municipalFeesYearly: 0,
      insuranceYearly: 0,
      taxRate: 0,
      valueGrowth: 0,
    },
  },
];
