import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, readJsonBody, tooManyRequests } from "@/lib/api-helpers";
import { checkRateLimit } from "@/lib/rate-limit";
import { analyzeFinnSearch, normalizeFinnSearchUrl } from "@/lib/super/analyze";
import { SUPER_DEFAULTS } from "@/lib/super/types";

export const maxDuration = 90;

function localizedNumberSchema(min: number, max: number) {
  return z.preprocess((value) => {
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value === "number") return value;
    if (typeof value !== "string") return value;
    const normalized = value.trim().replace(",", ".");
    if (!normalized) return undefined;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : value;
  }, z.number().min(min).max(max));
}

const assumptionsSchema = z.object({
  interestRate: localizedNumberSchema(0, 30).optional(),
  equityPct: localizedNumberSchema(0, 100).optional(),
  loanTermYears: localizedNumberSchema(1, 40).optional(),
  interestOnlyYears: localizedNumberSchema(0, 40).optional(),
  loanType: z.enum(["annuitet", "serie"]).optional(),
  renovationCost: localizedNumberSchema(0, 50_000_000).optional(),
  otherPurchaseCosts: localizedNumberSchema(0, 10_000_000).optional(),
});

const bodySchema = z.object({
  searchUrl: z.string().min(1).max(1_000),
  assumptions: assumptionsSchema.partial().optional(),
});

export async function POST(request: Request) {
  const { allowed } = await checkRateLimit(request, "super-analyze", 4, 600);
  if (!allowed) return tooManyRequests();

  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const parsed = bodySchema.safeParse(body.body);
  if (!parsed.success) {
    return jsonError(400, "INVALID_INPUT", "Lim inn en gyldig FINN-søkelenke og forutsetninger.");
  }

  const searchUrl = normalizeFinnSearchUrl(parsed.data.searchUrl);
  if (!searchUrl) {
    return jsonError(
      400,
      "INVALID_URL",
      "Vi støtter bare FINN-søk på /realestate/homes/search.html.",
    );
  }

  try {
    const analysis = await analyzeFinnSearch(searchUrl, {
      ...SUPER_DEFAULTS,
      ...(parsed.data.assumptions ?? {}),
    });

    return NextResponse.json({
      searchUrl: searchUrl.toString(),
      pagesScanned: analysis.pagesScanned,
      resultCount: analysis.results.length,
      truncated: analysis.truncated,
      warnings: analysis.warnings,
      results: analysis.results,
    });
  } catch (error) {
    console.error("super analyze failed", error);
    return jsonError(
      502,
      "ANALYZE_FAILED",
      "Klarte ikke å analysere FINN-søket. Prøv et smalere søk eller igjen om litt.",
    );
  }
}