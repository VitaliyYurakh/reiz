import type { Metadata } from "next";

import Icon from "@/components/Icon";
import { getTranslations, getLocale, setRequestLocale } from "next-intl/server";
import { type Locale, locales } from "@/i18n/request";
import { Link } from "@/i18n/request";
import { getDefaultPath } from "@/lib/seo";
import { getStaticPageMetadata } from "@/lib/seo-sync";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import HeroBookButton from "@/app/[locale]/components/HeroBookButton";
import HeroThemeColor from "./components/HeroThemeColor";

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

type PackageKey = "standard" | "comfort" | "premium";

const PACKAGES: {
  key: PackageKey;
  featured: boolean;
  tyresGlass: boolean;
  carWash: boolean;
}[] = [
  { key: "standard", featured: false, tyresGlass: false, carWash: false },
  { key: "comfort", featured: true, tyresGlass: false, carWash: true },
  { key: "premium", featured: false, tyresGlass: true, carWash: true },
];

function CheckIcon({ included }: { included: boolean }) {
  return (
    <span
      className={`ins-card__check ins-card__check--${included ? "yes" : "no"}`}
      aria-hidden="true"
    >
      {included ? (
        <svg viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6l2.5 2.5 4.5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 10 10" fill="none">
          <path
            d="M2.5 2.5l5 5M7.5 2.5l-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  );
}

export default async function InsurancePage() {
  const locale = (await getLocale()) as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("insurancePage");

  return (
    <div className="insurance-section__inner">
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

      {/* Mobile hero banner */}
      <div className="insurance-section__mob-hero">
        <HeroThemeColor />
        <img
          src="/img/emergency-sign-with-black-car-background-2.webp"
          alt=""
          className="insurance-section__mob-hero-img"
        />
        <div className="insurance-section__mob-hero-content">
          <h1 className="insurance-section__mob-hero-title">
            {t("hero.title")}
          </h1>
          <p className="insurance-section__mob-hero-text">{t("hero.text")}</p>
          <HeroBookButton className="insurance-section__mob-hero-btn">
            {t("hero.cta")}
          </HeroBookButton>
        </div>
      </div>

      <div className="cert__breadcrumb">
        <span className="cert__marker" />
        <span className="cert__breadcrumb-text">{t("pretitle")}</span>
      </div>

      <div className="blog-hero insurance-section__desktop-hero">
        <h1 className="blog-hero__title">{t("hero.title")}</h1>
      </div>

      <div className="insurance-section__content">
        {/* Intro */}
        <div className="insurance-section__intro">
          <p>{t("hero.text")}</p>
          <HeroBookButton className="main-button">
            {t("hero.cta")}
          </HeroBookButton>
        </div>

        {/* Explainer: What is additional insurance? */}
        <div className="insurance-section__block">
          <h2 className="pretitle">{t("explainer.title")}</h2>
          <div className="insurance-section__explainer">
            <p>{t("explainer.text")}</p>
            <div className="insurance-section__explainer-features">
              {(
                t.raw("explainer.features") as {
                  title: string;
                  subtitle: string;
                  desc: string;
                }[]
              ).map((f) => (
                <div key={f.title} className="insurance-section__explainer-item">
                  <span className="insurance-section__explainer-abbr">
                    {f.title}
                    <span className="insurance-section__explainer-subtitle">
                      {" "}({f.subtitle})
                    </span>
                  </span>
                  <span className="insurance-section__explainer-desc">
                    {f.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Package cards */}
        <div className="insurance-section__block">
          <h2 className="pretitle">{t("table.title")}</h2>

          <div className="insurance-section__cards">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.key}
                className={`ins-card${pkg.featured ? " ins-card--featured" : ""}`}
              >
                <div className="ins-card__header">
                  {pkg.featured && (
                    <span className="ins-card__badge">
                      {t("table.recommended")}
                    </span>
                  )}
                  <div className="ins-card__header-text">
                    <h3 className="ins-card__name">
                      {t(`table.packages.${pkg.key}.name`)}
                    </h3>
                    <span className="ins-card__tier-label">
                      {t(`table.packages.${pkg.key}.type`)}
                    </span>
                  </div>
                </div>

                <div className="ins-card__feature">
                  <span className="ins-card__label">
                    {t("table.labels.deposit")}
                  </span>
                  <span className="ins-card__value">
                    {t(`table.packages.${pkg.key}.deposit`)}
                  </span>
                </div>

                <div className="ins-card__feature">
                  <span className="ins-card__label">
                    {t("table.labels.driverLiabilityAccident")}
                  </span>
                  <span className="ins-card__value">
                    {t(`table.packages.${pkg.key}.driverLiabilityAccident`)}
                  </span>
                </div>

                <div className="ins-card__feature">
                  <span className="ins-card__label">
                    {t("table.labels.theftTotalLoss")}
                  </span>
                  <span className="ins-card__value">
                    {t(`table.packages.${pkg.key}.theftTotalLoss`)}
                  </span>
                </div>

                <div className="ins-card__feature">
                  <span className="ins-card__label">
                    {t("table.labels.tyresGlass")}
                  </span>
                  <span className="ins-card__value">
                    <CheckIcon included={pkg.tyresGlass} />
                  </span>
                </div>

                <div className="ins-card__feature">
                  <span className="ins-card__label">
                    {t("table.labels.carWashIncluded")}
                  </span>
                  <span className="ins-card__value">
                    <CheckIcon included={pkg.carWash} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility */}
        <div className="insurance-section__block">
          <h2 className="pretitle">{t("eligibility.title")}</h2>
          <div className="terms-block">
            <ul className="terms-block__list">
              {(t.raw("eligibility.items") as string[]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Exclusions */}
        <div className="insurance-section__block">
          <h2 className="pretitle">{t("exclusions.title")}</h2>
          <div className="terms-block">
            <ul className="terms-block__list insurance-section__warn-list">
              {(t.raw("exclusions.items") as string[]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Accident steps */}
        <div className="insurance-section__block">
          <h2 className="pretitle">{t("accident.title")}</h2>
          <div className="insurance-section__steps">
            {(
              t.raw("accident.steps") as { title: string; text: string }[]
            ).map((step, i) => (
              <div key={step.title} className="insurance-section__step">
                <span className="insurance-section__step-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="insurance-section__step-content">
                  <span className="insurance-section__step-title">
                    {step.title}
                  </span>
                  <span className="insurance-section__step-text">
                    {step.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 24/7 Roadside assistance */}
        <div className="insurance-section__roadside">
          <div className="insurance-section__roadside-icon">
            <Icon id="phone" width={32} height={32} />
          </div>
          <div className="insurance-section__roadside-info">
            <span className="insurance-section__roadside-title">
              {t("roadside.title")}
            </span>
            <span className="insurance-section__roadside-text">
              {t("roadside.text")}
            </span>
          </div>
        </div>

        {/* Bottom: Downloads + Breach */}
        <div className="insurance-section__bottom">
          <div className="terms-block insurance-section__download-block">
            <div className="terms-block__header">
              <h2 className="terms-block__title">{t("downloads.title")}</h2>
            </div>
            <p className="terms-block__note">{t("downloads.note")}</p>
            <Link
              href={t("downloads.file.href")}
              className="insurance-section__download-link"
            >
              <span className="insurance-section__download-icon">
                <Icon id="load" width={14} height={26} />
              </span>
              <span className="download__info">
                <span className="download__title">
                  {t("downloads.file.title")}
                </span>
                <span className="download__meta">
                  {t("downloads.file.meta")}
                </span>
              </span>
            </Link>
          </div>

          <div className="terms-block">
            <div className="terms-block__header">
              <h2 className="terms-block__title">{t("breach.title")}</h2>
            </div>
            <p className="terms-block__text">{t("breach.text")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
