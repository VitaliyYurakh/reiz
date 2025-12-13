import { locales } from "@/i18n/request";

export const stripLocale = (path: string) =>
  path.replace(new RegExp(`^/(?:${locales.join("|")})(?=/|$)`), "") || "/";
