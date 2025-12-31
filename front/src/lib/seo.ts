import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { defaultLocale, type Locale } from "@/i18n/request";
import type { Messages, NamespaceKeys, NestedKeyOf } from "use-intl/core";

export type RouteKey =
  | "home"
  | "about"
  | "blog"
  | "business"
  | "certificate"
  | "contacts"
  | "faq"
  | "insurance"
  | "invest"
  | "terms";

export const ROUTE_MAP: Record<RouteKey, Record<Locale, string>> = {
  home: { uk: "/", ru: "/ru", en: "/en" },
  about: { uk: "/about", ru: "/ru/about", en: "/en/about" },
  blog: { uk: "/blog", ru: "/ru/blog", en: "/en/blog" },
  business: { uk: "/business", ru: "/ru/business", en: "/en/business" },
  certificate: { uk: "/certificate", ru: "/ru/certificate", en: "/en/certificate" },
  contacts: { uk: "/contacts", ru: "/ru/contacts", en: "/en/contacts" },
  faq: { uk: "/faq", ru: "/ru/faq", en: "/en/faq" },
  insurance: { uk: "/insurance", ru: "/ru/insurance", en: "/en/insurance" },
  invest: { uk: "/invest", ru: "/ru/invest", en: "/en/invest" },
  terms: { uk: "/terms", ru: "/ru/terms", en: "/en/terms" },
};

export function localizedPath(routeKey: RouteKey, locale: Locale) {
  return ROUTE_MAP[routeKey][locale];
}

export function getDefaultPath(routeKey: RouteKey) {
  return ROUTE_MAP[routeKey][defaultLocale];
}

async function inferPathnameFromHeader(routeKey: RouteKey, locale: Locale) {
  const h = await headers();
  const hdr = h.get("x-current-path");
  return hdr?.startsWith("/") ? hdr : localizedPath(routeKey, locale);
}

function buildAlternates(routeKey: RouteKey, locale: Locale) {
  const pathname = localizedPath(routeKey, locale);

  // Canonical всегда указывает на текущий URL страницы (self)
  const canonical = localizedPath(routeKey, locale);

  // hreflang с правильными кодами для Украины
  const languages: Record<string, string> = {
    "uk-UA": localizedPath(routeKey, "uk"),
    "ru-UA": localizedPath(routeKey, "ru"),
    "en": localizedPath(routeKey, "en"),
    "x-default": localizedPath(routeKey, "uk"), // украинская версия как default
  };

  return { canonical, languages, pathname };
}

export async function getPageMetadata({
  routeKey,
  ns,
  locale,
}: {
  routeKey: RouteKey;
  ns: NamespaceKeys<Messages, NestedKeyOf<Messages>>;
  locale: Locale;
}): Promise<Metadata> {
  const t = await getTranslations(ns);

  const rawPathname = await inferPathnameFromHeader(routeKey, locale);
  const { canonical, languages } = buildAlternates(routeKey, locale);

  const ogImage = t("meta.og_image");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: "REIZ",
      title: t("meta.og_title"),
      description: t("meta.og_description"),
      images: [{ url: ogImage }],
      url: rawPathname,
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.og_title"),
      description: t("meta.og_description"),
      images: [ogImage],
    },
  };
}
