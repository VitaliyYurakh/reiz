import "./scss/style.scss";
import type {Metadata, Viewport} from "next";
import AOSProvider from "@/components/AOSProvider";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/request";
import { PreloadResources } from "@/app/preload-resources";
import type { ReactNode } from "react";
import { gowunDodum, halvar, inter, merriweather, kyivType } from "@/fonts";
import { Partytown } from "@qwik.dev/partytown/react";
import ThemeColorProvider from "@/components/ThemeColorProvider";

const SITE_ORIGIN = "https://reiz.com.ua";
const SITE_NAME = "REIZ";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  // const s = await params
  // const t = await getTranslations({locale: s.locale});

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: {
      default: "Оренда та прокат авто в Україні без застави | REIZ",
      template: "%s | REIZ",
    },
    description:
      "Прокат авто по Україні без застави. Нові машини 2023-2024, подача 24/7, безкоштовна доставка по місту. Київ, Львів, Одеса та інші міста.",
    alternates: {
      canonical: "/",
      languages: {
        "uk-UA": "/",
        "ru-UA": "/ru",
        "en": "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      url: SITE_ORIGIN,
      siteName: SITE_NAME,
      locale: "uk_UA",
      alternateLocale: ["ru_UA", "en_US"],
      title: "Оренда авто в Україні без застави | REIZ",
      description:
        "Прокат авто по Україні. Нові машини, подача 24/7, безкоштовна доставка. Київ, Львів, Одеса, Дніпро та інші міста.",
      images: [
        {
          url: `${SITE_ORIGIN}/img/og/home.webp`,
          width: 1200,
          height: 630,
          alt: "REIZ — Оренда авто в Україні",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Оренда авто в Україні без застави | REIZ",
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
      icon: [{ url: "/favicon.ico" }],
      apple: [{ url: "/img/apple-touch-icon.png", sizes: "180x180" }],
    },
  } satisfies Metadata;
}

export const viewport: Viewport = {
    themeColor: '#000',
}

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale} className="page">
      <head>
        {/*<base href="/"/>*/}

        {/* Partytown - moves third-party scripts to Web Worker */}
        <Partytown
          debug={process.env.NODE_ENV === "development"}
          forward={[
            "dataLayer.push",
            "gtag",
            "fbq",
          ]}
        />

        {/* Preload LCP hero images - CRITICAL for performance */}
        {/* Desktop hero - mercedescle2.webp (not 1!) */}
        <link
          rel="preload"
          as="image"
          href="/img/car/mercedescle2.webp"
          type="image/webp"
          media="(min-width: 1025px)"
          fetchPriority="high"
        />
        {/* Mobile hero */}
        <link
          rel="preload"
          as="image"
          href="/img/mercedesmobile.webp"
          type="image/webp"
          media="(max-width: 1024px)"
          fetchPriority="high"
        />

        {/* DNS prefetch for third-party services (lighter than preconnect) */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//grwapi.net" />

        {/* GTM - runs in Partytown Web Worker for better performance */}
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WGHWDS62');`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${halvar.variable} ${gowunDodum.variable} ${merriweather.variable} ${kyivType.variable}`}
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
        {children}
        <ThemeColorProvider />
        <AOSProvider />
        <PreloadResources />
      </body>
    </html>
  );
}
