import "./scss/style.scss";
import type {Metadata, Viewport} from "next";
import AOSProvider from "@/components/AOSProvider";
import { getLocale } from "next-intl/server";
import { LANGUAGE_TAG } from "@/i18n/locale-config";
import { defaultLocale, locales, type Locale } from "@/i18n/request";
import type { ReactNode } from "react";
import { getImageProps } from "next/image";
import { inter, kyivType, outfit } from "@/fonts";
import Script from "next/script";
import { GTM_CONTAINER_ID } from "@/config/analytics";
import { getConsentPreferences } from "@/lib/consent/cookie";
import { requiresCookieConsent } from "@/lib/consent/geo";
import {
  ALL_OPTIONAL_CONSENT,
  hasOptionalConsent,
  NO_OPTIONAL_CONSENT,
  toGoogleConsentMode,
} from "@/lib/consent/preferences";
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
    default: "Оренда та прокат авто в Україні | REIZ",
    template: "%s | REIZ",
  },
  description:
    "Прокат авто по Україні. Стандартний депозит за пошкодження, а для окремих авто — пакет без депозиту за пошкодження за додаткову оплату. Подача 24/7.",
  // alternates (canonical, languages) визначаються на рівні кожної сторінки
  // через generateMetadata, щоб уникнути дублювання
  openGraph: {
    type: "website",
    url: SITE_ORIGIN,
    siteName: SITE_NAME,
    title: "Оренда авто в Україні | REIZ",
    description:
      "Прокат авто по Україні. Нові машини, подача 24/7, безкоштовна доставка. Київ, Львів, Одеса, Дніпро та інші міста.",
    images: [
      {
        url: `${SITE_ORIGIN}/img/og/home.webp`,
        width: 1200,
        height: 675,
        alt: "REIZ — Оренда авто в Україні",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Оренда авто в Україні | REIZ",
    description:
      "Прокат авто по Україні: нові машини, подача 24/7, безкоштовна доставка по місту.",
    images: [`${SITE_ORIGIN}/img/og/home.webp`],
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
  const [locale, savedConsentPreferences, needsConsent] = await Promise.all([
    getLocale(),
    getConsentPreferences(),
    requiresCookieConsent(),
  ]);
  // Basic consent mode: in an opt-in jurisdiction nothing from GTM is
  // requested before a visitor makes a choice. Elsewhere the site's existing
  // default remains enabled, unless the visitor has explicitly opted out.
  const effectiveConsentPreferences =
    savedConsentPreferences ??
    (needsConsent ? NO_OPTIONAL_CONSENT : ALL_OPTIONAL_CONSENT);
  const shouldLoadGtmNow = hasOptionalConsent(effectiveConsentPreferences);
  const googleConsentMode = JSON.stringify(
    toGoogleConsentMode(effectiveConsentPreferences),
  );

  // Manually preloaded (instead of relying on UiImage's `priority` prop)
  // because the mobile/desktop hero variants are CSS-toggled, not
  // conditionally rendered — with `priority` on both, next/image would
  // auto-preload both unconditionally. getImageProps() reuses the exact
  // same URL/srcSet next/image computes, scoped to the right viewport via
  // `media`, so only the variant that's actually visible gets fetched early.
  const {
    props: { srcSet: mobileHeroSrcSet, sizes: mobileHeroSizes },
  } = getImageProps({
    alt: "",
    src: "/img/cars/20260410-audi%20q8.webp",
    width: 1440,
    height: 1440,
    quality: 75,
    sizes: "100vw",
  });
  const {
    props: { srcSet: desktopHeroSrcSet, sizes: desktopHeroSizes },
  } = getImageProps({
    alt: "",
    src: "/img/hero/reiz-4-1-desktop.webp",
    width: 2400,
    height: 1578,
    quality: 100,
    sizes: "100vw",
  });

  return (
    <html lang={LANGUAGE_TAG[locale as Locale] ?? locale} className="page">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: localeHistoryGuardInlineScript,
          }}
        />
        {/* Mobile hero */}
        <link
          rel="preload"
          as="image"
          imageSrcSet={mobileHeroSrcSet}
          imageSizes={mobileHeroSizes}
          media="(max-width: 1024px)"
          fetchPriority="high"
        />
        {/* Desktop hero */}
        <link
          rel="preload"
          as="image"
          imageSrcSet={desktopHeroSrcSet}
          imageSizes={desktopHeroSizes}
          media="(min-width: 1025px)"
          fetchPriority="high"
        />

        {/* DNS prefetch for third-party services (lighter than preconnect) */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//grwapi.net" />

      </head>
      <body
        className={`${inter.variable} ${kyivType.variable} ${outfit.variable}`}
      >
        <LocaleHistoryGuard />
        <LocalePreferenceSync />
        {children}
        <ThemeColorProvider />
        <AOSProvider />

        {/* GTM is loaded after the page is interactive and only after the
            current consent state was applied. The noscript iframe is omitted
            because it cannot receive or honour the visitor's category choice. */}
        {shouldLoadGtmNow && (
          <Script
            id="gtm"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i,c){w[l]=w[l]||[];w.gtag=function(){w[l].push(arguments)};
w.gtag('consent','default',c);w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}',${googleConsentMode});`,
            }}
          />
        )}
      </body>
    </html>
  );
}
