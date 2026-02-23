import type { Metadata } from "next";
import Icon from "@/components/Icon";
import { getTranslations, getLocale } from "next-intl/server";
import { type Locale, locales } from "@/i18n/request";
import { getDefaultPath } from "@/lib/seo";
import { getStaticPageMetadata } from "@/lib/seo-sync";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import BusinessCtaButton from "@/app/[locale]/(site)/business/components/BusinessCtaButton";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  return getStaticPageMetadata("businessPage", params.locale);
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

function BusinessJsonLd({ locale }: { locale: Locale }) {
  const names: Record<Locale, string> = {
    uk: "Корпоративна оренда автомобілів з ПДВ",
    ru: "Корпоративная аренда автомобилей с НДС",
    en: "Corporate Car Rental with VAT",
    pl: "Wynajem korporacyjny samochodów z VAT",
    ro: "Închiriere corporativă de mașini cu TVA",
  };
  const cities: Record<Locale, string[]> = {
    uk: ["Київ", "Львів", "Тернопіль"],
    ru: ["Киев", "Львов", "Тернополь"],
    en: ["Kyiv", "Lviv", "Ternopil"],
    pl: ["Kijów", "Lwów", "Tarnopol"],
    ro: ["Kiev", "Lviv", "Ternopil"],
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: names[locale],
    provider: {
      "@type": "Organization",
      name: "REIZ",
      url: BASE,
    },
    areaServed: cities[locale].map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    serviceType: "Corporate Car Rental",
    termsOfService: `${BASE}/terms`,
    url: `${BASE}/business`,
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: schema
      dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
    />
  );
}

type GuaranteeItem = { icon: string; title: string; text: string };
type StepItem = { title: string; text: string; photoHint?: string; photo?: string };
type CaseItem = { title: string; text: string; photoHint?: string; photo?: string };
type CompareCard = {
  badge: string;
  title: string;
  text: string;
  items: string[];
  cta: string;
};

export default async function BusinessPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("businessPage");

  const guarantees = t.has("guarantees.items")
    ? (t.raw("guarantees.items") as GuaranteeItem[])
    : [];

  const cases = t.has("cases.items")
    ? (t.raw("cases.items") as CaseItem[])
    : [];

  const steps = t.has("steps.items")
    ? (t.raw("steps.items") as StepItem[])
    : [];

  const stepLabel = t.has("steps.label") ? t("steps.label") : "Крок";

  const compareCards = t.has("compare.items")
    ? (t.raw("compare.items") as CompareCard[])
    : [];

  return (
    <>
      <BusinessJsonLd locale={locale} />

      <div
        className="rental-section__inner"
        data-aos="fade-left"
        data-aos-duration={900}
        data-aos-delay={600}
      >
        <Breadcrumbs
          mode="JsonLd"
          items={[
            { href: getDefaultPath("home"), name: t("breadcrumbs.home") },
            {
              href: getDefaultPath("business"),
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
          <p className="blog-hero__subtitle">{t("hero.text")}</p>
        </div>

        <div className="rental-section__content">

          {/* GUARANTEES — ICON GRID */}
          {guarantees.length > 0 && (
            <div className="rental-section__wrapp">
              <div className="editor">
                <h2 className="pretitle">{t("guarantees.title")}</h2>
              </div>
              <div className="business-guarantees">
                {guarantees.map((item) => (
                  <div className="business-guarantees__card" key={item.icon}>
                    <div className="business-guarantees__icon">
                      <i className="sprite">
                        <Icon id={item.icon} width={22} height={22} />
                      </i>
                    </div>
                    <h3 className="business-guarantees__title">{item.title}</h3>
                    <p className="business-guarantees__text">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CASES — photo + card rows (business examples) */}
          {cases.length > 0 && (
            <div className="rental-section__wrapp">
              <div className="editor">
                <h2 className="pretitle">{t("cases.title")}</h2>
              </div>
              <div className="business-steps">
                {cases.map((item, i) => (
                  <div className="business-steps__item" key={item.title}>
                    <div className={`business-steps__photo${!item.photo ? " business-steps__photo--placeholder" : ""}`}>
                      {item.photo ? (
                        <img src={item.photo} alt={item.title} />
                      ) : (
                        <span className="business-steps__photo-hint">
                          {item.photoHint ?? `Photo ${i + 1}`}
                        </span>
                      )}
                    </div>
                    <div className="business-steps__card">
                      <h3 className="business-steps__title">{item.title}</h3>
                      <p className="business-steps__text">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA BANNER (dark) — inside cases wrapp */}
              {t.has("ctaBanner.title") && (
                <div className="business-cta">
                  <img
                    className="business-cta__bg"
                    src="/img/business/medium-shot-man-working-as-valet.webp"
                    alt=""
                  />
                  <h2 className="business-cta__title">{t("ctaBanner.title")}</h2>
                  <p className="business-cta__text">{t("ctaBanner.text")}</p>
                  <a
                    href="#order-call"
                    className="main-button"
                    data-btn-modal="offer"
                  >
                    {t("ctaBanner.cta")}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* PROCESS — HOW IT WORKS (Siberia-style) */}
          {steps.length > 0 && (
            <div className="rental-section__wrapp">
              <div className="editor">
                <h2 className="pretitle">{t("steps.title")}</h2>
              </div>
              <div className="business-process">
                {steps.map((step, i) => (
                  <div className="business-process__item" key={step.title}>
                    <div className="business-process__label">
                      <span>{stepLabel} {String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="business-process__body">
                      <h3 className="business-process__title">{step.title}</h3>
                      <p className="business-process__text">{step.text}</p>
                    </div>
                    <div className={`business-process__photo${!step.photo ? " business-process__photo--placeholder" : ""}`}>
                      {step.photo ? (
                        <img src={step.photo} alt={step.title} />
                      ) : (
                        <span className="business-process__photo-hint">
                          {step.photoHint ?? `Photo ${i + 1}`}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMPARISON CARDS */}
          {compareCards.length > 0 && (
            <div className="rental-section__wrapp">
              <div className="editor">
                <h2 className="pretitle">{t("compare.title")}</h2>
              </div>
              <div className="business-compare">
                {compareCards.map((card, i) => (
                  <div
                    className={`business-compare__card${i === 1 ? " business-compare__card--accent" : ""}`}
                    key={card.badge}
                  >
                    <span className="business-compare__badge">
                      {card.badge}
                    </span>
                    <h3 className="business-compare__title">{card.title}</h3>
                    <p className="business-compare__text">{card.text}</p>
                    {card.items.length > 0 && (
                      <ul className="business-compare__list">
                        {card.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                    <div className="business-compare__cta">
                      <a
                        href="#order-call"
                        className="main-button"
                        data-btn-modal="offer"
                      >
                        {card.cta}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ORDER CTA (Siberia-style) */}
        <div className="business-cta-section" id="order-call">
          <div className="business-cta-section__label">
            <span>{t("order.title")}</span>
          </div>
          <div className="business-cta-section__body">
            <h2 className="business-cta-section__title">
              {t.rich("order.heading", {
                accent: (chunks) => <em>{chunks}</em>,
              })}
            </h2>
            <p className="business-cta-section__text">{t("order.lead")}</p>
            <BusinessCtaButton label={t("order.submit")} />
          </div>
        </div>
      </div>
    </>
  );
}
