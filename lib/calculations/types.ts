import type { StoredAiAssessment } from "@/lib/ai/types";
import type { FinnParsedData } from "@/lib/finn/types";

export type CalculationStatus =
  | "draft"
  | "pending_payment"
  | "processing"
  | "paid"
  | "failed"
  | "refunded";

/** Det klienten får se av en beregning. */
export interface PublicCalculation {
  id: string;
  kind: "manual" | "finn";
  status: CalculationStatus;
  inputs: Record<string, unknown>;
  finn: (FinnParsedData & { warnings: string[] }) | null;
  aiAssessment: StoredAiAssessment | null;
  aiRuns: number;
  errorCode: string | null;
  createdAt: string;
}
