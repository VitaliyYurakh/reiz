"use client";

import React, { useState } from "react";
import AccordionItem from "@/components/AccordionItem";

type Item = { title: string; content: string | React.ReactNode };

type Props = {
  items: Item[];
  className?: string;
  dataTitle?: string | number;
  dataPretitle?: string | number;
  dataDefault?: string | number;
  dataSingle?: string | boolean;
  dataBreakpoint?: string | number;
};

export default function AccordionGroup({
  items,
  className,
  dataTitle,
  dataPretitle,
  dataDefault,
  dataSingle,
  dataBreakpoint,
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <ul
      className={className || "acc"}
      data-default={dataDefault ?? undefined}
      data-single={dataSingle ?? undefined}
      data-breakpoint={dataBreakpoint ?? undefined}
      data-title={dataTitle ?? undefined}
      data-pretitle={dataPretitle ?? undefined}
    >
      {items.map((el, i) => (
        <AccordionItem
          key={el.title}
          i={i}
          title={el.title}
          content={el.content}
          open={openIndex === i}
          onToggle={() => handleToggle(i)}
        />
      ))}
    </ul>
  );
}
