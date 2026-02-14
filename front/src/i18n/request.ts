import { getRequestConfig } from "next-intl/server";
import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const locales = ["uk", "ru", "en", "pl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uk";

export const isLocale = (x: string): x is Locale =>
  (locales as readonly string[]).includes(x);

// Кеш вимкнено в dev режимі для hot reload перекладів
const cache = new Map<string, any>();
const isDev = process.env.NODE_ENV === "development";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = ((await requestLocale) || defaultLocale) as Locale;
  if (!locales.includes(locale)) locale = defaultLocale;

  // В dev режимі завжди перезавантажуємо переклади
  if (isDev || !cache.has(locale)) {
    const messages = (await import(`./translations/${locale}/index.json`))
      .default;
    cache.set(locale, messages);
  }

  return { locale, messages: cache.get(locale) };
});

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
});

export const { Link, useRouter, usePathname, redirect, getPathname } =
  createNavigation(routing);
