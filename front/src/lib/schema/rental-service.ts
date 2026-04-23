import type { Car } from "@/types/cars";
import type { Locale } from "@/i18n/request";
import { PHONE_NUMBER } from "@/config/social";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

type RentalServiceSchemaParams = {
  car: Car;
  locale: Locale;
  canonicalUrl: string;
};

/**
 * Generate Service (Car rental) schema.org JSON-LD for booking page
 */
export function generateRentalServiceSchema({
  car,
  locale,
  canonicalUrl,
}: RentalServiceSchemaParams): Record<string, unknown> {
  const carName = `${car.brand} ${car.model} ${car.yearOfManufacture}`.trim();

  // Calculate min price from rental tariffs
  const prices = car.rentalTariff?.map((t) => t.dailyPrice) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

  // Service name by locale
  const serviceNameByLocale: Record<Locale, string> = {
    ru: `Аренда ${carName}`,
    uk: `Оренда ${carName}`,
    en: `${carName} Rental`,
    pl: `Wynajem ${carName}`,
    ro: `Închiriere ${carName}`,
  };

  const descriptionByLocale: Record<Locale, string> = {
    ru: `Забронируйте ${carName} онлайн. Премиум-сервис, страховка, подача по адресу 24/7.`,
    uk: `Забронюйте ${carName} онлайн. Преміум-сервіс, страховка, подача за адресою 24/7.`,
    en: `Book ${carName} online. Premium service, insurance included, 24/7 delivery.`,
    pl: `Zarezerwuj ${carName} online. Serwis premium, ubezpieczenie w cenie, dostawa 24/7.`,
    ro: `Rezervați ${carName} online. Serviciu premium, asigurare inclusă, livrare 24/7.`,
  };

  // Localized postal address — Cyrillic looks broken to international searchers in rich snippets.
  const addressByLocale: Record<Locale, { street: string; city: string; region: string }> = {
    uk: { street: "вул. Любінська, 168", city: "Львів", region: "Львівська область" },
    ru: { street: "ул. Любинская, 168", city: "Львов", region: "Львовская область" },
    en: { street: "168 Lyubinska St", city: "Lviv", region: "Lviv Oblast" },
    pl: { street: "ul. Lubinska 168", city: "Lwów", region: "Obwód lwowski" },
    ro: { street: "Str. Liubinska 168", city: "Lviv", region: "Regiunea Lviv" },
  };
  const addr = addressByLocale[locale];

  // Localized areaServed.City name
  const cityServedByLocale: Record<Locale, string> = {
    uk: "Львів",
    ru: "Львов",
    en: "Lviv",
    pl: "Lwów",
    ro: "Lviv",
  };

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Car Rental",
    name: serviceNameByLocale[locale],
    description: descriptionByLocale[locale],
    url: canonicalUrl,
    provider: {
      "@type": "Organization",
      name: "REIZ",
      alternateName: ["REIZ Rental", "REIZ RENTAL CARS"],
      url: BASE,
      logo: `${BASE}/img/logo.svg`,
      address: {
        "@type": "PostalAddress",
        streetAddress: addr.street,
        addressLocality: addr.city,
        addressRegion: addr.region,
        postalCode: "79000",
        addressCountry: "UA",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: PHONE_NUMBER,
        contactType: "customer service",
        availableLanguage: ["Ukrainian", "Russian", "English", "Polish"],
      },
    },
    areaServed: {
      "@type": "City",
      name: cityServedByLocale[locale],
      containedInPlace: {
        "@type": "Country",
        name: "Ukraine",
      },
    },
    // Reference to the vehicle being rented
    itemOffered: {
      "@type": "Vehicle",
      name: carName,
      brand: { "@type": "Brand", name: car.brand },
      model: car.model,
      vehicleModelDate: car.yearOfManufacture?.toString(),
    },
  };

  // Offer with pricing
  if (minPrice !== null) {
    schema.offers = {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: minPrice.toString(),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: minPrice.toString(),
        priceCurrency: "EUR",
        unitText: "DAY",
      },
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
      validFrom: new Date().toISOString().split("T")[0],
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };
  }

  return schema;
}
