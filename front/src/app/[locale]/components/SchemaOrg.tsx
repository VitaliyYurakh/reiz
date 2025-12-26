const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://reiz.com.ua/#website",
  name: "REIZ",
  alternateName: [
    "REIZ - Оренда авто Львів",
    "REIZ - Аренда авто Львов",
    "REIZ - Car Rental Lviv",
    "REIZ RENTAL CARS",
  ],
  url: "https://reiz.com.ua",
  description: "Сервіс оренди автомобілів у Львові — від економ до преміум класу, доставка 24/7",
  inLanguage: ["uk", "ru", "en"],
  publisher: {
    "@id": "https://reiz.com.ua/#company",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://reiz.com.ua/?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const companyJsonLd = {
  "@context": "https://schema.org",
  "@type": "CarRental",
  "@id": "https://reiz.com.ua/#company",
  name: "REIZ",
  alternateName: "REIZ RENTAL CARS",
  url: "https://reiz.com.ua",
  logo: "https://reiz.com.ua/img/og/home-square.webp",
  image: "https://reiz.com.ua/img/og/home.webp",
  description: "Оренда авто у Львові — сучасні автомобілі, подача по місту та в аеропорт, підтримка 24/7.",
  telephone: "+380635471186",
  email: "info@reiz.com.ua",
  priceRange: "800-3000 UAH",
  currenciesAccepted: "UAH, USD, EUR",
  paymentAccepted: "Cash, Credit Card, Bank Transfer",
  address: {
    "@type": "PostalAddress",
    streetAddress: "вул. Любінська, 168",
    addressLocality: "Львів",
    addressRegion: "Львівська область",
    postalCode: "79000",
    addressCountry: "UA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "49.8397",
    longitude: "24.0297",
  },
  areaServed: [
    { "@type": "City", name: "Львів" },
    { "@type": "AdministrativeArea", name: "Львівська область" },
    { "@type": "Country", name: "Україна" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "24:00",
    },
  ],
  sameAs: ["https://www.instagram.com/reiz.rental"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Автомобілі в оренду",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Car",
          name: "Автомобілі економ класу",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Car",
          name: "Автомобілі бізнес класу",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Car",
          name: "SUV та позашляховики",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Car",
          name: "Преміум автомобілі",
        },
      },
    ],
  },
};

export default function SchemaOrg() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: true
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: true
        dangerouslySetInnerHTML={{ __html: JSON.stringify(companyJsonLd) }}
      />
    </>
  );
}
