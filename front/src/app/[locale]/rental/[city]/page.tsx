import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Advantages from "@/app/[locale]/components/Advantages";
import Catalog from "@/app/[locale]/components/Catalog";
import Rent from "@/app/[locale]/components/Rent";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CatalogFiltersProvider } from "@/context/CatalogFiltersContext";
import {
  getAllCitySlugs,
  getCityBySlug,
  getCityFooterAddress,
  getCityLocalizedData,
} from "@/data/cities";
import { getCityFAQ } from "@/data/cityContent";
import {
  buildHreflangMap,
  getOgAlternateLocales,
  type LocalizedField,
  OG_LOCALE,
} from "@/i18n/locale-config";
import type { Locale } from "@/i18n/request";
import { defaultLocale, locales } from "@/i18n/request";
import { fetchCars } from "@/lib/api/cars";
import CityEditorSection from "./components/CityEditorSection";
import CityFAQ from "./components/CityFAQ";
import CityHeroSection from "./components/CityHeroSection";
import CitySchemaOrg from "./components/CitySchemaOrg";

type PageParams = {
  locale: Locale;
  city: string;
};

const MAX_META_TITLE_LENGTH = 55;
const DASH_SEPARATOR = " \u2014 ";

const shortenMetaTitle = (value: string) => {
  const parts = value.split(DASH_SEPARATOR);
  if (parts.length > 1 && parts[0].trim()) return parts[0].trim();
  if (value.length <= MAX_META_TITLE_LENGTH) return value;

  const truncated = value.slice(0, MAX_META_TITLE_LENGTH);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated).trim();
};

const airportClaimPattern = /аеропорт|аэропорт|airport|lotnisko|aeroport/i;

const getSafeCityTitle = (
  city: NonNullable<ReturnType<typeof getCityBySlug>>,
  locale: Locale,
) => {
  const localized = city.localized[locale];
  const templates: Record<Locale, string> = {
    uk: `Оренда та прокат авто у ${localized.nameLocative}`,
    ru: `Аренда и прокат авто в ${localized.nameLocative}`,
    en: `Car Rental in ${localized.name}`,
    pl: `Wynajem samochodu w ${localized.name}`,
    ro: `Închiriere auto în ${localized.name}`,
  };

  return templates[locale];
};

const getSafeCityDescription = (
  city: NonNullable<ReturnType<typeof getCityBySlug>>,
  locale: Locale,
) => {
  const localized = city.localized[locale];
  const templates: Record<Locale, string> = {
    uk: `Оренда та прокат авто у ${localized.nameLocative} від REIZ. Подача за адресою в межах міста; умови оренди підтвердить менеджер.`,
    ru: `Аренда и прокат авто в ${localized.nameLocative} от REIZ. Подача по адресу в пределах города; условия аренды подтвердит менеджер.`,
    en: `Car rental in ${localized.name} with REIZ. City delivery to your address is confirmed by the manager before booking.`,
    pl: `Wynajem samochodu w ${localized.name} z REIZ. Dostawę pod adres w mieście potwierdza manager przed rezerwacją.`,
    ro: `Închiriere auto în ${localized.name} cu REIZ. Livrarea la adresă în oraș este confirmată de manager înainte de rezervare.`,
  };

  return templates[locale];
};

// Генерація статичних параметрів для SSG
export async function generateStaticParams(): Promise<PageParams[]> {
  const params: PageParams[] = [];

  for (const locale of locales) {
    for (const slug of getAllCitySlugs().filter(
      (citySlug) => citySlug !== "lviv",
    )) {
      params.push({ locale, city: slug });
    }
  }

  return params;
}

// Генерація метаданих для SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale, city: citySlug } = await params;

  // Lviv lives at the root (homepage IS the Lviv pillar) — never expose /rental/lviv.
  if (citySlug === "lviv") {
    permanentRedirect(locale === defaultLocale ? "/" : `/${locale}`);
  }

  const cityConfig = getCityBySlug(citySlug);
  const cityData = getCityLocalizedData(citySlug, locale);

  if (!cityConfig || !cityData) {
    return {
      title: "Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

  // Побудова canonical та alternates
  const getPath = (loc: Locale) => {
    const prefix = loc === defaultLocale ? "" : `/${loc}`;
    return `${prefix}/rental/${citySlug}`;
  };

  const canonical = `${baseUrl}${getPath(locale)}`;

  const languages = buildHreflangMap(
    (loc) => getPath(loc),
    (p) => `${baseUrl}${p}`,
  );

  const rawMetaTitle = shortenMetaTitle(cityData.title);
  const metaTitle = airportClaimPattern.test(rawMetaTitle)
    ? getSafeCityTitle(cityConfig, locale)
    : rawMetaTitle;
  const metaDescription = airportClaimPattern.test(cityData.metaDescription)
    ? getSafeCityDescription(cityConfig, locale)
    : cityData.metaDescription;
  const ogDescription = airportClaimPattern.test(cityData.ogDescription)
    ? metaDescription
    : cityData.ogDescription;
  const ogLocale = OG_LOCALE[locale];
  const ogAlternateLocales = getOgAlternateLocales(locale);

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: "REIZ",
      title: metaTitle,
      description: ogDescription,
      images: [
        { url: `${baseUrl}/img/og/home-square.jpg`, width: 1200, height: 1200 },
      ],
      url: canonical,
      locale: ogLocale,
      alternateLocale: ogAlternateLocales,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: ogDescription,
      images: [`${baseUrl}/img/og/home-square.jpg`],
    },
  };
}

export default async function CityRentalPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { city: citySlug, locale } = await params;

  // Lviv lives at the root (homepage IS the Lviv pillar) — never expose /rental/lviv.
  if (citySlug === "lviv") {
    permanentRedirect(locale === defaultLocale ? "/" : `/${locale}`);
  }

  const cityConfig = getCityBySlug(citySlug);
  const cityData = getCityLocalizedData(citySlug, locale);

  // Якщо місто не знайдено - 404
  if (!cityConfig || !cityData) {
    notFound();
  }

  const cars = await fetchCars(citySlug);
  const faqSections = getCityFAQ(cityConfig, locale);
  const footerAddress = getCityFooterAddress(cityConfig, locale);
  const footerDescription = cityData.footerDescription;

  // Локалізований заголовок для FAQ секції
  const faqTitles: LocalizedField = {
    uk: "Часті питання",
    ru: "Частые вопросы",
    en: "Frequently Asked Questions",
    pl: "Najczęściej zadawane pytania",
    ro: "Întrebări frecvente",
  };
  const faqMainTitle = faqTitles[locale];

  return (
    <CatalogFiltersProvider>
      <Header />
      <main className="main">
        <CitySchemaOrg
          city={cityConfig}
          locale={locale}
          faqSections={faqSections}
        />
        <CityHeroSection
          city={cityConfig}
          cityData={cityData}
          locale={locale}
        />
        <Catalog
          cars={cars}
          sectionTitle={cityData.sectionCars}
          citySlug={citySlug}
        />
        <Advantages />
        <Rent />
        <CityEditorSection city={cityConfig} locale={locale} />
        <CityFAQ faqSections={faqSections} mainTitle={faqMainTitle} />
      </main>
      <Footer addressText={footerAddress} descriptionText={footerDescription} />
    </CatalogFiltersProvider>
  );
}
