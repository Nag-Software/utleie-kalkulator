import "server-only";
import { createHash } from "node:crypto";
import OpenAI from "openai";
import { z } from "zod";
import { calculate } from "@/lib/calc/engine";
import type { CalcInput } from "@/lib/calc/schema";
import { getConfig } from "@/lib/config";
import type { FinnParsedData } from "@/lib/finn/types";
import type { AiAssessment, StoredAiAssessment } from "./types";

export function hashInputs(inputs: CalcInput): string {
  return createHash("sha256").update(JSON.stringify(inputs)).digest("hex");
}

const SYSTEM_PROMPT = `Du er en nøktern, objektiv analytiker av boligutleie-investeringer i Norge.
Du får beregnede nøkkeltall, brukerens forutsetninger og eventuelle fakta fra boligannonsen.

Regler:
- Vurder KUN ut fra tallene og faktaene du får, samt allment kjente norske markedsforhold. Ikke dikt opp tall.
- Vær kvantitativ: referer til konkrete tall fra grunnlaget når du begrunner.
- Ingen salgsspråk, ingen kjøpsanbefaling, ingen fraråding — kun analyse.
- Flagg usikkerhet eksplisitt der grunnlaget er tynt.
- Skriv alt på norsk bokmål, kort og presist.

probability_profitable (0–100) er din helhetlige, kalibrerte sannsynlighet for at
investeringen er lønnsom over den valgte horisonten, der lønnsom betyr positiv
totalavkastning på egenkapitalen (kontantstrøm + nedbetaling + verdiutvikling)
som minst forsvarer risikoen. Vekt månedlig kontantstrøm og rentefølsomhet tyngst;
verdistigning er brukerens antagelse, ikke et faktum. Vær kalibrert: 50 betyr
genuint usikkert. Ikke vær høflig-optimistisk.`;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    probability_profitable: {
      type: "integer",
      description: "Sannsynlighet 0-100 for at investeringen er lønnsom",
    },
    summary: {
      type: "string",
      description: "2-4 setninger med hovedkonklusjonen, på bokmål",
    },
    strengths: { type: "array", items: { type: "string" } },
    weaknesses: { type: "array", items: { type: "string" } },
    risks: { type: "array", items: { type: "string" } },
    assumptions_to_verify: {
      type: "array",
      items: { type: "string" },
      description: "Forutsetninger brukeren bør verifisere",
    },
  },
  required: [
    "probability_profitable",
    "summary",
    "strengths",
    "weaknesses",
    "risks",
    "assumptions_to_verify",
  ],
  additionalProperties: false,
} as const;

const assessmentSchema = z.object({
  probability_profitable: z.number().transform((v) => Math.round(Math.max(0, Math.min(100, v)))),
  summary: z.string().max(2000),
  strengths: z.array(z.string().max(500)).max(6),
  weaknesses: z.array(z.string().max(500)).max(6),
  risks: z.array(z.string().max(500)).max(6),
  assumptions_to_verify: z.array(z.string().max(500)).max(5),
});

function buildPayload(inputs: CalcInput, finn: FinnParsedData | null) {
  const result = calculate(inputs);
  const round = (v: number | null) => (v === null ? null : Math.round(v * 100) / 100);
  return {
    nokkeltall: {
      kontantstrom_mnd_etter_skatt: Math.round(result.monthlyCashflowAfterTax),
      kontantstrom_mnd_for_skatt: Math.round(result.monthlyCashflowBeforeTax),
      brutto_yield_pst: round(result.grossYieldPct),
      netto_yield_pst: round(result.netYieldPct),
      cash_on_cash_pst: round(result.cashOnCashPct),
      break_even_manedsleie: result.breakEvenRent !== null ? Math.round(result.breakEvenRent) : null,
      break_even_rente_pst: round(result.breakEvenRatePct),
      terminbelop_mnd: Math.round(result.monthlyPayment),
      lanebelop: Math.round(result.loanAmount),
      belaningsgrad_pst: round(result.ltvPct),
      total_investering: Math.round(result.totalProjectCost),
      egenkapital: inputs.equity,
      driftskostnader_mnd: Math.round(result.monthlyOpex),
      akkumulert_kontantstrom_ved_horisont: Math.round(
        result.years[result.years.length - 1]?.cumulativeCashflow ?? 0,
      ),
      beregnet_totalavkastning_ved_horisont: Math.round(
        result.years[result.years.length - 1]?.totalReturn ?? 0,
      ),
      advarsler: result.warnings,
    },
    forutsetninger: {
      manedsleie: inputs.monthlyRent,
      ledighet_pst: inputs.vacancyRate,
      nominell_rente_pst: inputs.interestRate,
      lopetid_ar: inputs.loanTermYears,
      avdragsfrihet_ar: inputs.interestOnlyYears,
      lanetype: inputs.loanType,
      arlig_leievekst_pst: inputs.rentGrowth,
      arlig_verdistigning_pst: inputs.valueGrowth,
      arlig_kostnadsvekst_pst: inputs.opexGrowth,
      skattesats_pst: inputs.taxRate,
      horisont_ar: inputs.horizonYears,
      eieform: inputs.ownershipType,
      kjopesum: inputs.purchasePrice,
      fellesgjeld: inputs.sharedDebt,
      felleskostnader_mnd: inputs.hoaFeesMonthly,
    },
    bolig: finn
      ? {
          boligtype: finn.propertyType,
          adresse: finn.address,
          bra_i_m2: finn.internalArea,
          soverom: finn.bedrooms,
          byggear: finn.buildYear,
          etasje: finn.floor,
          energimerking: finn.energyLabel,
          formuesverdi: finn.taxValue,
        }
      : null,
  };
}

/**
 * Kjører KI-vurderingen. Returnerer null når OpenAI ikke er konfigurert
 * eller kallet feiler — beregningen leveres uansett, vurderingen retries.
 */
export async function runAssessment(
  inputs: CalcInput,
  finn: FinnParsedData | null,
): Promise<StoredAiAssessment | null> {
  const { openaiApiKey, openaiModel, features } = getConfig();
  if (!features.ai || !openaiApiKey) return null;

  try {
    const client = new OpenAI({ apiKey: openaiApiKey, timeout: 45_000 });
    const response = await client.responses.create({
      model: openaiModel,
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Vurder denne utleieinvesteringen:\n${JSON.stringify(buildPayload(inputs, finn), null, 1)}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "utleievurdering",
          strict: true,
          schema: RESPONSE_SCHEMA as unknown as Record<string, unknown>,
        },
      },
      max_output_tokens: 2000,
    });

    const parsed = assessmentSchema.safeParse(JSON.parse(response.output_text));
    if (!parsed.success) {
      console.error("AI assessment schema mismatch", parsed.error.message);
      return null;
    }

    const result: AiAssessment = parsed.data;
    return {
      schemaVersion: 1,
      model: openaiModel,
      inputsHash: hashInputs(inputs),
      createdAt: new Date().toISOString(),
      result,
    };
  } catch (error) {
    console.error(
      "AI assessment failed",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
