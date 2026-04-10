import { getLocale, getTranslations } from "next-intl/server";
import { defaultLocale, locales, type Locale } from "@/i18n/request";
import { LANGUAGE_TAG, LOCALE_AREA } from "@/i18n/locale-config";
import { PHONE_NUMBER } from "@/config/social";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";
const SITE_NAME = "REIZ";
const SITE_ALTERNATE_NAMES = ["REIZ Rental", "REIZ RENTAL CARS"] as const;

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
  const webPageId = buildId(homeUrl, "webpage");
  const companyId = buildId(homeUrl, "company");
  const primaryImageId = buildId(homeUrl, "primaryimage");
  const primaryImageUrl = `${SITE_ORIGIN}/img/og/home-square.jpg`;
  const languageTags = locales.map((loc) => LANGUAGE_TAG[loc]);
  const localeLanguageTag = LANGUAGE_TAG[locale];

  const localizedTitle = t("meta.title");
  const localizedOgTitle = t("meta.og_title");
  const localizedDescription = t("meta.description");
  const localizedIntro = t("hero.intro");

  const alternateNames = Array.from(new Set(SITE_ALTERNATE_NAMES));

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
    name: SITE_NAME,
    alternateName: alternateNames,
    url: homeUrl,
    image: {
      "@id": primaryImageId,
    },
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

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": webPageId,
    url: homeUrl,
    name: localizedTitle,
    description: localizedDescription,
    isPartOf: {
      "@id": websiteId,
    },
    about: {
      "@id": companyId,
    },
    primaryImageOfPage: {
      "@id": primaryImageId,
    },
    inLanguage: localeLanguageTag,
  };

  const primaryImageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": primaryImageId,
    url: primaryImageUrl,
    contentUrl: primaryImageUrl,
    width: 1200,
    height: 1200,
    caption: localizedOgTitle,
    representativeOfPage: true,
    inLanguage: localeLanguageTag,
  };

  const companyJsonLd = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    "@id": companyId,
    name: SITE_NAME,
    alternateName: alternateNames,
    url: homeUrl,
    logo: `${SITE_ORIGIN}/img/og/home-square.jpg`,
    image: {
      "@id": primaryImageId,
    },
    description: localizedIntro,
    mainEntityOfPage: {
      "@id": webPageId,
    },
    telephone: PHONE_NUMBER,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: true
        dangerouslySetInnerHTML={{ __html: JSON.stringify(primaryImageJsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: true
        dangerouslySetInnerHTML={{ __html: JSON.stringify(companyJsonLd) }}
      />
    </>
  );
}
