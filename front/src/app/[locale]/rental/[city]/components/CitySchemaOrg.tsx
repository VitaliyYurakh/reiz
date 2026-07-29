import { PHONE_NUMBER } from "@/config/social";
import type { CityConfig } from "@/data/cities";
import type { CityFAQFormatted } from "@/data/cityContent";
import type { Locale } from "@/i18n/request";
import { defaultLocale } from "@/i18n/request";

type Props = {
  city: CityConfig;
  locale: Locale;
  faqSections?: CityFAQFormatted[];
};

export default function CitySchemaOrg({ city, locale, faqSections }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";
  const localizedCity = city.localized[locale];

  // Побудова URL сторінки
  const getPageUrl = () => {
    const prefix = locale === defaultLocale ? "" : `/${locale}`;
    return `${baseUrl}${prefix}/rental/${city.slug}`;
  };

  // Локалізовані описи для Schema.org
  const descriptions: Record<Locale, string> = {
    uk: `Оренда авто у ${localizedCity.nameLocative} — сучасні автомобілі, подача по місту та прозорі умови оренди.`,
    ru: `Аренда авто в ${localizedCity.nameLocative} — современные автомобили, подача по городу и прозрачные условия аренды.`,
    en: `Car rental in ${localizedCity.name} — modern vehicles, city-wide delivery, and clear rental terms.`,
    pl: `Wynajem samochodu w ${localizedCity.name} — nowoczesne pojazdy, dostawa po mieście i jasne warunki najmu.`,
    ro: `Închiriere auto în ${localizedCity.name} — vehicule moderne, livrare în oraș și condiții clare de închiriere.`,
  };

  // Schema.org WebPage для конкретного міста
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${getPageUrl()}#webpage`,
    url: getPageUrl(),
    name: `REIZ - ${
      locale === "uk"
        ? `Оренда авто у ${localizedCity.nameLocative}`
        : locale === "ru"
          ? `Аренда авто в ${localizedCity.nameLocative}`
          : locale === "pl"
            ? `Wynajem samochodu w ${localizedCity.name}`
            : locale === "ro"
              ? `Închiriere auto în ${localizedCity.name}`
              : `Car Rental in ${localizedCity.name}`
    }`,
    description: descriptions[locale],
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    inLanguage:
      locale === "uk"
        ? "uk-UA"
        : locale === "ru"
          ? "ru-UA"
          : locale === "pl"
            ? "pl-PL"
            : locale === "ro"
              ? "ro-RO"
              : "en-US",
  };

  // Schema.org LocalBusiness для конкретного міста
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    "@id": `${getPageUrl()}#localbusiness`,
    name: `REIZ ${localizedCity.name}`,
    alternateName: [
      `REIZ Rental ${localizedCity.name}`,
      `REIZ RENTAL CARS ${localizedCity.name}`,
    ],
    url: getPageUrl(),
    logo: `${baseUrl}/img/og/home-square.jpg`,
    image: `${baseUrl}/img/og/home-square.jpg`,
    description: descriptions[locale],
    telephone: PHONE_NUMBER,
    email: "info@reiz.com.ua",
    priceRange: "$$",
    currenciesAccepted: "UAH, USD, EUR",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      addressLocality: localizedCity.name,
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
      { "@type": "City", name: localizedCity.name },
      { "@type": "AdministrativeArea", name: city.region },
      {
        "@type": "Country",
        name:
          locale === "uk"
            ? "Україна"
            : locale === "ru"
              ? "Украина"
              : locale === "pl"
                ? "Ukraina"
                : "Ukraine",
      },
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
            : locale === "pl"
              ? "Samochody do wynajęcia"
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
                  : locale === "pl"
                    ? "Samochody klasy ekonomicznej"
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
                  : locale === "pl"
                    ? "Samochody klasy biznes"
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
                  : locale === "pl"
                    ? "SUV-y i crossovery"
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
                  : locale === "pl"
                    ? "Samochody premium"
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
        name:
          locale === "uk"
            ? "Головна"
            : locale === "ru"
              ? "Главная"
              : locale === "pl"
                ? "Strona główna"
                : "Home",
        item: `${baseUrl}${locale === defaultLocale ? "/" : `/${locale}/`}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name:
          locale === "uk"
            ? `Оренда авто у ${localizedCity.nameLocative}`
            : locale === "ru"
              ? `Аренда авто в ${localizedCity.nameLocative}`
              : locale === "pl"
                ? `Wynajem samochodu w ${localizedCity.name}`
                : locale === "ro"
                  ? `Închiriere auto în ${localizedCity.name}`
                  : `Car Rental in ${localizedCity.name}`,
        item: getPageUrl(),
      },
    ],
  };

  // FAQPage Schema.org для FAQ секції
  const faqJsonLd =
    faqSections && faqSections.length > 0
      ? {
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
            })),
          ),
        }
      : null;

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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd),
        }}
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
