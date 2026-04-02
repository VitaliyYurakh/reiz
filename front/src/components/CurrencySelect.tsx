"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useCurrencySafe, type Currency } from "@/context/CurrencyContext";

type Opt = { value: Currency; label: string; disabled?: boolean };
const opts: Opt[] = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "UAH", label: "UAH" },
];

export default function CurrencySelect({
  name = "currency",
}: {
  name?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { currency, setCurrency } = useCurrencySafe();
  const t = useTranslations("header");
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const map = useMemo(() => new Map(opts.map((o) => [o.value, o])), []);
  const current = map.get(currency)!;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    if (open) {
      const idx = opts.findIndex((o) => o.value === currency);
      setActiveIndex(idx >= 0 ? idx : 0);
    }
  }, [open, currency]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (open) {
            const opt = opts[activeIndex];
            if (opt && !opt.disabled) {
              setCurrency(opt.value);
              setOpen(false);
            }
          } else {
            setOpen(true);
          }
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!open) {
            setOpen(true);
          } else {
            setActiveIndex((prev) => Math.min(prev + 1, opts.length - 1));
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (open) {
            setActiveIndex((prev) => Math.max(prev - 1, 0));
          }
          break;
      }
    },
    [open, activeIndex, setCurrency],
  );

  const ariaLabel = t("currency");

  return (
    <div className="custom-select choice lang" data-role="client-select" ref={rootRef}>
      <input type="hidden" name={name} value={currency} />
      <span
        className="select-text"
        id={`${listboxId}-label`}
        onClick={() => setOpen((v) => !v)}
      >
        {t("currency")}:
      </span>

      <button
        type="button"
        className={`select-field ${open ? "active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
      >
        <span className="selected-options">
          <span className="selected-option" data-value={current.value}>
            <span className="option-label">{current.label}</span>
          </span>
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
        aria-labelledby={`${listboxId}-label`}
        tabIndex={-1}
      >
        {opts.map((o, idx) => (
          <li
            key={o.value}
            role="option"
            className={`option ${o.value === currency ? "active" : ""} ${o.disabled ? "disabled" : ""} ${idx === activeIndex ? "focused" : ""}`}
            data-value={o.value}
            aria-selected={o.value === currency}
            aria-disabled={o.disabled}
            onClick={() => {
              if (o.disabled) return;
              setCurrency(o.value);
              setOpen(false);
            }}
            onMouseEnter={() => setActiveIndex(idx)}
          >
            <span className="option-text">{o.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
