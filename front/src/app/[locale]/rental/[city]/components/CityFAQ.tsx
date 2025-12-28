"use client";

import AccordionGroup from "@/components/AccordionGroup";
import type { CityFAQFormatted } from "@/data/cityContent";

type Props = {
  faqSections: CityFAQFormatted[];
  mainTitle: string;
};

export default function CityFAQ({ faqSections, mainTitle }: Props) {
  if (faqSections.length === 0) return null;

  return (
    <section className="faq-section mode">
      <div className="container">
        <div className="faq-section__content">
          <h2 className="h2">{mainTitle}</h2>

          <div className="faq-section__accordion">
            {faqSections.map((section) => (
              <AccordionGroup
                key={section.title}
                items={section.items.map((el) => ({
                  title: el.question,
                  content: el.answer,
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
