import { NextResponse } from "next/server";
import { z } from "zod";
import {
  jsonError,
  readJsonBody,
  tooManyRequests,
} from "@/lib/api-helpers";
import { getCachedFinn, setCachedFinn } from "@/lib/finn/cache";
import { fetchFinnListing, FinnError } from "@/lib/finn/fetch";
import { extractFinnkode } from "@/lib/finn/finnkode";
import type { FinnParseOutcome } from "@/lib/finn/parse";
import type { FinnPreview } from "@/lib/finn/types";
import { checkRateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({ finnUrl: z.string().min(1).max(500) });

function toPreview(outcome: FinnParseOutcome): FinnPreview {
  const { parsed } = outcome;
  return {
    finnkode: parsed.finnkode,
    title: parsed.title,
    address: parsed.address,
    askingPrice: parsed.askingPrice,
    totalPrice: parsed.totalPrice,
    propertyType: parsed.propertyType,
    ownershipType: parsed.ownershipTypeRaw,
    imageUrl: parsed.imageUrl,
  };
}

export async function POST(request: Request) {
  const { allowed } = await checkRateLimit(request, "finn-preview", 10, 600);
  if (!allowed) return tooManyRequests();

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const parsed = bodySchema.safeParse(body.body);
  if (!parsed.success) {
    return jsonError(400, "INVALID_URL", "Lim inn en gyldig FINN-lenke.");
  }

  const finnkode = extractFinnkode(parsed.data.finnUrl);
  if (!finnkode) {
    return jsonError(
      400,
      "INVALID_URL",
      "Fant ingen FINN-kode. Lim inn lenken til en boligannonse på finn.no.",
    );
  }

  const cached = await getCachedFinn(finnkode);
  if (cached) return NextResponse.json(toPreview(cached));

  try {
    const outcome = await fetchFinnListing(finnkode);
    await setCachedFinn(finnkode, outcome);
    return NextResponse.json(toPreview(outcome));
  } catch (error) {
    if (error instanceof FinnError) {
      switch (error.code) {
        case "NOT_FOUND":
          return jsonError(
            404,
            "NOT_FOUND",
            "Fant ikke annonsen. Er den solgt eller fjernet?",
          );
        case "BLOCKED":
          return jsonError(
            502,
            "BLOCKED",
            "FINN svarte ikke som forventet. Prøv igjen om litt.",
          );
        case "TIMEOUT":
          return jsonError(504, "TIMEOUT", "FINN bruker for lang tid. Prøv igjen.");
        default:
          return jsonError(
            422,
            "PARSE_FAIL",
            "Klarte ikke å lese nøkkeltall fra annonsen.",
          );
      }
    }
    console.error("finn preview failed", error);
    return jsonError(500, "UNKNOWN", "Noe gikk galt. Prøv igjen.");
  }
}
