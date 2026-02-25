"use client";

import AccordionGroup from "@/components/AccordionGroup";

type Props = { items: { title: string; content: string }[] };

export default function InvestFaq({ items }: Props) {
  return <AccordionGroup items={items} dataSingle={true} className="acc" />;
}
