"use client";

import React, {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
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
  const listboxId = useId();

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          setOpen((v) => !v);
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          break;
        case "ArrowDown":
        case "ArrowUp":
          e.preventDefault();
          if (!open) setOpen(true);
          break;
      }
    },
    [open],
  );

  const onListClick: React.MouseEventHandler<HTMLUListElement> = (e) => {
    const option = (e.target as HTMLElement).closest("[data-locale]");
    const nextLocale = option?.getAttribute("data-locale");
    if (nextLocale) {
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    }
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

      <button
        type="button"
        className={`select-field ${open ? "active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label="Language"
      >
        <span className="selected-options">
          <span className="option-label">{currentLabel}</span>
        </span>
        <span className="arrow-down" aria-hidden="true">
          <svg width="6" height="3">
            <use href="/img/sprite/sprite.svg#angle" />
          </svg>
        </span>
      </button>

      <ul
        id={listboxId}
        className={`options-container ${open ? "active" : ""}`}
        role="listbox"
        aria-label="Language"
        onClick={onListClick}
        tabIndex={-1}
      >
        {enhancedChildren}
      </ul>
    </div>
  );
}
