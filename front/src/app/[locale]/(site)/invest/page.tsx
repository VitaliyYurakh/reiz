import UiImage from "@/components/ui/UiImage";
import Icon from "@/components/Icon";
import React from "react";
import { getDefaultPath } from "@/lib/seo";
import { getStaticPageMetadata } from "@/lib/seo-sync";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import InvestForm from "@/app/[locale]/(site)/invest/components/InvestForm";
import InvestFaq from "@/app/[locale]/(site)/invest/components/InvestFaq";
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

type HighlightItem = { value: string; label: string };
type IncomeItem = { label: string; range: string };

export default async function InvestPage() {
  const locale = (await getLocale()) as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("investPage");

  const whyItems = t.raw("why.items") as string[];
  const reqItems = t.raw("requirements.items") as string[];
  const highlights = t.raw("highlights.items") as HighlightItem[];
  const incomeItems = t.raw("income.items") as IncomeItem[];
  const faqItems = t.raw("faq.items") as {
    question: string;
    answer: string;
  }[];

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

        {/* HIGHLIGHTS */}
        <div className="invest-highlights">
          {highlights.map((item) => (
            <div className="invest-highlights__item" key={item.value}>
              <span className="invest-highlights__value">{item.value}</span>
              <span className="invest-highlights__label">{item.label}</span>
            </div>
          ))}
        </div>

        {/* WHY */}
        <div className="rental-section__wrapp">
          <h2 className="pretitle">{t("why.title")}</h2>

          <ul className="info-list mode" style={{ maxWidth: "100%" }}>
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
                  <Icon id={"wallet"} width={47} height={47} />
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
                    src="/img/icons/settings.svg"
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

        {/* INCOME BY CLASS */}
        <div className="rental-section__wrapp">
          <h2 className="pretitle">{t("income.title")}</h2>

          <div className="editor">
            <p>{t("income.text")}</p>
          </div>

          <div className="invest-income">
            {incomeItems.map((item) => (
              <div className="invest-income__card" key={item.label}>
                <span className="invest-income__label">{item.label}</span>
                <span className="invest-income__range">{item.range}</span>
              </div>
            ))}
          </div>

          <p className="invest-disclaimer">{t("income.disclaimer")}</p>
        </div>

        {/* REQUIREMENTS */}
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
                  <Icon id={"question-circle"} width={48} height={48} />
                </i>
              </span>
              <p>{reqItems[3]}</p>
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="rental-section__wrapp">
          <h2 className="pretitle">{t("faq.title")}</h2>
          <InvestFaq
            items={faqItems.map((el) => ({
              title: el.question,
              content: el.answer,
            }))}
          />
        </div>

        {/* FORM */}
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
