import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Catalog from "@/app/[locale]/components/Catalog";
import Advantages from "@/app/[locale]/components/Advantages";
import Rent from "@/app/[locale]/components/Rent";
import { CatalogFiltersProvider } from "@/context/CatalogFiltersContext";
import { fetchCars } from "@/lib/api/cars";
import type { Locale } from "@/i18n/request";
import { locales, defaultLocale } from "@/i18n/request";
import {
  OG_LOCALE,
  buildHreflangMap,
  getOgAlternateLocales,
  type LocalizedField,
} from "@/i18n/locale-config";
import {
  getCityBySlug,
  getCityFooterAddress,
  getCityLocalizedData,
  getAllCitySlugs,
} from "@/data/cities";
import { getCityFAQ } from "@/data/cityContent";
import CityHeroSection from "./components/CityHeroSection";
import CityEditorSection from "./components/CityEditorSection";
import CitySchemaOrg from "./components/CitySchemaOrg";
import CityFAQ from "./components/CityFAQ";

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

// Генерація статичних параметрів для SSG
export async function generateStaticParams(): Promise<PageParams[]> {
  const params: PageParams[] = [];

  for (const locale of locales) {
    for (const slug of getAllCitySlugs()) {
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

  const metaTitle = shortenMetaTitle(cityData.title);
  const ogLocale = OG_LOCALE[locale];
  const ogAlternateLocales = getOgAlternateLocales(locale);

  return {
    title: metaTitle,
    description: cityData.metaDescription,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: "REIZ",
      title: metaTitle,
      description: cityData.ogDescription,
      images: [{ url: `${baseUrl}/img/og/home.webp`, width: 1200, height: 630 }],
      url: canonical,
      locale: ogLocale,
      alternateLocale: ogAlternateLocales,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: cityData.ogDescription,
      images: [`${baseUrl}/img/og/home.webp`],
    },
  };
}

export default async function CityRentalPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { city: citySlug, locale } = await params;

  const cityConfig = getCityBySlug(citySlug);
  const cityData = getCityLocalizedData(citySlug, locale);

  // Якщо місто не знайдено - 404
  if (!cityConfig || !cityData) {
    notFound();
  }

  const cars = await fetchCars();
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
        <CitySchemaOrg city={cityConfig} locale={locale} faqSections={faqSections} />
        <CityHeroSection city={cityConfig} cityData={cityData} locale={locale} />
        <Catalog cars={cars} sectionTitle={cityData.sectionCars} />
        <Advantages />
        <Rent />
        <CityEditorSection city={cityConfig} locale={locale} />
        <CityFAQ faqSections={faqSections} mainTitle={faqMainTitle} />
      </main>
      <Footer addressText={footerAddress} descriptionText={footerDescription} />
    </CatalogFiltersProvider>
  );
}
