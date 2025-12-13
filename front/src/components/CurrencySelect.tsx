"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type Opt = { value: string; label: string; disabled?: boolean };
const opts: Opt[] = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "UAH", label: "UAH" },
];

export default function CurrencySelect({
  name = "currency",
  defaultValue = "USD",
}: {
  name?: string;
  defaultValue?: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const t = useTranslations("header");

  const map = useMemo(() => new Map(opts.map((o) => [o.value, o])), []);
  const current = map.get(value)!;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const root = (e.target as Node)?.parentElement?.closest?.(
        ".custom-select.choice.lang",
      );
      if (!root) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="custom-select choice lang" data-role="client-select">
      <input type="hidden" name={name} value={value} />
      <span className="select-text">{t("currency")}:</span>

      <div
        className={`select-field ${open ? "active" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="selected-options">
          <span className="selected-option" data-value={current.value}>
            <span className="option-label">{current.label}</span>
          </span>
        </div>
        <div className="arrow-down">
          <svg width="6" height="3">
            <use href="/img/sprite/sprite.svg#angle" />
          </svg>
        </div>
      </div>

      <ul
        className={`options-container ${open ? "active" : ""}`}
        role="listbox"
      >
        {opts.map((o) => (
          <li
            key={o.value}
            className={`option ${o.value === value ? "active" : ""} ${o.disabled ? "disabled" : ""}`}
            data-value={o.value}
            aria-selected={o.value === value}
            onClick={() => {
              if (o.disabled) return;
              setValue(o.value);
              setOpen(false);
            }}
          >
            <span className="option-text">{o.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
