import type { MetadataRoute } from "next";
import { ROUTE_MAP, type RouteKey } from "@/lib/seo";
import { defaultLocale } from "@/i18n/request";
import { buildHreflangMap } from "@/i18n/locale-config";
import { fetchCarsForSitemap } from "@/lib/api/cars";
import { createCarIdSlug } from "@/lib/utils/carSlug";
import { getAllCitySlugs } from "@/data/cities";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

const abs = (path: string) => new URL(path, BASE).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages (lastModified fixed — content rarely changes)
  const staticLastModified = new Date("2025-06-01");

  (Object.keys(ROUTE_MAP) as RouteKey[]).forEach((key) => {
    const languages = buildHreflangMap(
      (loc) => ROUTE_MAP[key][loc],
      abs,
    );

    const url = abs(ROUTE_MAP[key][defaultLocale]);
    const isHome = key === "home";

    entries.push({
      url,
      lastModified: isHome ? new Date() : staticLastModified,
      changeFrequency: isHome ? "daily" : "monthly",
      priority: isHome ? 1.0 : 0.8,
      alternates: { languages },
    });
  });

  // City rental pages
  const citySlugs = getAllCitySlugs();
  for (const citySlug of citySlugs) {
    const languages = buildHreflangMap(`/rental/${citySlug}`, abs);

    entries.push({
      url: abs(`/rental/${citySlug}`),
      lastModified: staticLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages },
    });
  }

  // Dynamic car pages (only valid, published cars)
  try {
    const cars = await fetchCarsForSitemap();
    for (const car of cars) {
      const idSlug = createCarIdSlug(car);
      const languages = buildHreflangMap(`/cars/${idSlug}`, abs);

      entries.push({
        url: abs(`/cars/${idSlug}`),
        lastModified: staticLastModified,
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: { languages },
      });
      // Note: /rent pages excluded from sitemap (noindex)
    }
  } catch (error) {
    console.error("Failed to fetch cars for sitemap:", error);
  }

  // Blog articles
  const blogArticles = ["/blog/lviv-travel"];
  for (const articlePath of blogArticles) {
    const languages = buildHreflangMap(articlePath, abs);
    entries.push({
      url: abs(articlePath),
      lastModified: staticLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages },
    });
  }

  return entries;
}
