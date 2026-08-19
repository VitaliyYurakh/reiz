"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Props = {
  cityContent: string;
  cityTitle: string;
};

export default function CityEditorSection({ cityContent, cityTitle }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("homePage.editor_block");

  return (
    <section
      className="editor-section homePage"
      data-aos="fade-up"
      data-aos-duration="400"
    >
      <div className="container">
        <div className="editor-section__box" data-clip={open}>
          <h2 className="h2">{cityTitle}</h2>
          <div
            className="editor"
            style={{
              maxHeight: open ? `${ref.current?.scrollHeight}px` : "164px",
              transition: "max-height 0.4s linear",
            }}
            data-clip-item={open}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: safe, generated content
            dangerouslySetInnerHTML={{ __html: cityContent }}
            ref={ref}
          />
          <button
            className="more-btn"
            type="button"
            onClick={() => setOpen(!open)}
          >
            {open ? t("show_less_button") : t("show_more_button")}
          </button>
        </div>
      </div>
    </section>
  );
}
