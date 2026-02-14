/**
 * Sync metadata helpers for SEO
 *
 * This module provides SYNCHRONOUS metadata generation to ensure
 * <title> and <meta> tags appear in the initial HTML shell,
 * not streamed later (which SEO crawlers miss).
 *
 * Uses direct JSON imports instead of async getTranslations()
 */

import type { Metadata } from "next";
import type { Locale } from "@/i18n/request";
import {
  OG_LOCALE,
  buildLocalizedPaths,
  buildHreflangMap,
  getOgAlternateLocales,
} from "@/i18n/locale-config";

// Direct sync imports of translation files
// When adding a new locale: add an import + entry below.
// TypeScript will error via `satisfies` if any locale is missing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import ukTranslations from "@/i18n/translations/uk/index.json";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import ruTranslations from "@/i18n/translations/ru/index.json";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import enTranslations from "@/i18n/translations/en/index.json";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import plTranslations from "@/i18n/translations/pl/index.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translations: Record<Locale, Record<string, any>> = {
  uk: ukTranslations,
  ru: ruTranslations,
  en: enTranslations,
  pl: plTranslations,
} satisfies Record<Locale, Record<string, any>>;

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

const toAbsolute = (value: string) => {
  if (!value) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return new URL(value, SITE_ORIGIN).toString();
};

export type PageKey =
  | "homePage"
  | "aboutPage"
  | "blogPage"
  | "businessPage"
  | "certificatePage"
  | "contactsPage"
  | "faqPage"
  | "insurancePage"
  | "investPage"
  | "termsPage";

const ROUTES: Record<PageKey, string> = {
  homePage: "/",
  aboutPage: "/about",
  blogPage: "/blog",
  businessPage: "/business",
  certificatePage: "/certificate",
  contactsPage: "/contacts",
  faqPage: "/faq",
  insurancePage: "/insurance",
  investPage: "/invest",
  termsPage: "/terms",
};

const ROUTE_PATHS: Record<PageKey, Record<Locale, string>> =
  Object.fromEntries(
    Object.entries(ROUTES).map(([key, path]) => [
      key,
      buildLocalizedPaths(path),
    ]),
  ) as Record<PageKey, Record<Locale, string>>;

/**
 * Get page metadata SYNCHRONOUSLY
 * This ensures title appears in initial HTML, not streamed
 */
export function getStaticPageMetadata(pageKey: PageKey, locale: Locale): Metadata {
  const t = translations[locale];
  const page = t?.[pageKey];
  const meta = page?.meta;

  if (!meta?.title) {
    // Fallback if meta is missing
    return {
      title: "REIZ - Оренда авто в Україні",
    };
  }

  const paths = ROUTE_PATHS[pageKey];
  const canonical = toAbsolute(paths[locale]);
  const ogLocale = OG_LOCALE[locale];
  const ogAlternateLocales = getOgAlternateLocales(locale);
  const ogImage = toAbsolute(
    (meta.og_image || "https://reiz.com.ua/img/og/home.webp") as string,
  );

  const languages = buildHreflangMap(
    (loc) => paths[loc],
    toAbsolute,
  );

  return {
    title: meta.title as string,
    description: meta.description as string,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: "REIZ",
      title: (meta.og_title || meta.title) as string,
      description: (meta.og_description || meta.description) as string,
      images: [{ url: ogImage }],
      url: canonical,
      locale: ogLocale,
      alternateLocale: ogAlternateLocales,
    },
    twitter: {
      card: "summary_large_image",
      title: (meta.og_title || meta.title) as string,
      description: (meta.og_description || meta.description) as string,
      images: [ogImage],
    },
  };
}
