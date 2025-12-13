"use client";

import { useEffect, useRef, useState } from "react";

export type PillSelectOption = { label: string; value: string };

type Props = {
  value: string;
  options: PillSelectOption[];
  onChange: (v: string) => void;
  variant?: "left" | "right";
  disabled?: boolean;
  width?: number;
  height?: number;
};

export default function PillSelect({
  value,
  options,
  onChange,
  disabled,
  variant = "left",
  width = 144,
  height = 50,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const current = options.find((o) => o.value === value)?.label ?? value;

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <div
      ref={wrapRef}
      className={[
        "pill-select",
        `pill-select--${variant}`,
        open ? "is-open" : "",
      ].join(" ")}
      style={{
        ["--ps-width" as any]: `${width}px`,
        ["--ps-height" as any]: `${height}px`,
      }}
    >
      <div className="pill-select__shape">
        <button
          type="button"
          className="pill-select__button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => !disabled && setOpen((s) => !s)}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
            if (e.key === "Escape") setOpen(false);
          }}
        >
          {variant === "left" && (
            <Chevron className="pill-select__chevron pill-select__chevron--left" />
          )}
          <span className="pill-select__label">{current}</span>
          {variant === "right" && (
            <Chevron className="pill-select__chevron pill-select__chevron--right" />
          )}
        </button>
      </div>

      {open && (
        <div
          className={`pill-select__dropdown ${isMobile ? "up" : ""}`}
          role="listbox"
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={[
                "pill-select__option",
                opt.value === value ? "is-active" : "",
              ].join(" ")}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="11"
      height="7"
      viewBox="0 0 11 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 0.999982L5.5 5.82141L10 0.999982" fill="#808080" />
      <path
        d="M1 0.999982L5.5 5.82141L10 0.999982"
        stroke="#808080"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
