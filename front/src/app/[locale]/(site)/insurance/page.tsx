import type { Metadata } from "next";

import Icon from "@/components/Icon";
import { getTranslations, getLocale, setRequestLocale } from "next-intl/server";
import { type Locale, locales } from "@/i18n/request";
import { Link } from "@/i18n/request";
import { getDefaultPath } from "@/lib/seo";
import { getStaticPageMetadata } from "@/lib/seo-sync";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";


export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata("insurancePage", locale);
}

export default async function InsurancePage() {
  const locale = await getLocale() as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("insurancePage");

  return (
    <div className="rental-section insurance">
      <div className="rental-section__inner">
        <Breadcrumbs
          mode="JsonLd"
          items={[
            { href: getDefaultPath("home"), name: t("breadcrumbs.home") },
            {
              href: getDefaultPath("insurance"),
              name: t("breadcrumbs.current"),
            },
          ]}
        />

        <div className="cert__breadcrumb">
          <span className="cert__marker" />
          <span className="cert__breadcrumb-text">{t("pretitle")}</span>
        </div>

        <div className="blog-hero">
          <h1 className="blog-hero__title">{t("hero.title")}</h1>
        </div>

        <div className="rental-section__content">
          <div className="rental-section__top">
            <div className="editor">
              <p>{t("hero.text")}</p>
              <Link href="/contacts" className="main-button">
                {t("hero.cta")}
              </Link>
            </div>
          </div>

          <div className="rental-section__wrapp">
            <h2 className="pretitle">{t("table.title")}</h2>
            <ul className="rental-table">
              <li className="rental-table__col mode">
                <span className="rental-table__value head">
                  {t("table.labels.coverageLevel")}
                </span>
                <span className="rental-table__value">
                  {t("table.labels.deposit")}
                </span>
                <span className="rental-table__value">
                  {t("table.labels.driverLiabilityAccident")}
                </span>
                <span className="rental-table__value">
                  {t("table.labels.theftTotalLoss")}
                </span>
                <span className="rental-table__value">
                  {t("table.labels.tyresGlass")}
                </span>
                <span className="rental-table__value">
                  {t("table.labels.carWashIncluded")}
                </span>
              </li>

              {/* Standard */}
              <li className="rental-table__col">
                <span className="rental-table__value head">
                  {t("table.packages.standard.name")}
                </span>
                <span
                  className="rental-table__value"
                  data-title={t("table.labels.deposit")}
                >
                  {t("table.packages.standard.deposit")}
                </span>
                <span
                  className="rental-table__value"
                  data-title={t("table.labels.driverLiabilityAccident")}
                >
                  {t("table.packages.standard.driverLiabilityAccident")}
                </span>
                <span
                  className="rental-table__value"
                  data-title={t("table.labels.theftTotalLoss")}
                >
                  {t("table.packages.standard.theftTotalLoss")}
                </span>
                <span
                  className="rental-table__value"
                  data-title={t("table.labels.tyresGlass")}
                >
                  ✘
                </span>
                <span
                  className="rental-table__value"
                  data-title={t("table.labels.carWashIncluded")}
                >
                  ✘
                </span>
              </li>

              {/* Comfort */}
              <li className="rental-table__col">
                <span className="rental-table__value head">
                  {t("table.packages.comfort.name")}
                </span>
                <span
                  className="rental-table__value"
                  data-title={t("table.labels.deposit")}
                >
                  {t("table.packages.comfort.deposit")}
                </span>
                <span
                  className="rental-table__value"
                  data-title={t("table.labels.driverLiabilityAccident")}
                >
                  {t("table.packages.comfort.driverLiabilityAccident")}
                </span>
                <span
                  className="rental-table__value"
                  data-title={t("table.labels.theftTotalLoss")}
                >
                  {t("table.packages.comfort.theftTotalLoss")}
                </span>
                <span
                  className="rental-table__value"
                  data-title={t("table.labels.tyresGlass")}
                >
                  ✘
                </span>
                <span
                  className="rental-table__value"
                  data-title={t("table.labels.carWashIncluded")}
                >
                  ✔
                </span>
              </li>

              {/* Premium */}
              <li className="rental-table__col">
                <span className="rental-table__value head">
                  {t("table.packages.premium.name")}
                </span>
                <span
                  className="rental-table__value"
                  data-title={t("table.labels.deposit")}
                >
                  {t("table.packages.premium.deposit")}
                </span>
                <span
                  className="rental-table__value"
                  data-title={t("table.labels.driverLiabilityAccident")}
                >
                  {t("table.packages.premium.driverLiabilityAccident")}
                </span>
                <span
                  className="rental-table__value"
                  data-title={t("table.labels.theftTotalLoss")}
                >
                  {t("table.packages.premium.theftTotalLoss")}
                </span>
                <span
                  className="rental-table__value"
                  data-title={t("table.labels.tyresGlass")}
                >
                  ✔
                </span>
                <span
                  className="rental-table__value"
                  data-title={t("table.labels.carWashIncluded")}
                >
                  ✔
                </span>
              </li>
            </ul>
          </div>

          <div className="rental-section__wrapp">
            <h2 className="pretitle">{t("eligibility.title")}</h2>
            <ul className="info-list">
              {t.raw("eligibility.items").map((item: string, i: number) => (
                <li className="info-list__item" key={item}>
                  <span className="info-list__icon sprite">
                    <Icon id={`icon${5 + i}`} width={40} height={40} />
                  </span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="rental-section__wrapp">
            <h2 className="pretitle">{t("exclusions.title")}</h2>
            <div className="info-list warn">
              <div className="info-list__item">
                <span className="info-list__icon yellow">
                  <Icon id="icon9" width={43} height={43} />
                </span>
                <ul>
                  {t.raw("exclusions.items").map((item: string) => (
                    <li key={item}>
                      <p>{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Downloads */}
          <div className="rental-section__wrapp mode">
            <div className="editor">
              <h2 className="pretitle">{t("downloads.title")}</h2>
            </div>
            <div className="rental-section__download">
              <p>{t("downloads.note")}</p>
              <a href={t("downloads.file.href")} className="download">
                <span className="download__icon">
                  <Icon id="load" width={14} height={26} />
                </span>
                <div className="download__info">
                  <div className="download__title">
                    {t("downloads.file.title")}
                  </div>
                  <div className="download__meta">
                    {t("downloads.file.meta")}
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Breach */}
          <div className="rental-section__wrapp mode">
            <div className="editor">
              <h2 className="pretitle">{t("breach.title")}</h2>
            </div>
            <div className="editor">
              <p>{t("breach.text")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
