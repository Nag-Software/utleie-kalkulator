import { GUIDE_CATEGORIES, GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

// Genereres fra guide-registeret ved build, så listen aldri blir stående
// utdatert når det kommer nye guider. Erstatter tidligere public/llms.txt.
export const dynamic = "force-static";

export function GET() {
  const guideSections = GUIDE_CATEGORIES.map((category) => {
    const guides = GUIDES.filter((guide) => guide.category === category.id);
    if (guides.length === 0) return "";
    const lines = guides
      .map(
        (guide) =>
          `- [${guide.title}](${SITE_URL}/guide/${guide.slug}): ${guide.description}`,
      )
      .join("\n");
    return `### ${category.label}\n\n${lines}`;
  })
    .filter(Boolean)
    .join("\n\n");

  const body = `# Utleie-kalkulator

> Norsk lønnsomhetskalkulator for utleiebolig på utleie-kalkulator.no. Beregner kontantstrøm per måned etter skatt, brutto/netto yield, cash-on-cash, break-even-leie, break-even-rente, amortisering og flerårig prognose. Gratis med manuelle tall, uten konto. Import av nøkkeltall fra en FINN.no-boligannonse med objektiv KI-vurdering (sannsynlighet 0–100 % for lønnsomhet) koster 9,90 NOK per beregning.

## Hva tjenesten gjør

- Alle parametere er justerbare: kjøpesum, eieform (selveier/andel — dokumentavgift 2,5 % beregnes automatisk for selveier), fellesgjeld, omkostninger, oppussing, egenkapital, nominell rente, løpetid, avdragsfrihet, annuitets-/serielån, månedsleie, ledighet, leievekst, felleskostnader, kommunale avgifter, eiendomsskatt, forsikring, vedlikehold, forvaltning, skattesats (22 % standard, 0 ved skattefri utleie i egen bolig), rentefradrag, verdistigning og horisont.
- Resultatene oppdateres umiddelbart og kan deles via lenke (alle tall ligger i URL-en).
- Betalt FINN-import fyller ut kjøpesum, felleskostnader, fellesgjeld og omkostninger automatisk og inkluderer en objektiv KI-vurdering med styrker, svakheter og risikofaktorer. Automatisk refusjon hvis annonsen ikke kan hentes.

## Viktige sider

- [Kalkulatoren](${SITE_URL}/): gratis utleiekalkulator med FINN-import
- [Alle guider](${SITE_URL}/guide): ${GUIDES.length} guider om utleie, søkbare og gruppert på kategori
- [Om tjenesten](${SITE_URL}/om), [vilkår](${SITE_URL}/vilkar) og [personvern](${SITE_URL}/personvern)

## Guider

${guideSections}

## Fakta

- Pris: manuell beregning 0 kr; FINN-import med KI-vurdering 9,90 NOK per beregning (engangsbetaling via Stripe, ingen konto).
- Tjenesten gir estimater, ikke finansiell rådgivning.
- Utgiver: Nag Software (kontakt: casper@nagsoftware.no).
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
