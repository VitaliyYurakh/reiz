"use client";

import { useCallback, useEffect, useMemo, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useRentalSearch } from "@/context/RentalSearchContext";

import CustomSelect from "./CustomSelect";

const formatDate = (date: Date, locale: string) => {
  const formatted = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export default function OrderForm() {
  const locale = useLocale();
  const tForm = useTranslations("homePage.order_form");
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

  const pickupOptions = useMemo(
    () => [
      tForm("pickup_option1"),
      tForm("pickup_option2"),
      tForm("pickup_option3"),
    ],
    [tForm],
  );

  const returnOptions = useMemo(
    () => [
      tForm("return_option1"),
      tForm("return_option2"),
      tForm("return_option3"),
    ],
    [tForm],
  );

  useEffect(() => {
    if (!pickupLocation && pickupOptions.length > 0) {
      setPickupLocation(pickupOptions[0]);
    }
  }, [pickupLocation, pickupOptions, setPickupLocation]);

  useEffect(() => {
    if (!returnLocation && returnOptions.length > 0) {
      setReturnLocation(returnOptions[0]);
    }
  }, [returnLocation, returnOptions, setReturnLocation]);

  const dateValue = useMemo(() => {
    if (!startDate || !endDate) return "";
    return `${formatDate(startDate, locale)} — ${formatDate(endDate, locale)}`;
  }, [endDate, locale, startDate]);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const section = document.querySelector('.catalog-section__box');
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleOpenDatePicker = useCallback(() => {
    openDatePicker();
  }, [openDatePicker]);

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <CustomSelect
        icon="geo"
        options={pickupOptions}
        value={pickupLocation}
        onChange={setPickupLocation}
        containerClassName="order"
        placeholder={tPersonal("pickupPlaceholder")}
      />
      <CustomSelect
        icon="geo"
        options={returnOptions}
        value={returnLocation}
        onChange={setReturnLocation}
        containerClassName="order"
        placeholder={tPersonal("returnPlaceholder")}
      />
      <label className="order-form__label">
        <span className="order-form__icon">
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
          onClick={handleOpenDatePicker}
          onFocus={handleOpenDatePicker}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleOpenDatePicker();
            }
          }}
        />
        <div className="arrow-down" aria-hidden>
          <svg width="6" height="3">
            <use href="/img/sprite/sprite.svg#arrow-d" />
          </svg>
        </div>
      </label>
      <button className="main-button" type="submit">
        {tOrder("submit")}
      </button>
    </form>
  );
}
