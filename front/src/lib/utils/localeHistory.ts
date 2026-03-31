import { defaultLocale, isLocale, type Locale } from "@/i18n/request";

export const LOCALE_SWITCH_HISTORY_KEY = "REIZ_LOCALE_SWITCH_HISTORY";
export const LOCALE_SWITCH_HISTORY_TTL_MS = 5 * 60 * 1000;

export type LocaleSwitchHistoryMarker = {
  locale: Locale;
  createdAt: number;
};

const getLocaleFromHref = (href: string): Locale => {
  try {
    const pathname = href.startsWith("http://") || href.startsWith("https://")
      ? new URL(href).pathname
      : href;
    const seg = pathname.split("/")[1];
    return isLocale(seg ?? "") ? (seg as Locale) : defaultLocale;
  } catch {
    return defaultLocale;
  }
};

export const parseLocaleSwitchHistory = (
  value: string | null,
): LocaleSwitchHistoryMarker | null => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<LocaleSwitchHistoryMarker>;
    const locale =
      typeof parsed.locale === "string" && isLocale(parsed.locale)
        ? (parsed.locale as Locale)
        : typeof (parsed as { to?: string }).to === "string"
          ? getLocaleFromHref((parsed as { to: string }).to)
          : null;

    if (!locale || typeof parsed.createdAt !== "number") {
      return null;
    }

    return {
      locale,
      createdAt: parsed.createdAt,
    };
  } catch {
    return null;
  }
};
