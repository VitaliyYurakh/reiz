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
import { getPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/request";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata({
    routeKey: "home",
    ns: "homePage",
    locale,
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const cars = await fetchCars();

  return (
    <CatalogFiltersProvider>
      <Header />
      <main className="main">
        <SchemaOrg locale={locale} />
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
