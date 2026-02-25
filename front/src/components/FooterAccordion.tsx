"use client";

import { useRef, useState, useEffect } from "react";
import cn from "classnames";

type FooterAccordionProps = {
  title: string;
  children: React.ReactNode;
};

export default function FooterAccordion({
  title,
  children,
}: FooterAccordionProps) {
  const [open, setOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState("0px");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && ref.current) {
      setMaxHeight(`${ref.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [open]);

  return (
    <div className={cn("footer-acc", open && "footer-acc--open")}>
      <button
        className="footer-acc__btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="footer-acc__icon" />
      </button>
      <div
        className="footer-acc__content"
        ref={ref}
        style={{ maxHeight, overflow: "hidden" }}
      >
        <div className="footer-acc__inner">{children}</div>
      </div>
    </div>
  );
}
