import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { guideListJsonLd, jsonLdString } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Guider om utleie, yield og skatt",
  description:
    "Lær å vurdere utleieboliger: lønnsomhet, riktig leiepris, yield, skatt på leieinntekter, lån og omkostninger. Praktiske guider for det norske markedet.",
  alternates: { canonical: "/guide" },
};

export default function GuideIndexPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(guideListJsonLd(GUIDES)),
        }}
      />
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
