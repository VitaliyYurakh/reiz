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

// Direct sync imports of translation files
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import ukTranslations from "@/i18n/translations/uk/index.json";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import ruTranslations from "@/i18n/translations/ru/index.json";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import enTranslations from "@/i18n/translations/en/index.json";

// Use Record<string, any> to handle slight differences between locale files
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translations: Record<Locale, Record<string, any>> = {
  uk: ukTranslations,
  ru: ruTranslations,
  en: enTranslations,
};

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

const OG_LOCALE: Record<Locale, string> = {
  uk: "uk_UA",
  ru: "ru_UA",
  en: "en_US",
};

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

// Route paths for alternates
const ROUTE_PATHS: Record<PageKey, Record<Locale, string>> = {
  homePage: { uk: "/", ru: "/ru", en: "/en" },
  aboutPage: { uk: "/about", ru: "/ru/about", en: "/en/about" },
  blogPage: { uk: "/blog", ru: "/ru/blog", en: "/en/blog" },
  businessPage: { uk: "/business", ru: "/ru/business", en: "/en/business" },
  certificatePage: { uk: "/certificate", ru: "/ru/certificate", en: "/en/certificate" },
  contactsPage: { uk: "/contacts", ru: "/ru/contacts", en: "/en/contacts" },
  faqPage: { uk: "/faq", ru: "/ru/faq", en: "/en/faq" },
  insurancePage: { uk: "/insurance", ru: "/ru/insurance", en: "/en/insurance" },
  investPage: { uk: "/invest", ru: "/ru/invest", en: "/en/invest" },
  termsPage: { uk: "/terms", ru: "/ru/terms", en: "/en/terms" },
};

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
  const ogAlternateLocales = Object.values(OG_LOCALE).filter(
    (value) => value !== ogLocale,
  );
  const ogImage = toAbsolute(
    (meta.og_image || "https://reiz.com.ua/img/og/home.webp") as string,
  );

  return {
    title: meta.title as string,
    description: meta.description as string,
    alternates: {
      canonical,
      languages: {
        uk: toAbsolute(paths.uk),
        ru: toAbsolute(paths.ru),
        en: toAbsolute(paths.en),
        "x-default": toAbsolute(paths.uk),
      },
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
