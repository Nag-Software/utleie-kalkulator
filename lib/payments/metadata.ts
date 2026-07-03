import type { StoredAiAssessment } from "@/lib/ai/types";
import type { FinnParsedData } from "@/lib/finn/types";

/**
 * Uten database er Stripe PaymentIntent-metadata lageret for betalte
 * beregninger: 50 nøkler × 500 tegn. JSON-verdier chunkes over flere
 * nøkler (`prefix_0..n` + `prefix_n`-teller). Rene funksjoner — testbare.
 */

const CHUNK_SIZE = 450;
const MAX_CHUNKS = 20;

export function chunkValue(
  prefix: string,
  value: unknown,
  previous?: Record<string, string>,
): Record<string, string> {
  const json = JSON.stringify(value);
  if (json.length > CHUNK_SIZE * MAX_CHUNKS) {
    throw new Error(`metadata value too large for ${prefix}: ${json.length}`);
  }
  const out: Record<string, string> = {};
  const count = Math.ceil(json.length / CHUNK_SIZE) || 1;
  for (let i = 0; i < count; i++) {
    out[`${prefix}_${i}`] = json.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
  }
  out[`${prefix}_n`] = String(count);
  // null-still overskytende chunks fra en tidligere, lengre skriving
  const previousCount = Number(previous?.[`${prefix}_n`] ?? 0);
  for (let i = count; i < previousCount; i++) {
    out[`${prefix}_${i}`] = "";
  }
  return out;
}

export function readChunked<T>(
  metadata: Record<string, string | null>,
  prefix: string,
): T | null {
  const count = Number(metadata[`${prefix}_n`]);
  if (!count || Number.isNaN(count)) return null;
  let json = "";
  for (let i = 0; i < count; i++) {
    const part = metadata[`${prefix}_${i}`];
    if (part === undefined || part === null) return null;
    json += part;
  }
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/** Lagret FINN-resultat (parsed + advarsler) i metadata. */
export interface StoredFinn {
  p: FinnParsedData;
  w: string[];
}

export type PaidState =
  | { kind: "new" }
  | { kind: "fulfilled" }
  | { kind: "failed"; code: string; refunded: boolean };

export interface PaidCalculation {
  state: PaidState;
  finn: StoredFinn | null;
  ai: StoredAiAssessment | null;
  aiRuns: number;
  inputsHash: string | null;
}

export function parsePaidMetadata(
  metadata: Record<string, string | null>,
): PaidCalculation {
  const raw = metadata.state ?? "";
  let state: PaidState;
  if (raw === "fulfilled") {
    state = { kind: "fulfilled" };
  } else if (raw.startsWith("failed:") || raw.startsWith("refunded:")) {
    state = {
      kind: "failed",
      code: raw.split(":")[1] ?? "UNKNOWN",
      refunded: raw.startsWith("refunded:"),
    };
  } else {
    state = { kind: "new" };
  }
  return {
    state,
    finn: readChunked<StoredFinn>(metadata, "finn"),
    ai: readChunked<StoredAiAssessment>(metadata, "ai"),
    aiRuns: Number(metadata.ai_runs ?? 0) || 0,
    inputsHash: metadata.inputs_hash ?? null,
  };
}
