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
import { RentalSearchProvider } from "@/context/RentalSearchContext";
import { fetchCars } from "@/lib/api/cars";

export const metadata: Metadata = {
  title: "Главная",
  description: "Описание сайта",
};

export default async function Home() {
  const cars = await fetchCars();

  return (
    <CatalogFiltersProvider>
      <RentalSearchProvider>
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
      </RentalSearchProvider>
    </CatalogFiltersProvider>
  );
}
