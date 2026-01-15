import type { Metadata } from "next";
import UiImage from "@/components/ui/UiImage";
import Icon from "@/components/Icon";
import { getTranslations } from "next-intl/server";
import { type Locale, locales } from "@/i18n/request";
import { getDefaultPath } from "@/lib/seo";
import { getStaticPageMetadata } from "@/lib/seo-sync";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import AccessibleTabs from "@/components/AccessibleTabs";


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

  const tabsNav = t.raw("tabs.nav") as string[];
  const tabs = t.raw("tabs.contents") as Array<{
    paragraphs?: string[];
    table?: { head: string[]; rows: string[][] };
  }>;

  return (
    <div
      className="terms-section__inner"
      data-aos="fade-left"
      data-aos-duration="900"
      data-aos-delay="600"
    >
      <h2 className="pretitle">{t("hero.pretitle")}</h2>
      <Breadcrumbs
        items={[
          { href: getDefaultPath("home"), name: t("breadcrumbs.home") },
          { href: getDefaultPath("terms"), name: t("breadcrumbs.current") },
        ]}
      />

      <div className="terms-hero">
        <h1 className="main-title">{t("hero.title")}</h1>
        <p className="terms-hero__subtitle">{t("hero.subtitle")}</p>
      </div>

      <div className="terms-section__content">
        <ul className="terms-list">
          <li className="terms-list__item">
            <span className="terms-list__title">{t("termsList.ageTitle")}</span>
            <div className="terms-list__bg">
              <UiImage
                width={480}
                height={270}
                src="/img/car/years-2.webp"
                alt="Водитель за рулем — минимальный возраст арендатора от 21 года"
                sizePreset="card"
              />
            </div>
          </li>

          <li className="terms-list__item">
            <span className="terms-list__title">
              {t("termsList.experienceTitle")}
            </span>
            <div className="terms-list__bg">
              <UiImage
                width={480}
                height={270}
                src="/img/car/mers2.webp"
                alt="Mercedes на парковке — требуемый стаж вождения от 3 лет"
                sizePreset="card"
              />
            </div>
          </li>

          <li className="terms-list__item mode">
            <p>{t("termsList.requirementsBlockLabel")}</p>
          </li>

          <li className="terms-list__item">
            <span className="terms-list__title">
              {t("termsList.citizensUA.title")}
            </span>
            <div className="terms-list__bg">
              <UiImage
                width={480}
                height={270}
                src="/img/car/ua.webp"
                alt="Панорама Киева — требования к гражданам Украины для аренды авто"
                sizePreset="card"
              />
            </div>
            <ul>
              <li>
                <p>{uaItems[0]}</p>
              </li>
              <li>
                <p>{uaItems[1]}</p>
              </li>
              <li>
                <p>{uaItems[2]}</p>
              </li>
            </ul>
          </li>

          <li className="terms-list__item">
            <span className="terms-list__title">
              {t("termsList.foreignCitizens.title")}
            </span>
            <div className="terms-list__bg">
              <UiImage
                width={480}
                height={270}
                src="/img/car/visa.webp"
                alt="Заграничный паспорт с визой — документы для иностранных граждан"
                sizePreset="card"
              />
            </div>
            <ul>
              <li>
                <p>{frItems[0]}</p>
              </li>
              <li>
                <p>{frItems[1]}</p>
              </li>
              <li>
                <p>{frItems[2]}</p>
              </li>
            </ul>
          </li>
        </ul>

        <div className="terms-card">
          <div className="terms-card__bg">
            <UiImage
              width={1000}
              height={440}
              src="/img/car/macbook2.webp"
              alt="Онлайн оформление аренды на сайте REIZ — доступные способы оплаты"
              quality={100}
            />
          </div>
          <div className="terms-card__title">{t("payments.title")}</div>

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

        <div className="terms-section__tabs">
          <AccessibleTabs
            items={tabsNav.map((nav, i) => ({
              label: nav,
              value: String(i),
              content: (
                <div className="editor">
                  <p>{tabs?.[i]?.paragraphs?.[0]}</p>
                  <ul className="terms-table">
                    <li className="terms-table__row head">
                      <span className="terms-table__value">
                        {tabs?.[i]?.table?.head?.[0]}
                      </span>
                      <span className="terms-table__value">
                        {tabs?.[i]?.table?.head?.[1]}
                      </span>
                    </li>
                    {tabs?.[i]?.table?.rows?.map((r, i) => (
                      <li className="terms-table__row" key={`${i}-${r[0]}`}>
                        <span className="terms-table__value">{r[0]}</span>
                        <span className="terms-table__value">{r[1]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
