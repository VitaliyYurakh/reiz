"use client";

import type React from "react";
import { useRef, useState, useEffect, useId } from "react";
import cn from "classnames";
import Icon from "@/components/Icon";

type Props = {
  title: string;
  content: string | React.ReactNode;
  liClassName?: string;
  buttonClassName?: string;
  contentClassName?: string;
  i: number;
  open?: boolean;
  onToggle?: () => void;
};

export default function AccordionItem({
  title,
  content,
  i,
  liClassName,
  contentClassName,
  buttonClassName,
  open: openProp,
  onToggle,
}: Props) {
  const [localOpen, setLocalOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState("0px");
  const uniqueId = useId();

  const isControlled =
    typeof openProp === "boolean" && typeof onToggle === "function";
  const open = isControlled ? openProp : localOpen;

  const toggleOpen = () => {
    if (isControlled) {
      onToggle && onToggle();
    } else {
      setLocalOpen((v) => !v);
    }
  };

  const ref = useRef<HTMLDivElement | null>(null);

  // Update maxHeight only on client after mount
  useEffect(() => {
    if (open && ref.current) {
      setMaxHeight(`${ref.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [open]);

  const qId = `accordion${uniqueId}-header`;
  const aId = `accordion${uniqueId}-content`;
  return (
    <li
      className={cn(liClassName || "acc__item", open ? "active" : "")}
      key={qId}
    >
      <button
        className={cn(buttonClassName || "acc__btn", open ? "active" : "")}
        id={qId}
        data-id={String(i)}
        aria-expanded={open}
        aria-controls={aId}
        onClick={toggleOpen}
      >
        {title}
        <i className="sprite">
          <Icon id={"arrow-d2"} width={20} height={12} />
        </i>
      </button>

      <div
        className={cn(contentClassName || "acc__content", open ? "active" : "")}
        role="region"
        id={aId}
        data-content={String(i)}
        style={{
          maxHeight,
          overflow: "hidden",
        }}
        aria-labelledby={qId}
        ref={ref}
      >
        {typeof content !== "string" ? (
          <div className="acc__box editor">{content}</div>
        ) : (
          <div
            className="acc__box editor"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: i18n
            dangerouslySetInnerHTML={{ __html: content as string }}
          />
        )}
      </div>
    </li>
  );
}
