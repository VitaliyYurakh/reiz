"use client";

import clsx from "classnames";
import { useTranslations } from "next-intl";
import type { ChangeEvent } from "react";
import type { Locale } from "@/i18n/request";
import TelInput from "@/components/TelInput";

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  pickupLocation: string;
  returnLocation: string;
  flightNumber: string;
  comment: string;
  consent?: boolean;
};

interface PersonalInfoFormProps {
  formState: FormState;
  invalidFields: Set<keyof FormState>;
  locale: Locale;
  formResetKey: number;
  handleInputChange: (
    field: keyof FormState,
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange: (value: string) => void;
  setFieldRef: (field: keyof FormState) => (node: HTMLElement | null) => void;
}

export default function PersonalInfoForm({
  formState,
  invalidFields,
  formResetKey,
  handleInputChange,
  handlePhoneChange,
  setFieldRef,
}: PersonalInfoFormProps) {
  const t = useTranslations("carRentPage");

  return (
    <div className="main-form__wrapp">
      <span className="main-form__text">
        {t("personal.title")}
      </span>

      <label
        className="main-form__label"
        ref={setFieldRef("firstName")}
      >
        <input
          type="text"
          name="first_name"
          id="first_name"
          placeholder={t("personal.firstName")}
          className={clsx("main-form__input", {
            "main-form__input--error":
              invalidFields.has("firstName"),
          })}
          value={formState.firstName}
          onChange={handleInputChange("firstName")}
          required
        />
        <i></i>
      </label>
      <label
        className="main-form__label"
        ref={setFieldRef("lastName")}
      >
        <input
          type="text"
          name="last_name"
          id="last_name"
          placeholder={t("personal.lastName")}
          className={clsx("main-form__input", {
            "main-form__input--error":
              invalidFields.has("lastName"),
          })}
          value={formState.lastName}
          onChange={handleInputChange("lastName")}
          required
        />
        <i></i>
      </label>
      <label
        className="main-form__label tel"
        ref={setFieldRef("phone")}
      >
        <TelInput
          key={formResetKey}
          // @ts-expect-error
          onChange={handlePhoneChange}
          name="step_phone"
          id="step_phone"
          required
          placeholder={t("personal.phonePlaceholder")}
          className={clsx({
            "main-form__tel_input--error":
              invalidFields.has("phone"),
          })}
          defaultValue={formState.phone}
        />
        <i></i>
      </label>
      <label
        className="main-form__label"
        ref={setFieldRef("email")}
      >
        <input
          type="email"
          name="step_mail"
          id="step_mail"
          placeholder={t("personal.email")}
          className={clsx("main-form__input", {
            "main-form__input--error":
              invalidFields.has("email"),
          })}
          value={formState.email}
          onChange={handleInputChange("email")}
          required
        />
        <i></i>
      </label>
      <label className="main-form__label">
        <input
          type="text"
          name="step_mess"
          id="step_mess"
          placeholder={t("comment.placeholder")}
          className="main-form__input"
          value={formState.comment}
          onChange={handleInputChange("comment")}
        />
      </label>
      <span></span>

      <label
        className="custom-checkbox"
        style={{ marginTop: "-15px" }}
      >
        <input
          type="checkbox"
          className="custom-checkbox__field"
          checked={formState.consent}
          onChange={handleInputChange("consent")}
        />
        <span
          className="custom-checkbox__content"
          style={{ border: "none" }}
        >
          {t("agreement")}
        </span>
      </label>
    </div>
  );
}
