import "./scss/style.scss";
import type {Metadata, Viewport} from "next";
import AOSProvider from "@/components/AOSProvider";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/request";
import { PreloadResources } from "@/app/preload-resources";
import type { ReactNode } from "react";
import { gowunDodum, halvar, inter, merriweather } from "@/fonts";
import { Partytown } from "@qwik.dev/partytown/react";

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
      default: "Оренда авто у Львові — подача по місту та в аеропорт | REIZ",
      template: "%s | REIZ",
    },
    description:
      "Оренда автомобілів у Львові. Сучасні авто, преміум‑сервіс, подача за адресою, 24/7.",
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
      title: "Оренда авто у Львові — REIZ RENTAL CARS",
      description:
        "Прокат автомобілів у Львові. Нові авто, преміальний сервіс, адресна доставка, підтримка 24/7.",
      images: [
        {
          url: `${SITE_ORIGIN}/img/og/home.webp`,
          width: 1200,
          height: 630,
          alt: "REIZ Rental Cars — Львів",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Оренда авто у Львові — REIZ RENTAL CARS",
      description:
        "Прокат авто у Львові: нові авто, подача за адресою, підтримка 24/7.",
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
        <link
          rel="preload"
          as="image"
          href="/img/car/mercedescle1.webp"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/img/mercedesmobile.webp"
          type="image/webp"
          media="(max-width: 1024px)"
          fetchPriority="high"
        />

        {/* Google Fonts preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Third-party services preconnect */}
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
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />

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
        className={`${inter.variable} ${halvar.variable} ${gowunDodum.variable} ${merriweather.variable}`}
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
