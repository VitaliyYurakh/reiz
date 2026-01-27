"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { defaultLocale, locales, type Locale } from "@/i18n/request";
import { stripLocale } from "@/lib/utils/functions";

const LOCALE_COOKIE = "NEXT_LOCALE";
const SKIP_PREFIXES = ["/admin", "/api", "/_next", "/_vercel"];

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length < 2) return null;
  return parts.pop()?.split(";").shift() ?? null;
};

const getLocaleFromPath = (pathname: string): Locale => {
  const seg = pathname.split("/")[1];
  return locales.includes(seg as Locale) ? (seg as Locale) : defaultLocale;
};

const buildPathForLocale = (pathname: string, locale: Locale) => {
  const basePath = stripLocale(pathname);
  if (locale === defaultLocale) return basePath;
  return `/${locale}${basePath === "/" ? "" : basePath}`;
};

export default function LocalePreferenceSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.toString();

  useEffect(() => {
    if (!pathname) return;
    if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return;

    const cookieLocale = getCookie(LOCALE_COOKIE);
    if (!cookieLocale || !locales.includes(cookieLocale as Locale)) return;

    const currentLocale = getLocaleFromPath(pathname);
    if (cookieLocale === currentLocale) return;

    const nextPath = buildPathForLocale(pathname, cookieLocale as Locale);
    if (nextPath === pathname) return;

    const suffix = search ? `?${search}` : "";
    const hash = window.location.hash || "";
    router.replace(`${nextPath}${suffix}${hash}`);
  }, [pathname, router, search]);

  return null;
}
