import type { CityConfig } from "@/data/cities";
import type { Locale } from "@/i18n/request";
import { defaultLocale } from "@/i18n/request";
import type { CityFAQFormatted } from "@/data/cityContent";

type Props = {
  city: CityConfig;
  locale: Locale;
  faqSections?: CityFAQFormatted[];
};

export default function CitySchemaOrg({ city, locale, faqSections }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

  // Побудова URL сторінки
  const getPageUrl = () => {
    const prefix = locale === defaultLocale ? "" : `/${locale}`;
    return `${baseUrl}${prefix}/rental/${city.slug}`;
  };

  // Локалізовані описи для Schema.org
  const descriptions: Record<Locale, string> = {
    uk: `Оренда авто ${city.nameLocative} — сучасні автомобілі, подача по місту та в аеропорт, підтримка 24/7.`,
    ru: `Аренда авто в ${city.nameLocative} — современные автомобили, подача по городу и в аэропорт, поддержка 24/7.`,
    en: `Car rental in ${city.name} — modern vehicles, city-wide delivery and airport pickup, 24/7 support.`,
    pl: `Wynajem samochodu w ${city.name} — nowoczesne pojazdy, dostawa po mieście i na lotnisko, wsparcie 24/7.`,
  };

  // Schema.org WebPage для конкретного міста
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${getPageUrl()}#webpage`,
    url: getPageUrl(),
    name: `REIZ - ${
      locale === "uk"
        ? `Оренда авто у ${city.nameLocative}`
        : locale === "ru"
          ? `Аренда авто в ${city.nameLocative}`
          : `Car Rental in ${city.name}`
    }`,
    description: descriptions[locale],
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    inLanguage: locale === "uk" ? "uk-UA" : locale === "ru" ? "ru-UA" : "en",
  };

  // Schema.org LocalBusiness для конкретного міста
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    "@id": `${getPageUrl()}#localbusiness`,
    name: `REIZ ${city.name}`,
    alternateName: `REIZ RENTAL CARS ${city.name}`,
    url: getPageUrl(),
    logo: `${baseUrl}/img/og/home-square.webp`,
    image: `${baseUrl}/img/og/home.webp`,
    description: descriptions[locale],
    telephone: "+380635471186",
    email: "info@reiz.com.ua",
    priceRange: "$$",
    currenciesAccepted: "UAH, USD, EUR",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: city.region,
      postalCode: city.postalCode,
      addressCountry: "UA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.geo.latitude,
      longitude: city.geo.longitude,
    },
    areaServed: [
      { "@type": "City", name: city.name },
      { "@type": "AdministrativeArea", name: city.region },
      { "@type": "Country", name: "Україна" },
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
    parentOrganization: {
      "@id": `${baseUrl}/#company`,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name:
        locale === "uk"
          ? "Автомобілі в оренду"
          : locale === "ru"
            ? "Автомобили в аренду"
            : "Cars for rent",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Car",
            name:
              locale === "uk"
                ? "Автомобілі економ класу"
                : locale === "ru"
                  ? "Автомобили эконом класса"
                  : "Economy class cars",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Car",
            name:
              locale === "uk"
                ? "Автомобілі бізнес класу"
                : locale === "ru"
                  ? "Автомобили бизнес класса"
                  : "Business class cars",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Car",
            name:
              locale === "uk"
                ? "SUV та позашляховики"
                : locale === "ru"
                  ? "SUV и внедорожники"
                  : "SUVs and crossovers",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Car",
            name:
              locale === "uk"
                ? "Преміум автомобілі"
                : locale === "ru"
                  ? "Премиум автомобили"
                  : "Premium cars",
          },
        },
      ],
    },
  };

  // BreadcrumbList для навігації
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "uk" ? "Головна" : locale === "ru" ? "Главная" : "Home",
        item: `${baseUrl}${locale === defaultLocale ? "/" : `/${locale}/`}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name:
          locale === "uk"
            ? `Оренда авто у ${city.nameLocative}`
            : locale === "ru"
              ? `Аренда авто в ${city.nameLocative}`
              : `Car Rental in ${city.name}`,
        item: getPageUrl(),
      },
    ],
  };

  // FAQPage Schema.org для FAQ секції
  const faqJsonLd = faqSections && faqSections.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqSections.flatMap((section) =>
      section.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      }))
    ),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: safe structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: safe structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: safe structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: safe structured data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </>
  );
}
