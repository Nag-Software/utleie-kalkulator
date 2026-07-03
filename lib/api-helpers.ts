import "server-only";
import { NextResponse } from "next/server";

export function jsonError(
  status: number,
  error: string,
  message: string,
): NextResponse {
  return NextResponse.json({ error, message }, { status });
}

export const dbUnavailable = () =>
  jsonError(503, "DB_DISABLED", "Lagring er ikke tilgjengelig ennå.");

export const paymentsUnavailable = () =>
  jsonError(503, "PAYMENTS_DISABLED", "Betaling er ikke tilgjengelig ennå.");

export const tooManyRequests = () =>
  jsonError(429, "RATE_LIMITED", "For mange forespørsler. Prøv igjen senere.");

/** Leser og parser JSON-body med størrelsesvakt (16 KB). */
export async function readJsonBody(
  request: Request,
): Promise<{ ok: true; body: unknown } | { ok: false; response: NextResponse }> {
  const text = await request.text();
  if (text.length > 16_384) {
    return {
      ok: false,
      response: jsonError(413, "BODY_TOO_LARGE", "Forespørselen er for stor."),
    };
  }
  try {
    return { ok: true, body: JSON.parse(text) };
  } catch {
    return {
      ok: false,
      response: jsonError(400, "INVALID_JSON", "Ugyldig JSON."),
    };
  }
}
