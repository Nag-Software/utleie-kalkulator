import type { Metadata } from "next";
import { GuideDirectory } from "@/components/guide-directory";
import { GUIDES } from "@/lib/guides";
import { guideListJsonLd, jsonLdString } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Guider om utleie, skatt, lån og avkastning",
  description:
    "Alle guidene våre om utleiebolig: lønnsomhet, yield, skatt og fradrag, lån, husleieloven, depositum, leiepriser og mer. Søk eller bla etter kategori.",
  alternates: { canonical: "/guide" },
};

export default function GuideIndexPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(guideListJsonLd(GUIDES)),
        }}
      />
      <span className="eyebrow eyebrow-dot">Guider</span>
      <h1 className="display mt-5 text-[clamp(2rem,5vw,3rem)]">
        Guider om utleie og boliginvestering
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
        {GUIDES.length} korte, praktiske guider som hjelper deg å vurdere,
        finansiere og drive utleiebolig i Norge – fra første regnestykke til
        skattemeldingen.
      </p>
      <GuideDirectory guides={GUIDES} />
    </div>
  );
}
