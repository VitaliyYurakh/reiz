import type { Car } from "@/types/cars";
import type { Locale } from "@/i18n/request";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

type VehicleSchemaParams = {
  car: Car;
  locale: Locale;
  canonicalUrl: string;
};

/**
 * Generate Vehicle + AggregateOffer schema.org JSON-LD
 */
export function generateVehicleSchema({
  car,
  locale,
  canonicalUrl,
}: VehicleSchemaParams): Record<string, unknown> {
  const carName = `${car.brand} ${car.model} ${car.yearOfManufacture}`.trim();

  // Collect vehicle configuration items
  const configItems: string[] = [];
  if (car.transmission?.[locale]) configItems.push(car.transmission[locale]);
  if (car.engineType?.[locale]) configItems.push(car.engineType[locale]);
  if (car.driveType?.[locale]) configItems.push(car.driveType[locale]);
  if (car.engineVolume) configItems.push(car.engineVolume);

  // Get images (PC type preferred)
  const images = car.carPhoto
    .filter((p) => p.type === "PC" || p.type === "MOBILE")
    .map((p) => p.url);

  // Calculate price range from rental tariffs
  const prices = car.rentalTariff?.map((t) => t.dailyPrice) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: carName,
    url: canonicalUrl,
    brand: {
      "@type": "Brand",
      name: car.brand,
    },
    model: car.model,
    vehicleModelDate: car.yearOfManufacture?.toString(),
  };

  // VIN only if available (do not fabricate)
  if (car.VIN) {
    schema.vehicleIdentificationNumber = car.VIN;
  }

  // Vehicle configuration
  if (configItems.length > 0) {
    schema.vehicleConfiguration = configItems.join(", ");
  }

  // Seating capacity
  if (car.seats) {
    schema.seatingCapacity = car.seats;
  }

  // Color
  if (car.color) {
    schema.color = car.color;
  }

  // Images
  if (images.length > 0) {
    schema.image = images;
  }

  // Fuel type
  if (car.engineType?.[locale]) {
    schema.fuelType = car.engineType[locale];
  }

  // Offers (rental pricing)
  if (minPrice !== null) {
    schema.offers = {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: minPrice,
      highPrice: maxPrice,
      offerCount: prices.length,
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      seller: {
        "@type": "Organization",
        name: "REIZ RENTAL CARS",
        url: BASE,
      },
    };
  }

  return schema;
}
