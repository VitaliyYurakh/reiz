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

          <div className="faq-section__accordion faq-section__accordion--city">
            {faqSections.map((section) => (
              <div className="faq-section__group" key={section.title}>
                <div className="faq-section__group-title">{section.title}</div>
                <AccordionGroup
                  items={section.items.map((el) => ({
                    title: el.question,
                    content: el.answer,
                  }))}
                  className="acc"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
