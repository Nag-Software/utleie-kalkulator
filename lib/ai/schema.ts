import { z } from "zod";

/**
 * Kontrakten for det KI-modellen henter ut av salgsoppgaven. Den henter ut
 * og forklarer; den regner aldri. Alle beløp er hele kroner, og `page` er
 * siden i PDF-en tallet står på, så kunden kan etterprøve det.
 */
const amount = z.object({
  value: z.number().nullable().describe("Beløp i hele kroner, eller null hvis det ikke står i dokumentet"),
  page: z.number().nullable().describe("Sidetall i PDF-en der tallet står"),
});

export const analysisSchema = z.object({
  isProspectus: z.boolean().describe("true bare hvis dokumentet er en salgsoppgave/prospekt for en bolig"),
  property: z.object({
    address: z.string().nullable(),
    postalCode: z.string().nullable().describe("Fire sifre"),
    city: z.string().nullable(),
    propertyType: z.string().nullable().describe("F.eks. leilighet, enebolig, rekkehus"),
    ownership: z.enum(["selveier", "andel", "aksje", "ukjent"]),
    areaSqm: z.number().nullable().describe("BRA-i eller primærrom i kvadratmeter"),
    rooms: z.number().nullable(),
    bedrooms: z.number().nullable(),
    buildYear: z.number().nullable(),
  }),
  numbers: z.object({
    askingPrice: amount.describe("Prisantydning"),
    sharedDebt: amount.describe("Andel fellesgjeld"),
    transactionCosts: amount.describe("Omkostninger ved kjøp"),
    hoaFeesMonthly: amount.describe("Felleskostnader per måned"),
    municipalFeesYearly: amount.describe("Kommunale avgifter per år, bare hvis de betales utenom felleskostnadene. Uten eiendomsskatt: er den inkludert i beløpet dokumentet oppgir, trekk den fra her og før den bare som eiendomsskatt"),
    propertyTaxYearly: amount.describe("Eiendomsskatt per år"),
    currentMonthlyRent: amount.describe("Dagens månedsleie hvis boligen er utleid"),
  }),
  rental: z.object({
    status: z.enum(["tillatt", "krever_samtykke", "begrenset", "ukjent"]),
    note: z.string().describe("Én setning om hva vedtektene sier om utleie"),
    page: z.number().nullable(),
  }),
  condition: z
    .array(
      z.object({
        part: z.string().describe("Bygningsdelen, ett til tre ord, f.eks. Bad, Vinduer, Elektrisk anlegg"),
        grade: z.number().describe("Tilstandsgrad fra tilstandsrapporten: 0, 1, 2 eller 3"),
        note: z.string().describe("Én setning om hva takstmannen fant. Tom streng for TG0 og TG1."),
        page: z.number().nullable(),
        costLow: z.number().nullable().describe("Nedre anslag for utbedring i kroner, bare når dokumentet oppgir det"),
        costHigh: z.number().nullable(),
      }),
    )
    .describe("Én rad per bygningsdel i tilstandsrapporten, alle grader. Hver bygningsdel bare én gang. Tom liste hvis dokumentet ikke har tilstandsrapport."),
  findings: z
    .array(
      z.object({
        severity: z.enum(["alvorlig", "obs", "bra"]),
        title: z.string().describe("Maks seks ord"),
        detail: z.string().describe("Én til to setninger om hva det betyr for en som skal leie ut"),
        page: z.number().nullable(),
        costLow: z.number().nullable().describe("Nedre anslag for utbedring i kroner, bare når dokumentet gir grunnlag"),
        costHigh: z.number().nullable(),
      }),
    )
    .describe("Andre forhold som påvirker lønnsomheten: økonomi i sameie eller borettslag, vedtekter, heftelser, tomt, offentlige forhold. Ikke tilstandsgrader – de hører hjemme i condition. Hvert forhold bare én gang. Viktigst først, maks åtte."),
  summary: z.string().describe("To til tre setninger på norsk, uten tall modellen ikke har funnet i dokumentet"),
});

export type AnalysisResult = z.infer<typeof analysisSchema>;
