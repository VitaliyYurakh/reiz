import "./scss/style.scss";
import type {Metadata, Viewport} from "next";
import AOSProvider from "@/components/AOSProvider";
import { getLocale } from "next-intl/server";
import { LANGUAGE_TAG } from "@/i18n/locale-config";
import { defaultLocale, locales, type Locale } from "@/i18n/request";
import { PreloadResources } from "@/app/preload-resources";
import type { ReactNode } from "react";
import { inter, merriweather, kyivType, outfit } from "@/fonts";
import Script from "next/script";
import ThemeColorProvider from "@/components/ThemeColorProvider";
import LocalePreferenceSync from "@/components/LocalePreferenceSync";
import LocaleHistoryGuard from "@/components/LocaleHistoryGuard";
import {
  LOCALE_SWITCH_HISTORY_KEY,
  LOCALE_SWITCH_HISTORY_TTL_MS,
} from "@/lib/utils/localeHistory";

const SITE_ORIGIN = "https://reiz.com.ua";
const SITE_NAME = "REIZ";

// Static metadata - renders synchronously in initial <head>
// Page-level generateMetadata will override these values
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Оренда та прокат авто в Україні без застави | REIZ",
    template: "%s | REIZ",
  },
  description:
    "Прокат авто по Україні без застави. Нові машини 2023-2024, подача 24/7, безкоштовна доставка по місту. Київ, Львів, Одеса та інші міста.",
  // alternates (canonical, languages) визначаються на рівні кожної сторінки
  // через generateMetadata, щоб уникнути дублювання
  openGraph: {
    type: "website",
    url: SITE_ORIGIN,
    siteName: SITE_NAME,
    title: "Оренда авто в Україні без застави | REIZ",
    description:
      "Прокат авто по Україні. Нові машини, подача 24/7, безкоштовна доставка. Київ, Львів, Одеса, Дніпро та інші міста.",
    images: [
      {
        url: `${SITE_ORIGIN}/img/og/home-square.jpg`,
        width: 1200,
        height: 1200,
        alt: "REIZ — Оренда авто в Україні",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Оренда авто в Україні без застави | REIZ",
    description:
      "Прокат авто по Україні: нові машини, подача 24/7, безкоштовна доставка по місту.",
    images: [`${SITE_ORIGIN}/img/og/home-square.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#999999",
};

const localeHistoryGuardInlineScript = `
(() => {
  const KEY = ${JSON.stringify(LOCALE_SWITCH_HISTORY_KEY)};
  const TTL = ${LOCALE_SWITCH_HISTORY_TTL_MS};
  const LOCALES = ${JSON.stringify(locales)};
  const DEFAULT_LOCALE = ${JSON.stringify(defaultLocale)};

  const clearMarker = () => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {}
  };

  const getNavigationType = () => {
    const entry = performance.getEntriesByType("navigation")[0];
    return entry && "type" in entry ? entry.type : null;
  };

  const isAdminPath = (pathname) =>
    pathname === "/admin" || pathname.startsWith("/admin/");

  const getLocaleFromPath = (pathname) => {
    const seg = pathname.split("/")[1];
    return LOCALES.includes(seg) ? seg : DEFAULT_LOCALE;
  };

  const stripLocaleFromPath = (pathname) => {
    const parts = pathname.split("/");
    if (!LOCALES.includes(parts[1])) {
      return pathname || "/";
    }

    const pathWithoutLocale = "/" + parts.slice(2).join("/");
    return pathWithoutLocale === "/"
      ? "/"
      : pathWithoutLocale.replace(/\\/{2,}/g, "/");
  };

  const buildLocalizedHref = (pathname, search, hash, locale) => {
    const pathWithoutLocale = stripLocaleFromPath(pathname);
    const localizedPath =
      locale === DEFAULT_LOCALE
        ? pathWithoutLocale || "/"
        : \`/\${locale}\${pathWithoutLocale === "/" ? "" : pathWithoutLocale}\`;

    return \`\${(localizedPath.replace(/\\/{2,}/g, "/") || "/")}\${search}\${hash}\`;
  };

  const redirectIfNeeded = (allowClientPopstate) => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      const locale =
        typeof parsed?.locale === "string" && LOCALES.includes(parsed.locale)
          ? parsed.locale
          : null;

      if (!locale || typeof parsed?.createdAt !== "number") {
        clearMarker();
        return;
      }

      if (Date.now() - parsed.createdAt > TTL) {
        clearMarker();
        return;
      }

      if (!allowClientPopstate && getNavigationType() !== "back_forward") {
        return;
      }

      const { pathname, search, hash } = window.location;
      if (isAdminPath(pathname) || getLocaleFromPath(pathname) === locale) {
        return;
      }

      document.documentElement.style.visibility = "hidden";
      window.location.replace(buildLocalizedHref(pathname, search, hash, locale));
    } catch {}
  };

  const handleInitialCheck = () => redirectIfNeeded(false);
  const handlePopState = () => redirectIfNeeded(true);

  handleInitialCheck();
  window.addEventListener("pageshow", handleInitialCheck);
  window.addEventListener("popstate", handlePopState);
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={LANGUAGE_TAG[locale as Locale] ?? locale} className="page">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: localeHistoryGuardInlineScript,
          }}
        />
        <link
          rel="image_src"
          href={`${SITE_ORIGIN}/img/og/home-square.jpg`}
        />
        {/* Preload LCP hero images - CRITICAL for performance */}
        {/* Desktop hero - matches current LCP image */}
        <link
          rel="preload"
          as="image"
          href="/img/hero/reiz-4-0-desktop.webp"
          type="image/webp"
          media="(min-width: 1025px)"
          fetchPriority="high"
        />
        {/* Mobile hero */}
        <link
          rel="preload"
          as="image"
          href="/img/cars/20260410-audi%20q8.webp"
          type="image/webp"
          media="(max-width: 1024px)"
          fetchPriority="high"
        />

        {/* DNS prefetch for third-party services (lighter than preconnect) */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//grwapi.net" />

      </head>
      <body
        className={`${inter.variable} ${merriweather.variable} ${kyivType.variable} ${outfit.variable}`}
      >
        <noscript>
          <iframe
            title="gtm"
            src="https://www.googletagmanager.com/ns.html?id=GTM-WGHWDS62"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <LocaleHistoryGuard />
        <LocalePreferenceSync />
        {children}
        <ThemeColorProvider />
        <AOSProvider />
        <PreloadResources />

        {/* GTM - loaded after page is interactive */}
        <Script
          id="gtm"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WGHWDS62');`,
          }}
        />
      </body>
    </html>
  );
}
