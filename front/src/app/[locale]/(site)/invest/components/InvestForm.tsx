"use client";

import { useState, type SyntheticEvent } from "react";
import { useTranslations } from "next-intl";
import { useInvestModal } from "@/app/[locale]/(site)/invest/components/modals";
import CustomSelect from "@/app/[locale]/components/CustomSelect";

export default function InvestForm() {
  const t = useTranslations("investPage");
  const transmissionOptions = t.raw("form.transmissionOptions") as string[];
  const invest = useInvestModal("confirm");
  const [transmission, setTransmission] = useState<string | null>(null);

  const openInvest = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const formData = {
      car: (fd.get("car") as string) || "",
      model: (fd.get("model") as string) || "",
      transmission: transmission || undefined,
      mileage: (fd.get("milliage") as string) || undefined,
      year: (fd.get("year") as string) || undefined,
      color: (fd.get("color") as string) || undefined,
      complect: (fd.get("complect") as string) || undefined,
      name: (fd.get("name") as string) || "",
      phone: (fd.get("phone") as string) || "",
      email: (fd.get("mail") as string) || "",
    };

    invest.open({ formData });
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
          required
        />
      </label>

      <label className="main-form__label">
        <input
          type="text"
          name="model"
          id="model"
          placeholder={t("form.placeholders.model")}
          className="main-form__input"
          required
        />
      </label>

      <div className="main-form__fields">
        <CustomSelect
          options={transmissionOptions}
          placeholder={t("form.placeholders.transmission")}
          value={transmission}
          onChange={setTransmission}
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
          required
        />
      </label>

      <label className="main-form__label">
        <input
          type="tel"
          name="phone"
          id="phone"
          placeholder={t("form.placeholders.phone")}
          className="main-form__input"
          required
        />
      </label>

      <label className="main-form__label">
        <input
          type="email"
          name="mail"
          id="mail"
          placeholder={t("form.placeholders.mail")}
          className="main-form__input"
          required
        />
      </label>

      <button className="main-button main-button--black" type="submit">
        {t("form.submit")}
      </button>
    </form>
  );
}
