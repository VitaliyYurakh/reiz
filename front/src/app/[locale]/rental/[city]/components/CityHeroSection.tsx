import UiImage from "@/components/ui/UiImage";
import OrderForm from "@/app/[locale]/components/OrderForm";
import SidebarNav from "@/app/[locale]/(site)/components/SidebarNav";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/request";
import LocationMapLink from "@/app/[locale]/components/LocationMapLink";
import HeroBookButton from "@/app/[locale]/components/HeroBookButton";
import { getCityPickupLocations } from "@/data/cities";
import type { CityConfig, CityLocalizedData } from "@/data/cities";
import type { Locale } from "@/i18n/request";

type Props = {
  city: CityConfig;
  cityData: CityLocalizedData;
  locale: Locale;
};

export default async function CityHeroSection({ city, cityData, locale }: Props) {
  const t = await getTranslations("homePage.hero");
  const pickupLocations = getCityPickupLocations(city.slug, locale);
  const defaultPickupLocation =
    (city.slug === "bukovel"
      ? pickupLocations.find((loc) => loc.type === "center")?.name
      : undefined) ??
    pickupLocations.find((loc) => loc.type === "airport")?.name ??
    pickupLocations[0]?.name ??
    city.localized[locale].name;

  return (
    <section className="hero-section">
      <div className="hero-section__slider">
        <div className="swiper-container">
          <ul className="swiper-wrapper">
            <li className="swiper-slide">
              {/* Mobile hero image - LCP critical */}
              <UiImage
                src="/img/mercedesmobile.webp"
                alt={`${cityData.h1} — Mercedes CLE | REIZ Rental Cars`}
                width={575}
                height={720}
                hero
                quality={70}
                sizes="100vw"
                className="hero-image-mobile"
                fetchPriority="high"
              />
              {/* Desktop hero image - LCP critical */}
              <UiImage
                src="/img/car/mercedesclsbukovel (2).webp"
                alt={`${cityData.h1} — Mercedes CLE | REIZ Rental Cars`}
                width={2500}
                height={1685}
                hero
                quality={75}
                sizes="100vw"
                className="hero-image-desktop"
                fetchPriority="high"
              />
            </li>
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="hero-section__box">
          <SidebarNav />

          <div className="hero-section__inner">
            <div className="hero-section__top">
              {/* Динамічний pretitle для міста */}
              <p className="pretitle">{cityData.sectionWelcome}</p>
              <span className="hero-section__date">
                <i className="sprite">
                  <svg width="24" height="24">
                    <use href="/img/sprite/sprite.svg#time" />
                  </svg>
                </i>
                {t("availability")}
              </span>
            </div>

            <div className="editor">
              {/* Динамічний H1 для міста */}
              <h1 className="title">{cityData.h1}</h1>
              {/* Динамічний підзаголовок для міста */}
              <p>{cityData.subtitle}</p>
              <HeroBookButton className="hero-book-btn">
                {t("book_button")}
              </HeroBookButton>
            </div>

            <div
              className="hero-section__links"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="1100"
            >
              <LocationMapLink className="adress-link address-link">
                <i className="sprite mode">
                  <svg width="20" height="26">
                    <use href="/img/sprite/sprite.svg#geo" />
                  </svg>
                </i>
                <span>{t("address_link")}</span>
              </LocationMapLink>

              <a href="#catalog" className="down-btn">
                <i className="sprite">
                  <svg width="16" height="22">
                    <use href="/img/sprite/sprite.svg#arrow" />
                  </svg>
                </i>
                {t("down_button")}
              </a>
            </div>

            <div className="hero-section__content">
              <p className="h2">{t("secondary_title")}</p>
              <Link
                href="/invest"
                className="main-button main-button--transparent"
              >
                {t("secondary_button")}
              </Link>
            </div>

            <OrderForm defaultPickupLocation={defaultPickupLocation} />
          </div>
        </div>
      </div>
    </section>
  );
}
