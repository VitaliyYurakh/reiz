import { useTranslations } from "next-intl";
import UiImage from "@/components/ui/UiImage";
import { Link } from "@/i18n/request";
import CatalogLink from "@/components/CatalogLink";
import { SOCIAL_LINKS, PHONE_NUMBER, PHONE_DISPLAY } from "@/config/social";
import FooterAccordion from "@/components/FooterAccordion";
import FooterSubscribe from "@/components/FooterSubscribe";
import WhatsAppUnavailable from "@/components/WhatsAppUnavailable";

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
      {/* Contact cards bar — rounded container */}
      <div className="footer__contacts">
        <div className="container">
          <div className="footer__contacts-grid">
            <a href={`tel:${PHONE_NUMBER}`} className="footer__contact-card">
              <span className="footer__contact-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M14.05 6A5 5 0 0118 10m-3.95-8a9 9 0 018 7.94m0 7v3a2 2 0 01-2 2h-.19a19.79 19.79 0 01-8.63-3.07 19.52 19.52 0 01-6-6 19.82 19.82 0 01-3.11-8.69A2 2 0 013.93 2h3.18a2 2 0 012 1.72 13 13 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 13 13 0 002.81.7A2 2 0 0122 16.92z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="footer__contact-text">
                <span className="footer__contact-title">
                  {t("contact_cards.call")}
                </span>
                <span className="footer__contact-value">{PHONE_DISPLAY}</span>
              </span>
            </a>

            <a
              href={`mailto:${t("contact_cards.email")}`}
              className="footer__contact-card"
            >
              <span className="footer__contact-icon">
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path d="M22,8.32V18a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V8.69L4,9.78l7.52,4.1A1,1,0,0,0,12,14a1,1,0,0,0,.5-.14L20,9.49Z" fill="#fff"/>
                  <path d="M22,6h0L20,7.18l-8,4.67L4,7.5,2,6.4V6A2,2,0,0,1,4,4H20A2,2,0,0,1,22,6Z" fill="#fff"/>
                </svg>
              </span>
              <span className="footer__contact-text">
                <span className="footer__contact-title">
                  {t("contact_cards.write")}
                </span>
                <span className="footer__contact-value">
                  {t("contact_cards.email")}
                </span>
              </span>
            </a>

            <a
              href={addressLink}
              className="footer__contact-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="footer__contact-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0Z" stroke="#fff" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="#fff" strokeWidth="2"/>
                </svg>
              </span>
              <span className="footer__contact-text">
                <span className="footer__contact-title">
                  {t("address.title")}
                </span>
                <span className="footer__contact-value">{address}</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Main footer body */}
      <div className="footer__body">
        <div className="container">
          <div className="footer__main">
            {/* Brand column */}
            <div className="footer__brand">
              <Link href="/" className="footer__logo">
                REIZ
              </Link>
              <p className="footer__desc">{description}</p>
              <div className="footer__messengers">
                <WhatsAppUnavailable message={t("whatsapp_unavailable")} size={22} />
                <a
                  href={SOCIAL_LINKS.telegram}
                  aria-label="Telegram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <UiImage
                    width={22}
                    height={22}
                    src="/img/icons/telegram.svg"
                    alt="Telegram"
                  />
                </a>
                <a
                  href={SOCIAL_LINKS.viber}
                  aria-label="Viber"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <UiImage
                    width={22}
                    height={22}
                    src="/img/icons/viber-color.svg"
                    alt="Viber"
                  />
                </a>
              </div>
            </div>

            {/* Quick Links column */}
            <div className="footer__nav-col">
              <h3 className="footer__col-title">{t("links_title")}</h3>
              <ul className="footer__nav-list">
                <li>
                  <Link href="/about">{t("nav.about")}</Link>
                </li>
                <li>
                  <CatalogLink>{t("nav.cars")}</CatalogLink>
                </li>
                <li>
                  <Link href="/business">{t("nav.business")}</Link>
                </li>
                <li>
                  <Link href="/contacts">{t("nav.contacts")}</Link>
                </li>
                <li>
                  <Link href="/blog">{t("nav.blog")}</Link>
                </li>
              </ul>
            </div>

            {/* Subscribe column */}
            <div className="footer__subscribe">
              <h3 className="footer__col-title">{t("subscribe.title")}</h3>
              <p className="footer__subscribe-desc">
                {t("subscribe.description")}
              </p>
              <FooterSubscribe placeholder={t("subscribe.placeholder")} />
            </div>
          </div>

          {/* Mobile accordion navigation */}
          <div className="footer__mobile-nav">
            <FooterAccordion title={t("accordion.rental")}>
              <ul>
                <li>
                  <CatalogLink>{t("nav.cars")}</CatalogLink>
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

          {/* Payment & Social cards */}
          <div className="footer__middle">
            <ul className="footer__list" data-title={t("payments.title")}>
              <li className="footer__item">
                <span className="footer__link ms">
                  <i className="sprite" aria-hidden="true">
                    <svg width="42" height="26">
                      <use href="/img/sprite/sprite.svg?ver=15#mastercard" />
                    </svg>
                  </i>
                  <span>MASTERCARD</span>
                </span>
              </li>
              <li className="footer__item">
                <span className="footer__link visa">
                  <i className="sprite" aria-hidden="true">
                    <svg width="60" height="19">
                      <use href="/img/sprite/sprite.svg?ver=14#visa" />
                    </svg>
                  </i>
                  <span>VISA</span>
                </span>
              </li>
              <li className="footer__item">
                <span className="footer__link pay">
                  <i className="sprite" aria-hidden="true">
                    <svg width="70" height="22">
                      <use href="/img/sprite/sprite.svg?ver=14#payment" />
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
                      <svg width="28" height="28">
                        <use href="/img/sprite/sprite.svg?ver=14#facebook" />
                      </svg>
                    </i>
                    <span>FACEBOOK</span>
                  </a>
                ) : (
                  <span className="footer__link">
                    <i className="sprite" aria-hidden="true">
                      <svg width="28" height="28">
                        <use href="/img/sprite/sprite.svg?ver=14#facebook" />
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
                    <svg width="28" height="28">
                      <use href="/img/sprite/sprite.svg?ver=14#instagram" />
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
                      <svg width="28" height="28">
                        <use href="/img/sprite/sprite.svg?ver=14#youtube" />
                      </svg>
                    </i>
                    <span>YOUTUBE</span>
                  </a>
                ) : (
                  <span className="footer__link red">
                    <i className="sprite" aria-hidden="true">
                      <svg width="28" height="28">
                        <use href="/img/sprite/sprite.svg?ver=14#youtube" />
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
