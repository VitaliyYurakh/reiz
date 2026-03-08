import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, isLocale, routing, type Locale } from "./i18n/request";

const LOCALE_COOKIE = "NEXT_LOCALE";
const intlMiddleware = createMiddleware(routing);

const getLocaleFromPath = (pathname: string): Locale => {
  const seg = pathname.split("/")[1];
  return isLocale(seg ?? "") ? (seg as Locale) : defaultLocale;
};

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathLocale = getLocaleFromPath(pathname);
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;

  const response = intlMiddleware(request);

  // URL locale takes priority — update cookie to match
  if (pathLocale !== cookieLocale) {
    response.cookies.set(LOCALE_COOKIE, pathLocale, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|_vercel|api|admin|.*\\..*).*)"],
};
