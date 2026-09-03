import type { CheerioAPI } from "cheerio";

/**
 * FINN-karusellen bruker data-srcset for de faktiske bildene (srcset på
 * senere slides peker ofte på første bilde i SSR). Vi kanoniserer til 960w
 * og lagrer bare unike motiver, så URL-dossieret ikke sprekker.
 */

export const FINN_IMAGE_WIDTH = "960w";
export const MAX_LISTING_IMAGES = 12;

const DYNAMIC =
  /https:\/\/images\.finncdn\.no\/dynamic\/(\d+w)\/([^\s,"']+\.(?:jpe?g|png|webp))/gi;

export function canonicalizeFinnImageUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  DYNAMIC.lastIndex = 0;
  const match = DYNAMIC.exec(raw.trim());
  if (!match) {
    if (/^https:\/\/images\.finncdn\.no\//i.test(raw.trim())) return raw.trim();
    return null;
  }
  return `https://images.finncdn.no/dynamic/${FINN_IMAGE_WIDTH}/${match[2]}`;
}

function pickFromSrcset(srcset: string | undefined): string | null {
  if (!srcset) return null;
  const found: { size: string; path: string }[] = [];
  for (const match of srcset.matchAll(DYNAMIC)) {
    found.push({ size: match[1], path: match[2] });
  }
  if (found.length === 0) return null;
  const preferred =
    found.find((item) => item.size === FINN_IMAGE_WIDTH) ??
    found.find((item) => item.size === "1280w") ??
    found[0];
  return `https://images.finncdn.no/dynamic/${FINN_IMAGE_WIDTH}/${preferred.path}`;
}

export function extractListingImages($: CheerioAPI, ogImage: string | null): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();

  const push = (url: string | null) => {
    const canonical = canonicalizeFinnImageUrl(url);
    if (!canonical || seen.has(canonical)) return;
    seen.add(canonical);
    urls.push(canonical);
  };

  $('img[id^="image-"]').each((_, el) => {
    const $el = $(el);
    push(
      pickFromSrcset($el.attr("data-srcset")) ??
        pickFromSrcset($el.attr("srcset")) ??
        ($el.attr("src") ?? null),
    );
  });

  push(ogImage);
  return urls.slice(0, MAX_LISTING_IMAGES);
}
