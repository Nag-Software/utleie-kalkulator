import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const paths = [
    { path: "", priority: 1 },
    { path: "/guide", priority: 0.7 },
    { path: "/guide/yield-utleiebolig", priority: 0.8 },
    { path: "/guide/skatt-pa-utleie-2026", priority: 0.8 },
    { path: "/guide/dokumentavgift-og-omkostninger", priority: 0.8 },
    { path: "/personvern", priority: 0.2 },
    { path: "/vilkar", priority: 0.2 },
  ];
  return paths.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority,
  }));
}
