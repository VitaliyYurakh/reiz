import type { Metadata } from "next";
import UiImage from "@/components/ui/UiImage";
import Icon from "@/components/Icon";
import { getTranslations } from "next-intl/server";
import { type Locale, locales } from "@/i18n/request";
import { getDefaultPath } from "@/lib/seo";
import { getStaticPageMetadata } from "@/lib/seo-sync";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";

import SectionNav from "./SectionNav";
import LoyaltySection from "./sections/LoyaltySection";
import AddOnsSection from "./sections/AddOnsSection";
import OneWaySection from "./sections/OneWaySection";
import MileageSection from "./sections/MileageSection";
import DepositSection from "./sections/DepositSection";
import InsuranceSection from "./sections/InsuranceSection";
import DriverSection from "./sections/DriverSection";
import DeliverySection from "./sections/DeliverySection";
import TerritorySection from "./sections/TerritorySection";
import CancellationSection from "./sections/CancellationSection";
import ContractSection from "./sections/ContractSection";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  return getStaticPageMetadata("termsPage", params.locale);
}

export default async function TermsPage() {
  const t = await getTranslations("termsPage");

  const uaItems = t.raw("termsList.citizensUA.items") as string[];
  const frItems = t.raw("termsList.foreignCitizens.items") as string[];
  const payMethods = t.raw("payments.methods") as string[];
  const navItems = t.raw("nav.items") as { id: string; label: string }[];

  return (
    <div
      className="terms-section__inner"
      data-aos="fade-left"
      data-aos-duration="900"
      data-aos-delay="600"
    >
      <Breadcrumbs
        mode="JsonLd"
        items={[
          { href: getDefaultPath("home"), name: t("breadcrumbs.home") },
          { href: getDefaultPath("terms"), name: t("breadcrumbs.current") },
        ]}
      />

      <div className="cert__breadcrumb">
        <span className="cert__marker" />
        <span className="cert__breadcrumb-text">{t("hero.pretitle")}</span>
      </div>

      <div className="terms-hero">
        <h1 className="blog-hero__title">{t("hero.title")}</h1>
        <p className="terms-hero__subtitle">{t("hero.subtitle")}</p>
      </div>

      <SectionNav
        items={navItems}
        ariaLabel={t("nav.ariaLabel")}
        goToSection={t("nav.goToSection")}
      />

      <div className="terms-section__content">
        {/* --- Original blocks with images (requirements, documents, payments) --- */}
        <div id="requirements">
          <ul className="terms-list">
            <li className="terms-list__item">
              <h2 className="terms-list__title">{t("termsList.ageTitle")}</h2>
              <div className="terms-list__bg">
                <UiImage
                  width={480}
                  height={270}
                  src="/img/car/years-2.webp"
                  alt={t("images.ageAlt")}
                  sizePreset="card"
                />
              </div>
            </li>

            <li className="terms-list__item">
              <h2 className="terms-list__title">
                {t("termsList.experienceTitle")}
              </h2>
              <div className="terms-list__bg">
                <UiImage
                  width={480}
                  height={270}
                  src="/img/car/mers2.webp"
                  alt={t("images.experienceAlt")}
                  sizePreset="card"
                />
              </div>
            </li>

            <li className="terms-list__item mode">
              <p>{t("termsList.requirementsBlockLabel")}</p>
            </li>

            <li className="terms-list__item" id="documents">
              <h2 className="terms-list__title">
                {t("termsList.citizensUA.title")}
              </h2>
              <div className="terms-list__bg">
                <UiImage
                  width={480}
                  height={270}
                  src="/img/car/ua.webp"
                  alt={t("images.uaAlt")}
                  sizePreset="card"
                />
              </div>
              <ul>
                {uaItems.map((item, i) => (
                  <li key={i}>
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </li>

            <li className="terms-list__item">
              <h2 className="terms-list__title">
                {t("termsList.foreignCitizens.title")}
              </h2>
              <div className="terms-list__bg">
                <UiImage
                  width={480}
                  height={270}
                  src="/img/car/visa.webp"
                  alt={t("images.visaAlt")}
                  sizePreset="card"
                />
              </div>
              <ul>
                {frItems.map((item, i) => (
                  <li key={i}>
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>

        <div className="terms-card" id="payments">
          <div className="terms-card__bg">
            <UiImage
              width={1000}
              height={440}
              src="/img/car/macbook2.webp"
              alt={t("images.paymentAlt")}
              quality={100}
            />
          </div>
          <h2 className="terms-card__title">{t("payments.title")}</h2>

          <div className="terms-card__box">
            <div className="terms-card__wrapp">
              <span className="terms-card__name">{payMethods[0]}</span>
              <span className="terms-card__icon sprite">
                <Icon id="icon18" width={56} height={56} />
              </span>
            </div>

            <div className="terms-card__wrapp">
              <span className="terms-card__name">{payMethods[1]}</span>
              <span className="terms-card__icon sprite">
                <Icon id="icon15" width={93} height={28} />
              </span>
            </div>

            <div className="terms-card__wrapp">
              <span className="terms-card__name">{payMethods[2]}</span>
              <span className="terms-card__icon sprite">
                <Icon id="icon16" width={56} height={56} />
              </span>
            </div>

            <div className="terms-card__wrapp">
              <span className="terms-card__name">{payMethods[3]}</span>
              <span className="terms-card__icon sprite">
                <Icon id="icon16" width={56} height={56} />
              </span>
            </div>

            <div className="terms-card__wrapp">
              <span className="terms-card__name">{payMethods[4]}</span>
              <span className="terms-card__icon sprite">
                <Icon id="icon17" width={56} height={56} />
              </span>
            </div>
          </div>
        </div>

        <LoyaltySection />
        <AddOnsSection />
        <OneWaySection />
        <MileageSection />
        <DepositSection />
        <InsuranceSection />
        <DriverSection />
        <DeliverySection />
        <TerritorySection />
        <CancellationSection />
        <ContractSection />
      </div>
    </div>
  );
}
