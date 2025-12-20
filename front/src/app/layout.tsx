import "./scss/style.scss";
import type {Metadata, Viewport} from "next";
import AOSProvider from "@/components/AOSProvider";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/request";
import { PreloadResources } from "@/app/preload-resources";
import type { ReactNode } from "react";
import { gowunDodum, halvar, inter } from "@/fonts";
import Script from "next/script";

const SITE_ORIGIN = "https://reiz.com.ua";
const SITE_NAME = "REIZ RENTAL CARS";

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
      default: "Аренда авто во Львове — подача по городу и в аэропорт | REIZ",
      template: "%s | REIZ",
    },
    description:
      "Аренда автомобилей во Львове. Современные авто, премиум‑сервис, подача по адресу, 24/7.",
    alternates: {
      canonical: "/",
      languages: {
        ru: "/",
        uk: "/uk",
        en: "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      url: SITE_ORIGIN,
      siteName: SITE_NAME,
      locale: "ru_RU",
      alternateLocale: ["uk_UA", "en_US"],
      title: "Аренда авто во Львове — REIZ RENTAL CARS",
      description:
        "Прокат автомобилей во Львове. Новые авто, премиальный сервис, адресная доставка, поддержка 24/7.",
      images: [
        {
          url: `${SITE_ORIGIN}/img/og/home.webp`,
          width: 1200,
          height: 630,
          alt: "REIZ Rental Cars — Львов",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Аренда авто во Львове — REIZ RENTAL CARS",
      description:
        "Прокат авто во Львове: новые авто, подача по адресу, поддержка 24/7.",
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

        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://consent.cookiebot.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://grwapi.net"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="//grwapi.net" />

        <Script id="gtm-loader" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WGHWDS62');`}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${halvar.variable} ${gowunDodum.variable}`}
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
        <AOSProvider />
        <PreloadResources />
      </body>
    </html>
  );
}
