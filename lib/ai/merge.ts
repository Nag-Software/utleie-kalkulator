import type { AnalysisResult } from "./schema";

type Amount = AnalysisResult["numbers"]["askingPrice"];

const shift = (page: number | null, offset: number) =>
  page === null ? null : page + offset;

/** Flytter sidetallene i en del til sidetallene i hele dokumentet. */
export function offsetPages(result: AnalysisResult, firstPage: number): AnalysisResult {
  const offset = firstPage - 1;
  if (offset === 0) return result;
  const numbers = Object.fromEntries(
    Object.entries(result.numbers).map(([key, amount]) => [
      key,
      { value: amount.value, page: shift(amount.page, offset) },
    ]),
  ) as AnalysisResult["numbers"];
  return {
    ...result,
    numbers,
    rental: { ...result.rental, page: shift(result.rental.page, offset) },
    condition: (result.condition ?? []).map((item) => ({
      ...item,
      page: shift(item.page, offset),
    })),
    findings: result.findings.map((finding) => ({
      ...finding,
      page: shift(finding.page, offset),
    })),
  };
}

/** «Bad/vaskerom» og «Bad» er samme bygningsdel. */
export function partKey(part: string): string {
  return part.trim().toLowerCase().split(/[\s/,(]+/)[0] ?? "";
}

const SEVERITY_ORDER = { alvorlig: 0, obs: 1, bra: 2 } as const;
const MAX_FINDINGS = 8;

/**
 * Slår sammen analysene av delene til én. Tall og egenskaper tas fra den
 * første delen som faktisk fant dem (nøkkeltallene står tidlig i en
 * salgsoppgave); funnene samles og sorteres etter alvor.
 */
export function mergeAnalyses(parts: AnalysisResult[]): AnalysisResult {
  if (parts.length === 1) return parts[0];
  const [first] = parts;

  const property = { ...first.property };
  for (const part of parts.slice(1)) {
    for (const key of Object.keys(property) as (keyof typeof property)[]) {
      const current = property[key];
      const candidate = part.property[key];
      const missing = current === null || (key === "ownership" && current === "ukjent");
      if (missing && candidate !== null && candidate !== "ukjent") {
        (property as Record<string, unknown>)[key] = candidate;
      }
    }
  }

  const numbers = { ...first.numbers };
  for (const key of Object.keys(numbers) as (keyof typeof numbers)[]) {
    const found: Amount | undefined = parts
      .map((part) => part.numbers[key])
      .find((amount) => amount.value !== null);
    if (found) numbers[key] = found;
  }

  const seen = new Set<string>();
  const findings = parts
    .flatMap((part) => part.findings)
    .filter((finding) => {
      const key = finding.title.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
    .slice(0, MAX_FINDINGS);

  // Samme bygningsdel kan dukke opp i to deler: behold den strengeste graden.
  const byPart = new Map<string, AnalysisResult["condition"][number]>();
  for (const item of parts.flatMap((part) => part.condition ?? [])) {
    const key = partKey(item.part);
    const existing = byPart.get(key);
    if (!existing || item.grade > existing.grade) byPart.set(key, item);
  }

  return {
    isProspectus: parts.some((part) => part.isProspectus),
    condition: [...byPart.values()].sort((a, b) => b.grade - a.grade),
    property,
    numbers,
    rental: parts.map((part) => part.rental).find((r) => r.status !== "ukjent") ?? first.rental,
    findings,
    summary: parts
      .map((part) => part.summary.trim())
      .filter(Boolean)
      .join(" "),
  };
}
