import type { MetadataRoute } from "next";
import { ROUTE_MAP, type RouteKey } from "@/lib/seo";
import { defaultLocale } from "@/i18n/request";
import { fetchCarsForSitemap } from "@/lib/api/cars";
import { createCarIdSlug } from "@/lib/utils/carSlug";
import { getAllCitySlugs } from "@/data/cities";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

const abs = (path: string) => new URL(path, BASE).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  (Object.keys(ROUTE_MAP) as RouteKey[]).forEach((key) => {
    const languages: Record<string, string> = {};

    // Добавляем все языковые версии с правильными hreflang кодами
    languages["uk-UA"] = abs(ROUTE_MAP[key]["uk"]);
    languages["ru-UA"] = abs(ROUTE_MAP[key]["ru"]);
    languages["en"] = abs(ROUTE_MAP[key]["en"]);
    languages["x-default"] = abs(ROUTE_MAP[key]["uk"]); // украинская как default

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
    const languages: Record<string, string> = {};

    // uk на корне, ru и en с префиксами
    languages["uk-UA"] = abs(`/rental/${citySlug}`);
    languages["ru-UA"] = abs(`/ru/rental/${citySlug}`);
    languages["en"] = abs(`/en/rental/${citySlug}`);
    languages["x-default"] = abs(`/rental/${citySlug}`);

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
      const languages: Record<string, string> = {};

      // uk на корне, ru и en с префиксами
      languages["uk-UA"] = abs(`/cars/${idSlug}`);
      languages["ru-UA"] = abs(`/ru/cars/${idSlug}`);
      languages["en"] = abs(`/en/cars/${idSlug}`);
      languages["x-default"] = abs(`/cars/${idSlug}`);

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
