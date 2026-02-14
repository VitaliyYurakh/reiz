import { type RentalTariff, type Car, type LocalizedText, localized } from "@/types/cars";

export type SortKey = "default" | "asc" | "desc";

export type Filters = {
  segment?: string | null;
  fuel?: string | null;
  brand?: string | null;
  model?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
};

export const emptyFilters = (): Filters => ({
  segment: null,
  brand: null,
  model: null,
  fuel: null,
  priceMin: null,
  priceMax: null,
});

export const cleanString = (value: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

export const parseNumberFromString = (value: string | null): number | null => {
  if (value == null) return null;
  const n = Number(String(value).trim());
  return Number.isFinite(n) ? n : null;
};

export const parseFiltersFromSearch = (
  search: string,
): { filters: Filters; sortKey: SortKey } => {
  const params = new URLSearchParams(search);
  const filters = emptyFilters();

  filters.segment = cleanString(params.get("class"));
  filters.brand = cleanString(params.get("brand"));
  filters.model = cleanString(params.get("model"));
  filters.fuel = cleanString(params.get("fuel"));
  filters.priceMin = parseNumberFromString(params.get("priceMin"));
  filters.priceMax = parseNumberFromString(params.get("priceMax"));

  const sort = params.get("sort");
  const sortKey: SortKey = sort === "asc" || sort === "desc" ? sort : "default";

  return { filters, sortKey };
};

export function getMinTariffPrice(rentalTariff: RentalTariff[]): number | null {
  if (!rentalTariff?.length) return null;
  let min = Infinity;
  for (const t of rentalTariff) {
    min = Math.min(min, t.dailyPrice);
  }
  return Number.isFinite(min) ? min : null;
}

export function getTariffForRange(
  tariffs: RentalTariff[],
  minDays: number,
  maxDays: number | null, // null => без верхней границы
): RentalTariff | null {
  if (!tariffs?.length) return null;
  return (
    tariffs.find(
      (t) => t.minDays === minDays && t.maxDays === (maxDays ?? 0),
    ) ?? null
  );
}

export function human(value: string | number | null | undefined, empty = "—") {
  if (value === 0) return "0";
  return value ? String(value) : empty;
}

export function buildDerivedLists(cars: Car[]) {
  const segmentNames = Array.from(
    new Set(cars.flatMap((c) => c.segment?.map((s) => s.name) ?? [])),
  );
  const carBrands = Array.from(
    new Set(cars.map((c) => c.brand).filter(Boolean)),
  ) as string[];
  const carModels = Array.from(
    new Set(cars.map((c) => c.model).filter(Boolean)),
  ) as string[];
  return { segmentNames, carBrands, carModels };
}

/**
 * Форматирует информацию о двигателе: объём + тип топлива
 * @param engineVolume - объём двигателя (например, "2.4")
 * @param engineType - локализованный тип двигателя
 * @param locale - текущая локаль (en, ru, uk)
 * @returns строка вида "2.4 Дизель" или только объём, если тип не указан
 */
export function formatEngine(
  engineVolume: string | null,
  engineType: LocalizedText | null,
  locale: string,
): string {
  const volume = engineVolume ?? "";
  const type = localized(engineType, locale);
  return type ? `${volume} ${type}`.trim() : volume;
}
