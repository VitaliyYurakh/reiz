import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/request";
import { defaultLocale, locales, type Locale } from "@/i18n/request";

type Crumb = { name?: string; href: string };
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://reiz.com.ua/";

const abs = (p: string) => new URL(p, siteUrl).toString();

const hasLocalePrefix = (path: string) =>
  locales.some((locale) => path === `/${locale}` || path.startsWith(`/${locale}/`));

const splitHref = (href: string) => {
  const match = href.match(/^[^?#]*/);
  const path = match ? match[0] : href;
  const suffix = href.slice(path.length);
  return { path, suffix };
};

const localizeHref = (href: string, locale: Locale) => {
  if (!href.startsWith("/")) return href;

  const { path, suffix } = splitHref(href);
  if (hasLocalePrefix(path)) return href;

  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  if (path === "/") {
    return `${localePrefix || "/"}${suffix}`;
  }

  return `${localePrefix}${path}${suffix}`;
};

export default async function Breadcrumbs({
  items,
  mode = "both",
}: {
  items: Crumb[];
  mode?: "both" | "JsonLd" | "ui";
}) {
  const locale = (await getLocale()) as Locale;

  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(localizeHref(it.href, locale)),
    })),
  };

  if (items.length === 0 || items.some((it) => !it.name)) {
    return null;
  }

  const showUi = mode === "ui" || mode === "both";
  const showJsonLd = mode === "JsonLd" || mode === "both";

  return (
    <>
      {showUi ? (
        <ul className="breadcrumbs">
          {items.map((it, i) => (
            <li key={it.name}>
              {i < items.length - 1 ? (
                <Link href={it.href}>{it.name}</Link>
              ) : (
                it.name
              )}
            </li>
          ))}
        </ul>
      ) : null}
      {showJsonLd ? (
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: schema
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ) : null}
    </>
  );
}
