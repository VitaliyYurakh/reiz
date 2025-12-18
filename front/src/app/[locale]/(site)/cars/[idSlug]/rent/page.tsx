import type { Metadata } from "next";
import CarClientProvider from "@/app/[locale]/(site)/cars/[idSlug]/components/modals/CarClientProvider";
import ThemeColorSetter from "@/app/[locale]/(site)/cars/[idSlug]/components/ThemeColorSetter";
import RentPageContent from "@/app/[locale]/(site)/cars/[idSlug]/rent/RentPageContent";
import { fetchCar } from "@/lib/api/cars";
import { type Locale, defaultLocale, locales } from "@/i18n/request";
import { createCarIdSlug, parseCarIdFromSlug } from "@/lib/utils/carSlug";
import { notFound, redirect } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { generateRentalServiceSchema } from "@/lib/schema/rental-service";

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
  const path = `/cars/${slug}/rent`;

  const minPrice = car.rentalTariff?.reduce((min, t) => Math.min(min, t.dailyPrice), Infinity) || 0;
  const title = `Забронировать ${carName} — от $${minPrice}/день | REIZ`;
  const description = `Оформите аренду ${carName} онлайн. От $${minPrice}/день, страховка включена, подача по адресу 24/7.`;

  const languages: Record<string, string> = {};
  locales.forEach((loc) => {
    const prefix = loc === defaultLocale ? "" : `/${loc}`;
    languages[loc] = `${BASE}${prefix}${path}`;
  });
  languages["x-default"] = `${BASE}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}${locale === defaultLocale ? "" : `/${locale}`}${path}`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `${BASE}${locale === defaultLocale ? "" : `/${locale}`}${path}`,
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

  return (
    <CarClientProvider>
      <JsonLd data={rentalServiceSchema} />
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
