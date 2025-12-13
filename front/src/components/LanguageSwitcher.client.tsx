"use client";

import React, {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  children: React.ReactNode;
  locales: string[];
  defaultLocale: string;
  labels: Record<string, string>;
};

export default function LanguageSwitcherClient({
  children,
  locales,
  defaultLocale,
  labels,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const [hash, setHash] = useState<string>("");

  const currentLocale = useMemo(() => {
    const seg = pathname.split("/")[1];
    return locales.includes(seg) ? seg : defaultLocale;
  }, [pathname, locales, defaultLocale]);

  const currentLabel = labels[currentLocale] ?? labels[defaultLocale];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  useEffect(() => {
    setHash(typeof window !== "undefined" ? window.location.hash : "");
  }, [pathname, searchParams]);

  const onListClick: React.MouseEventHandler<HTMLUListElement> = (e) => {
    const a = (e.target as HTMLElement).closest("a");
    if (a) setOpen(false);
  };

  const enhancedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const childLocale = (child.props as any)["data-locale"];
    const isActive = childLocale === currentLocale;

    const nextClass = [
      "option",
      // @ts-ignore
      child.props.className,
      isActive ? "active" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return cloneElement(child as any, {
      className: nextClass,
      role: "option",
      "aria-selected": isActive,
    });
  });

  return (
    <div className="custom-select choice lang2" ref={rootRef}>
      <input type="hidden" name="custom-select-value" value={currentLabel} />

      <div
        className={`select-field ${open ? "active" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="selected-options">
          <span className="option-label">{currentLabel}</span>
        </div>
        <div className="arrow-down" aria-hidden>
          <svg width="6" height="3">
            <use href="/img/sprite/sprite.svg#angle" />
          </svg>
        </div>
      </div>

      <ul
        id="language"
        className={`options-container ${open ? "active" : ""}`}
        role="listbox"
        aria-label="Выбор языка"
        onClick={onListClick}
      >
        {enhancedChildren}
      </ul>
    </div>
  );
}
