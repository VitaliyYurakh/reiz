"use client";

import type { SyntheticEvent } from "react";
import { useTranslations } from "next-intl";
import { useBusinessModal } from "@/app/[locale]/(site)/business/components/modals";

export default function BusinessForm() {
  const t = useTranslations("businessPage");
  const invest = useBusinessModal("offer");

  const openInvest = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    invest.open({ plan: "pro" }, (result) => {
      console.log("invest result", result);
    });
  };

  return (
    <>
      <form className="main-form mode" onSubmit={openInvest}>
        <label className="main-form__label">
          <input
            type="text"
            name="name"
            id="name"
            placeholder={t("order.form.namePlaceholder")}
            className="main-form__input"
            required
          />
          <i></i>
        </label>
        <label className="main-form__label">
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder={t("order.form.phonePlaceholder")}
            className="main-form__input"
            required
          />
          <i></i>
        </label>
        <label className="main-form__label">
          <input
            type="email"
            name="mail"
            id="mail"
            placeholder={t("order.form.emailPlaceholder")}
            className="main-form__input"
            required
          />
          <i></i>
        </label>

        <button className="main-button main-button--black" type="submit">
          {t("order.form.submit")}
        </button>
      </form>

      {/* @ts-ignore */}
      <button onClick={openInvest} className="main-button main-button--black">
        {t("order.form.submit")}
      </button>
    </>
  );
}
