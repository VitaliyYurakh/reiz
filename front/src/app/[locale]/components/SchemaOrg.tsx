const companyJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRental",
  "@id": "https://reiz.com.ua/#company",
  name: "REIZ Rental Cars",
  url: "https://reiz.com.ua/",
  logo: "https://reiz.com.ua/ico/Reiz.png",
  image: "https://reiz.com.ua/img/reiz.webp",
  description:
    "REIZ — аренда авто во Львове: современные автомобили, подача по адресу и поддержка 24/7.",
  telephone: "+380635471186",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Львов",
    addressCountry: "UA",
  },
  areaServed: [
    { "@type": "City", name: "Львов" },
    { "@type": "AdministrativeArea", name: "Львовская область" },
    { "@type": "Country", name: "Украина" },
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
      opens: "08:00",
      closes: "22:00",
    },
  ],
  sameAs: ["https://www.instagram.com/reiz.rental"],
};

export default function SchemaOrg() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: true
        dangerouslySetInnerHTML={{ __html: JSON.stringify(companyJsonLd) }}
      />
    </>
  );
}
