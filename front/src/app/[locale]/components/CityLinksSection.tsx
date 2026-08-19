import { cities } from "@/data/cities";
import { Link } from "@/i18n/request";
import type { Locale } from "@/i18n/request";

type Props = {
  locale: Locale;
  currentCity?: string;
};

const copy: Record<Locale, { title: string; navLabel: string }> = {
  uk: {
    title: "Оренда авто в містах України",
    navLabel: "Міста для оренди авто",
  },
  ru: {
    title: "Аренда авто в городах Украины",
    navLabel: "Города для аренды авто",
  },
  en: {
    title: "Car rental in cities across Ukraine",
    navLabel: "Car rental cities",
  },
  pl: {
    title: "Wynajem samochodów w miastach Ukrainy",
    navLabel: "Miasta wynajmu samochodów",
  },
  ro: {
    title: "Închirieri auto în orașele Ucrainei",
    navLabel: "Orașe pentru închirieri auto",
  },
};

export default function CityLinksSection({ locale, currentCity }: Props) {
  const { title, navLabel } = copy[locale];
  const linkedCities = cities.filter((city) => city.slug !== currentCity);

  return (
    <section className="editor-section city-links-section">
      <div className="container">
        <div className="editor-section__box">
          <h2 className="h2">{title}</h2>
          <nav aria-label={navLabel} className="article__locations">
            {linkedCities.map((city) => (
              <Link
                key={city.slug}
                href={city.slug === "lviv" ? "/" : `/rental/${city.slug}`}
                className="article__location-btn"
              >
                {city.localized[locale].name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
