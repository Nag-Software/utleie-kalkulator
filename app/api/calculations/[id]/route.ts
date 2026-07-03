import { NextResponse } from "next/server";
import {
  dbUnavailable,
  jsonError,
  readJsonBody,
  tooManyRequests,
} from "@/lib/api-helpers";
import { calcInputSchema } from "@/lib/calc/schema";
import {
  getCalculation,
  isUuid,
  toPublicCalculation,
  updateCalculationInputs,
} from "@/lib/calculations/store";
import { getConfig } from "@/lib/config";
import { checkRateLimit } from "@/lib/rate-limit";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  if (!getConfig().features.db) return dbUnavailable();
  const { id } = await context.params;
  if (!isUuid(id)) return jsonError(404, "NOT_FOUND", "Fant ikke beregningen.");

  const { allowed } = await checkRateLimit(request, "calc-read", 60, 600);
  if (!allowed) return tooManyRequests();

  const row = await getCalculation(id);
  if (!row) return jsonError(404, "NOT_FOUND", "Fant ikke beregningen.");
  return NextResponse.json(toPublicCalculation(row));
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!getConfig().features.db) return dbUnavailable();
  const { id } = await context.params;
  if (!isUuid(id)) return jsonError(404, "NOT_FOUND", "Fant ikke beregningen.");

  const { allowed } = await checkRateLimit(request, "calc-write", 60, 600);
  if (!allowed) return tooManyRequests();

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const parsed = calcInputSchema.safeParse(
    (body.body as { inputs?: unknown })?.inputs,
  );
  if (!parsed.success) {
    return jsonError(400, "INVALID_INPUTS", "Ugyldige verdier i beregningen.");
  }

  const row = await getCalculation(id);
  if (!row) return jsonError(404, "NOT_FOUND", "Fant ikke beregningen.");
  if (row.status !== "draft" && row.status !== "paid") {
    return jsonError(409, "NOT_EDITABLE", "Beregningen kan ikke endres nå.");
  }

  const updated = await updateCalculationInputs(id, parsed.data);
  if (!updated) return jsonError(500, "UPDATE_FAILED", "Kunne ikke oppdatere.");
  return NextResponse.json({ ok: true });
}
