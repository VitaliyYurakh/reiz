"use client";

import AccordionGroup from "@/components/AccordionGroup";

type Props = {
  items: { title: string; content: string }[];
  className?: string;
};

export default function InvestFaq({ items, className }: Props) {
  return (
    <AccordionGroup
      items={items}
      dataSingle={true}
      className={className ?? "acc"}
    />
  );
}
