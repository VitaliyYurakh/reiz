"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { defaultLocale, locales, type Locale } from "@/i18n/request";

const LOCALE_COOKIE = "NEXT_LOCALE";

const getLocaleFromPath = (pathname: string): Locale => {
  const seg = pathname.split("/")[1];
  return locales.includes(seg as Locale) ? (seg as Locale) : defaultLocale;
};

/**
 * Syncs the NEXT_LOCALE cookie to match the current URL locale.
 * URL always takes priority over the cookie.
 */
export default function LocalePreferenceSync() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const urlLocale = getLocaleFromPath(pathname);
    document.cookie = `${LOCALE_COOKIE}=${urlLocale}; path=/; max-age=31536000; samesite=lax`;
  }, [pathname]);

  return null;
}
