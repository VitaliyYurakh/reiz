import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/request";
import { NextRequest } from "next/server";

const intl = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const res = intl(req);

  const url = req.nextUrl;
  const fullPath = url.pathname + (url.search || "") + (url.hash || "");

  res.headers.set("x-current-path", fullPath);
  return res;
}

export const config = {
  matcher: ["/((?!_next|_vercel|api|admin|.*\\..*).*)"],
};
