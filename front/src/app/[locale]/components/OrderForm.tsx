"use client";

import { useCallback, useMemo, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useRentalSearch } from "@/context/RentalSearchContext";

import LocationSelect from "./LocationSelect";

const formatDateWithTime = (date: Date, locale: string) => {
  const day = date.getDate();
  const month = new Intl.DateTimeFormat(locale, { month: "short" }).format(date);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${hours}:${minutes}`;
};

export default function OrderForm() {
  const locale = useLocale() as "uk" | "ru" | "en";
  const tPersonal = useTranslations("carRentModal.personal");
  const tOrder = useTranslations("carRentModal.orderForm");
  const {
    pickupLocation,
    setPickupLocation,
    returnLocation,
    setReturnLocation,
    startDate,
    endDate,
    openDatePicker,
  } = useRentalSearch();

  const handlePickupChange = useCallback(
    (location: string) => {
      setPickupLocation(location);
    },
    [setPickupLocation]
  );

  const handleReturnChange = useCallback(
    (location: string) => {
      setReturnLocation(location);
    },
    [setReturnLocation]
  );

  const dateValue = useMemo(() => {
    if (!startDate || !endDate) return "";
    return `${formatDateWithTime(startDate, locale)} — ${formatDateWithTime(endDate, locale)}`;
  }, [endDate, locale, startDate]);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const section = document.querySelector('.catalog-section__box');
    if (!section) return;

    const targetPosition = section.getBoundingClientRect().top + window.scrollY - 100;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 1200;
    let startTime: number | null = null;

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

      if (elapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }, []);

  const handleOpenDatePicker = useCallback(() => {
    openDatePicker();
  }, [openDatePicker]);

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <LocationSelect
        icon="geo"
        value={pickupLocation}
        onChange={handlePickupChange}
        containerClassName="order"
        placeholder={tPersonal("pickupPlaceholder")}
        locale={locale}
        locationType="pickup"
      />
      <LocationSelect
        icon="geo"
        value={returnLocation}
        onChange={handleReturnChange}
        containerClassName="order"
        placeholder={tPersonal("returnPlaceholder")}
        locale={locale}
        locationType="return"
      />
      <label className="order-form__label" htmlFor="date">
        <span className="order-form__icon" aria-hidden="true">
          <svg width="21" height="21">
            <use href="/img/sprite/sprite.svg#pickup" />
          </svg>
        </span>
        <input
          type="text"
          name="date"
          id="date"
          placeholder={tOrder("datePlaceholder")}
          value={dateValue}
          readOnly
          aria-label={tOrder("datePlaceholder")}
          onClick={handleOpenDatePicker}
          onFocus={handleOpenDatePicker}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleOpenDatePicker();
            }
          }}
        />
        <span className="arrow-down" aria-hidden="true">
          <svg width="6" height="3">
            <use href="/img/sprite/sprite.svg#arrow-d" />
          </svg>
        </span>
      </label>
      <button className="main-button" type="submit">
        {tOrder("submit")}
      </button>
    </form>
  );
}
