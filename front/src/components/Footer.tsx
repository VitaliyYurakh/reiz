import { useTranslations } from "next-intl";
import UiImage from "@/components/ui/UiImage";
import { Link } from "@/i18n/request";
import { SOCIAL_LINKS } from "@/config/social";
import FooterAccordion from "@/components/FooterAccordion";

type FooterProps = {
  addressText?: string;
  descriptionText?: string;
};

export default function Footer({ addressText, descriptionText }: FooterProps) {
  const t = useTranslations("footer");
  const address = addressText ?? t("address.text");
  const description = descriptionText ?? t("description");
  const addressLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const facebookLink = SOCIAL_LINKS.facebook;
  const youtubeLink = SOCIAL_LINKS.youtube;
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__box">
          <div className="footer__top">
            <div className="footer__col">
              <Link href="/" className="logo">
                REIZ
              </Link>
              <span className="footer__name">{t("tagline")}</span>
              <p>{description}</p>

              <nav className="footer-nav">
                <ul className="footer-nav__list">
                  <li className="footer-nav__item">
                    <Link href="/">{t("nav.home")}</Link>
                  </li>
                  <li className="footer-nav__item">
                    <Link href="/#catalog">{t("nav.cars")}</Link>
                  </li>
                  <li className="footer-nav__item">
                    <Link href="/business">{t("nav.business")}</Link>
                  </li>
                  <li className="footer-nav__item">
                    <Link href="/invest">{t("nav.invest")}</Link>
                  </li>
                  <li className="footer-nav__item">
                    <Link href="/blog">{t("nav.blog")}</Link>
                  </li>
                  <li className="footer-nav__item">
                    <Link href="/about">{t("nav.about")}</Link>
                  </li>
                  <li className="footer-nav__item">
                    <Link href="/contacts">{t("nav.contacts")}</Link>
                  </li>
                  <li className="footer-nav__item">
                    <Link href="/insurance">{t("nav.insurance")}</Link>
                  </li>
                  <li className="footer-nav__item">
                    <Link href="/faq">{t("nav.faq")}</Link>
                  </li>
                  <li className="footer-nav__item">
                    <Link href="/certificate">{t("nav.certificate")}</Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="footer__wrapp">
              <div
                className="footer__info"
                data-title={t("contacts.phone_title")}
              >
                <div className="footer__social">
                  <a href="tel:+380635471186" className="footer__phone-btn"> +380 63 547 11 86 </a>
                  <a
                    href={SOCIAL_LINKS.whatsapp}
                    aria-label="REIZ WhatsApp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="default">
                      <UiImage
                        width={26}
                        height={26}
                        src="/img/icons/whatsapp.svg"
                        alt="WhatsApp"
                      />
                    </span>
                    <span className="hover">
                      <UiImage
                        width={26}
                        height={26}
                        src="/img/icons/whatsapp-hover.svg"
                        alt="WhatsApp"
                      />
                    </span>
                  </a>

                  <a
                    href={SOCIAL_LINKS.telegram}
                    aria-label="REIZ Telegram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="default">
                      <UiImage
                        width={26}
                        height={26}
                        src="/img/icons/telegram.svg"
                        alt="Telegram"
                      />
                    </span>
                    <span className="hover">
                      <UiImage
                        width={26}
                        height={26}
                        src="/img/icons/telegram-hover.svg"
                        alt="Telegram"
                      />
                    </span>
                  </a>

                  <a
                    href={SOCIAL_LINKS.viber}
                    aria-label="REIZ Viber"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="default">
                      <UiImage
                        width={26}
                        height={26}
                        src="/img/icons/viber-color.svg"
                        alt="Viber"
                      />
                    </span>
                    <span className="hover">
                      <UiImage
                        width={26}
                        height={26}
                        src="/img/icons/viber-hover.svg"
                        alt="Viber"
                      />
                    </span>
                  </a>
                </div>
                <p>{t("contacts.working_hours")}</p>
              </div>

              <a
                href={addressLink}
                className="footer__adress"
                data-title={t("address.title")}
                aria-label={t("address.title")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{address}</span>
              </a>

              <span className="footer__rate">
                <UiImage
                  width={130}
                  height={58}
                  src="/img/icons/google.svg"
                  alt="REIZ Rental Cars rating"
                />
              </span>
            </div>
          </div>

          {/* Mobile accordion navigation — visible only on mobile via CSS */}
          <div className="footer__mobile-nav">
            <FooterAccordion title={t("accordion.rental")}>
              <ul>
                <li>
                  <Link href="/#catalog">{t("nav.cars")}</Link>
                </li>
                <li>
                  <Link href="/business">{t("nav.business")}</Link>
                </li>
                <li>
                  <Link href="/invest">{t("nav.invest")}</Link>
                </li>
                <li>
                  <Link href="/insurance">{t("nav.insurance")}</Link>
                </li>
                <li>
                  <Link href="/certificate">{t("nav.certificate")}</Link>
                </li>
              </ul>
            </FooterAccordion>
            <FooterAccordion title={t("accordion.company")}>
              <ul>
                <li>
                  <Link href="/about">{t("nav.about")}</Link>
                </li>
                <li>
                  <Link href="/blog">{t("nav.blog")}</Link>
                </li>
                <li>
                  <Link href="/faq">{t("nav.faq")}</Link>
                </li>
                <li>
                  <Link href="/contacts">{t("nav.contacts")}</Link>
                </li>
              </ul>
            </FooterAccordion>
          </div>

          <div className="footer__middle">
            <ul className="footer__list" data-title={t("payments.title")}>
              <li className="footer__item">
                <span className="footer__link ms">
                  <i className="sprite" aria-hidden="true">
                    <svg width="42" height="26">
                      <use href="/img/sprite/sprite.svg?ver=15#mastercard"></use>
                    </svg>
                  </i>
                  <span>MASTERCARD</span>
                </span>
              </li>
              <li className="footer__item">
                <span className="footer__link visa">
                  <i className="sprite" aria-hidden="true">
                    <svg width="60" height="19">
                      <use href="/img/sprite/sprite.svg?ver=14#visa"></use>
                    </svg>
                  </i>
                  <span>VISA</span>
                </span>
              </li>
              <li className="footer__item">
                <span className="footer__link pay">
                  <i className="sprite" aria-hidden="true">
                    <svg width="70" height="22">
                      <use href="/img/sprite/sprite.svg?ver=14#payment"></use>
                    </svg>
                  </i>
                  <span>UNIONPAY</span>
                </span>
              </li>
            </ul>
            <ul className="footer__list mode" data-title={t("social.title")}>
              <li className="footer__item">
                {facebookLink ? (
                  <a
                    href={facebookLink}
                    className="footer__link"
                    aria-label="REIZ Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="sprite" aria-hidden="true">
                      <svg
                        width="28"
                        height="28"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use
                          href="/img/sprite/sprite.svg?ver=14#facebook"
                          xlinkHref="/img/sprite/sprite.svg?ver=14#facebook"
                        />
                      </svg>
                    </i>
                    <span>FACEBOOK</span>
                  </a>
                ) : (
                  <span className="footer__link">
                    <i className="sprite" aria-hidden="true">
                      <svg
                        width="28"
                        height="28"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use
                          href="/img/sprite/sprite.svg?ver=14#facebook"
                          xlinkHref="/img/sprite/sprite.svg?ver=14#facebook"
                        />
                      </svg>
                    </i>
                    <span>FACEBOOK</span>
                  </span>
                )}
              </li>

              <li className="footer__item">
                <a
                  href={SOCIAL_LINKS.instagram}
                  className="footer__link pink"
                  aria-label="REIZ Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="sprite" aria-hidden="true">
                    <svg
                      width="28"
                      height="28"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use
                        href="/img/sprite/sprite.svg?ver=14#instagram"
                        xlinkHref="/img/sprite/sprite.svg?ver=14#instagram"
                      />
                    </svg>
                  </i>
                  <span>INSTAGRAM</span>
                </a>
              </li>

              <li className="footer__item">
                {youtubeLink ? (
                  <a
                    href={youtubeLink}
                    className="footer__link red"
                    aria-label="REIZ YouTube"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="sprite" aria-hidden="true">
                      <svg
                        width="28"
                        height="28"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use
                          href="/img/sprite/sprite.svg?ver=14#youtube"
                          xlinkHref="/img/sprite/sprite.svg?ver=14#youtube"
                        />
                      </svg>
                    </i>
                    <span>YOUTUBE</span>
                  </a>
                ) : (
                  <span className="footer__link red">
                    <i className="sprite" aria-hidden="true">
                      <svg
                        width="28"
                        height="28"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use
                          href="/img/sprite/sprite.svg?ver=14#youtube"
                          xlinkHref="/img/sprite/sprite.svg?ver=14#youtube"
                        />
                      </svg>
                    </i>
                    <span>YOUTUBE</span>
                  </span>
                )}
              </li>
            </ul>
          </div>

          <div className="footer__bottom">
            <span>{t("bottom.copyright")}</span>
            <Link href="/terms" aria-label={t("bottom.privacy")}>
              {t("bottom.privacy")}
            </Link>
            <span>{t("bottom.developed_by")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
