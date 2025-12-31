import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Catalog from "@/app/[locale]/components/Catalog";
import Advantages from "@/app/[locale]/components/Advantages";
import Rent from "@/app/[locale]/components/Rent";
import { CatalogFiltersProvider } from "@/context/CatalogFiltersContext";
import { RentalSearchProvider } from "@/context/RentalSearchContext";
import { fetchCars } from "@/lib/api/cars";
import type { Locale } from "@/i18n/request";
import { locales, defaultLocale } from "@/i18n/request";
import {
  getCityBySlug,
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

  const languages: Record<string, string> = {
    "uk-UA": `${baseUrl}${getPath("uk")}`,
    "ru-UA": `${baseUrl}${getPath("ru")}`,
    en: `${baseUrl}${getPath("en")}`,
    "x-default": `${baseUrl}${getPath("uk")}`,
  };

  return {
    title: cityData.title,
    description: cityData.metaDescription,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: "REIZ",
      title: cityData.ogTitle,
      description: cityData.ogDescription,
      images: [{ url: `${baseUrl}/img/og/home.webp` }],
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: cityData.ogTitle,
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

  // Локалізований заголовок для FAQ секції
  const faqMainTitle = {
    uk: "Часті питання",
    ru: "Частые вопросы",
    en: "Frequently Asked Questions",
  }[locale];

  return (
    <CatalogFiltersProvider>
      <RentalSearchProvider>
        <Header />
        <main className="main">
          <CitySchemaOrg city={cityConfig} locale={locale} faqSections={faqSections} />
          <CityHeroSection city={cityConfig} cityData={cityData} />
          <Catalog cars={cars} sectionTitle={cityData.sectionCars} />
          <Advantages />
          <Rent />
          <CityEditorSection city={cityConfig} locale={locale} />
          <CityFAQ faqSections={faqSections} mainTitle={faqMainTitle} />
        </main>
        <Footer />
      </RentalSearchProvider>
    </CatalogFiltersProvider>
  );
}
