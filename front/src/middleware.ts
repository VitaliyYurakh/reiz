import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, isLocale, routing, type Locale } from "./i18n/request";

const LOCALE_COOKIE = "NEXT_LOCALE";
const intlMiddleware = createMiddleware(routing);

const getLocaleFromPath = (pathname: string): Locale => {
  const seg = pathname.split("/")[1];
  return isLocale(seg ?? "") ? (seg as Locale) : defaultLocale;
};

const setLocaleCookie = (response: NextResponse, locale: Locale) => {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
  });
};

const isLegacyLvivRentalPath = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 2) {
    return segments[0] === "rental" && segments[1] === "lviv";
  }

  if (segments.length === 3 && isLocale(segments[0])) {
    return segments[1] === "rental" && segments[2] === "lviv";
  }

  return false;
};

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathLocale = getLocaleFromPath(pathname);
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;

  if (isLegacyLvivRentalPath(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = pathLocale === defaultLocale ? "/" : `/${pathLocale}`;

    const response = NextResponse.redirect(redirectUrl, 301);
    setLocaleCookie(response, pathLocale);
    return response;
  }

  const response = intlMiddleware(request);

  // URL locale takes priority — update cookie to match
  if (pathLocale !== cookieLocale) {
    setLocaleCookie(response, pathLocale);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|_vercel|api|admin|.*\\..*).*)"],
};
