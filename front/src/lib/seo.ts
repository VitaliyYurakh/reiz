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
  home: { ru: "/", uk: "/uk", en: "/en" },
  about: { ru: "/about", uk: "/uk/about", en: "/en/about" },
  blog: { ru: "/blog", uk: "/uk/blog", en: "/en/blog" },
  business: { ru: "/business", uk: "/uk/business", en: "/en/business" },
  certificate: {
    ru: "/certificate",
    uk: "/uk/certificate",
    en: "/en/certificate",
  },
  contacts: { ru: "/contacts", uk: "/uk/contacts", en: "/en/contacts" },
  faq: { ru: "/faq", uk: "/uk/faq", en: "/en/faq" },
  insurance: { ru: "/insurance", uk: "/uk/insurance", en: "/en/insurance" },
  invest: { ru: "/invest", uk: "/uk/invest", en: "/en/invest" },
  terms: { ru: "/terms", uk: "/uk/terms", en: "/en/terms" },
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
  const isDefault = locale === defaultLocale;

  const canonical = isDefault
    ? localizedPath(routeKey, defaultLocale)
    : localizedPath(routeKey, locale);

  const languages: Record<string, string> = {
    ru: localizedPath(routeKey, "ru"),
    uk: localizedPath(routeKey, "uk"),
    en: localizedPath(routeKey, "en"),
    "x-default": localizedPath(routeKey, defaultLocale),
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

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: t("meta.og_title"),
      description: t("meta.og_description"),
      images: [{ url: t("meta.og_image") }],
      url: rawPathname,
    },
  };
}
