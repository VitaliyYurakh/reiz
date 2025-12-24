import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/request";
import { getDefaultPath, getPageMetadata } from "@/lib/seo";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import AccordionGroup from "@/components/AccordionGroup";
import JsonLd from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const locale = (await params).locale;
  return getPageMetadata({
    routeKey: "faq",
    ns: "faqPage",
    locale,
  });
}

type FaqItem = {
  question: string;
  answer: string;
};

export default async function FaqPage() {
  const t = await getTranslations("faqPage");

  const faqs = t.raw("questions") as FaqItem[];
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <>
      <div
        className="faq-section__inner"
        data-aos="fade-left"
        data-aos-duration="900"
        data-aos-delay="600"
      >
        <h2 className="pretitle">{t("pretitle")}</h2>

        <Breadcrumbs
          items={[
            { href: getDefaultPath("home"), name: t("breadcrumbs.home") },
            { href: getDefaultPath("faq"), name: t("breadcrumbs.current") },
          ]}
        />

        <h1 className="main-title">{t("main_title")}</h1>

        <AccordionGroup
          items={faqs.map((el) => ({ title: el.question, content: el.answer }))}
          dataDefault={1}
          dataSingle={true}
          dataBreakpoint={576}
          dataTitle={t("faq_title")}
          dataPretitle={t("faq_pretitle")}
          className="acc"
        />
      </div>

      <JsonLd data={faqLd} />
    </>
  );
}
