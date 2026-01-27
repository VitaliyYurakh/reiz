import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, isLocale, routing, type Locale } from "./i18n/request";

const LOCALE_COOKIE = "NEXT_LOCALE";
const intlMiddleware = createMiddleware(routing);

const getLocaleFromPath = (pathname: string): Locale => {
  const seg = pathname.split("/")[1];
  return isLocale(seg ?? "") ? (seg as Locale) : defaultLocale;
};

const stripLocaleFromPath = (pathname: string) => {
  const seg = pathname.split("/")[1];
  if (!isLocale(seg ?? "")) return pathname;
  const rest = "/" + pathname.split("/").slice(2).join("/");
  return rest === "/" ? "/" : rest;
};

const withLocale = (pathname: string, locale: Locale) => {
  if (locale === defaultLocale) return pathname;
  return `/${locale}${pathname === "/" ? "" : pathname}`;
};

export default function middleware(request: NextRequest) {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale ?? "")) {
    const pathname = request.nextUrl.pathname;
    const pathLocale = getLocaleFromPath(pathname);
    if (pathLocale !== cookieLocale) {
      const basePath = stripLocaleFromPath(pathname);
      const nextPath = withLocale(basePath, cookieLocale);
      if (nextPath !== pathname) {
        const url = request.nextUrl.clone();
        url.pathname = nextPath;
        return NextResponse.redirect(url);
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|api|admin|.*\\..*).*)"],
};
