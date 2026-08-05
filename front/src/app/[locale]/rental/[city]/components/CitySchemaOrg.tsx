import type { CityConfig } from "@/data/cities";
import type { Locale } from "@/i18n/request";
import { defaultLocale } from "@/i18n/request";
import type { CityFAQFormatted } from "@/data/cityContent";
import { PHONE_NUMBER } from "@/config/social";

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
  // Bug fixed: all 5 branches used to interpolate the raw (Ukrainian-only)
  // city.name/city.nameLocative fields — e.g. the "ru" branch rendered the
  // Ukrainian spelling ("Києві") inside Russian text instead of "Киеве", and
  // en/pl/ro rendered Ukrainian city names ("Одеса") instead of the localized
  // form ("Odesa"/"Odessa"). city.localized[locale] already has the correct
  // per-locale name/nameLocative for all 5 locales — use that everywhere.
  const descriptions: Record<Locale, string> = {
    uk: `Оренда авто ${city.localized.uk.nameLocative} — сучасні автомобілі, подача по місту та в аеропорт, підтримка 24/7.`,
    ru: `Аренда авто в ${city.localized.ru.nameLocative} — современные автомобили, подача по городу и в аэропорт, поддержка 24/7.`,
    en: `Car rental in ${city.localized.en.name} — modern vehicles, city-wide delivery and airport pickup, 24/7 support.`,
    pl: `Wynajem samochodu w ${city.localized.pl.name} — nowoczesne pojazdy, dostawa po mieście i na lotnisko, wsparcie 24/7.`,
    ro: `Închiriere auto în ${city.localized.ro.name} — vehicule moderne, livrare în oraș și la aeroport, asistență 24/7.`,
  };

  // Shared per-locale "Car Rental in <City>" headline — reused by webPageJsonLd.name
  // and the breadcrumb's city label below. Previously each site duplicated this as
  // its own ternary chain, and neither had a "ro" branch (both silently fell back
  // to the English string), and the "pl"/"en" branches used the raw Ukrainian
  // city.name instead of the localized form.
  const cityHeadline: Record<Locale, string> = {
    uk: `Оренда авто у ${city.localized.uk.nameLocative}`,
    ru: `Аренда авто в ${city.localized.ru.nameLocative}`,
    en: `Car Rental in ${city.localized.en.name}`,
    pl: `Wynajem samochodu w ${city.localized.pl.name}`,
    ro: `Închiriere auto în ${city.localized.ro.name}`,
  };

  const inLanguageTag: Record<Locale, string> = {
    uk: "uk-UA",
    ru: "ru-UA",
    pl: "pl-PL",
    en: "en-US",
    // Bug fixed: this used to fall through the uk/ru/pl ternary to the "en-US"
    // default, so every /ro/rental/* page declared its language as English.
    ro: "ro-RO",
  };

  // Schema.org WebPage для конкретного міста
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${getPageUrl()}#webpage`,
    url: getPageUrl(),
    name: `REIZ - ${cityHeadline[locale]}`,
    description: descriptions[locale],
    // Id format must match SchemaOrg.tsx's `buildId(homeUrl, "website")` exactly
    // (no leading slash before "#", and locale-prefixed for non-default locales)
    // or this points at a node id that is never emitted anywhere on the site.
    // Note: like all "@id" references here, this still only resolves if a
    // crawler merges JSON-LD across pages of the same site — Google's own
    // structured-data docs describe @id reuse as same-page only, so treat this
    // as best-effort entity hinting, not a guaranteed graph link.
    isPartOf: {
      "@id": `${locale === defaultLocale ? baseUrl : `${baseUrl}/${locale}`}#website`,
    },
    inLanguage: inLanguageTag[locale],
  };

  // Schema.org LocalBusiness для конкретного міста
  // city.name/city.nameLocative are Ukrainian-only; city.localized[locale].name
  // is the per-locale form (e.g. "Kyiv" / "Kijów") — use it for anything a
  // non-Ukrainian searcher's rich snippet will render.
  const localizedCityName = city.localized[locale].name;
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    "@id": `${getPageUrl()}#localbusiness`,
    name: `REIZ ${localizedCityName}`,
    alternateName: [
      `REIZ Rental ${localizedCityName}`,
      `REIZ RENTAL CARS ${localizedCityName}`,
    ],
    url: getPageUrl(),
    logo: `${baseUrl}/favicon-192.png`,
    image: `${baseUrl}/img/og/home-square.jpg`,
    description: descriptions[locale],
    telephone: PHONE_NUMBER,
    email: "info@reiz.com.ua",
    priceRange: "$$",
    currenciesAccepted: "UAH, USD, EUR",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      addressLocality: localizedCityName,
      // TODO(i18n-auditor): city.region (e.g. "Львівська область") has no
      // localized counterpart in CityConfig — every non-uk locale's rich
      // snippet still shows the Ukrainian oblast name here. Needs a
      // `regionLocalized: LocalizedField<string>` added to CityConfig for
      // all 37 cities (same pattern as rental-service.ts's addressByLocale,
      // which only covers Lviv). Not machine-translatable safely: oblast
      // names take a grammatical case in uk/pl that can't be derived from
      // the nominative city name.
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
      { "@type": "City", name: localizedCityName },
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
                : locale === "ro"
                  ? "Ucraina"
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
    // Inlined (not "@id" reference): city pages never emit the homepage's
    // Organization node in their own markup, so a cross-page "@id" reference
    // resolved to nothing (and the id string didn't even match homepage's
    // "{homeUrl}#company" — this built "{baseUrl}/#company", an extra slash).
    // Structured data references only resolve within the same page.
    parentOrganization: {
      "@type": "Organization",
      name: "REIZ",
      alternateName: ["REIZ Rental", "REIZ RENTAL CARS"],
      url: baseUrl,
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
  // Bug fixed: the "Home" label had no "ro" branch (fell back to English), and
  // the city label had no "pl" branch at all — every /pl/rental/* breadcrumb
  // rendered the English "Car Rental in <Ukrainian city name>" string.
  const homeLabel: Record<Locale, string> = {
    uk: "Головна",
    ru: "Главная",
    pl: "Strona główna",
    en: "Home",
    ro: "Acasă",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homeLabel[locale],
        item: `${baseUrl}${locale === defaultLocale ? "/" : `/${locale}/`}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cityHeadline[locale],
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
