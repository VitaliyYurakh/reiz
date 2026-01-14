import type { Metadata } from "next";
import CarClientProvider from "@/app/[locale]/(site)/cars/[idSlug]/components/modals/CarClientProvider";
import ThemeColorSetter from "@/app/[locale]/(site)/cars/[idSlug]/components/ThemeColorSetter";
import RentPageContent from "@/app/[locale]/(site)/cars/[idSlug]/rent/RentPageContent";
import { fetchCar } from "@/lib/api/cars";
import { type Locale, defaultLocale } from "@/i18n/request";
import { createCarIdSlug, parseCarIdFromSlug } from "@/lib/utils/carSlug";
import { notFound, redirect } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { generateRentalServiceSchema } from "@/lib/schema/rental-service";
import { getTranslations } from "next-intl/server";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

type RentPageParams = { idSlug: string; locale: Locale };

export async function generateMetadata({
  params,
}: {
  params: Promise<RentPageParams>;
}): Promise<Metadata> {
  const { idSlug, locale } = await params;
  const carId = parseCarIdFromSlug(idSlug);
  if (carId === null) return {};

  const car = await fetchCar(carId);
  if (!car) return {};

  const carName = `${car.brand} ${car.model} ${car.yearOfManufacture}`.trim();
  const slug = createCarIdSlug(car);
  const carPath = `/cars/${slug}`;

  const minPrice = car.rentalTariff?.reduce((min, t) => Math.min(min, t.dailyPrice), Infinity) || 0;
  const t = await getTranslations("carRentPage");
  const title = t("meta.title", { carName, price: minPrice });
  const description = t("meta.description", { carName, price: minPrice });

  // Canonical points to car detail page, not rent page
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  const canonicalUrl = `${BASE}${localePrefix}${carPath}`;

  const ogImage = car.carPhoto.find((p) => p.type === "PC")?.url || "/img/og/home.webp";

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [{ url: ogImage, alt: carName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

type RentSearchParams = {
  startDate?: string;
  endDate?: string;
  planId?: string;
};

const normalizeDate = (value: string | undefined, fallback: Date) => {
  if (!value) return fallback;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return parsed;
};

export default async function CarRentPage({
  params,
  searchParams,
}: {
  params: Promise<RentPageParams>;
  searchParams: Promise<RentSearchParams>;
}) {
  const { idSlug, locale } = await params;
  const carId = parseCarIdFromSlug(idSlug);
  if (carId === null) {
    notFound();
  }
  const query = await searchParams;
  const car = await fetchCar(carId);
  if (!car) {
    notFound();
  }

  // 301 redirect if slug is missing or incorrect
  const expectedIdSlug = createCarIdSlug(car);
  if (idSlug !== expectedIdSlug) {
    const queryString = new URLSearchParams(query as Record<string, string>).toString();
    redirect(`/${locale}/cars/${expectedIdSlug}/rent${queryString ? `?${queryString}` : ""}`);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const defaultStartDate = new Date(today);
  const defaultEndDate = new Date(today);
  defaultEndDate.setDate(defaultEndDate.getDate() + 7);

  const parsedStart = normalizeDate(query.startDate, defaultStartDate);
  const parsedEnd = normalizeDate(query.endDate, defaultEndDate);

  const initialStartDate = parsedStart.toISOString();
  let endDate = parsedEnd;
  if (parsedEnd.getTime() < parsedStart.getTime()) {
    endDate = new Date(parsedStart);
    endDate.setDate(endDate.getDate() + 7);
  }
  const initialEndDate = endDate.toISOString();

  const requestedPlanId = Number.parseInt(query.planId ?? "", 10);
  const availablePlanIds = new Set(car.carCountingRule.map((plan) => plan.id));
  const initialPlanId =
    Number.isNaN(requestedPlanId) || !availablePlanIds.has(requestedPlanId)
      ? (car.carCountingRule[0]?.id ?? 0)
      : requestedPlanId;

  // Generate canonical URL for schema
  const slug = createCarIdSlug(car);
  const canonicalUrl = `${BASE}${locale === defaultLocale ? "" : `/${locale}`}/cars/${slug}/rent`;

  // Generate Rental Service schema.org JSON-LD
  const rentalServiceSchema = generateRentalServiceSchema({
    car,
    locale,
    canonicalUrl,
  });

  // Generate BreadcrumbList schema.org JSON-LD
  const t = await getTranslations("carRentPage");
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  const carDetailUrl = `${BASE}${localePrefix}/cars/${slug}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumbs.home"),
        item: `${BASE}${localePrefix || "/"}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumbs.cars"),
        item: `${BASE}${localePrefix}/#catalog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${car.brand} ${car.model}`,
        item: carDetailUrl,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: t("breadcrumbs.booking"),
        item: canonicalUrl,
      },
    ],
  };

  return (
    <CarClientProvider>
      <JsonLd data={rentalServiceSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ThemeColorSetter />
      <RentPageContent
        car={car}
        initialPlanId={initialPlanId}
        initialStartDate={initialStartDate}
        initialEndDate={initialEndDate}
      />
    </CarClientProvider>
  );
}
