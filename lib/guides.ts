export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
}

/**
 * Alle guider, i visningsrekkefølge. Forsiden viser de tre første.
 * Sitemap, guide-indeks, footer og artikkel-layout leser herfra.
 */
export const GUIDES: GuideMeta[] = [
  {
    slug: "lonner-det-seg-a-kjope-utleiebolig",
    title: "Lønner det seg å kjøpe bolig for utleie? (2026)",
    description:
      "Regnestykket bak en utleiebolig: yield mot lånerente, kontantstrøm, avdrag og verdistigning – og kostnadene folk glemmer. Med konkrete eksempler.",
    datePublished: "2026-07-06",
  },
  {
    slug: "hva-kan-jeg-leie-ut-for",
    title: "Hva kan jeg leie ut for? Slik setter du riktig leiepris",
    description:
      "Finn markedsleien med FINN-metoden og SSBs leiestatistikk, se hva som drar prisen opp, og hvorfor én måned tomgang koster mer enn litt lavere leie.",
    datePublished: "2026-07-06",
  },
  {
    slug: "yield-utleiebolig",
    title: "Yield på utleiebolig: slik regner du ut avkastningen (2026)",
    description:
      "Brutto vs. netto yield, regneeksempler steg for steg, og hva som regnes som god avkastning i store og små byer.",
    datePublished: "2026-07-04",
  },
  {
    slug: "skatt-pa-utleie-2026",
    title: "Skatt på utleie 2026: satser, fradrag og skattefri utleie",
    description:
      "22 % på netto leieinntekt, alle fradragene du kan kreve, halvparten-regelen for egen bolig og reglene for korttidsutleie.",
    datePublished: "2026-07-04",
  },
  {
    slug: "egenkapital-og-lan-til-utleiebolig",
    title: "Lån til utleiebolig: egenkapital, krav og rente (2026)",
    description:
      "Hvor mye egenkapital krever banken for en utleiebolig? Utlånsforskriftens krav, hvordan leieinntekter teller med, og fellene i borettslag.",
    datePublished: "2026-07-06",
  },
  {
    slug: "leie-ut-del-av-egen-bolig",
    title: "Leie ut del av egen bolig: hybel, sokkel og skattefritt",
    description:
      "Slik leier du ut hybel eller sokkelleilighet skattefritt: halvparten-regelen, krav til utleiedelen, kontrakt og depositum – og hva det betyr for økonomien.",
    datePublished: "2026-07-06",
  },
  {
    slug: "dokumentavgift-og-omkostninger",
    title: "Dokumentavgift og omkostninger ved boligkjøp",
    description:
      "2,5 %-regelen for selveier, hvorfor borettslag slipper, tinglysingsgebyrer og hva kjøpet faktisk koster totalt.",
    datePublished: "2026-07-04",
  },
];

export function getGuide(slug: string): GuideMeta {
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) throw new Error(`Ukjent guide-slug: ${slug}`);
  return guide;
}

export function formatGuideDate(isoDate: string): string {
  return new Intl.DateTimeFormat("nb-NO", { dateStyle: "long" }).format(
    new Date(`${isoDate}T12:00:00Z`),
  );
}
