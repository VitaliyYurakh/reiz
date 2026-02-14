"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import cn from "classnames";
import { cities, getCityPickupLocations } from "@/data/cities";
import type { Locale } from "@/i18n/request";
import type { LocalizedField } from "@/i18n/locale-config";

type LocationType = "pickup" | "return";

// "Within city" option translations for pickup and return
const WITHIN_CITY_OPTIONS: Record<LocationType, LocalizedField> = {
  pickup: {
    uk: "Подача у межах міста",
    ru: "Подача в пределах города",
    en: "Pickup within the city",
    pl: "Podstawienie w granicach miasta",
  },
  return: {
    uk: "Повернення у межах міста",
    ru: "Возврат в пределах города",
    en: "Return within the city",
    pl: "Zwrot w granicach miasta",
  },
};

// Cities sorted by popularity
const POPULAR_CITY_SLUGS = [
  "kyiv",
  "lviv",
  "odesa",
  "dnipro",
  "kharkiv",
  "ivano-frankivsk",
  "uzhhorod",
  "vinnytsia",
  "zaporizhzhia",
  "ternopil",
  "poltava",
  "chernivtsi",
  "mukachevo",
  "bukovel",
  "truskavets",
  "skhidnytsia",
  "boryspil",
];

export default function LocationSelect({
  value,
  onChange,
  placeholder,
  containerClassName = "",
  icon,
  locale,
  containerRef,
  locationType = "pickup",
}: {
  value?: string;
  onChange?: (value: string, citySlug: string) => void;
  placeholder?: string;
  containerClassName?: string;
  icon?: string;
  locale: Locale;
  containerRef?: (node: HTMLDivElement | null) => void;
  locationType?: LocationType;
}) {
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useId();
  const buttonId = useId();
  const ref = useRef<HTMLDivElement | null>(null);

  // Get sorted cities
  const sortedCities = useMemo(() => {
    return POPULAR_CITY_SLUGS
      .map((slug) => cities.find((c) => c.slug === slug))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);
  }, []);

  // Get locations for selected city
  const cityLocations = useMemo(() => {
    if (!selectedCity) return [];
    return getCityPickupLocations(selectedCity, locale);
  }, [selectedCity, locale]);

  // "Within city" option text based on location type
  const withinCityText = WITHIN_CITY_OPTIONS[locationType][locale];

  // Current list to display (including "within city" option when city is selected)
  const currentList = useMemo(() => {
    if (selectedCity) {
      return [withinCityText, ...cityLocations.map((loc) => loc.name)];
    }
    return sortedCities.map((c) => c.localized[locale].name);
  }, [selectedCity, cityLocations, sortedCities, locale, withinCityText]);

  const handleCityClick = useCallback((citySlug: string) => {
    setSelectedCity(citySlug);
    setActiveIndex(0);
  }, []);

  const handleLocationClick = useCallback(
    (locationName: string) => {
      if (selectedCity) {
        onChange?.(locationName, selectedCity);
        setOpen(false);
        setSelectedCity(null);
      }
    },
    [selectedCity, onChange]
  );

  const handleBack = useCallback(() => {
    setSelectedCity(null);
    setActiveIndex(0);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (!open) {
            setOpen(true);
          } else if (activeIndex >= 0) {
            if (selectedCity) {
              handleLocationClick(currentList[activeIndex]);
            } else {
              handleCityClick(sortedCities[activeIndex].slug);
            }
          }
          break;
        case "Escape":
          e.preventDefault();
          if (selectedCity) {
            handleBack();
          } else {
            setOpen(false);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!open) {
            setOpen(true);
          } else {
            setActiveIndex((prev) => Math.min(prev + 1, currentList.length - 1));
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (open) {
            setActiveIndex((prev) => Math.max(prev - 1, 0));
          }
          break;
        case "Backspace":
          if (selectedCity) {
            e.preventDefault();
            handleBack();
          }
          break;
      }
    },
    [open, activeIndex, selectedCity, currentList, sortedCities, handleCityClick, handleLocationClick, handleBack]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        setSelectedCity(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
    }
  }, [open, selectedCity]);

  const displayLabel = placeholder || "Select location";

  return (
    <div
      className={cn("custom-select", containerClassName, { open })}
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
        onClick={() => {
          setOpen((v) => !v);
          if (!open) setSelectedCity(null);
        }}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={displayLabel}
      >
        <span className="selected-options">
          {value ? (
            <span className="selected-option">
              <span className="option-label">{value}</span>
            </span>
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </span>
        <span className="arrow-down" aria-hidden="true">
          <svg width="6" height="3">
            <use href="/img/sprite/sprite.svg#arrow-d" />
          </svg>
        </span>
      </button>
      <ul
        id={listboxId}
        role="listbox"
        aria-label={displayLabel}
        className={cn("options-container", open && "active")}
        tabIndex={-1}
      >
        {selectedCity && (
          <li
            className="option option--back"
            onClick={handleBack}
          >
            <span className="option-back-icon" aria-hidden="true">
              <svg width="6" height="10" viewBox="0 0 6 10" style={{ transform: "rotate(180deg)" }}>
                <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </span>
            <span className="option-text">
              {sortedCities.find((c) => c.slug === selectedCity)?.localized[locale].name}
            </span>
          </li>
        )}
        {selectedCity
          ? (
              <>
                {/* "Within city" option */}
                <li
                  key="within-city"
                  role="option"
                  aria-selected={value === withinCityText}
                  className={cn("option option--within-city", {
                    active: value === withinCityText,
                    focused: activeIndex === 0,
                  })}
                  onClick={() => handleLocationClick(withinCityText)}
                  onMouseEnter={() => setActiveIndex(0)}
                >
                  <span className="option-text">{withinCityText}</span>
                </li>
                {/* Specific locations */}
                {cityLocations.map((loc, idx) => (
                  <li
                    key={loc.id}
                    role="option"
                    aria-selected={loc.name === value}
                    className={cn("option", {
                      active: loc.name === value,
                      focused: idx + 1 === activeIndex,
                    })}
                    onClick={() => handleLocationClick(loc.name)}
                    onMouseEnter={() => setActiveIndex(idx + 1)}
                  >
                    <span className="option-text">{loc.name}</span>
                  </li>
                ))}
              </>
            )
          : sortedCities.map((city, idx) => (
              <li
                key={city.slug}
                role="option"
                className={cn("option option--city", {
                  focused: idx === activeIndex,
                })}
                onClick={() => handleCityClick(city.slug)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <span className="option-text">{city.localized[locale].name}</span>
                <span className="option-arrow" aria-hidden="true">
                  <svg width="6" height="10" viewBox="0 0 6 10">
                    <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </span>
              </li>
            ))}
      </ul>
    </div>
  );
}
