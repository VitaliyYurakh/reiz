import type { Metadata } from "next";
import Icon from "@/components/Icon";
import InfoSlider from "@/app/[locale]/(site)/business/components/InfoSlider";
import { getTranslations, getLocale } from "next-intl/server";
import { type Locale, locales } from "@/i18n/request";
import { getDefaultPath } from "@/lib/seo";
import { getStaticPageMetadata } from "@/lib/seo-sync";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import BusinessForm from "@/app/[locale]/(site)/business/components/BusinessForm";


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

type Slide = { id: string; title: string; text: string };

export default async function BusinessPage() {
  const locale = await getLocale() as Locale;
  const t = await getTranslations("businessPage");

  const iconOrder = [
    "icon10",
    "icon11",
    "icon12",
    "icon14",
    "icon10",
    "icon11",
    "icon12",
    "icon14",
  ];

  const slides: Slide[] = (
    t.raw("slider.items") as Array<{ title: string; text: string }>
  ).map((item, i) => ({
    id: iconOrder[i] ?? "icon10",
    title: item.title,
    text: item.text,
  }));

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
        </div>

        <div className="rental-section__content">
          <div className="editor">
            <p>{t("hero.text")}</p>
            <a
              href="#order-call"
              className="main-button"
              data-btn-modal="offer"
            >
              {t("hero.cta")}
            </a>
          </div>

          <InfoSlider slides={slides} />

          {/* WHY US */}
          <div className="rental-section__wrapp mode">
            <div className="editor">
              <h2 className="pretitle">{t("whyUs.title")}</h2>
            </div>
            <div className="editor">
              <p>{t("whyUs.text")}</p>
              <ul>
                {(t.has("whyUs.items")
                  ? (t.raw("whyUs.items") as string[])
                  : []
                ).map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* HOW IT WORKS */}
          {t.has("howItWorks.steps") && (
            <div className="rental-section__wrapp mode">
              <div className="editor">
                <h2 className="pretitle">{t("howItWorks.title")}</h2>
              </div>
              <div className="editor">
                <ul>
                  {(t.raw("howItWorks.steps") as string[]).map((step) => (
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: i18n content
                    <li key={step} dangerouslySetInnerHTML={{ __html: step }} />
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TARIFFS */}
          {t.has("tariffs.title") && (
            <div className="rental-section__wrapp mode">
              <div className="editor">
                <h2 className="pretitle">{t("tariffs.title")}</h2>
              </div>
              <div className="editor">
                <ul>
                  {(t.raw("tariffs.items") as string[]).map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
                <p>{t("tariffs.note")}</p>
              </div>
            </div>
          )}

          {/* DOCUMENTS */}
          {t.has("documents.title") && (
            <div className="rental-section__wrapp mode">
              <div className="editor">
                <h2 className="pretitle">{t("documents.title")}</h2>
              </div>
              <div className="editor">
                <ul>
                  {(t.raw("documents.items") as string[]).map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* DRIVER REQUIREMENTS */}
          {t.has("driverRequirements.title") && (
            <div className="rental-section__wrapp mode">
              <div className="editor">
                <h2 className="pretitle">{t("driverRequirements.title")}</h2>
              </div>
              <div className="editor">
                <ul>
                  {(t.raw("driverRequirements.items") as string[]).map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* DOWNLOADS */}
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

          {/* ORDER */}
          <div className="rental-section__wrapp order" id="order-call">
            <div className="editor">
              <h2 className="pretitle">{t("order.title")}</h2>
              <p>{t("order.lead")}</p>

              <BusinessForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
