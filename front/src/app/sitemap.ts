import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { MetadataRoute } from "next";
import { ROUTE_MAP, type RouteKey } from "@/lib/seo";
import { defaultLocale } from "@/i18n/request";
import { buildHreflangMap } from "@/i18n/locale-config";
import { fetchCarsForSitemap } from "@/lib/api/cars";
import { createCarIdSlug } from "@/lib/utils/carSlug";
import { getAllCitySlugs } from "@/data/cities";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

const abs = (path: string) => new URL(path, BASE).toString();

const DEFAULT_IMAGE = abs("/img/og/home-square.jpg");

const BLOG_ARTICLE_IMAGES: Record<string, string> = {
  "/blog/long-term-car-rental-ukraine": abs("/img/blog/parking-payment-clean.webp"),
  "/blog/lviv-travel": abs("/img/blog/synevir-lake.webp"),
};

// Auto-discover all blog articles from the filesystem.
// Filters out non-article files like layout.tsx / page.tsx (the index).
function getBlogArticleSlugs(): string[] {
  const blogDir = join(process.cwd(), "src/app/[locale]/(site)/blog");
  try {
    return readdirSync(blogDir).filter((entry) => {
      const full = join(blogDir, entry);
      return statSync(full).isDirectory();
    });
  } catch {
    return [];
  }
}

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
      images: [DEFAULT_IMAGE],
    });
  });

  // City rental pages
  const citySlugs = getAllCitySlugs().filter((citySlug) => citySlug !== "lviv");
  for (const citySlug of citySlugs) {
    const languages = buildHreflangMap(`/rental/${citySlug}`, abs);

    entries.push({
      url: abs(`/rental/${citySlug}`),
      lastModified: staticLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages },
      images: [DEFAULT_IMAGE],
    });
  }

  // Dynamic car pages (only valid, published cars)
  try {
    const cars = await fetchCarsForSitemap();
    for (const car of cars) {
      const idSlug = createCarIdSlug(car);
      const languages = buildHreflangMap(`/cars/${idSlug}`, abs);

      const photo =
        car.carPhoto.find((p) => p.type === "PC")?.url ||
        car.carPhoto[0]?.url;
      const carImage = photo
        ? abs(`/static/${encodeURI(photo)}`)
        : DEFAULT_IMAGE;

      entries.push({
        url: abs(`/cars/${idSlug}`),
        lastModified: staticLastModified,
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: { languages },
        images: [carImage],
      });
      // Note: /rent pages excluded from sitemap (noindex)
    }
  } catch (error) {
    console.error("Failed to fetch cars for sitemap:", error);
  }

  // Blog articles — auto-discovered from filesystem so new articles get indexed
  // without anyone remembering to update this file.
  const blogArticles = getBlogArticleSlugs().map((slug) => `/blog/${slug}`);
  for (const articlePath of blogArticles) {
    const languages = buildHreflangMap(articlePath, abs);
    entries.push({
      url: abs(articlePath),
      lastModified: staticLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages },
      images: [BLOG_ARTICLE_IMAGES[articlePath] ?? DEFAULT_IMAGE],
    });
  }

  return entries;
}
