import type React from "react";
import { useTranslations } from "next-intl";
import AccordionGroup from "@/components/AccordionGroup";

type FAQSection = {
  title: string;
  items: {
    id: number;
    q: string;
    a: React.ReactNode;
  }[];
};

export default function FAQ() {
  const t = useTranslations("homePage.faq");
  const faqData: FAQSection[] = [
    {
      title: t("group1_pretitle"),
      items: [
        {
          id: 1,
          q: t("group1_item1_question"),
          a: t("group1_item1_answer"),
        },
        {
          id: 2,
          q: t("group1_item2_question"),
          a: t("group1_item2_answer"),
        },
        {
          id: 3,
          q: t("group1_item3_question"),
          a: t("group1_item3_answer"),
        },
      ],
    },
    {
      title: t("group2_pretitle"),
      items: [
        {
          id: 4,
          q: t("group2_item1_question"),
          a: t("group2_item1_answer"),
        },
        {
          id: 5,
          q: t("group2_item2_question"),
          a: t("group2_item2_answer"),
        },
        {
          id: 6,
          q: t("group2_item3_question"),
          a: t.raw("group2_item3_answer"),
        },
      ],
    },
    {
      title: t("group3_pretitle"),
      items: [
        {
          id: 7,
          q: t("group3_item1_question"),
          a: t("group3_item1_answer"),
        },
        {
          id: 8,
          q: t("group3_item2_question"),
          a: t("group3_item2_answer"),
        },
        {
          id: 9,
          q: t("group3_item3_question"),
          a: t("group3_item3_answer"),
        },
      ],
    },
    {
      title: t("group4_pretitle"),
      items: [
        {
          id: 10,
          q: t("group4_item1_question"),
          a: t("group4_item1_answer"),
        },
        {
          id: 11,
          q: t("group4_item2_question"),
          a: t("group4_item2_answer"),
        },
        {
          id: 12,
          q: t("group4_item3_question"),
          a: t("group4_item3_answer"),
        },
      ],
    },
  ];

  return (
    <section className="faq-section mode">
      <div className="container">
        <div className="faq-section__content">
          <h2 className="h2">{t("title")}</h2>

          <div className="faq-section__accordion">
            {faqData.map((section) => (
              <AccordionGroup
                key={section.title}
                items={section.items.map((el) => ({
                  title: el.q,
                  content: el.a,
                }))}
                dataPretitle={section.title}
                className="acc"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
