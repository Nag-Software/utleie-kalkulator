import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

// Stabile datoer (ikke build-tidspunkt) så Google ikke ser «endret» innhold
// ved hver deploy uten reelle endringer.
const STATIC_PAGES: {
  path: string;
  priority: number;
  lastModified: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
}[] = [
  { path: "", priority: 1, lastModified: "2026-07-11", changeFrequency: "weekly" },
  { path: "/guide", priority: 0.7, lastModified: "2026-07-11", changeFrequency: "weekly" },
  { path: "/om", priority: 0.3, lastModified: "2026-08-26", changeFrequency: "yearly" },
  { path: "/kontakt", priority: 0.3, lastModified: "2026-08-26", changeFrequency: "yearly" },
  { path: "/personvern", priority: 0.2, lastModified: "2026-08-26", changeFrequency: "yearly" },
  { path: "/vilkar", priority: 0.2, lastModified: "2026-08-26", changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_PAGES.map(({ path, priority, lastModified, changeFrequency }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(lastModified),
      changeFrequency,
      priority,
    })),
    ...GUIDES.map((guide) => ({
      url: `${SITE_URL}/guide/${guide.slug}`,
      lastModified: new Date(guide.dateModified ?? guide.datePublished),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
