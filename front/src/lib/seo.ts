import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { defaultLocale, type Locale } from "@/i18n/request";
import {
  OG_LOCALE,
  buildLocalizedPaths,
  buildHreflangMap,
  getOgAlternateLocales,
} from "@/i18n/locale-config";
import type { Messages, NamespaceKeys, NestedKeyOf } from "use-intl/core";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

const toAbsolute = (value: string) => {
  if (!value) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return new URL(value, SITE_ORIGIN).toString();
};

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

const ROUTES: Record<RouteKey, string> = {
  home: "/",
  about: "/about",
  blog: "/blog",
  business: "/business",
  certificate: "/certificate",
  contacts: "/contacts",
  faq: "/faq",
  insurance: "/insurance",
  invest: "/invest",
  terms: "/terms",
};

export const ROUTE_MAP: Record<RouteKey, Record<Locale, string>> =
  Object.fromEntries(
    Object.entries(ROUTES).map(([key, path]) => [
      key,
      buildLocalizedPaths(path),
    ]),
  ) as Record<RouteKey, Record<Locale, string>>;

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
  const canonical = toAbsolute(localizedPath(routeKey, locale));
  const languages = buildHreflangMap(
    (loc) => localizedPath(routeKey, loc),
    toAbsolute,
  );

  const ogImage = toAbsolute(t("meta.og_image"));
  const ogLocale = OG_LOCALE[locale];
  const ogAlternateLocales = getOgAlternateLocales(locale);

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
      url: toAbsolute(rawPathname),
      locale: ogLocale,
      alternateLocale: ogAlternateLocales,
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.og_title"),
      description: t("meta.og_description"),
      images: [ogImage],
    },
  };
}
