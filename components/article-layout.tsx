import Link from "next/link";
import { Pill } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { formatGuideDate, GUIDES, type GuideMeta } from "@/lib/guides";
import { articleJsonLd, breadcrumbJsonLd, jsonLdString } from "@/lib/jsonld";

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
      <h2 id="les-ogsa" className="display-sm text-lg">
        Les også
      </h2>
      <div className="mt-4 grid gap-3">
        {related.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guide/${guide.slug}`}
            className="group flex items-center justify-between gap-6 rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:border-foreground/25"
          >
            <span className="text-sm font-medium tracking-[-0.01em]">
              {guide.title}
            </span>
            <span
              aria-hidden
              className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-cta"
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
          <h1 className="display mt-5 text-[clamp(2rem,5vw,2.75rem)]">
            {meta.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {meta.description}
          </p>
          <div className="mb-10 mt-6 border-b border-border pb-6">
            <Pill dot={false}>
              {meta.dateModified
                ? `Sist oppdatert ${formatGuideDate(meta.dateModified)}`
                : `Publisert ${formatGuideDate(meta.datePublished)}`}
            </Pill>
          </div>
          {children}
        </article>

        <aside className="surface-dark relative mt-14 overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[radial-gradient(closest-side,rgba(255,93,48,0.35),transparent)]"
          />
          <h2 className="display relative text-[clamp(1.5rem,4vw,2rem)]">
            Regn på din egen utleiebolig
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/65">
            Kontantstrøm, yield og break-even på sekunder – gratis og uten
            konto. Eller hent tallene rett fra en FINN-annonse.
          </p>
          <Button asChild variant="cta" size="lg" className="relative mt-7">
            <Link href="/#kalkulator">Prøv utleiekalkulatoren</Link>
          </Button>
        </aside>

        <RelatedGuides currentSlug={meta.slug} />
      </div>
    </>
  );
}
