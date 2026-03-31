"use client";

import { defaultLocale, isLocale, type Locale } from "@/i18n/request";
import { useEffect } from "react";
import {
  LOCALE_SWITCH_HISTORY_KEY,
  LOCALE_SWITCH_HISTORY_TTL_MS,
  parseLocaleSwitchHistory,
} from "@/lib/utils/localeHistory";

const isAdminPath = (pathname: string) => pathname === "/admin" || pathname.startsWith("/admin/");

const getLocaleFromPath = (pathname: string): Locale => {
  const seg = pathname.split("/")[1];
  return isLocale(seg ?? "") ? (seg as Locale) : defaultLocale;
};

const stripLocaleFromPath = (pathname: string) => {
  const parts = pathname.split("/");
  if (!isLocale(parts[1] ?? "")) {
    return pathname || "/";
  }

  const pathWithoutLocale = `/${parts.slice(2).join("/")}`;
  return pathWithoutLocale === "/" ? "/" : pathWithoutLocale.replace(/\/{2,}/g, "/");
};

const buildLocalizedHref = (
  pathname: string,
  search: string,
  hash: string,
  locale: Locale,
) => {
  const pathWithoutLocale = stripLocaleFromPath(pathname);
  const localizedPath =
    locale === defaultLocale
      ? pathWithoutLocale || "/"
      : `/${locale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;

  const normalizedPath = localizedPath.replace(/\/{2,}/g, "/") || "/";
  return `${normalizedPath}${search}${hash}`;
};

const getNavigationType = () => {
  const [entry] = performance.getEntriesByType("navigation");
  return entry && "type" in entry ? entry.type : null;
};

export default function LocaleHistoryGuard() {
  useEffect(() => {
    const clearMarker = () => {
      sessionStorage.removeItem(LOCALE_SWITCH_HISTORY_KEY);
    };

    const redirectIfNeeded = (allowClientPopstate: boolean) => {
      const marker = parseLocaleSwitchHistory(
        sessionStorage.getItem(LOCALE_SWITCH_HISTORY_KEY),
      );

      if (!marker) {
        clearMarker();
        return;
      }

      if (Date.now() - marker.createdAt > LOCALE_SWITCH_HISTORY_TTL_MS) {
        clearMarker();
        return;
      }

      if (!allowClientPopstate && getNavigationType() !== "back_forward") {
        return;
      }

      const { pathname, search, hash } = window.location;

      if (isAdminPath(pathname)) {
        return;
      }

      const currentLocale = getLocaleFromPath(pathname);
      if (currentLocale === marker.locale) {
        return;
      }

      window.location.replace(
        buildLocalizedHref(pathname, search, hash, marker.locale),
      );
    };

    const handleInitialCheck = () => redirectIfNeeded(false);
    const handlePopState = () => redirectIfNeeded(true);

    handleInitialCheck();
    window.addEventListener("pageshow", handleInitialCheck);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("pageshow", handleInitialCheck);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}
