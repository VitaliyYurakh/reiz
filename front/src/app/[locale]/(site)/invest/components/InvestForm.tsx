"use client";

import type { SyntheticEvent } from "react";
import { useTranslations } from "next-intl";
import { useInvestModal } from "@/app/[locale]/(site)/invest/components/modals";
import CustomSelect from "@/app/[locale]/components/CustomSelect";

export default function InvestForm() {
  const t = useTranslations("investPage");
  const transmissionOptions = t.raw("form.transmissionOptions") as string[];
  const invest = useInvestModal("confirm");

  const openInvest = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    invest.open({ plan: "pro" }, (result) => {
      console.log("invest result", result);
    });
  };

  return (
    <form className="main-form" onSubmit={openInvest}>
      <label className="main-form__label">
        <input
          type="text"
          name="car"
          id="car"
          placeholder={t("form.placeholders.car")}
          className="main-form__input"
        />
      </label>

      <label className="main-form__label">
        <input
          type="text"
          name="model"
          id="model"
          placeholder={t("form.placeholders.model")}
          className="main-form__input"
        />
      </label>

      <div className="main-form__fields">
        <CustomSelect
          options={transmissionOptions}
          placeholder={t("form.placeholders.transmission")}
        />

        <label className="main-form__label">
          <input
            type="text"
            name="milliage"
            id="milliage"
            placeholder={t("form.placeholders.milliage")}
            className="main-form__input"
          />
        </label>

        <label className="main-form__label">
          <input
            type="text"
            name="year"
            id="year"
            placeholder={t("form.placeholders.year")}
            className="main-form__input"
          />
        </label>

        <label className="main-form__label">
          <input
            type="text"
            name="color"
            id="color"
            placeholder={t("form.placeholders.color")}
            className="main-form__input"
          />
        </label>
      </div>

      <label className="main-form__label">
        <input
          type="text"
          name="complect"
          id="complect"
          placeholder={t("form.placeholders.complect")}
          className="main-form__input"
        />
      </label>

      <label className="main-form__label">
        <input
          type="text"
          name="name"
          id="name"
          placeholder={t("form.placeholders.name")}
          className="main-form__input"
        />
      </label>

      <label className="main-form__label">
        <input
          type="tel"
          name="phone"
          id="phone"
          placeholder={t("form.placeholders.phone")}
          className="main-form__input"
        />
      </label>

      <label className="main-form__label">
        <input
          type="email"
          name="mail"
          id="mail"
          placeholder={t("form.placeholders.mail")}
          className="main-form__input"
        />
      </label>

      <button className="main-button main-button--black" type="submit">
        {t("form.submit")}
      </button>
    </form>
  );
}
