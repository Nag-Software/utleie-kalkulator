import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, readJsonBody, tooManyRequests } from "@/lib/api-helpers";
import { readSession } from "@/lib/auth/session";
import { getConfig } from "@/lib/config";
import { createAnalysis } from "@/lib/db/analyses";
import { checkRateLimit } from "@/lib/rate-limit";
import { KI_MAX_BYTES } from "@/lib/site";
import { createSignedUploadUrl } from "@/lib/storage";

const bodySchema = z.object({
  filename: z.string().min(1).max(200),
  sizeBytes: z.number().int().positive(),
});

/**
 * Registrerer en salgsoppgave og gir nettleseren en signert URL å laste
 * opp til. Ingen KI kjøres her, og ingenting koster noe ennå.
 */
export async function POST(request: Request) {
  if (!getConfig().features.ai) {
    return jsonError(503, "AI_DISABLED", "KI-analysen er ikke åpnet ennå.");
  }
  const { allowed } = await checkRateLimit(request, "analyse-create", 10, 600);
  if (!allowed) return tooManyRequests();

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;
  const parsed = bodySchema.safeParse(body.body);
  if (!parsed.success || !/\.pdf$/i.test(parsed.data.filename)) {
    return jsonError(400, "INVALID_FILE", "Last opp salgsoppgaven som PDF.");
  }
  if (parsed.data.sizeBytes > KI_MAX_BYTES) {
    return jsonError(
      413,
      "FILE_TOO_LARGE",
      `PDF-en er for stor. Grensen er ${Math.round(KI_MAX_BYTES / 1024 / 1024)} MB.`,
    );
  }

  const id = randomUUID();
  const storagePath = `${id}.pdf`;
  try {
    const session = await readSession();
    await createAnalysis({
      id,
      userId: session?.userId ?? null,
      storagePath,
      filename: parsed.data.filename,
      sizeBytes: parsed.data.sizeBytes,
    });
    const uploadUrl = await createSignedUploadUrl(storagePath);
    return NextResponse.json({ id, uploadUrl });
  } catch (error) {
    console.error("analyse: opprettelse feilet", error instanceof Error ? error.message : error);
    return jsonError(500, "CREATE_FAILED", "Kunne ikke starte opplastingen.");
  }
}
