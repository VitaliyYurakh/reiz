"use client";

import LanguageSwitcherClient from "./LanguageSwitcher.client";
import { usePathname } from "next/navigation";
import { defaultLocale, locales } from "@/i18n/request";
import Link from "next/link";

const labels = { ru: "Русский", uk: "Українська", en: "English" } as const;

function buildHref(target: string, pathname: string) {
  const parts = pathname.split("/");
  const hasLocale = parts[1] && locales.includes(parts[1] as any);
  const pathWithoutLocale = hasLocale
    ? "/" + parts.slice(2).join("/")
    : pathname;

  let href =
    target === defaultLocale
      ? pathWithoutLocale || "/"
      : `/${target}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;

  href = href.replace(/\/{2,}/g, "/").replace(/\/+(\?|#|$)/, "$1") || "/";
  return href;
}

export default function LanguageSwitcher() {
  const pathname = usePathname();

  return (
    <LanguageSwitcherClient
      locales={locales as unknown as string[]}
      defaultLocale={defaultLocale}
      labels={labels as any}
    >
      {locales.map((lng) => (
        <li key={lng} data-locale={lng} className="option">
          <Link
            href={buildHref(lng, pathname)}
            className="option-text"
            replace
          >
            {labels[lng]}
          </Link>
        </li>
      ))}
    </LanguageSwitcherClient>
  );
}
