"use client";

import { getPathname, type Locale, usePathname } from "@/i18n/request";
import { LOCALE_SWITCH_HISTORY_KEY } from "@/lib/utils/localeHistory";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";

type Props = {
  locales: readonly Locale[];
  defaultLocale: Locale;
  labels: Record<string, string>;
};

export default function LanguageSwitcherClient({
  locales,
  defaultLocale,
  labels,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const pathname = usePathname() || "/";
  const currentLocale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const [hash, setHash] = useState<string>("");

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

  const buildLocalizedHref = useCallback(
    (nextLocale: Locale) => {
      const queryString = searchParams.toString();
      const href = `${pathname}${queryString ? `?${queryString}` : ""}${hash}`;
      return getPathname({
        href,
        locale: nextLocale,
      });
    },
    [hash, pathname, searchParams],
  );

  const createLocaleClickHandler = useCallback(
    (nextLocale: Locale) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.stopPropagation();

      if (nextLocale === currentLocale) {
        event.preventDefault();
        setOpen(false);
        return;
      }

      const isModifiedClick =
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey;

      if (isModifiedClick) {
        return;
      }

      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
      sessionStorage.setItem(
        LOCALE_SWITCH_HISTORY_KEY,
        JSON.stringify({
          locale: nextLocale,
          createdAt: Date.now(),
        }),
      );
      setOpen(false);
    },
    [currentLocale],
  );

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
        tabIndex={-1}
      >
        {locales.map((locale) => {
          const isActive = locale === currentLocale;
          const href = buildLocalizedHref(locale);

          return (
            <li
              key={locale}
              data-locale={locale}
              className={`option ${isActive ? "active" : ""}`}
              role="option"
              aria-selected={isActive}
            >
              <Link
                href={href}
                replace
                className="option-text"
                onClick={createLocaleClickHandler(locale)}
              >
                {labels[locale]}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
