import type { Car } from "@/types/cars";
import type { Locale } from "@/i18n/request";

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

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Car Rental",
    name: serviceNameByLocale[locale],
    description: descriptionByLocale[locale],
    url: canonicalUrl,
    provider: {
      "@type": "Organization",
      name: "REIZ RENTAL CARS",
      url: BASE,
      logo: `${BASE}/img/logo.svg`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "вул. Любінська, 168",
        addressLocality: "Львів",
        addressRegion: "Львівська область",
        postalCode: "79000",
        addressCountry: "UA",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+380635471186",
        contactType: "customer service",
        availableLanguage: ["Ukrainian", "Russian", "English", "Polish"],
      },
    },
    areaServed: {
      "@type": "City",
      name: "Lviv",
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
      priceCurrency: "USD",
      price: minPrice.toString(),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: minPrice.toString(),
        priceCurrency: "USD",
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
