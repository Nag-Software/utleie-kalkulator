"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import {
  GUIDE_CATEGORIES,
  type GuideCategory,
  type GuideMeta,
} from "@/lib/guides";

const CATEGORY_LABELS = new Map<GuideCategory, string>(
  GUIDE_CATEGORIES.map((category) => [category.id, category.label]),
);

function normalize(text: string): string {
  return text.toLowerCase();
}

function matchesQuery(guide: GuideMeta, words: string[]): boolean {
  if (words.length === 0) return true;
  const haystack = normalize(
    `${guide.title} ${guide.description} ${CATEGORY_LABELS.get(guide.category) ?? ""}`,
  );
  return words.every((word) => haystack.includes(word));
}

function GuideRow({
  guide,
  showCategory,
}: {
  guide: GuideMeta;
  showCategory: boolean;
}) {
  return (
    <Link
      href={`/guide/${guide.slug}`}
      className="group flex items-center justify-between gap-6 py-6"
    >
      <div className="min-w-0">
        {showCategory && (
          <p className="eyebrow mb-1.5 !text-[10px]">
            {CATEGORY_LABELS.get(guide.category)}
          </p>
        )}
        <h3 className="text-lg font-semibold leading-snug underline-offset-4 group-hover:underline">
          {guide.title}
        </h3>
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {guide.description}
        </p>
      </div>
      <span
        aria-hidden
        className="text-lg text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground"
      >
        →
      </span>
    </Link>
  );
}

export function GuideDirectory({ guides }: { guides: GuideMeta[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<GuideCategory | "alle">(
    "alle",
  );

  const words = normalize(query.trim()).split(/\s+/).filter(Boolean);
  const isFiltering = words.length > 0 || activeCategory !== "alle";

  const results = guides.filter(
    (guide) =>
      (activeCategory === "alle" || guide.category === activeCategory) &&
      matchesQuery(guide, words),
  );

  const countByCategory = new Map<GuideCategory, number>();
  for (const guide of guides) {
    countByCategory.set(
      guide.category,
      (countByCategory.get(guide.category) ?? 0) + 1,
    );
  }

  return (
    <div className="mt-10">
      {/* Søkefelt */}
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          role="searchbox"
          aria-label="Søk i guidene"
          placeholder="Søk i guidene – f.eks. skatt, depositum, yield …"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-12 w-full rounded-full border border-border bg-transparent pl-11 pr-12 text-[15px] outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Tøm søket"
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Kategorifilter */}
      <div
        role="group"
        aria-label="Filtrer på kategori"
        className="mt-5 flex flex-wrap gap-2"
      >
        <button
          type="button"
          onClick={() => setActiveCategory("alle")}
          aria-pressed={activeCategory === "alle"}
          className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
            activeCategory === "alle"
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
          }`}
        >
          Alle ({guides.length})
        </button>
        {GUIDE_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() =>
              setActiveCategory(
                activeCategory === category.id ? "alle" : category.id,
              )
            }
            aria-pressed={activeCategory === category.id}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              activeCategory === category.id
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            {category.label} ({countByCategory.get(category.id) ?? 0})
          </button>
        ))}
      </div>

      {/* Treffliste (filtrert) eller full oversikt gruppert på kategori */}
      {isFiltering ? (
        <div className="mt-8">
          <p aria-live="polite" className="eyebrow">
            {results.length === 0
              ? "Ingen treff"
              : results.length === 1
                ? "1 guide"
                : `${results.length} guider`}
          </p>
          {results.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Ingen guider matcher{" "}
                {words.length > 0 ? <>«{query.trim()}»</> : "filteret"}. Prøv
                et annet søkeord, eller se alle guidene.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("alle");
                }}
                className="mt-4 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground/40"
              >
                Nullstill søket
              </button>
            </div>
          ) : (
            <div className="mt-2 divide-y divide-border border-t border-border">
              {results.map((guide) => (
                <GuideRow key={guide.slug} guide={guide} showCategory />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">
          {GUIDE_CATEGORIES.map((category) => {
            const categoryGuides = guides.filter(
              (guide) => guide.category === category.id,
            );
            if (categoryGuides.length === 0) return null;
            return (
              <section
                key={category.id}
                id={category.id}
                aria-labelledby={`kategori-${category.id}`}
                className="mt-12 scroll-mt-24"
              >
                <h2
                  id={`kategori-${category.id}`}
                  className="font-display text-2xl font-semibold"
                >
                  {category.label}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {category.blurb}
                </p>
                <div className="mt-5 divide-y divide-border border-t border-border">
                  {categoryGuides.map((guide) => (
                    <GuideRow
                      key={guide.slug}
                      guide={guide}
                      showCategory={false}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
