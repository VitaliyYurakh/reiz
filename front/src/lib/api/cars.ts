import type { Car } from "@/types/cars";
import {API_URL} from "@/config/environment";

export async function fetchCars(): Promise<Car[]> {
  const res = await fetch(`${API_URL}/car`, {
    next: { revalidate: 10 }, // TODO: update in prod
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Fetch cars failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { cars: Car[] };
  return data.cars as Car[];
}

export async function fetchCar(id: number): Promise<Car | null> {
  const res = await fetch(`${API_URL}/car/${id}`, {
    next: { revalidate: 10 }, // TODO: update in prod
    headers: { Accept: "application/json" },
  });

  // Return null for 404 - car not found
  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Fetch car failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { car: Car };
  return data.car ?? null;
}

/**
 * Fetch cars for sitemap with validation.
 * - No cache to always get fresh data
 * - Filters out invalid/test cars
 */
export async function fetchCarsForSitemap(): Promise<Car[]> {
  const res = await fetch(`${API_URL}/car`, {
    cache: "no-store", // Always fresh data for sitemap
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Fetch cars for sitemap failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { cars: Car[] };
  const cars = data.cars as Car[];

  // Filter: only valid cars for sitemap
  return cars.filter((car) => {
    // Must have id
    if (!car.id || car.id <= 0) return false;

    // Must have brand and model (not null/empty)
    if (!car.brand?.trim() || !car.model?.trim()) return false;

    // Must have valid year (reasonable range)
    if (!car.yearOfManufacture || car.yearOfManufacture < 1990 || car.yearOfManufacture > 2030) return false;

    // Exclude test patterns in brand/model
    const testPatterns = /^(test|тест|1111|0000|xxx|demo)/i;
    if (testPatterns.test(car.brand) || testPatterns.test(car.model)) return false;

    // Must have at least one photo
    if (!car.carPhoto || car.carPhoto.length === 0) return false;

    // Must have rental tariffs
    if (!car.rentalTariff || car.rentalTariff.length === 0) return false;

    return true;
  });
}
