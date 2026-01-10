"use client";

import AccordionGroup from "@/components/AccordionGroup";
import type { CityFAQFormatted } from "@/data/cityContent";

type Props = {
  faqSections: CityFAQFormatted[];
  mainTitle: string;
};

export default function CityFAQ({ faqSections, mainTitle }: Props) {
  if (faqSections.length === 0) return null;

  const splitIntoColumns = (items: CityFAQFormatted[number]["items"]) => {
    if (items.length <= 3) return [items];
    const midpoint = Math.ceil(items.length / 2);
    return [items.slice(0, midpoint), items.slice(midpoint)];
  };

  return (
    <section className="faq-section mode">
      <div className="container">
        <div className="faq-section__content">
          <h2 className="h2">{mainTitle}</h2>

          <div className="faq-section__accordion">
            {faqSections.flatMap((section) => {
              const [leftItems, rightItems = []] = splitIntoColumns(section.items);
              const groups = [
                <AccordionGroup
                  key={`${section.title}-left`}
                  items={leftItems.map((el) => ({
                    title: el.question,
                    content: el.answer,
                  }))}
                  dataPretitle={section.title}
                  className="acc"
                />,
              ];

              if (rightItems.length > 0) {
                groups.push(
                  <AccordionGroup
                    key={`${section.title}-right`}
                    items={rightItems.map((el) => ({
                      title: el.question,
                      content: el.answer,
                    }))}
                    dataPretitle="\u200B"
                    className="acc"
                  />
                );
              }

              return groups;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
