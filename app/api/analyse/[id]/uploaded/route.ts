import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-helpers";
import { ANALYSIS_ID_PATTERN, markAnalysisUploaded } from "@/lib/db/analyses";

/** Nettleseren melder at filen ligger i lagringen. */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!ANALYSIS_ID_PATTERN.test(id)) {
    return jsonError(404, "NOT_FOUND", "Fant ikke analysen.");
  }
  try {
    await markAnalysisUploaded(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("analyse: uploaded feilet", error instanceof Error ? error.message : error);
    return jsonError(500, "UPLOAD_FAILED", "Kunne ikke registrere opplastingen.");
  }
}
