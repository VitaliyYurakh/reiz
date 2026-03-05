import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, getLocale, setRequestLocale } from "next-intl/server";
import { type Locale, locales } from "@/i18n/request";
import { getDefaultPath } from "@/lib/seo";
import { getStaticPageMetadata } from "@/lib/seo-sync";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import BusinessCtaButton from "@/app/[locale]/(site)/business/components/BusinessCtaButton";
import BusinessCasesTabs from "@/app/[locale]/(site)/business/components/BusinessCasesTabs";
import BusinessVehicleTabs from "@/app/[locale]/(site)/business/components/BusinessVehicleTabs";
import BusinessInlineForm from "@/app/[locale]/(site)/business/components/BusinessInlineForm";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata("businessPage", locale);
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

type HeroFeature = string;
type BenefitCol = { value: string; label: string; desc: string };
type LegalCard = { title: string; text: string };
type FleetCard = { title: string; text: string };
type CaseItem = { title: string; text: string; photo: string };
type VehicleTab = { key: string; label: string; title: string; text: string; cta: string };

export default async function BusinessPage() {
  const locale = (await getLocale()) as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("businessPage");

  const heroFeatures = t.has("hero.features")
    ? (t.raw("hero.features") as HeroFeature[])
    : [];

  const heroPrimaryCta = t.has("hero.ctaPrimary") ? t("hero.ctaPrimary") : t("hero.cta");
  const heroSecondaryCta = t.has("hero.ctaSecondary") ? t("hero.ctaSecondary") : "";

  const benefitCols = t.has("benefit.cols")
    ? (t.raw("benefit.cols") as BenefitCol[])
    : [];

  const legalCards = t.has("legal.cards")
    ? (t.raw("legal.cards") as LegalCard[])
    : [];

  const fleetCards = t.has("fleet.cards")
    ? (t.raw("fleet.cards") as FleetCard[])
    : [];

  const cases = t.has("cases.items")
    ? (t.raw("cases.items") as CaseItem[])
    : [];

  const vehicleTabs = t.has("vehicles.tabs")
    ? (t.raw("vehicles.tabs") as VehicleTab[])
    : [];

  const finalCtaFeatures = t.has("finalCta.features")
    ? (t.raw("finalCta.features") as string[])
    : [];

  return (
    <>
      <BusinessJsonLd locale={locale} />

      <div className="rental-section__inner">
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

        <div className="business-hero" data-aos="fade-up" data-aos-duration={700}>
          <div className="business-hero__content">
            <span className="business-hero__eyebrow">{t("pretitle")}</span>
            <h1 className="business-hero__title">{t("hero.title")}</h1>

            {heroFeatures.length > 0 && (
              <div className="business-hero__features">
                {heroFeatures.map((feature, i) => (
                  <div className="business-hero__feature" key={feature}>
                    <span className="business-hero__feature-icon" aria-hidden="true">
                      {i === 0 && (
                        <svg viewBox="-2 -2 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M13.5581 30.3896C14.344 30.7023 15.1712 30.8571 15.9968 30.8571C16.8256 30.8571 17.6528 30.7023 18.4419 30.388L21.8459 29.012C22.3651 28.8009 22.9684 28.8181 23.4971 29.0573L24.7006 29.6328C25.5485 30.0315 26.5201 29.9736 27.3108 29.4826C28.1015 28.9901 28.573 28.1457 28.5714 27.2231L28.5556 8.05266C28.5556 3.79011 25.9597 1.14282 21.7824 1.14282H10.1938C5.97527 1.14282 3.45717 3.726 3.45717 8.0511L3.42859 27.2216C3.42701 28.1457 3.90332 28.9901 4.70034 29.4811C5.49102 29.9689 6.46746 30.0159 7.29942 29.6171L8.48861 29.0605C9.02049 28.8197 9.62382 28.8025 10.1462 29.012L13.5581 30.3896ZM19.7538 21.001H11.6438C10.9865 21.001 10.453 20.4756 10.453 19.8283C10.453 19.1809 10.9865 18.6555 11.6438 18.6555H19.7538C20.4111 18.6555 20.9446 19.1809 20.9446 19.8283C20.9446 20.4756 20.4111 21.001 19.7538 21.001ZM13.901 15.8561C14.1329 16.0859 14.4393 16.2001 14.7425 16.2001C15.0474 16.2001 15.3522 16.0859 15.584 15.8561L20.5964 10.9149C21.06 10.4568 21.06 9.71401 20.5964 9.25742C20.1312 8.7977 19.377 8.80083 18.9118 9.25742L14.7409 13.3683L13.1358 11.7906C12.669 11.3324 11.9164 11.3324 11.4528 11.7906C10.9876 12.2487 10.9876 12.9914 11.4528 13.448L13.901 15.8561Z" fill="#214230"/>
                        </svg>
                      )}
                      {i === 1 && (
                        <svg viewBox="1 1 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill="#214230" fillRule="evenodd" d="m27.2 12.2.96.95a3.94 3.94 0 0 1 1.18 2.83 3.97 3.97 0 0 1-1.15 2.84l-.03.03v.01l-.96.95a2 2 0 0 0-.58 1.41v1.37c0 2.22-1.8 4.02-4.02 4.02h-1.37a2 2 0 0 0-1.42.58l-.96.96a4.04 4.04 0 0 1-5.68.01l-.97-.97a2 2 0 0 0-1.42-.58H9.41a4.02 4.02 0 0 1-4.01-4.02v-1.37c0-.53-.22-1.04-.6-1.43l-.95-.94a4.03 4.03 0 0 1-.01-5.68l.97-.98a2 2 0 0 0 .59-1.42V9.4a4 4 0 0 1 4-4h1.37a2 2 0 0 0 1.42-.6l.96-.95a4.02 4.02 0 0 1 5.68-.01l.97.97a2 2 0 0 0 1.42.59h1.37c2.22 0 4.02 1.8 4.02 4v1.38a2 2 0 0 0 .58 1.41Zm-14.62 8.4c.32 0 .61-.13.83-.35l6.85-6.86a1.16 1.16 0 1 0-1.64-1.65l-6.86 6.85a1.17 1.17 0 0 0 .82 2Zm5.7-1.18a1.17 1.17 0 1 0 2.33.01 1.17 1.17 0 0 0-2.33-.01Zm-5.7-8.01a1.16 1.16 0 1 1 .01 2.33c-.64 0-1.18-.52-1.18-1.17 0-.64.54-1.16 1.18-1.16Z" clipRule="evenodd"/>
                        </svg>
                      )}
                      {i === 2 && (
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12,2a8,8,0,0,0-8,8c0,5.4,7,11.5,7.35,11.76l.65.56.65-.56C13,21.5,20,15.4,20,10A8,8,0,0,0,12,2Zm0,12a4,4,0,1,1,4-4A4,4,0,0,1,12,14Z" fill="#214230"/>
                          <circle cx="12" cy="10" r="2" fill="#214230"/>
                        </svg>
                      )}
                    </span>
                    <span className="business-hero__feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="business-hero__actions">
              <BusinessCtaButton
                label={heroPrimaryCta}
                className="business-hero__cta business-hero__cta--primary"
              />
              {heroSecondaryCta ? (
                <a className="business-hero__cta business-hero__cta--secondary" href="tel:+380635471186">
                  {heroSecondaryCta}
                </a>
              ) : null}
            </div>
          </div>

          <div className="business-hero__visual" aria-hidden="true">
            <div className="business-hero__device">
              <Image
                className="business-hero__laptop"
                src="/img/business/macbook-hero.webp"
                alt=""
                width={510}
                height={436}
                sizes="(max-width: 768px) 100vw, 560px"
                priority
              />
            </div>
          </div>
        </div>


        {/* ═══ BLOCK 2 — BENEFIT (dark card, 4 columns) ═══ */}
        {benefitCols.length > 0 && (
          <div className="business-benefit" data-aos="fade-up" data-aos-duration={700}>
            <div className="business-benefit__heading">
              <h2 className="business-benefit__title">{t("benefit.title")}</h2>
              <p className="business-benefit__subtitle">{t("benefit.subtitle")}</p>
            </div>
            <div className="business-benefit__card">
              {benefitCols.map((col, i) => (
                <div className="business-benefit__col" key={col.value}>
                  <div className="business-benefit__icon" aria-hidden="true">
                    {i === 0 && (
                      <svg viewBox="-2 -2 36 36" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M13.5581 30.3896C14.344 30.7023 15.1712 30.8571 15.9968 30.8571C16.8256 30.8571 17.6528 30.7023 18.4419 30.388L21.8459 29.012C22.3651 28.8009 22.9684 28.8181 23.4971 29.0573L24.7006 29.6328C25.5485 30.0315 26.5201 29.9736 27.3108 29.4826C28.1015 28.9901 28.573 28.1457 28.5714 27.2231L28.5556 8.05266C28.5556 3.79011 25.9597 1.14282 21.7824 1.14282H10.1938C5.97527 1.14282 3.45717 3.726 3.45717 8.0511L3.42859 27.2216C3.42701 28.1457 3.90332 28.9901 4.70034 29.4811C5.49102 29.9689 6.46746 30.0159 7.29942 29.6171L8.48861 29.0605C9.02049 28.8197 9.62382 28.8025 10.1462 29.012L13.5581 30.3896ZM19.7538 21.001H11.6438C10.9865 21.001 10.453 20.4756 10.453 19.8283C10.453 19.1809 10.9865 18.6555 11.6438 18.6555H19.7538C20.4111 18.6555 20.9446 19.1809 20.9446 19.8283C20.9446 20.4756 20.4111 21.001 19.7538 21.001ZM13.901 15.8561C14.1329 16.0859 14.4393 16.2001 14.7425 16.2001C15.0474 16.2001 15.3522 16.0859 15.584 15.8561L20.5964 10.9149C21.06 10.4568 21.06 9.71401 20.5964 9.25742C20.1312 8.7977 19.377 8.80083 18.9118 9.25742L14.7409 13.3683L13.1358 11.7906C12.669 11.3324 11.9164 11.3324 11.4528 11.7906C10.9876 12.2487 10.9876 12.9914 11.4528 13.448L13.901 15.8561Z" fill="#fff"/></svg>
                    )}
                    {i === 1 && (
                      <svg viewBox="0 0 56 56" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M33.14 3.981c-2.497-3.57-7.783-3.57-10.28 0a6.274 6.274 0 0 1-6.768 2.463c-4.208-1.13-8.257 2.269-7.876 6.609a6.274 6.274 0 0 1-3.6 6.237C.665 21.13-.253 26.335 2.83 29.415a6.274 6.274 0 0 1 1.25 7.092c-1.842 3.948.8 8.526 5.141 8.904a6.274 6.274 0 0 1 5.517 4.629c1.126 4.209 6.093 6.017 9.661 3.516a6.274 6.274 0 0 1 7.202 0c3.568 2.5 8.535.693 9.661-3.516a6.274 6.274 0 0 1 5.517-4.629c4.34-.378 6.983-4.956 5.14-8.904a6.274 6.274 0 0 1 1.251-7.092c3.082-3.08 2.164-8.286-1.785-10.125a6.274 6.274 0 0 1-3.601-6.237c.381-4.34-3.668-7.738-7.876-6.609a6.274 6.274 0 0 1-6.767-2.463Zm-15.86 19.73c-.742 1.117-1.23 2.812-1.23 4.858 0 2.124.412 3.811 1.097 4.9.617.98 1.475 1.536 2.82 1.536 1.344 0 2.202-.555 2.819-1.536.685-1.089 1.096-2.776 1.096-4.9 0-2.046-.487-3.74-1.23-4.858-.709-1.067-1.607-1.578-2.686-1.578s-1.977.51-2.686 1.578Zm-3.331-2.214c1.32-1.986 3.379-3.364 6.017-3.364 2.639 0 4.698 1.378 6.018 3.364 1.286 1.936 1.898 4.459 1.898 7.072 0 2.536-.474 5.066-1.71 7.03-1.306 2.074-3.405 3.407-6.206 3.407-2.8 0-4.9-1.333-6.205-3.406-1.236-1.965-1.71-4.495-1.71-7.03 0-2.614.612-5.137 1.898-7.073Zm18.643 1.49c3.806-1.407 5.415-.614 5.764-.262a.507.507 0 0 1 .155.481c-.03.188-.153.504-.506.862h-5.509a2 2 0 0 0 0 4h8.546a2 2 0 0 0 1.261-3.553c.068-.223.122-.45.158-.68A4.502 4.502 0 0 0 41.2 19.91c-2.05-2.07-5.725-2.254-9.993-.677a2 2 0 1 0 1.386 3.752Zm2.818 9.921h5.633a2 2 0 0 0 0-4h-8.547a2 2 0 0 0-1.246 3.565 5.52 5.52 0 0 0-.211 1.265 4.83 4.83 0 0 0 1.621 3.886c2.203 1.967 5.85 1.975 9.79.23a2 2 0 1 0-1.62-3.657c-3.367 1.491-5.045.854-5.506.443a.836.836 0 0 1-.29-.711c.012-.242.103-.596.376-1.021Z" fill="#fff"/></svg>
                    )}
                    {i === 2 && (
                      <svg viewBox="18 18 36 36" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M26.7044 24.6055V25.6005C26.7044 26.0805 26.9794 26.5171 27.4111 26.7271C27.5828 26.8105 27.7694 26.8505 27.9544 26.8505C28.2311 26.8505 28.5061 26.7571 28.7311 26.5805L31.6294 24.2805C31.9294 24.0421 32.1028 23.6821 32.1028 23.3005C32.1028 22.9205 31.9294 22.5588 31.6294 22.3205L28.7311 20.0205C28.3544 19.7238 27.8411 19.6655 27.4111 19.8738C26.9794 20.0838 26.7044 20.5205 26.7044 21.0005V22.1055C23.1011 22.3871 20.2461 25.3755 20.2461 29.0505C20.2461 29.7405 20.8061 30.3005 21.4961 30.3005C22.1861 30.3005 22.7461 29.7405 22.7461 29.0505C22.7461 26.7538 24.4794 24.8771 26.7044 24.6055Z" fill="#fff"/><path fillRule="evenodd" clipRule="evenodd" d="M51.7462 42.9492C51.7462 42.2592 51.1862 41.6992 50.4962 41.6992C49.8062 41.6992 49.2462 42.2592 49.2462 42.9492C49.2462 45.2776 47.4645 47.1759 45.1945 47.4042V46.3976C45.1945 45.9142 44.9162 45.4759 44.4795 45.2692C44.0479 45.0626 43.5279 45.1242 43.1512 45.4326L40.3495 47.7342C40.0612 47.9726 39.8945 48.3259 39.8945 48.6992C39.8945 49.0742 40.0612 49.4292 40.3512 49.6659L43.1529 51.9659C43.3795 52.1526 43.6612 52.2492 43.9445 52.2492C44.1279 52.2492 44.3095 52.2109 44.4795 52.1292C44.9162 51.9226 45.1945 51.4826 45.1945 50.9992V49.9042C48.8429 49.6676 51.7462 46.6559 51.7462 42.9492Z" fill="#fff"/><path fillRule="evenodd" clipRule="evenodd" d="M39.6533 43.7149C33.3866 43.7149 28.2899 38.6149 28.2899 32.3483C28.2899 32.1041 28.0464 31.9416 27.8366 32.0666C25.2442 33.6114 23.4883 36.4158 23.4883 39.6483C23.4883 44.5366 27.4649 48.5149 32.3499 48.5149C35.5833 48.5149 38.3863 46.7566 39.9314 44.1624C40.0548 43.9553 39.8944 43.7149 39.6533 43.7149Z" fill="#fff"/><path fillRule="evenodd" clipRule="evenodd" d="M39.6563 41.2194C44.543 41.2194 48.518 37.241 48.518 32.3527C48.518 27.4627 44.543 23.4844 39.6563 23.4844C34.768 23.4844 30.793 27.4627 30.793 32.3527C30.793 37.241 34.768 41.2194 39.6563 41.2194Z" fill="#fff"/></svg>
                    )}
                    {i === 3 && (
                      <svg viewBox="1 1 30 30" fill="none"><path fill="#fff" fillRule="evenodd" d="m27.2 12.2.96.95a3.94 3.94 0 0 1 1.18 2.83 3.97 3.97 0 0 1-1.15 2.84l-.03.03v.01l-.96.95a2 2 0 0 0-.58 1.41v1.37c0 2.22-1.8 4.02-4.02 4.02h-1.37a2 2 0 0 0-1.42.58l-.96.96a4.04 4.04 0 0 1-5.68.01l-.97-.97a2 2 0 0 0-1.42-.58H9.41a4.02 4.02 0 0 1-4.01-4.02v-1.37c0-.53-.22-1.04-.6-1.43l-.95-.94a4.03 4.03 0 0 1-.01-5.68l.97-.98a2 2 0 0 0 .59-1.42V9.4a4 4 0 0 1 4-4h1.37a2 2 0 0 0 1.42-.6l.96-.95a4.02 4.02 0 0 1 5.68-.01l.97.97a2 2 0 0 0 1.42.59h1.37c2.22 0 4.02 1.8 4.02 4v1.38a2 2 0 0 0 .58 1.41Zm-14.62 8.4c.32 0 .61-.13.83-.35l6.85-6.86a1.16 1.16 0 1 0-1.64-1.65l-6.86 6.85a1.17 1.17 0 0 0 .82 2Zm5.7-1.18a1.17 1.17 0 1 0 2.33.01 1.17 1.17 0 0 0-2.33-.01Zm-5.7-8.01a1.16 1.16 0 1 1 .01 2.33c-.64 0-1.18-.52-1.18-1.17 0-.64.54-1.16 1.18-1.16Z" clipRule="evenodd"/></svg>
                    )}
                  </div>
                  <p className="business-benefit__value">{col.value}</p>
                  <p className="business-benefit__label">{col.label}</p>
                  <p className="business-benefit__desc">{col.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ BLOCK 3 — LEGAL SHIELD (2 cards) ═══ */}
        {legalCards.length > 0 && (
          <div className="business-legal" data-aos="fade-up" data-aos-duration={700}>
            <div className="business-legal__heading">
              <h2 className="business-legal__title">{t("legal.title")}</h2>
              <p className="business-legal__subtitle">{t("legal.subtitle")}</p>
            </div>
            <div className="business-legal__grid">
              {legalCards.map((card, i) => (
                <div className={`business-legal__card${i === 0 ? " business-legal__card--accent" : ""}`} key={card.title}>
                  <div className="business-legal__card-icon" aria-hidden="true">
                    {i === 0 ? (
                      <svg viewBox="0 0 24 24" fill="none"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="#fff"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-2.4 8.8L8 15.2l1.4-1.4 2.2 2.2 4.6-4.6L17.6 13l-6 5.8z" fill="#fff"/></svg>
                    )}
                  </div>
                  <h3 className="business-legal__card-title">{card.title}</h3>
                  <p className="business-legal__card-text">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ BLOCK 4 — FLEET MANAGEMENT (3 cards) ═══ */}
        {fleetCards.length > 0 && (
          <div className="business-fleet" data-aos="fade-up" data-aos-duration={700}>
            <div className="business-fleet__heading">
              <h2 className="business-fleet__title">{t("fleet.title")}</h2>
              <p className="business-fleet__subtitle">{t("fleet.subtitle")}</p>
            </div>
            <div className="business-fleet__grid">
              {fleetCards.map((card, i) => (
                <div className="business-fleet__card" key={card.title}>
                  <div className={`business-fleet__card-icon business-fleet__card-icon--${i === 0 ? "green" : i === 1 ? "blue" : "orange"}`} aria-hidden="true">
                    {i === 0 && (
                      <svg viewBox="0 0 24 24" fill="none"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="#2e7d32"/></svg>
                    )}
                    {i === 1 && (
                      <svg viewBox="0 0 24 24" fill="none"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="#1565c0"/></svg>
                    )}
                    {i === 2 && (
                      <svg viewBox="0 0 24 24" fill="none"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="#ef6c00"/></svg>
                    )}
                  </div>
                  <h3 className="business-fleet__card-title">{card.title}</h3>
                  <p className="business-fleet__card-text">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ BLOCK 5 — WHO WE WORK WITH ═══ */}
        {cases.length > 0 && (
          <div className="business-cases" data-aos="fade-up" data-aos-duration={700}>
            <div className="business-cases__heading">
              <h2 className="business-cases__title">{t("cases.title")}</h2>
            </div>
            <BusinessCasesTabs items={cases} />
          </div>
        )}

        {/* ═══ BLOCK 6 — VEHICLES & CROSS-BORDER (tabs) ═══ */}
        {vehicleTabs.length > 0 && (
          <div className="business-vehicles" data-aos="fade-up" data-aos-duration={700}>
            <div className="business-vehicles__heading">
              <h2 className="business-vehicles__title">{t("vehicles.title")}</h2>
              <p className="business-vehicles__subtitle">{t("vehicles.subtitle")}</p>
            </div>
            <BusinessVehicleTabs tabs={vehicleTabs} />
          </div>
        )}

        {/* ═══ FINAL CTA ═══ */}
        <div className="business-final-cta" data-aos="fade-up" data-aos-duration={700}>
          <div className="business-final-cta__left">
            <h2 className="business-final-cta__title">{t("finalCta.title")}</h2>
            <p className="business-final-cta__text">{t("finalCta.subtitle")}</p>
            {finalCtaFeatures.length > 0 && (
              <ul className="business-final-cta__features">
                {finalCtaFeatures.map((f) => (
                  <li className="business-final-cta__feature" key={f}>
                    <svg className="business-final-cta__feature-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="business-final-cta__right">
            <BusinessInlineForm />
          </div>
        </div>
      </div>
    </>
  );
}
