import { getTranslations, getLocale, setRequestLocale } from "next-intl/server";
import UiImage from "@/components/ui/UiImage";
import Icon from "@/components/Icon";
import { type Locale, locales } from "@/i18n/request";
import type { Metadata } from "next";
import { getDefaultPath } from "@/lib/seo";
import { getStaticPageMetadata } from "@/lib/seo-sync";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import ContactsForm from "@/app/[locale]/(site)/contacts/components/ContactsForm";
import { SOCIAL_LINKS } from "@/config/social";


export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata("contactsPage", locale);
}

export default async function ContactsPage() {
  const locale = await getLocale() as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("contactsPage");

  const officesTitle = t("officesSection.title");
  const offices = t.raw("officesSection.offices") as Array<{
    city: string;
    address: string;
    phone: string;
    hours: string;
    email: string;
  }>;

  const mapLink = (address: string | undefined) =>
    address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : "https://www.google.com/maps";

  return (
    <div className="contacts-section__inner">
      <Breadcrumbs
        mode="JsonLd"
        items={[
          { href: getDefaultPath("home"), name: t("breadcrumbs.home") },
          { href: getDefaultPath("contacts"), name: t("breadcrumbs.current") },
        ]}
      />

      <div className="cert__breadcrumb">
        <span className="cert__marker" />
        <span className="cert__breadcrumb-text">{t("hero.pretitle")}</span>
      </div>

      <div className="blog-hero">
        <h1 className="blog-hero__title">{t("hero.title")}</h1>
      </div>

      <div className="contacts-section__content">
        <div className="contacts-section__offices-block">
          <h2 className="pretitle">{officesTitle}</h2>

          <div className="contacts-section__offices-grid">
            {offices.map((office, index) => (
              <div className="contacts-section__card" key={index}>
                <p className="contacts-section__city">{office.city}</p>

                <div className="contacts-section__details">
                  <a
                    href={mapLink(office.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contacts-section__detail"
                  >
                    <i className="sprite">
                      <Icon id="geo-alt" width={17} height={17} />
                    </i>
                    {office.address}
                  </a>

                  <a href="tel:+380635471186" className="contacts-section__detail">
                    <i className="sprite">
                      <Icon id="tel" width={17} height={17} />
                    </i>
                    {office.phone}
                  </a>

                  <span className="contacts-section__detail">
                    <i className="sprite">
                      <Icon id="clock-alt" width={17} height={17} />
                    </i>
                    {office.hours}
                  </span>

                  <a href="mailto:info@reiz.com.ua" className="contacts-section__detail">
                    <i className="sprite">
                      <Icon id="mail" width={17} height={17} />
                    </i>
                    {office.email}
                  </a>
                </div>

                <div className="contacts-section__messengers">
                  <a
                    href={SOCIAL_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contacts-section__messenger"
                  >
                    <UiImage
                      width={26}
                      height={26}
                      src="/img/icons/whatsapp.svg"
                      alt="WhatsApp"
                    />
                    WhatsApp
                  </a>
                  <a
                    href={SOCIAL_LINKS.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contacts-section__messenger"
                  >
                    <UiImage
                      width={26}
                      height={26}
                      src="/img/icons/telegram.svg"
                      alt="Telegram"
                    />
                    Telegram
                  </a>
                  <a
                    href={SOCIAL_LINKS.viber}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contacts-section__messenger"
                  >
                    <UiImage
                      width={26}
                      height={26}
                      src="/img/icons/viber-color.svg"
                      alt="Viber"
                    />
                    Viber
                  </a>
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contacts-section__messenger"
                  >
                    <UiImage
                      width={26}
                      height={26}
                      src="/img/icons/instagram-color.svg"
                      alt="Instagram"
                    />
                    Instagram
                  </a>
                </div>

                <a
                  href={mapLink(office.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contacts-section__map-link"
                >
                  <Icon id="geo-alt" width={15} height={15} />
                  {t("officesSection.mapButton")}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="contacts-section__form-block">
          <h2 className="pretitle">{t("form.title")}</h2>
          <ContactsForm />
        </div>
      </div>
    </div>
  );
}
