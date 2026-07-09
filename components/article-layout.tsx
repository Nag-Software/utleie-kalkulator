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
  const related = GUIDES.filter((guide) => guide.slug !== currentSlug).slice(
    0,
    3,
  );
  if (related.length === 0) return null;
  return (
    <section aria-labelledby="les-ogsa" className="mt-10">
      <h2 id="les-ogsa" className="text-lg font-semibold">
        Les også
      </h2>
      <ul className="mt-3 space-y-2 text-sm">
        {related.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guide/${guide.slug}`}
              className="text-primary hover:underline"
            >
              {guide.title}
            </Link>
          </li>
        ))}
      </ul>
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
      <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-8">
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
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{meta.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{meta.description}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {meta.dateModified
              ? `Sist oppdatert ${formatGuideDate(meta.dateModified)}`
              : `Publisert ${formatGuideDate(meta.datePublished)}`}
          </p>
          {children}
        </article>
        <aside className="mt-10 rounded-xl border bg-card p-6 text-center">
          <h2 className="text-lg font-semibold">
            Regn på din egen utleiebolig
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
            Kontantstrøm, yield og break-even på sekunder – gratis og uten
            konto. Eller hent tallene rett fra en FINN-annonse.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Prøv utleiekalkulatoren</Link>
          </Button>
        </aside>
        <RelatedGuides currentSlug={meta.slug} />
      </div>
    </>
  );
}
