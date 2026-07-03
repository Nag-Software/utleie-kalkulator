import { NextResponse } from "next/server";
import {
  dbUnavailable,
  jsonError,
  readJsonBody,
  tooManyRequests,
} from "@/lib/api-helpers";
import { calcInputSchema } from "@/lib/calc/schema";
import { insertManualCalculation } from "@/lib/calculations/store";
import { getConfig } from "@/lib/config";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!getConfig().features.db) return dbUnavailable();

  const { allowed } = await checkRateLimit(request, "calc-save", 10, 3600);
  if (!allowed) return tooManyRequests();

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const parsed = calcInputSchema.safeParse(
    (body.body as { inputs?: unknown })?.inputs,
  );
  if (!parsed.success) {
    return jsonError(400, "INVALID_INPUTS", "Ugyldige verdier i beregningen.");
  }

  const id = await insertManualCalculation(parsed.data);
  if (!id) return jsonError(500, "SAVE_FAILED", "Kunne ikke lagre beregningen.");

  return NextResponse.json({ id }, { status: 201 });
}
