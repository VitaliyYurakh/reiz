import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/request";
import { NextRequest, NextResponse } from "next/server";

const intl = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 301 редирект /uk/* → /* (украинский теперь на корне)
  if (pathname === "/uk" || pathname.startsWith("/uk/")) {
    const newPathname = pathname === "/uk" ? "/" : pathname.slice(3);
    const url = req.nextUrl.clone();
    url.pathname = newPathname || "/";
    return NextResponse.redirect(url, 301);
  }

  const res = intl(req);

  const url = req.nextUrl;
  const fullPath = url.pathname + (url.search || "") + (url.hash || "");

  res.headers.set("x-current-path", fullPath);
  return res;
}

export const config = {
  matcher: ["/((?!_next|_vercel|api|admin|.*\\..*).*)"],
};
