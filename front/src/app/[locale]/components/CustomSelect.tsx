"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import cn from "classnames";

export default function CustomSelect({
  options,
  value: controlled,
  onChange = () => {},
  placeholder,
  containerClassName = "",
  icon,
  preSelectIcon,
  showArrow = true,
  containerRef,
  ariaLabel,
  defaultOption,
}: {
  options: string[];
  value?: string | null;
  onChange?: (v: string) => void;
  placeholder?: string;
  containerClassName?: string;
  icon?: string;
  preSelectIcon?: string;
  showArrow?: boolean;
  containerRef?: (node: HTMLDivElement | null) => void;
  ariaLabel?: string;
  /** When this option is selected, adds 'default-selected' class (hides text on mobile) */
  defaultOption?: string;
}) {
  const [open, setOpen] = useState(false);
  const [uncontrolled, setUncontrolled] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const value = controlled ?? uncontrolled;
  const listboxId = useId();
  const buttonId = useId();

  const list = useMemo(() => options, [options]);
  const ref = useRef<HTMLDivElement | null>(null);

  const setValue = (v: string) => {
    if (controlled === undefined) setUncontrolled(v);
    onChange?.(v);
    setOpen(false);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (open && activeIndex >= 0) {
            setValue(list[activeIndex]);
          } else {
            setOpen(!open);
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
            setActiveIndex((prev) => Math.min(prev + 1, list.length - 1));
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
    [open, activeIndex, list],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (open) {
      const idx = list.indexOf(value ?? "");
      setActiveIndex(idx >= 0 ? idx : 0);
    }
  }, [open, list, value]);

  const displayLabel = ariaLabel || placeholder || "Select option";
  const isDefaultSelected = defaultOption != null && value === defaultOption;

  return (
    <div
      className={cn("custom-select", containerClassName, {
        open,
        "default-selected": isDefaultSelected,
      })}
      ref={(node) => {
        ref.current = node;
        containerRef?.(node);
      }}
    >
      {icon && (
        <span className="select-icon" aria-hidden="true">
          <svg width="25" height="25">
            <use href={`/img/sprite/sprite.svg#${icon}`} />
          </svg>
        </span>
      )}
      <button
        type="button"
        id={buttonId}
        className={cn("select-field", open && "active")}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={displayLabel}
      >
        <div className="selected-options">
          {preSelectIcon && (
            <span className="select-icon" aria-hidden="true">
              <i className="sprite">
                <svg width="14" height="12">
                  <use href={`/img/sprite/sprite.svg#${preSelectIcon}`} />
                </svg>
              </i>
            </span>
          )}
          {value ? (
            <div className="selected-option">
              <span className="option-label">{value}</span>
            </div>
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        {showArrow && (
          <div className="arrow-down" aria-hidden="true">
            <svg width="6" height="3">
              <use href="/img/sprite/sprite.svg#arrow-d" />
            </svg>
          </div>
        )}
      </button>
      <ul
        id={listboxId}
        role="listbox"
        aria-label={displayLabel}
        className={cn("options-container", open && "active")}
        tabIndex={-1}
      >
        {list.map((opt, idx) => (
          <li
            key={opt}
            role="option"
            aria-selected={opt === value}
            className={cn("option", {
              active: opt === value,
              focused: idx === activeIndex,
            })}
            onMouseDown={(e) => {
              e.preventDefault();
              setValue(opt);
            }}
            onMouseEnter={() => setActiveIndex(idx)}
          >
            <span className="option-text">{opt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
