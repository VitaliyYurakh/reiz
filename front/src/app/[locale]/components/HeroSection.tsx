import { getTranslations } from "next-intl/server";
import SidebarNav from "@/app/[locale]/(site)/components/SidebarNav";
import UiImage from "@/components/ui/UiImage";
import WhatsAppUnavailable from "@/components/WhatsAppUnavailable";
import { SOCIAL_LINKS } from "@/config/social";
import { Link } from "@/i18n/request";
import UtilityBar from "@/components/UtilityBar";
import HeroBookButton from "./HeroBookButton";
import LocationMapLink from "./LocationMapLink";
import OrderForm from "./OrderForm";
import ScrollToCatalogButton from "./ScrollToCatalogButton";

export default async function HeroSection() {
  const t = await getTranslations("homePage.hero");
  const footerT = await getTranslations("footer");
  const heroImageAlt = `${t("title")} | REIZ`;

  return (
    <section className="hero-section">
      <div className="hero-section__slider">
        <div className="swiper-container">
          <ul className="swiper-wrapper">
            <li className="swiper-slide">
              {/* Mobile hero image - LCP critical */}
              <UiImage
                src="/img/cars/20260410-audi%20q8.webp"
                alt={heroImageAlt}
                width={1440}
                height={1440}
                hero
                quality={75}
                sizes="100vw"
                className="hero-image-mobile"
                fetchPriority="high"
                style={{
                  objectPosition: "8% center",
                  height: "100%",
                  transform: "translateY(-6%) scale(1.1)",
                  transformOrigin: "center center",
                }}
              />
              {/* Desktop hero image - LCP critical */}
              <UiImage
                src="/img/hero/reiz-4-1-desktop.webp"
                alt={heroImageAlt}
                width={2400}
                height={1578}
                hero
                quality={100}
                sizes="100vw"
                className="hero-image-desktop"
                fetchPriority="high"
              />
              <div className="hero-section__mobile-overlay" />
            </li>
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="hero-section__box">
          <SidebarNav />

          <div className="hero-section__inner">
            <UtilityBar />
            <div className="editor">
              <h1 className="title">{t("title")}</h1>
              <p className="hero-section__intro">{t("intro")}</p>
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

              <ScrollToCatalogButton className="down-btn">
                <i className="sprite">
                  <svg width="16" height="22">
                    <use href="/img/sprite/sprite.svg#arrow" />
                  </svg>
                </i>
                {t("down_button")}
              </ScrollToCatalogButton>
            </div>

            <div className="hero-section__content">
              <h2 className="h2 hero-section__mobile-title">
                <Link
                  href="/cars/24-hyundai-elantra-2025"
                  className="hero-section__mobile-title-link"
                >
                  {t("mobile_title")}
                </Link>
              </h2>
              <div className="contacts-hero-cta">
                <WhatsAppUnavailable
                  message={footerT("whatsapp_unavailable")}
                  className="contacts-hero-cta__btn contacts-hero-cta__btn--outline"
                  hideIcon
                >
                  <UiImage
                    width={28}
                    height={28}
                    src="/img/icons/whatsapp.svg"
                    alt=""
                    aria-hidden="true"
                  />
                  <span>WhatsApp</span>
                </WhatsAppUnavailable>

                <a
                  href={SOCIAL_LINKS.telegram}
                  className="contacts-hero-cta__btn contacts-hero-cta__btn--outline"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                >
                  <UiImage
                    width={28}
                    height={28}
                    src="/img/icons/telegram.svg"
                    alt=""
                    aria-hidden="true"
                  />
                  <span>Telegram</span>
                </a>
              </div>
            </div>

            <OrderForm />
          </div>
        </div>
      </div>
    </section>
  );
}
