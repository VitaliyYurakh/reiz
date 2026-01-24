import { useTranslations } from "next-intl";
import UiImage from "@/components/ui/UiImage";
import { Link } from "@/i18n/request";

type FooterProps = {
  addressText?: string;
  descriptionText?: string;
};

export default function Footer({ addressText, descriptionText }: FooterProps) {
  const t = useTranslations("footer");
  const address = addressText ?? t("address.text");
  const description = descriptionText ?? t("description");
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
                </ul>
              </nav>
            </div>

            <div className="footer__wrapp">
              <div
                className="footer__info"
                data-title={t("contacts.phone_title")}
              >
                <div className="footer__social">
                  <a href="tel:+380635471186"> +380 63 547 11 86 </a>
                  <a href="#" aria-label="REIZ WhatsApp">
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
                        src="/img/icons/whatsapp_hover.svg"
                        alt="WhatsApp"
                      />
                    </span>
                  </a>

                  <a href="#" aria-label="REIZ Telegram">
                    <span className="default">
                      <UiImage
                        width={26}
                        height={26}
                        src="/img/icons/Telegram_logo.svg"
                        alt="Telegram"
                      />
                    </span>
                    <span className="hover">
                      <UiImage
                        width={26}
                        height={26}
                        src="/img/icons/tg_hover.svg"
                        alt="Telegram"
                      />
                    </span>
                  </a>
                </div>
                <p>{t("contacts.working_hours")}</p>
              </div>

              <a
                href="#"
                className="footer__adress"
                data-title={t("address.title")}
                aria-label={t("address.title")}
              >
                <span>{address}</span>
              </a>

              <span className="footer__rate">
                <UiImage
                  width={164}
                  height={59}
                  src="/img/rate-rental.png"
                  alt="REIZ Rental Cars rating"
                />
              </span>
            </div>
          </div>

          <div className="footer__middle">
            <ul className="footer__list" data-title={t("payments.title")}>
              <li className="footer__item">
                <span className="footer__link ms">
                  <i className="sprite" aria-hidden="true">
                    <svg width="42" height="26">
                      <use href="/img/sprite/sprite.svg?ver=15#ms"></use>
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
                      <use href="/img/sprite/sprite.svg?ver=14#pay"></use>
                    </svg>
                  </i>
                  <span>UNIONPAY</span>
                </span>
              </li>
            </ul>
            <ul className="footer__list mode" data-title={t("social.title")}>
              <li className="footer__item">
                <a href="#" className="footer__link" aria-label="REIZ Facebook">
                  <i className="sprite" aria-hidden="true">
                    <svg
                      width="28"
                      height="28"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use
                        href="/img/sprite/sprite.svg?ver=14#fb"
                        xlinkHref="/img/sprite/sprite.svg?ver=14#fb"
                      />
                    </svg>
                  </i>
                  <span>FACEBOOK</span>
                </a>
              </li>

              <li className="footer__item">
                <a href="https://www.instagram.com/reiz.rental?igsh=MXY4bmMyMjl0YWNtYg==" className="footer__link pink" aria-label="REIZ Instagram" target="_blank" rel="noopener noreferrer">
                  <i className="sprite" aria-hidden="true">
                    <svg
                      width="28"
                      height="28"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use
                        href="/img/sprite/sprite.svg?ver=14#inst"
                        xlinkHref="/img/sprite/sprite.svg?ver=14#inst"
                      />
                    </svg>
                  </i>
                  <span>INSTAGRAM</span>
                </a>
              </li>

              <li className="footer__item">
                <a href="#" className="footer__link red" aria-label="REIZ YouTube">
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
              </li>
            </ul>
          </div>

          <div className="footer__bottom">
            <span>{t("bottom.copyright")}</span>
            <a href="#" aria-label={t("bottom.privacy")}>{t("bottom.privacy")}</a>
            <span>{t("bottom.developed_by")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
