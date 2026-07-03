import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guider om utleie, yield og skatt",
  description:
    "Lær å vurdere utleieboliger: yield og avkastning, skatt på leieinntekter og alle omkostningene ved boligkjøp. Praktiske guider for boliginvestorer.",
  alternates: { canonical: "/guide" },
};

const GUIDES = [
  {
    slug: "yield-utleiebolig",
    title: "Yield på utleiebolig: slik regner du ut avkastningen (2026)",
    description:
      "Brutto vs. netto yield, regneeksempler steg for steg, og hva som regnes som god avkastning i store og små byer.",
  },
  {
    slug: "skatt-pa-utleie-2026",
    title: "Skatt på utleie 2026: satser, fradrag og skattefri utleie",
    description:
      "22 % på netto leieinntekt, alle fradragene du kan kreve, halvparten-regelen for egen bolig og reglene for korttidsutleie.",
  },
  {
    slug: "dokumentavgift-og-omkostninger",
    title: "Dokumentavgift og omkostninger ved boligkjøp",
    description:
      "2,5 %-regelen for selveier, hvorfor borettslag slipper, tinglysingsgebyrer og hva kjøpet faktisk koster totalt.",
  },
];

export default function GuideIndexPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10">
      <h1 className="text-3xl font-bold tracking-tight">
        Guider om utleie og boliginvestering
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Korte, praktiske guider som hjelper deg å vurdere om en utleiebolig er
        en god investering – skrevet for det norske markedet.
      </p>
      <div className="mt-8 space-y-4">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guide/${guide.slug}`}
            className="group block rounded-xl border bg-card p-6 transition-colors hover:border-primary/50"
          >
            <h2 className="text-lg font-semibold group-hover:text-primary">
              {guide.title}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {guide.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
