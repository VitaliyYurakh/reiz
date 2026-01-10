import UiImage from "@/components/ui/UiImage";
import OrderForm from "./OrderForm";
import SidebarNav from "@/app/[locale]/(site)/components/SidebarNav";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/request";
import LocationMapLink from "./LocationMapLink";

export default async function HeroSection() {
  const t = await getTranslations("homePage.hero");

  return (
    <section className="hero-section">
      <div className="hero-section__slider">
        <div className="swiper-container">
          <ul className="swiper-wrapper">
            <li className="swiper-slide">
              {/* Mobile hero image - LCP critical */}
              <UiImage
                src="/img/mercedesmobile.webp"
                alt="Аренда авто во Львове — Mercedes CLE | REIZ Rental Cars"
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
                src="/img/car/mercedescle2.webp"
                alt="Аренда авто во Львове — Mercedes CLE | REIZ Rental Cars"
                width={1440}
                height={902}
                hero
                quality={95}
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
              <h3 className="pretitle">{t("pretitle")}</h3>
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
              <h1 className="title">{t("title")}</h1>
              <p>{t("intro")}</p>
              <ul>
                <li>
                  <p>{t("bullet1")}</p>
                </li>
                <li>
                  <p>{t("bullet2")}</p>
                </li>
                <li>
                  <p>{t("bullet3")}</p>
                </li>
                <li>
                  <p>{t("bullet4")}</p>
                </li>
                <li>
                  <p>{t("bullet5")}</p>
                </li>
              </ul>
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
              <h2 className="h2">{t("secondary_title")}</h2>
              <Link
                href="/invest"
                className="main-button main-button--transparent"
              >
                {t("secondary_button")}
              </Link>
            </div>

            <OrderForm />
          </div>
        </div>
      </div>
    </section>
  );
}
