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

// ---------- Utility type: replaces { uk: string; ru: string; en: string } ----------
export type LocalizedField<T = string> = Record<Locale, T>;

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

// Regions used by city rental pages. The source key is the Ukrainian value
// stored in CityConfig; rendering code must use this map instead of exposing
// Ukrainian region names on every translated version of a city page.
export const LOCALIZED_REGION = {
  "Київська область": {
    uk: "Київська область",
    ru: "Киевская область",
    en: "Kyiv Oblast",
    pl: "Obwód kijowski",
    ro: "Regiunea Kiev",
  },
  "Львівська область": {
    uk: "Львівська область",
    ru: "Львовская область",
    en: "Lviv Oblast",
    pl: "Obwód lwowski",
    ro: "Regiunea Lviv",
  },
  "Тернопільська область": {
    uk: "Тернопільська область",
    ru: "Тернопольская область",
    en: "Ternopil Oblast",
    pl: "Obwód tarnopolski",
    ro: "Regiunea Ternopil",
  },
  "Одеська область": {
    uk: "Одеська область",
    ru: "Одесская область",
    en: "Odesa Oblast",
    pl: "Obwód odeski",
    ro: "Regiunea Odesa",
  },
  "Дніпропетровська область": {
    uk: "Дніпропетровська область",
    ru: "Днепропетровская область",
    en: "Dnipropetrovsk Oblast",
    pl: "Obwód dniepropetrowski",
    ro: "Regiunea Dnipropetrovsk",
  },
  "Харківська область": {
    uk: "Харківська область",
    ru: "Харьковская область",
    en: "Kharkiv Oblast",
    pl: "Obwód charkowski",
    ro: "Regiunea Harkiv",
  },
  "Івано-Франківська область": {
    uk: "Івано-Франківська область",
    ru: "Ивано-Франковская область",
    en: "Ivano-Frankivsk Oblast",
    pl: "Obwód iwanofrankiwski",
    ro: "Regiunea Ivano-Frankivsk",
  },
  "Закарпатська область": {
    uk: "Закарпатська область",
    ru: "Закарпатская область",
    en: "Zakarpattia Oblast",
    pl: "Obwód zakarpacki",
    ro: "Regiunea Transcarpatia",
  },
  "Вінницька область": {
    uk: "Вінницька область",
    ru: "Винницкая область",
    en: "Vinnytsia Oblast",
    pl: "Obwód winnicki",
    ro: "Regiunea Vinnița",
  },
  "Запорізька область": {
    uk: "Запорізька область",
    ru: "Запорожская область",
    en: "Zaporizhzhia Oblast",
    pl: "Obwód zaporoski",
    ro: "Regiunea Zaporijje",
  },
  "Полтавська область": {
    uk: "Полтавська область",
    ru: "Полтавская область",
    en: "Poltava Oblast",
    pl: "Obwód połtawski",
    ro: "Regiunea Poltava",
  },
  "Чернівецька область": {
    uk: "Чернівецька область",
    ru: "Черновицкая область",
    en: "Chernivtsi Oblast",
    pl: "Obwód czerniowiecki",
    ro: "Regiunea Cernăuți",
  },
  "Волинська область": {
    uk: "Волинська область",
    ru: "Волынская область",
    en: "Volyn Oblast",
    pl: "Obwód wołyński",
    ro: "Regiunea Volînia",
  },
  "Рівненська область": {
    uk: "Рівненська область",
    ru: "Ровненская область",
    en: "Rivne Oblast",
    pl: "Obwód rówieński",
    ro: "Regiunea Rivne",
  },
  "Хмельницька область": {
    uk: "Хмельницька область",
    ru: "Хмельницкая область",
    en: "Khmelnytskyi Oblast",
    pl: "Obwód chmielnicki",
    ro: "Regiunea Hmelnițki",
  },
} as const satisfies Record<string, LocalizedField>;

export type LocalizedRegionKey = keyof typeof LOCALIZED_REGION;

export function getLocalizedRegion(region: LocalizedRegionKey, locale: Locale): string {
  return LOCALIZED_REGION[region][locale];
}

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
