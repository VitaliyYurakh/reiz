"use client";

import AccordionGroup from "@/components/AccordionGroup";

type FAQItem = {
  q: string;
  aHtml: string;
};

type Props = {
  title: string;
  items: FAQItem[];
};

export default function CertificateFAQ({ title, items }: Props) {
  const accordionItems = items.map((item) => ({
    title: item.q,
    content: item.aHtml,
  }));

  return (
    <section className="cert-faq-section">
      {/* Divider */}
      <div className="cert-faq-section__divider" />

      {/* Section label */}
      <div className="cert-faq-section__label">
        <span className="cert-faq-section__marker" />
        <span className="cert-faq-section__label-text">{title}</span>
      </div>

      {/* FAQ Accordion */}
      <div className="cert-faq">
        <AccordionGroup
          items={accordionItems}
          className="cert-faq__accordion acc"
        />
      </div>
    </section>
  );
}
