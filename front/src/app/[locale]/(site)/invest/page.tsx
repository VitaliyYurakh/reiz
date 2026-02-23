import UiImage from "@/components/ui/UiImage";
import Icon from "@/components/Icon";
import React from "react";
import { getDefaultPath } from "@/lib/seo";
import { getStaticPageMetadata } from "@/lib/seo-sync";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import InvestForm from "@/app/[locale]/(site)/invest/components/InvestForm";
import { getTranslations, getLocale, setRequestLocale } from "next-intl/server";
import { type Locale, locales } from "@/i18n/request";
import type { Metadata } from "next";


export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata("investPage", locale);
}

export default async function InvestPage() {
  const locale = await getLocale() as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("investPage");

  const whyItems = t.raw("why.items") as string[];
  const reqItems = t.raw("requirements.items") as string[];

  const Txt = ({ text }: { text: string }) => (
    <>
      {text.split("\n").map((line, i) => (
        <React.Fragment key={line}>
          {line}
          {i < text.split("\n").length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );

  return (
    <div className="rental-section__inner">
      <Breadcrumbs
        mode="JsonLd"
        items={[
          { href: getDefaultPath("home"), name: t("breadcrumbs.home") },
          { href: getDefaultPath("invest"), name: t("breadcrumbs.current") },
        ]}
      />

      <div className="cert__breadcrumb">
        <span className="cert__marker" />
        <span className="cert__breadcrumb-text">{t("hero.pretitle")}</span>
      </div>

      <div className="blog-hero">
        <h1 className="blog-hero__title">{t("hero.title")}</h1>
      </div>

      <div className="rental-section__content">
        <div className="editor">
          <p>{t("hero.intro")}</p>
        </div>

        <div className="rental-section__wrapp">
          <h2 className="pretitle">{t("why.title")}</h2>

          <ul className="info-list mode">
            <li className="info-list__item">
              <span className="info-list__icon sprite">
                <i className="sprite">
                  <Icon id={"invest"} width={32} height={32} />
                </i>
              </span>
              <p>{whyItems[0]}</p>
            </li>

            <li className="info-list__item">
              <span className="info-list__icon sprite">
                <i className="sprite">
                  <Icon id={"money"} width={47} height={47} />
                </i>
              </span>
              <p>{whyItems[1]}</p>
            </li>

            <li className="info-list__item">
              <span className="info-list__icon sprite">
                <i className="sprite">
                  <UiImage
                    width={40}
                    height={40}
                    src="/img/icons/setting.svg"
                    alt="icon"
                  />
                </i>
              </span>
              <p>{whyItems[2]}</p>
            </li>

            <li className="info-list__item">
              <span className="info-list__icon sprite">
                <i className="sprite">
                  <Icon id={"group"} width={37} height={37} />
                </i>
              </span>
              <p>{whyItems[3]}</p>
            </li>

            <li className="info-list__item">
              <span className="info-list__icon sprite">
                <i className="sprite">
                  <Icon id={"shield"} width={29} height={36} />
                </i>
              </span>
              <p>{whyItems[4]}</p>
            </li>
          </ul>
        </div>

        <div className="rental-section__wrapp">
          <h2 className="pretitle">{t("requirements.title")}</h2>

          <ul className="info-list">
            <li className="info-list__item">
              <span className="info-list__icon sprite">
                <i className="sprite">
                  <Icon id={"clock"} width={35} height={35} />
                </i>
              </span>
              <p>{reqItems[0]}</p>
            </li>

            <li className="info-list__item">
              <span className="info-list__icon sprite">
                <i className="sprite">
                  <Icon id={"group2"} width={40} height={40} />
                </i>
              </span>
              <p>{reqItems[1]}</p>
            </li>

            <li className="info-list__item">
              <span className="info-list__icon sprite">
                <i className="sprite">
                  <Icon id={"artboard"} width={40} height={40} />
                </i>
              </span>
              <p>
                <Txt text={reqItems[2]} />
              </p>
            </li>

            <li className="info-list__item">
              <span className="info-list__icon sprite">
                <i className="sprite">
                  <Icon id={"icong"} width={48} height={48} />
                </i>
              </span>
              <p>{reqItems[3]}</p>
            </li>
          </ul>
        </div>

        <div className="rental-section__wrapp">
          <div className="editor">
            <h2 className="pretitle">{t("form.title")}</h2>
            <p>{t("form.text")}</p>
          </div>

          <InvestForm />
        </div>
      </div>
    </div>
  );
}
