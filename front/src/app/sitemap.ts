import type { MetadataRoute } from "next";
import { ROUTE_MAP, type RouteKey } from "@/lib/seo";
import { defaultLocale, locales } from "@/i18n/request";
import { fetchCarsForSitemap } from "@/lib/api/cars";
import { createCarIdSlug } from "@/lib/utils/carSlug";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

const abs = (path: string) => new URL(path, BASE).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  (Object.keys(ROUTE_MAP) as RouteKey[]).forEach((key) => {
    const languages: Record<string, string> = {};
    locales.forEach((loc) => {
      languages[loc] = abs(ROUTE_MAP[key][loc]);
    });

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

  // Dynamic car pages (only valid, published cars)
  try {
    const cars = await fetchCarsForSitemap();
    for (const car of cars) {
      const idSlug = createCarIdSlug(car);
      const languages: Record<string, string> = {};
      locales.forEach((loc) => {
        const prefix = loc === defaultLocale ? "" : `/${loc}`;
        languages[loc] = abs(`${prefix}/cars/${idSlug}`);
      });

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
