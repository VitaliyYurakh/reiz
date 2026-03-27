import { getTranslations, getLocale, setRequestLocale } from "next-intl/server";
import Icon from "@/components/Icon";
import { SOCIAL_LINKS } from "@/config/social";
import { type Locale, locales } from "@/i18n/request";
import type { Metadata } from "next";
import { getDefaultPath } from "@/lib/seo";
import { getStaticPageMetadata } from "@/lib/seo-sync";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import ContactsForm from "@/app/[locale]/(site)/contacts/components/ContactsForm";


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

  const offices = t.raw("officesSection.offices") as Array<{
    city: string;
    address: string;
    phone: string;
    hours: string;
    email: string;
  }>;

  const firstOffice = offices[0];

  return (
    <div className="contacts-section__inner">
      <Breadcrumbs
        mode="JsonLd"
        items={[
          { href: getDefaultPath("home"), name: t("breadcrumbs.home") },
          { href: getDefaultPath("contacts"), name: t("breadcrumbs.current") },
        ]}
      />

      {/* Hero zone: same height as sidebar, cards align to bottom */}
      <div className="contacts-hero-zone">
        <div className="contacts-hero-content">
          <div className="cert__breadcrumb">
            <span className="cert__marker" />
            <span className="cert__breadcrumb-text">{t("hero.pretitle")}</span>
          </div>

          <div className="blog-hero">
            <h1 className="blog-hero__title">{t("hero.title")} <span>{t("hero.titleAccent")}</span></h1>
          </div>

        </div>

        {/* Info cards */}
        <div className="contacts-cards">
          <a href={`mailto:${firstOffice.email}`} className="contacts-cards__item">
            <div className="contacts-cards__icon">
              <Icon id="email-fill" />
            </div>
            <h3 className="contacts-cards__title">{t("cards.email")}</h3>
            <p className="contacts-cards__text">
              {firstOffice.email}
            </p>
            <div className="contacts-cards__watermark">
              <Icon id="email-fill" />
            </div>
          </a>

          <div className="contacts-cards__item">
            <div className="contacts-cards__icon">
              <Icon id="location-fill" />
            </div>
            <h3 className="contacts-cards__title">{t("cards.address")}</h3>
            <p className="contacts-cards__text">{firstOffice.address}</p>
            <div className="contacts-cards__watermark">
              <Icon id="location-fill" />
            </div>
          </div>

          <div className="contacts-cards__item">
            <div className="contacts-cards__icon">
              <Icon id="clock-alt" />
            </div>
            <h3 className="contacts-cards__title">{t("cards.hours")}</h3>
            <p className="contacts-cards__text">{firstOffice.hours}</p>
            <div className="contacts-cards__watermark">
              <Icon id="clock-alt" />
            </div>
          </div>

          <a href={`tel:${firstOffice.phone.replace(/\s/g, "")}`} className="contacts-cards__item contacts-cards__item--accent">
            <div className="contacts-cards__icon">
              <Icon id="phone-fill" />
            </div>
            <h3 className="contacts-cards__title">{t("cards.phone")}</h3>
            <p className="contacts-cards__text">
              {firstOffice.phone}
            </p>
            <div className="contacts-cards__watermark">
              <Icon id="phone-fill" />
            </div>
          </a>
        </div>
      </div>{/* end contacts-hero-zone */}

      {/* Form section */}
      <div className="contacts-bottom">
        <div className="contacts-bottom__form">
          <h2 className="contacts-bottom__heading">{t("form.title")}</h2>
          <ContactsForm />
        </div>
      </div>
    </div>
  );
}
