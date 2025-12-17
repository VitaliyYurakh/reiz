import CarClientProvider from "@/app/[locale]/(site)/cars/[idSlug]/components/modals/CarClientProvider";
import ThemeColorSetter from "@/app/[locale]/(site)/cars/[idSlug]/components/ThemeColorSetter";
import RentPageContent from "@/app/[locale]/(site)/cars/[idSlug]/rent/RentPageContent";
import { fetchCar } from "@/lib/api/cars";
import type { Locale } from "@/i18n/request";
import { createCarIdSlug, parseCarIdFromSlug } from "@/lib/utils/carSlug";
import { notFound, redirect } from "next/navigation";

type RentPageParams = { idSlug: string; locale: Locale };

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

  return (
    <CarClientProvider>
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
