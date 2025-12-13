import CarClientProvider from "@/app/[locale]/(site)/cars/[id]/components/modals/CarClientProvider";
import RentPageContent from "@/app/[locale]/(site)/cars/[id]/rent/RentPageContent";
import { fetchCar } from "@/lib/api/cars";
import type { Locale } from "@/i18n/request";

type RentPageParams = { id: number; locale: Locale };

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
  const { id: carId } = await params;
  const query = await searchParams;
  const car = await fetchCar(carId);

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
      <RentPageContent
        car={car}
        initialPlanId={initialPlanId}
        initialStartDate={initialStartDate}
        initialEndDate={initialEndDate}
      />
    </CarClientProvider>
  );
}
