import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-helpers";
import { getAnalysis } from "@/lib/db/analyses";

/** Tilstanden rapportsiden spør etter mens analysen kjører. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const analysis = await getAnalysis((await params).id).catch(() => null);
  if (!analysis) return jsonError(404, "NOT_FOUND", "Fant ikke analysen.");
  return NextResponse.json({
    status: analysis.status,
    paid: analysis.paid,
    error: analysis.error,
  });
}
