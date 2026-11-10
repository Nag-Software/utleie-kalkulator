import "server-only";
import { z } from "zod";
import { getConfig } from "@/lib/config";
import { mergeAnalyses, offsetPages } from "./merge";
import { type AnalysisResult, analysisSchema } from "./schema";
import { type PdfPart, splitPdf } from "./split";

/**
 * Leser salgsoppgaven med OpenAI sitt Responses-API. Rå `fetch`, ingen
 * SDK-avhengighet: det er ett kall, og kontrakten er JSON-skjemaet under.
 */
const ENDPOINT = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-6.1-sol";
/** OpenAI tar filer under 50 MB. Større salgsoppgaver deles og leses i biter. */
export const MAX_PART_BYTES = 40 * 1024 * 1024;

const SYSTEM = `Du leser norske salgsoppgaver for en som vurderer å kjøpe boligen for å leie den ut.

Hent ut tallene og forholdene som avgjør om utleie lønner seg. Regler:
- Bruk bare det som står i dokumentet. Finner du ikke et tall, er verdien null. Gjett aldri.
- Oppgi sidetallet i PDF-en for hvert tall og hvert funn.
- Beløp er hele kroner. Felleskostnader er per måned, avgifter og eiendomsskatt per år.
- Tilstandsgradene fra tilstandsrapporten går i en egen liste, én rad per bygningsdel. Salgsoppgaven nevner ofte det samme to steder (i sammendraget og i selve rapporten): ta det med én gang, og bruk siden i selve tilstandsrapporten.
- Funn er alt annet som er konkret: vedtatte eller varslede økninger i felleskostnader, høy fellesgjeld eller avdragsfrie perioder som utløper, festetomt, begrensninger på utleie og korttidsutleie, heftelser, manglende ferdigattest eller ulovlig bruk. Ta også med det som taler for kjøpet. Ikke gjenta samme forhold i to funn.
- Oppgi utbedringskostnad bare når dokumentet selv oppgir den.
- Du skal ikke regne ut kontantstrøm eller yield, og ikke gi kjøpsråd. Det gjør kalkulatoren.
- Skriv kort, på norsk bokmål.`;

// Strengt skjema: OpenAI krever at alle felt er påkrevd og at objekter er
// lukket. Zod gir oss det; `$schema`-nøkkelen hører ikke hjemme i kallet.
const { $schema: _ignored, ...JSON_SCHEMA } = z.toJSONSchema(analysisSchema) as Record<string, unknown>;
void _ignored;

export class AnalysisError extends Error {
  constructor(
    message: string,
    /** Melding som trygt kan vises til kunden. */
    readonly userMessage: string,
  ) {
    super(message);
    this.name = "AnalysisError";
  }
}

interface ResponsesBody {
  status?: string;
  incomplete_details?: { reason?: string } | null;
  error?: { message?: string } | null;
  output?: {
    type?: string;
    content?: { type?: string; text?: string; refusal?: string }[];
  }[];
}

/**
 * Leser salgsoppgaven og gir strukturerte funn. Filer over `maxPartBytes`
 * deles i sidebolker som leses parallelt; sidetallene regnes tilbake til
 * originalen før delene slås sammen.
 */
export async function analyzeProspectus(
  pdf: Buffer,
  filename = "salgsoppgave.pdf",
  maxPartBytes = MAX_PART_BYTES,
): Promise<AnalysisResult> {
  let parts: PdfPart[];
  try {
    parts = await splitPdf(pdf, maxPartBytes);
  } catch (error) {
    throw new AnalysisError(
      `klarte ikke å dele PDF-en: ${error instanceof Error ? error.message : error}`,
      "Vi klarte ikke å lese PDF-en. Den kan være passordbeskyttet eller skadet.",
    );
  }

  const results = await Promise.all(
    parts.map(async (part, index) =>
      offsetPages(
        await analyzePart(part.bytes, filename, {
          index: index + 1,
          count: parts.length,
        }),
        part.firstPage,
      ),
    ),
  );
  const merged = mergeAnalyses(results);
  if (!merged.isProspectus) {
    throw new AnalysisError(
      "ikke en salgsoppgave",
      "Dette ser ikke ut som en salgsoppgave for en bolig. Last opp prospektet fra megleren.",
    );
  }
  return merged;
}

async function analyzePart(
  pdf: Buffer,
  filename: string,
  position: { index: number; count: number },
): Promise<AnalysisResult> {
  const { openai } = getConfig();
  if (!openai.apiKey) {
    throw new AnalysisError("OPENAI_API_KEY mangler", "KI-analysen er ikke aktivert.");
  }
  const instruction =
    position.count === 1
      ? "Analyser denne salgsoppgaven."
      : `Dette er del ${position.index} av ${position.count} av én salgsoppgave. Analyser bare det som står i denne delen, og oppgi sidetall slik de er i denne filen. Sett isProspectus til true når innholdet hører hjemme i en salgsoppgave, også om delen bare inneholder vedlegg som tilstandsrapport eller vedtekter. I sammendraget skriver du bare det du fant: ikke nevn at dette er en del, og ikke list opp hva som mangler.`;

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openai.apiKey}`,
      },
      body: JSON.stringify({
        model: openai.model ?? DEFAULT_MODEL,
        max_output_tokens: 16_000,
        input: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              {
                type: "input_file",
                filename,
                file_data: `data:application/pdf;base64,${pdf.toString("base64")}`,
              },
              { type: "input_text", text: instruction },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "salgsoppgave_analyse",
            schema: JSON_SCHEMA,
            strict: true,
          },
        },
      }),
      // 4 min: under funksjonens tidsgrense, så vi rekker å registrere feilen.
      signal: AbortSignal.timeout(240_000),
      cache: "no-store",
    });
  } catch (error) {
    throw new AnalysisError(
      `nettverksfeil mot OpenAI: ${error instanceof Error ? error.message : error}`,
      "Analysen tok for lang tid eller ble avbrutt. Prøv igjen.",
    );
  }

  const text = await response.text();
  let body: ResponsesBody;
  try {
    body = JSON.parse(text) as ResponsesBody;
  } catch {
    throw new AnalysisError(`ugyldig svar fra OpenAI (${response.status})`, "Analysen feilet hos KI-leverandøren. Prøv igjen.");
  }

  if (!response.ok) {
    const detail = body.error?.message ?? text.slice(0, 300);
    if (response.status === 429) {
      throw new AnalysisError(`OpenAI 429: ${detail}`, "Det er stor pågang akkurat nå. Prøv igjen om et minutt.");
    }
    if (response.status === 400) {
      throw new AnalysisError(
        `OpenAI avviste forespørselen: ${detail}`,
        "Vi klarte ikke å lese PDF-en. Den kan være passordbeskyttet, skadet eller for lang.",
      );
    }
    throw new AnalysisError(`OpenAI-feil ${response.status}: ${detail}`, "Analysen feilet hos KI-leverandøren. Prøv igjen.");
  }

  if (body.status === "incomplete") {
    throw new AnalysisError(
      `ufullstendig svar (${body.incomplete_details?.reason ?? "ukjent"})`,
      "Analysen ble ikke fullført. Prøv igjen.",
    );
  }

  const parts = (body.output ?? [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content ?? []);
  if (parts.some((part) => part.type === "refusal")) {
    throw new AnalysisError("modellen avslo forespørselen", "Dokumentet kunne ikke analyseres.");
  }
  const output = parts.find((part) => part.type === "output_text")?.text;
  if (!output) {
    throw new AnalysisError("svaret manglet tekst", "Analysen ble ikke fullført. Prøv igjen.");
  }

  let parsed;
  try {
    parsed = analysisSchema.safeParse(JSON.parse(output));
  } catch {
    throw new AnalysisError("svaret var ikke gyldig JSON", "Analysen ble ikke fullført. Prøv igjen.");
  }
  if (!parsed.success) {
    throw new AnalysisError(`svaret fulgte ikke skjemaet: ${parsed.error.message.slice(0, 300)}`, "Analysen ble ikke fullført. Prøv igjen.");
  }
  return parsed.data;
}
