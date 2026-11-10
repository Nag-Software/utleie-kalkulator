import type { Metadata } from "next";
import { ReportView } from "@/components/analyse/report-view";
import { EXAMPLE_PRESETS } from "@/components/calculator/presets";
import type { AnalysisResult } from "@/lib/ai/schema";

export const metadata: Metadata = {
  title: "Eksempel på KI-analyse av salgsoppgave",
  description:
    "Se hva KI-analysen gir: tallene fra salgsoppgaven, funnene med sidetall og regnestykket for utleie.",
  alternates: { canonical: "/analyse/eksempel" },
};

/**
 * Oppdiktet bolig som viser hvordan en rapport ser ut. Tallene er de samme
 * som forhåndsvalget «3-roms, 40 % egenkapital» på forsiden, så
 * kontantstrømmen her er regnet av motoren og stemmer med heroen.
 */
const SAMPLE: AnalysisResult = {
  isProspectus: true,
  property: {
    address: "Eksempelveien 12",
    postalCode: null,
    city: "Eksempelby",
    propertyType: "Leilighet",
    ownership: "selveier",
    areaSqm: 68,
    rooms: 3,
    bedrooms: 2,
    buildYear: 1987,
  },
  numbers: {
    askingPrice: { value: 2_400_000, page: 2 },
    sharedDebt: { value: null, page: null },
    transactionCosts: { value: 61_170, page: 3 },
    hoaFeesMonthly: { value: 2_800, page: 3 },
    municipalFeesYearly: { value: null, page: null },
    propertyTaxYearly: { value: null, page: null },
    currentMonthlyRent: { value: 13_900, page: 5 },
  },
  rental: {
    status: "tillatt",
    note: "Vedtektene tillater utleie uten samtykke fra styret. Korttidsutleie er begrenset til 90 døgn i året.",
    page: 63,
  },
  condition: [
    {
      part: "Bad",
      grade: 2,
      note: "Membran fra 2004 er ikke dokumentert. Regn med oppgradering i løpet av noen år.",
      page: 34,
      costLow: 150_000,
      costHigh: 250_000,
    },
    { part: "Vinduer", grade: 2, note: "Punkterte ruter i to vinduer mot sør.", page: 36, costLow: null, costHigh: null },
    { part: "Kjøkken", grade: 1, note: "", page: 35, costLow: null, costHigh: null },
    { part: "Elektrisk anlegg", grade: 1, note: "", page: 38, costLow: null, costHigh: null },
    { part: "Tak", grade: 1, note: "", page: 40, costLow: null, costHigh: null },
  ],
  findings: [
    {
      severity: "bra",
      title: "Ingen varslede økninger i felleskostnader",
      detail: "Årsregnskapet viser positiv likviditet, og styret har ikke varslet større vedlikehold.",
      page: 51,
      costLow: null,
      costHigh: null,
    },
    {
      severity: "bra",
      title: "Utleid i dag",
      detail: "Boligen er utleid for 13 900 kr i måneden, med leieavtale som kan overtas.",
      page: 5,
      costLow: null,
      costHigh: null,
    },
  ],
  summary:
    "En 3-roms selveierleilighet som allerede er utleid. Økonomien i sameiet ser ryddig ut, og utleie er tillatt. Det viktigste å prise inn er badet, som har TG2.",
};

export default function SampleAnalysisPage() {
  return (
    <ReportView
      analysis={SAMPLE}
      filename="eksempel.pdf"
      inputOverride={EXAMPLE_PRESETS[0].input}
      sample
    />
  );
}
