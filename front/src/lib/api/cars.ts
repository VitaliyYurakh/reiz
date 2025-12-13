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

export async function fetchCar(id: number): Promise<Car> {
  const res = await fetch(`${API_URL}/car/${id}`, {
    next: { revalidate: 10 }, // TODO: update in prod
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Fetch cars failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { car: Car };
  return data.car as Car;
}
