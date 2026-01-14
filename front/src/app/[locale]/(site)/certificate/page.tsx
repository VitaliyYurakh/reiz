import type { Metadata } from "next";
import UiImage from "@/components/ui/UiImage";
import { getTranslations } from "next-intl/server";
import { type Locale, locales } from "@/i18n/request";
import { getDefaultPath } from "@/lib/seo";
import { getStaticPageMetadata } from "@/lib/seo-sync";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import CertificateForm from "./components/CertificateForm";
import CertificateFAQ from "./components/CertificateFAQ";
import CertificateThemeColorSetter from "./components/ThemeColorSetter";

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  return getStaticPageMetadata("certificatePage", params.locale);
}

export default async function CertificatePage() {
  const t = await getTranslations("certificatePage");

  return (
    <div className="cert-content">
      <CertificateThemeColorSetter />
      <form className="cert">
        {/* JSON-LD Breadcrumbs */}
        <Breadcrumbs
        mode={"JsonLd"}
        items={[
          { href: getDefaultPath("home"), name: t("breadcrumbs.home") },
          {
            href: getDefaultPath("certificate"),
            name: t("breadcrumbs.current"),
          },
        ]}
      />

      {/* 1. Breadcrumb line */}
      <div
        className="cert__breadcrumb"
        data-aos="fade-up"
        data-aos-duration={800}
      >
        <span className="cert__marker" />
        <span className="cert__breadcrumb-text">{t("pretitle")}</span>
      </div>

      {/* 2. Hero */}
      <div
        className="cert__hero"
        data-aos="fade-up"
        data-aos-duration={800}
        data-aos-delay={100}
      >
        <h1 className="cert__hero-title">
          <span className="cert__hero-title-accent">{t("hero.titleAccent")}</span>
          {" "}
          <span className="cert__hero-title-nowrap">{t("hero.titleRest")}</span>
        </h1>
        <p className="cert__hero-subtitle">
          {t("hero.subtitle")}
        </p>
      </div>

      {/* 3. Two-column block: Image + Amount Selection ONLY */}
      <div
        className="cert__main"
        data-aos="fade-up"
        data-aos-duration={800}
        data-aos-delay={200}
      >
        {/* Left: Certificate Image */}
        <div className="cert__image">
          <UiImage
            width={480}
            height={600}
            src="/img/gift2.png"
            alt={t("hero.titleDesktop")}
            hero
          />
        </div>

        {/* Right: Amount Selection ONLY */}
        <div className="cert__amounts">
          <CertificateForm
            amountOptions={t.raw("form.amountOptions")}
            labels={{
              chooseAmount: t("form.chooseAmount"),
              fillForm: t("form.fillForm"),
              namePlaceholder: t("form.placeholders.name"),
              phonePlaceholder: t("form.placeholders.phone"),
              emailPlaceholder: t("form.placeholders.email"),
              togglePhysical: t("form.togglePhysical"),
              previewTitle: t("form.preview.title"),
              previewButton: t("form.preview.button"),
              termsTitle: t("form.terms.title"),
              termsDriverRequirementsAge: t("form.terms.driverRequirementsAge"),
              termsDriverRequirementsNote: t("form.terms.driverRequirementsNote"),
              termsText: t("form.terms.text"),
              checkoutTitle: t("form.checkout.title"),
              payButton: t("form.payButton"),
              consent: t("form.consent"),
            }}
          />
        </div>
      </div>
      </form>

      {/* 4. FAQ Section - outside form to prevent submit behavior */}
      <CertificateFAQ
        title={t("faq.title")}
        items={t.raw("faq.items")}
      />
    </div>
  );
}
