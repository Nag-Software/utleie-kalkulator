/** Clientsafe typer for KI-vurderingen (selve kallet skjer server-side). */

export interface AiAssessment {
  probability_profitable: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  assumptions_to_verify: string[];
}

export interface StoredAiAssessment {
  schemaVersion: 1;
  model: string;
  inputsHash: string;
  createdAt: string;
  result: AiAssessment;
}
