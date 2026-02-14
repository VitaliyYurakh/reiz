import { getLocale, getTranslations } from "next-intl/server";
import { defaultLocale, locales, type Locale } from "@/i18n/request";
import { LANGUAGE_TAG, LOCALE_AREA } from "@/i18n/locale-config";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";
const SITE_NAME = "REIZ";

const buildHomeUrl = (locale: Locale) =>
  locale === defaultLocale ? SITE_ORIGIN : `${SITE_ORIGIN}/${locale}`;

const buildId = (baseUrl: string, id: string) => `${baseUrl}#${id}`;

export default async function SchemaOrg({
  locale: inputLocale,
}: {
  locale?: Locale;
}) {
  const rawLocale = inputLocale ?? ((await getLocale()) as Locale);
  const locale = locales.includes(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations("homePage");

  const homeUrl = buildHomeUrl(locale);
  const websiteId = buildId(homeUrl, "website");
  const companyId = buildId(homeUrl, "company");
  const languageTags = locales.map((loc) => LANGUAGE_TAG[loc]);

  const localizedTitle = t("meta.title");
  const localizedOgTitle = t("meta.og_title");
  const localizedDescription = t("meta.description");
  const localizedHeroTitle = t("hero.title");
  const localizedIntro = t("hero.intro");

  const siteDisplayName = `${SITE_NAME} - ${localizedHeroTitle}`;
  const alternateNames = Array.from(
    new Set(
      [
        SITE_NAME,
        localizedTitle,
        localizedOgTitle,
        `${SITE_NAME} RENTAL CARS`,
      ].filter(Boolean),
    ),
  );

  const catalogHeading = t("catalog_aside.catalog_content.heading");
  const offerCategoryKeys = ["category1", "category2", "category3", "category4"] as const;
  const offerCategories = offerCategoryKeys.map((key) =>
    t(`catalog_aside.${key}`),
  );

  const { city, region, country } = LOCALE_AREA[locale];

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteDisplayName,
    alternateName: alternateNames,
    url: homeUrl,
    description: localizedDescription,
    inLanguage: languageTags,
    publisher: {
      "@id": companyId,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${homeUrl}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const companyJsonLd = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    "@id": companyId,
    name: siteDisplayName,
    alternateName: SITE_NAME,
    url: homeUrl,
    logo: `${SITE_ORIGIN}/img/og/home-square.webp`,
    image: `${SITE_ORIGIN}/img/og/home.webp`,
    description: localizedIntro,
    telephone: "+380635471186",
    email: "info@reiz.com.ua",
    priceRange: "$$",
    currenciesAccepted: "UAH, USD, EUR",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: "вул. Любінська, 168",
      addressLocality: city,
      addressRegion: region,
      postalCode: "79000",
      addressCountry: "UA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "49.8397",
      longitude: "24.0297",
    },
    areaServed: [
      { "@type": "City", name: city },
      { "@type": "AdministrativeArea", name: region },
      { "@type": "Country", name: country },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "22:00",
      },
    ],
    sameAs: ["https://www.instagram.com/reiz.rental"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: catalogHeading,
      itemListElement: offerCategories.map((name) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Car",
          name,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: true
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: true
        dangerouslySetInnerHTML={{ __html: JSON.stringify(companyJsonLd) }}
      />
    </>
  );
}
