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

  // Static pages
  (Object.keys(ROUTE_MAP) as RouteKey[]).forEach((key) => {
    const languages = buildHreflangMap(
      (loc) => ROUTE_MAP[key][loc],
      abs,
    );

    const url = abs(ROUTE_MAP[key][defaultLocale]);
    const isHome = key === "home";

    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency: isHome ? "daily" : "weekly",
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
      lastModified: new Date(),
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
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: { languages },
      });
      // Note: /rent pages excluded from sitemap (noindex)
    }
  } catch (error) {
    console.error("Failed to fetch cars for sitemap:", error);
  }

  return entries;
}
