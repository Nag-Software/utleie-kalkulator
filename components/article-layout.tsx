import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatGuideDate, GUIDES, type GuideMeta } from "@/lib/guides";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  jsonLdString,
} from "@/lib/jsonld";

export type ArticleMeta = GuideMeta;

function RelatedGuides({ currentSlug }: { currentSlug: string }) {
  const current = GUIDES.find((guide) => guide.slug === currentSlug);
  // Samme kategori først, deretter resten i registerrekkefølge.
  const related = [
    ...GUIDES.filter(
      (guide) =>
        guide.slug !== currentSlug && guide.category === current?.category,
    ),
    ...GUIDES.filter(
      (guide) =>
        guide.slug !== currentSlug && guide.category !== current?.category,
    ),
  ].slice(0, 3);
  if (related.length === 0) return null;
  return (
    <section aria-labelledby="les-ogsa" className="mt-14">
      <p className="eyebrow" id="les-ogsa">
        Les også
      </p>
      <div className="mt-4 divide-y divide-border border-t border-border">
        {related.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guide/${guide.slug}`}
            className="group flex items-center justify-between gap-6 py-4"
          >
            <span className="text-sm font-medium underline-offset-4 group-hover:underline">
              {guide.title}
            </span>
            <span
              aria-hidden
              className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground"
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ArticleLayout({
  meta,
  children,
}: {
  meta: ArticleMeta;
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(articleJsonLd(meta)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Forside", path: "/" },
              { name: "Guider", path: "/guide" },
              { name: meta.title, path: `/guide/${meta.slug}` },
            ]),
          ),
        }}
      />
      <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-12 sm:px-6">
        <nav aria-label="Brødsmulesti" className="text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Forside
          </Link>
          {" / "}
          <Link href="/guide" className="hover:text-foreground">
            Guider
          </Link>
        </nav>
        <article className="article">
          <h1 className="font-display mt-4 text-4xl font-semibold leading-[1.1] sm:text-[2.75rem]">
            {meta.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {meta.description}
          </p>
          <p className="mb-10 mt-4 border-b border-border pb-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {meta.dateModified
              ? `Sist oppdatert ${formatGuideDate(meta.dateModified)}`
              : `Publisert ${formatGuideDate(meta.datePublished)}`}
          </p>
          {children}
        </article>
        <aside className="surface-panel dark relative mt-14 overflow-hidden rounded-[1.5rem] px-6 py-10 text-center sm:px-10">
          <svg
            viewBox="0 0 260 170"
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-3 hidden w-60 sm:block"
          >
            <path
              d="M0 148 C60 140 105 122 150 90 S230 34 244 24"
              fill="none"
              stroke="#f7f2e6"
              strokeOpacity="0.16"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="244" cy="24" r="5" fill="#e2582a" fillOpacity="0.85" />
          </svg>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Regn på din egen utleiebolig
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Kontantstrøm, yield og break-even på sekunder – gratis og uten
            konto. Eller hent tallene rett fra en FINN-annonse.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 h-11 rounded-full bg-cta px-6 text-[15px] font-semibold text-cta-foreground hover:bg-cta/90"
          >
            <Link href="/">Prøv utleiekalkulatoren</Link>
          </Button>
        </aside>
        <RelatedGuides currentSlug={meta.slug} />
      </div>
    </>
  );
}
