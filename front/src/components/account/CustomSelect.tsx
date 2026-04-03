"use client";

import { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
  name: string;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}

export default function CustomSelect({
  name,
  label,
  placeholder,
  options,
  defaultValue = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === selected)?.label || "";

  return (
    <div className="profile-form__field" ref={ref}>
      <label>{label}</label>
      <input type="hidden" name={name} value={selected} />
      <button
        type="button"
        className={`custom-dropdown__trigger ${open ? "custom-dropdown__trigger--open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span className={selectedLabel ? "" : "custom-dropdown__placeholder"}>
          {selectedLabel || placeholder}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`custom-dropdown__arrow ${open ? "custom-dropdown__arrow--open" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="custom-dropdown__menu">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`custom-dropdown__option ${
                selected === opt.value ? "custom-dropdown__option--active" : ""
              }`}
              onClick={() => {
                setSelected(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
