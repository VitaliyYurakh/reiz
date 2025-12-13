"use client";

import type { SyntheticEvent } from "react";
import { useTranslations } from "next-intl";
import { useContactsModal } from "@/app/[locale]/(site)/contacts/components/modals";

export default function ContactsForm() {
  const t = useTranslations("contactsPage");
  const invest = useContactsModal("confirm");

  const openInvest = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    invest.open({ plan: "pro" }, (result) => {
      console.log("invest result", result);
    });
  };

  return (
    <form className="main-form mode" onSubmit={openInvest}>
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
          type="email"
          name="mail"
          id="mail"
          placeholder={t("form.placeholders.email")}
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
        <textarea
          name="mess"
          id="mess"
          className="main-form__area"
          placeholder={t("form.placeholders.message")}
        ></textarea>
      </label>

      <button className="main-button main-button--black" type="submit">
        {t("form.submit")}
      </button>
    </form>
  );
}
