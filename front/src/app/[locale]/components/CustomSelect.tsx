"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
}) {
  const [open, setOpen] = useState(false);
  const [uncontrolled, setUncontrolled] = useState<string | null>(null);
  const value = controlled ?? uncontrolled;

  const list = useMemo(() => options, [options]);
  const ref = useRef<HTMLDivElement | null>(null);

  const setValue = (v: string) => {
    if (controlled === undefined) setUncontrolled(v);
    onChange?.(v);
    // setOpen(false);
  };

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

  return (
    <div
      className={cn("custom-select", containerClassName, { open })}
      onClick={() => setOpen(!open)}
      tabIndex={0}
      ref={(node) => {
        ref.current = node;
        containerRef?.(node);
      }}
    >
      {icon && (
        <span className="select-icon">
          <svg width="25" height="25">
            <use href={`/img/sprite/sprite.svg#${icon}`} />
          </svg>
        </span>
      )}
      <div
        className={cn("select-field", open && "active")}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="selected-options">
          {preSelectIcon && (
            <span className={"select-icon"}>
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
          <div className="arrow-down">
            <svg width="6" height="3">
              <use href="/img/sprite/sprite.svg#arrow-d" />
            </svg>
          </div>
        )}
      </div>
      <ul className={cn("options-container", open && "active")}>
        {list.map((opt) => (
          <li
            key={opt}
            className={cn("option", { active: opt === value })}
            onMouseDown={(e) => {
              e.preventDefault();
              setValue(opt);
            }}
          >
            <span className="option-text">{opt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
