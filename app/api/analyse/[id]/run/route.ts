import { NextResponse } from "next/server";
import { AnalysisError, analyzeProspectus } from "@/lib/ai/analyze";
import { jsonError, tooManyRequests } from "@/lib/api-helpers";
import { readSession } from "@/lib/auth/session";
import { getConfig } from "@/lib/config";
import {
  ANALYSIS_ID_PATTERN,
  beginAnalysis,
  claimAnalysis,
  completeAnalysis,
  failAnalysis,
  markAnalysisFileDeleted,
} from "@/lib/db/analyses";
import { checkRateLimit } from "@/lib/rate-limit";
import { deleteObject, downloadObject } from "@/lib/storage";

// En salgsoppgave på 80–100 sider tar gjerne et minutt eller to å lese.
export const maxDuration = 300;

/**
 * Kjører analysen. Rekkefølgen er bevisst: KI-en kjøres FØR kreditten trekkes, og kreditten trekkes i
 * samme transaksjon som resultatet lagres. Feiler noe underveis, har
 * kunden kreditten sin i behold og kan prøve igjen.
 *
 * Kalles fra rapportsiden, aldri som sideeffekt av å laste den:
 * lenkeforhåndshenting skal ikke kunne starte en betalt kjøring.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!getConfig().features.ai) {
    return jsonError(503, "AI_DISABLED", "KI-analysen er ikke åpnet ennå.");
  }
  const { allowed } = await checkRateLimit(request, "analyse-run", 10, 600);
  if (!allowed) return tooManyRequests();

  const { id } = await params;
  if (!ANALYSIS_ID_PATTERN.test(id)) {
    return jsonError(404, "NOT_FOUND", "Fant ikke analysen.");
  }

  try {
    // Har en innlogget bruker kreditter fra før, er analysen hans.
    const session = await readSession();
    if (session) await claimAnalysis(id, session.userId);

    const { outcome, storagePath } = await beginAnalysis(id);
    if (outcome === "done" || outcome === "running") {
      return NextResponse.json({ status: outcome });
    }
    if (outcome === "not_uploaded") {
      return jsonError(409, "NOT_UPLOADED", "Salgsoppgaven er ikke lastet opp ennå.");
    }
    if (outcome === "unpaid" || !storagePath) {
      return jsonError(402, "PAYMENT_REQUIRED", "Analysen er ikke betalt.");
    }

    try {
      let pdf: Buffer;
      try {
        pdf = await downloadObject(storagePath);
      } catch {
        throw new AnalysisError(
          "filen finnes ikke i lagringen",
          "Salgsoppgaven er ikke lenger lagret hos oss. Last den opp på nytt – du er ikke belastet.",
        );
      }
      const result = await analyzeProspectus(pdf);
      const stored = await completeAnalysis(id, result);
      if (stored === "no_credit") {
        return jsonError(402, "PAYMENT_REQUIRED", "Analysen er ikke betalt.");
      }
      // Salgsoppgaven trengs ikke lenger. Feil her velter ikke analysen.
      await deleteObject(storagePath)
        .then(() => markAnalysisFileDeleted(id))
        .catch(() => {});
      return NextResponse.json({ status: "done" });
    } catch (error) {
      const message =
        error instanceof AnalysisError
          ? error.userMessage
          : "Analysen feilet. Du er ikke belastet for den – prøv igjen.";
      console.error("analyse: kjøring feilet", id, error instanceof Error ? error.message : error);
      await failAnalysis(id, message).catch(() => {});
      return jsonError(502, "ANALYSIS_FAILED", message);
    }
  } catch (error) {
    console.error("analyse: run feilet", id, error instanceof Error ? error.message : error);
    return jsonError(500, "RUN_FAILED", "Kunne ikke starte analysen.");
  }
}
