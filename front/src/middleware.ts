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

  // Admin area: gate at the edge by checking for the presence of the `token`
  // cookie. This is NOT full auth — the API validates the JWT on every /api
  // request, and the dashboard layout re-checks via /auth/me. The goal here
  // is to stop unauthenticated browsers from loading the admin HTML shell
  // at all, so they don't see a flash of dashboard UI before the client
  // redirects them (audit H-6).
  if (pathname.startsWith("/admin")) {
    const isLoginPage =
      pathname === "/admin/login" || pathname.startsWith("/admin/login/");
    if (!isLoginPage) {
      const token = request.cookies.get("token")?.value;
      if (!token) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/admin/login";
        redirectUrl.search = "";
        return NextResponse.redirect(redirectUrl);
      }
    }
    // Admin has no i18n — bypass intl middleware entirely.
    return NextResponse.next();
  }

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
  matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
