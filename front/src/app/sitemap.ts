import type { MetadataRoute } from "next";
import { ROUTE_MAP, type RouteKey } from "@/lib/seo";
import { defaultLocale, locales } from "@/i18n/request";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

const abs = (path: string) => new URL(path, BASE).toString();

const lastMod = (iso?: string | Date) => iso ?? new Date(2025, 8, 15);

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // TODO: UNCOMMENT FOR PROD
  return entries;

  // (Object.keys(ROUTE_MAP) as RouteKey[]).forEach((key) => {
  //   const languages: Record<string, string> = {};
  //   locales.forEach((loc) => {
  //     languages[loc] = abs(ROUTE_MAP[key][loc]);
  //   });
  //
  //   const url = abs(ROUTE_MAP[key][defaultLocale]);
  //
  //   entries.push({
  //     url,
  //     lastModified: lastMod(),
  //     // priority: 0.8,
  //     alternates: { languages },
  //   });
  // });
  //
  // return entries;
}
