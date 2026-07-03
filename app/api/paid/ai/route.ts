import { NextResponse } from "next/server";
import { z } from "zod";
import { hashInputs, runAssessment } from "@/lib/ai/assess";
import {
  jsonError,
  readJsonBody,
  tooManyRequests,
} from "@/lib/api-helpers";
import { calcInputSchema } from "@/lib/calc/schema";
import { getConfig } from "@/lib/config";
import { loadOrFulfill } from "@/lib/payments/fulfill";
import { chunkValue } from "@/lib/payments/metadata";
import { getStripe } from "@/lib/payments/stripe";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 60;

const bodySchema = z.object({
  sessionId: z.string().min(1).max(200),
  inputs: calcInputSchema,
});

/**
 * Kjører KI-vurderingen for en betalt beregning og lagrer den i
 * PaymentIntent-metadata. Første kall etter kjøp gir vurdering nr. 1;
 * ett nytt kall er inkludert når tallene faktisk er endret (maks 2 totalt).
 */
export async function POST(request: Request) {
  const config = getConfig();
  if (!config.features.ai) {
    return jsonError(503, "AI_DISABLED", "KI-vurdering er ikke tilgjengelig ennå.");
  }

  const { allowed } = await checkRateLimit(request, "paid-ai", 10, 600);
  if (!allowed) return tooManyRequests();

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;
  const parsed = bodySchema.safeParse(body.body);
  if (!parsed.success) {
    return jsonError(400, "INVALID_REQUEST", "Ugyldig forespørsel.");
  }
  const { sessionId, inputs } = parsed.data;

  const lookup = await loadOrFulfill(sessionId);
  if (lookup.kind !== "ready") {
    return jsonError(402, "NOT_PAID", "Fant ingen betalt beregning for lenken.");
  }

  const { calculation, paymentIntentId, finn, piMetadata } = lookup;
  const newHash = hashInputs(inputs);

  if (calculation.ai) {
    if (calculation.inputsHash === newHash) {
      // uendrede tall → returner eksisterende vurdering (idempotent)
      return NextResponse.json({ aiAssessment: calculation.ai, aiRuns: calculation.aiRuns });
    }
    if (calculation.aiRuns >= 2) {
      return jsonError(
        409,
        "RERUN_LIMIT",
        "Beregningen har brukt begge KI-vurderingene sine.",
      );
    }
  }

  const assessment = await runAssessment(inputs, finn.p);
  if (!assessment) {
    return jsonError(502, "AI_FAILED", "KI-vurderingen feilet. Prøv igjen om litt.");
  }

  const stripe = getStripe();
  const aiRuns = calculation.ai ? calculation.aiRuns + 1 : Math.max(1, calculation.aiRuns);
  if (stripe) {
    try {
      await stripe.paymentIntents.update(paymentIntentId, {
        metadata: {
          ...chunkValue("ai", assessment, piMetadata),
          ai_runs: String(aiRuns),
          inputs_hash: newHash,
        },
      });
    } catch (error) {
      // vurderingen leveres uansett; lagringen prøves på nytt ved neste kall
      console.error(
        "persist ai to stripe failed",
        error instanceof Error ? error.message : error,
      );
    }
  }

  return NextResponse.json({ aiAssessment: assessment, aiRuns });
}
