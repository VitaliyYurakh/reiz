import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { MetadataRoute } from "next";
import { getAllCitySlugs } from "@/data/cities";
import sitemapContentDates from "@/generated/sitemap-content-dates.json";
import { buildHreflangMap } from "@/i18n/locale-config";
import { defaultLocale } from "@/i18n/request";
import { fetchCarsForSitemap } from "@/lib/api/cars";
import { ROUTE_MAP, type RouteKey } from "@/lib/seo";
import { createCarIdSlug } from "@/lib/utils/carSlug";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

type SitemapContentDates = {
  routes: Record<RouteKey, string | undefined>;
  privacy?: string;
  cityPages?: string;
  blog: Record<string, string | undefined>;
};

const contentDates = sitemapContentDates as SitemapContentDates;

const abs = (path: string) => new URL(path, BASE).toString();

const DEFAULT_IMAGE = abs("/img/og/home.webp");
const CITY_SERP_IMAGE = abs("/img/og/home-square.jpg");

const BLOG_ARTICLE_IMAGES: Record<string, string> = {
  "/blog/long-term-car-rental-ukraine": abs(
    "/img/blog/parking-payment-clean.webp",
  ),
  "/blog/lviv-travel": abs("/img/blog/synevir-lake.webp"),
  "/blog/chernivtsi-trip-from-lviv": abs(
    "/img/blog/chernivtsi-trip-centered-v3.webp",
  ),
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
    return Object.keys(contentDates.blog).map((path) =>
      path.replace(/^\/blog\//, ""),
    );
  }
}

function parseLastModified(value: string | undefined): Date | undefined {
  if (!value) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function getCarLastModified(
  updatedAt: string | null | undefined,
): Date | undefined {
  return parseLastModified(updatedAt ?? undefined);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  (Object.keys(ROUTE_MAP) as RouteKey[]).forEach((key) => {
    const languages = buildHreflangMap((loc) => ROUTE_MAP[key][loc], abs);

    const url = abs(ROUTE_MAP[key][defaultLocale]);
    const isHome = key === "home";

    entries.push({
      url,
      lastModified: parseLastModified(contentDates.routes[key]),
      changeFrequency: isHome ? "daily" : "monthly",
      priority: isHome ? 1.0 : 0.8,
      alternates: { languages },
      images: [DEFAULT_IMAGE],
    });
  });

  // The privacy policy has one official Ukrainian edition. Other locale
  // routes show it for convenience but intentionally canonicalize here.
  entries.push({
    url: abs("/privacy-policy"),
    lastModified: parseLastModified(contentDates.privacy),
    changeFrequency: "yearly",
    priority: 0.3,
  });

  // City rental pages
  const citySlugs = getAllCitySlugs().filter((citySlug) => citySlug !== "lviv");
  for (const citySlug of citySlugs) {
    const languages = buildHreflangMap(`/rental/${citySlug}`, abs);

    entries.push({
      url: abs(`/rental/${citySlug}`),
      lastModified: parseLastModified(contentDates.cityPages),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages },
      images: [CITY_SERP_IMAGE],
    });
  }

  // Dynamic car pages (only valid, published cars)
  try {
    const cars = await fetchCarsForSitemap();
    for (const car of cars) {
      const idSlug = createCarIdSlug(car);
      const languages = buildHreflangMap(`/cars/${idSlug}`, abs);

      const photo =
        car.carPhoto.find((p) => p.type === "PC")?.url || car.carPhoto[0]?.url;
      const carImage = photo
        ? abs(`/static/${encodeURI(photo)}`)
        : DEFAULT_IMAGE;
      const carLastModified = getCarLastModified(car.updatedAt);

      entries.push({
        url: abs(`/cars/${idSlug}`),
        // `updatedAt` is the database timestamp returned by the API. If an
        // older API response omits it, leave lastModified out rather than
        // publishing an invented date.
        ...(carLastModified ? { lastModified: carLastModified } : {}),
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
      lastModified: parseLastModified(contentDates.blog[articlePath]),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages },
      images: [BLOG_ARTICLE_IMAGES[articlePath] ?? DEFAULT_IMAGE],
    });
  }

  return entries;
}
