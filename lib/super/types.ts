import type { LoanType } from "@/lib/calc/schema";

export interface SuperAssumptions {
  interestRate: number;
  equityPct: number;
  loanTermYears: number;
  interestOnlyYears: number;
  loanType: LoanType;
  renovationCost: number;
  otherPurchaseCosts: number;
}

export const SUPER_DEFAULTS: SuperAssumptions = {
  interestRate: 5.5,
  equityPct: 20,
  loanTermYears: 25,
  interestOnlyYears: 0,
  loanType: "annuitet",
  renovationCost: 0,
  otherPurchaseCosts: 0,
};

export interface SuperSearchListing {
  finnkode: string;
  url: string;
  title: string | null;
  imageUrl: string | null;
  askingPrice: number | null;
  totalPrice: number | null;
  hoaFeesMonthly: number | null;
  ownershipType: string | null;
  propertyType: string | null;
  bedrooms: number | null;
  area: number | null;
  rawText: string;
  page: number;
}

export interface SuperAnalysis extends SuperSearchListing {
  resolvedOwnershipType: "selveier" | "andel";
  estimatedMonthlyRent: number;
  transactionCosts: number;
  sharedDebt: number;
  totalPropertyCost: number;
  totalProjectCost: number;
  equity: number;
  loanAmount: number;
  monthlyCashflowBeforeTax: number;
  monthlyCashflowAfterTax: number;
  grossYieldPct: number | null;
  netYieldPct: number | null;
  cashOnCashPct: number | null;
  breakEvenRent: number | null;
  score: number;
  warnings: string[];
}

export interface SuperAnalysisResponse {
  searchUrl: string;
  pagesScanned: number;
  resultCount: number;
  truncated: boolean;
  warnings: string[];
  results: SuperAnalysis[];
}