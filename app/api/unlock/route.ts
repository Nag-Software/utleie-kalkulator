import { NextResponse } from "next/server";
import { z } from "zod";
import {
  jsonError,
  paymentsUnavailable,
  readJsonBody,
  tooManyRequests,
} from "@/lib/api-helpers";
import { readSession } from "@/lib/auth/session";
import { getConfig } from "@/lib/config";
import { extractFinnkode } from "@/lib/finn/finnkode";
import { unlockFinn } from "@/lib/klippekort/unlock";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

const bodySchema = z.object({
  finnUrl: z.string().min(1).max(500),
});

const errors = {
  expired: [402, "EXPIRED", "Klippekortet er utløpt. Kjøp et nytt kort."],
  empty: [402, "NO_KLIPP", "Du har ingen klipp igjen."],
  not_found: [404, "NOT_FOUND", "Fant ikke annonsen. Er den fjernet?"],
  blocked: [502, "BLOCKED", "FINN svarte ikke som forventet. Prøv igjen."],
  timeout: [504, "TIMEOUT", "FINN bruker for lang tid. Prøv igjen."],
  parse_failed: [
    422,
    "PARSE_FAIL",
    "Klarte ikke å lese nøkkeltall fra annonsen.",
  ],
} as const;

export async function POST(request: Request) {
  if (!getConfig().features.payments) return paymentsUnavailable();

  const { allowed } = await checkRateLimit(request, "unlock", 10, 600);
  if (!allowed) return tooManyRequests();

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;
  const parsed = bodySchema.safeParse(body.body);
  if (!parsed.success) {
    return jsonError(400, "INVALID_URL", "Lim inn en gyldig FINN-lenke.");
  }

  const finnkode = extractFinnkode(parsed.data.finnUrl);
  if (!finnkode) {
    return jsonError(400, "INVALID_URL", "Fant ingen FINN-kode i lenken.");
  }

  const session = await readSession();
  if (!session) {
    return jsonError(
      401,
      "LOGIN_REQUIRED",
      "Logg inn med Vipps for å bruke klippekortet.",
    );
  }

  const result = await unlockFinn(session.userId, finnkode);
  if (!result.ok) {
    const [status, code, message] = errors[result.reason];
    return jsonError(status, code, message);
  }

  return NextResponse.json(result);
}
