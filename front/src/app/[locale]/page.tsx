import type { Metadata } from "next";
import Header from "@/components/Header";
import HeroSection from "@/app/[locale]/components/HeroSection";
import Catalog from "@/app/[locale]/components/Catalog";
import Advantages from "@/app/[locale]/components/Advantages";
import Rent from "@/app/[locale]/components/Rent";
import FAQ from "@/app/[locale]/components/FAQ";
import SchemaOrg from "@/app/[locale]/components/SchemaOrg";
import EditorSection from "@/app/[locale]/components/EditorSection";
import Footer from "@/components/Footer";
import { CatalogFiltersProvider } from "@/context/CatalogFiltersContext";
import { fetchCars } from "@/lib/api/cars";
import { getStaticPageMetadata } from "@/lib/seo-sync";
import { type Locale, locales } from "@/i18n/request";

// Force static generation to ensure metadata in initial HTML
export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// SYNC metadata - ensures title in initial HTML shell for SEO crawlers
export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  return getStaticPageMetadata("homePage", params.locale);
}

export default async function Home() {
  const cars = await fetchCars();

  return (
    <CatalogFiltersProvider>
      <Header />
      <main className="main">
        <SchemaOrg />
        <HeroSection />
        <Catalog cars={cars} />
        <Advantages />
        <Rent />
        <EditorSection />
        <FAQ />
      </main>
      <Footer />
    </CatalogFiltersProvider>
  );
}
