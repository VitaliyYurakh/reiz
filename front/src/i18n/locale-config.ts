import { locales, defaultLocale, type Locale } from "./request";

// ---------- OpenGraph locale codes ----------
export const OG_LOCALE: Record<Locale, string> = {
  uk: "uk_UA",
  ru: "ru_UA",
  en: "en_US",
  pl: "pl_PL",
  ro: "ro_MD",
};

// ---------- BCP-47 language tags (Schema.org, HTML lang) ----------
export const LANGUAGE_TAG: Record<Locale, string> = {
  uk: "uk-UA",
  ru: "ru-UA",
  en: "en-US",
  pl: "pl-PL",
  ro: "ro-MD",
};

// ---------- Display labels for language switcher ----------
export const LOCALE_LABEL: Record<Locale, string> = {
  uk: "Українська",
  ru: "русский",
  en: "English",
  pl: "Polski",
  ro: "Română",
};

// ---------- Schema.org area data ----------
export const LOCALE_AREA: Record<
  Locale,
  { city: string; region: string; country: string }
> = {
  uk: { city: "Львів", region: "Львівська область", country: "Україна" },
  ru: { city: "Львов", region: "Львовская область", country: "Украина" },
  en: { city: "Lviv", region: "Lviv Oblast", country: "Ukraine" },
  pl: { city: "Lwów", region: "Obwód lwowski", country: "Ukraina" },
  ro: { city: "Lviv", region: "Regiunea Lviv", country: "Ucraina" },
};

// ---------- Utility type: replaces { uk: string; ru: string; en: string } ----------
export type LocalizedField<T = string> = Record<Locale, T>;

// ---------- Build localized paths for a route ----------
// Default locale gets bare path, others get /{locale}/path
export function buildLocalizedPaths(path: string): Record<Locale, string> {
  const result = {} as Record<Locale, string>;
  for (const loc of locales) {
    if (loc === defaultLocale) {
      result[loc] = path;
    } else {
      result[loc] = `/${loc}${path === "/" ? "" : path}`;
    }
  }
  return result;
}

// ---------- Build hreflang map including x-default ----------
export function buildHreflangMap(
  pathOrBuilder: string | ((locale: Locale) => string),
  makeAbsolute: (path: string) => string = (p) => p,
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    const path =
      typeof pathOrBuilder === "function"
        ? pathOrBuilder(loc)
        : loc === defaultLocale
          ? pathOrBuilder
          : `/${loc}${pathOrBuilder === "/" ? "" : pathOrBuilder}`;
    languages[loc] = makeAbsolute(path);
  }
  languages["x-default"] = languages[defaultLocale];
  return languages;
}

// ---------- Get OG alternate locales (all except current) ----------
export function getOgAlternateLocales(locale: Locale): string[] {
  const current = OG_LOCALE[locale];
  return Object.values(OG_LOCALE).filter((v) => v !== current);
}
