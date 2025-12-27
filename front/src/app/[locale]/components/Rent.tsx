import UiImage from "@/components/ui/UiImage";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/request";

export default function Rent() {
  const t = useTranslations("homePage");
  return (
    <>
      <section className="rent-section">
        <div className="container">
          <div className="rent-section__box">
            <ul className="rent-list">
              <li className="rent-list__item">
                <Link href="/invest" className="rent-card">
                  <div className="rent-card__image">
                    <UiImage
                      width={670}
                      height={350}
                      src="/img/invest-car.webp"
                      alt={t("rent.card1_image_alt")}
                      sizePreset="card"
                    />
                  </div>
                  <span className="rent-card__title">
                    {t("rent.card1_title")}
                  </span>
                  <ul className="rent-card__list">
                    <li className="rent-card__item">
                      <i className="sprite">
                        <svg width="45" height="43">
                          <use href="/img/sprite/sprite.svg#axes"></use>
                        </svg>
                      </i>
                      {/** biome-ignore lint/security/noDangerouslySetInnerHtml: i18n */}
                      <p
                        dangerouslySetInnerHTML={{
                          __html: t("rent.card1_point1"),
                        }}
                      />
                    </li>
                    <li className="rent-card__item">
                      <i className="sprite mode">
                        <svg width="53" height="53">
                          <use href="/img/sprite/sprite.svg#money"></use>
                        </svg>
                      </i>
                      {/** biome-ignore lint/security/noDangerouslySetInnerHtml: i18n */}
                      <p
                        dangerouslySetInnerHTML={{
                          __html: t("rent.card1_point2"),
                        }}
                      />
                    </li>
                    <li className="rent-card__item">
                      <i className="sprite">
                        <svg width="41" height="41">
                          <use href="/img/sprite/sprite.svg#icon"></use>
                        </svg>
                      </i>
                      {/** biome-ignore lint/security/noDangerouslySetInnerHtml: i18n */}
                      <p
                        dangerouslySetInnerHTML={{
                          __html: t("rent.card1_point3"),
                        }}
                      />
                    </li>
                  </ul>
                  <div className="main-button main-button--transparent">
                    {t("rent.card1_button")}
                  </div>
                </Link>
              </li>

              <li className="rent-list__item">
                <Link href="/terms" className="rent-card">
                  <div className="rent-card__image">
                    <UiImage
                      width={670}
                      height={350}
                      src="/img/carterms.png"
                      alt={t("rent.card1_image_alt")}
                      sizePreset="card"
                    />
                  </div>
                  <span className="rent-card__title">
                    {t("rent.card2_title")}
                  </span>
                  <div className="main-button main-button--transparent">
                    {t("rent.card2_button")}
                  </div>
                </Link>
              </li>

              <li className="rent-list__item">
                <Link href="/faq" className="rent-card">
                  <div className="rent-card__image">
                    <UiImage
                      width={670}
                      height={350}
                      src="/img/faq.png"
                      alt={t("rent.card3_image_alt")}
                      sizePreset="card"
                    />
                  </div>
                  <span className="rent-card__title">
                    {t("rent.card3_title")}
                  </span>
                  <div className="main-button main-button--transparent">
                    {t("rent.card3_button")}
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="advantages-section advantages-section--reviews">
        <div className="container">
          <div className="advantages-section__content">
            <div className="advantages-section__inner">
              <span className="advantages-section__title">
                {t("reviews_block.title")}
              </span>
              <p>{t("reviews_block.subtitle")}</p>
            </div>

            <div className="advantages-section__links">
              <a
                className="advantages-section__review"
                href="https://www.trustpilot.com/review/reiz.com.ua"
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label={t("reviews_block.trustpilot_aria")}
              >
                <span>{t("reviews_block.trustpilot_label")}</span>
                <UiImage
                  width={184}
                  height={68}
                  src="/img/trip.png"
                  alt={t("reviews_block.trustpilot_aria")}
                />
              </a>

              <a
                className="advantages-section__review"
                href="https://www.google.com/search?q=REIZ+Rental+Cars+Lviv+reviews"
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label={t("reviews_block.google_aria")}
              >
                <span>{t("reviews_block.google_label")}</span>
                <UiImage
                  width={195}
                  height={70}
                  src="/img/google.png"
                  alt={t("reviews_block.google_aria")}
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
