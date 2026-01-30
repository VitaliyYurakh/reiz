import { getTranslations } from "next-intl/server";
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

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  return getStaticPageMetadata("contactsPage", params.locale);
}

export default async function ContactsPage() {
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
    <div
      className="contacts-section__inner"
      data-aos="fade-left"
      data-aos-duration="900"
      data-aos-delay="600"
    >
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
        <div className="contacts-section__map">
          <UiImage
            width={673}
            height={539}
            src="/img/map.png"
            alt="Map of Ukraine with REIZ offices marked in Kyiv and Lviv"
          />
        </div>

        <div className="contacts-section__wrapp">
          <h2 className="pretitle">{officesTitle}</h2>

          <div className="contacts-section__editors">
            <div className="editor">
              <p>{offices?.[0]?.city}</p>
              <a
                href={mapLink(offices?.[0]?.address)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="sprite">
                  <Icon id={"geo2"} width={17} height={17} />
                </i>
                {offices?.[0]?.address}
              </a>
              <div className="row">
                <a href="tel:+380635471186">
                  <i className="sprite">
                    <Icon id={"tel"} width={17} height={17} />
                  </i>
                  {offices?.[0]?.phone}
                </a>
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <UiImage
                    width={26}
                    height={26}
                    src="/img/icons/whatsapp.svg"
                    alt="Contact via WhatsApp"
                  />
                </a>
                <a
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <UiImage
                    width={26}
                    height={26}
                    src="/img/icons/Telegram_logo.svg"
                    alt="Contact via Telegram"
                  />
                </a>
              </div>
              <span className="contacts-section__meta">
                <i className="sprite">
                  <Icon id={"clock2"} width={17} height={17} />
                </i>
                {offices?.[0]?.hours}
              </span>
              <a href="mailto:info@reiz.com.ua">
                <i className="sprite">
                  <Icon id={"mail"} width={17} height={17} />
                </i>
                {offices?.[0]?.email}
              </a>
            </div>

            <div className="editor">
              <p>{offices?.[1]?.city}</p>
              <a
                href={mapLink(offices?.[1]?.address)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="sprite">
                  <Icon id={"geo2"} width={17} height={17} />
                </i>
                {offices?.[1]?.address}
              </a>
              <div className="row">
                <a href="tel:+380635471186">
                  <i className="sprite">
                    <Icon id={"tel"} width={17} height={17} />
                  </i>
                  {offices?.[1]?.phone}
                </a>
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <UiImage
                    width={26}
                    height={26}
                    src="/img/icons/whatsapp.svg"
                    alt="WhatsApp — message us"
                  />
                </a>
                <a
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <UiImage
                    width={26}
                    height={26}
                    src="/img/icons/Telegram_logo.svg"
                    alt="Telegram — message us"
                  />
                </a>
              </div>
              <span className="contacts-section__meta">
                <i className="sprite">
                  <Icon id={"clock2"} width={17} height={17} />
                </i>
                {offices?.[1]?.hours}
              </span>
              <a href="mailto:info@reiz.com.ua">
                <i className="sprite">
                  <Icon id={"mail"} width={17} height={17} />
                </i>
                {offices?.[1]?.email}
              </a>
            </div>
          </div>
        </div>

        <div className="contacts-section__wrapp">
          <h2 className="pretitle">{t("form.title")}</h2>

          <ContactsForm />
        </div>
      </div>
    </div>
  );
}
