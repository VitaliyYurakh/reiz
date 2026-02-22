import clsx from "classnames";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/request";
import type { ChangeEvent } from "react";
import LocationSelect from "@/app/[locale]/components/LocationSelect";
import TelInput from "@/components/TelInput";
import type { FormState } from "./types";

type StepOneProps = {
  formState: FormState;
  invalidFields: Set<keyof FormState>;
  formError: string | null;
  step: 1 | 2;
  totalDays: number;
  formResetKey: number;
  locale: Locale;
  close: () => void;
  handleInputChange: (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (field: "pickupLocation" | "returnLocation") => (value: string) => void;
  handlePhoneChange: (value: string) => void;
  handleSelectDates: () => void;
  handleNextStep: () => void;
  setFieldRef: (field: keyof FormState) => (node: HTMLElement | null) => void;
  renderRangeLabel: () => string;
};

export default function StepOne({
  formState,
  invalidFields,
  formError,
  step,
  totalDays,
  formResetKey,
  locale,
  close,
  handleInputChange,
  handleSelectChange,
  handlePhoneChange,
  handleSelectDates,
  handleNextStep,
  setFieldRef,
  renderRangeLabel,
}: StepOneProps) {
  const t = useTranslations("carRentModal");

  return (
    <div className="modal__step" data-step="1">
      <div className="modal-step">
        <div className="modal-step__top">
          <span className="modal-step__title">{t("steps.title")}</span>
          <div>
            <button
              type={"button"}
              className={"modal-step__back"}
              onClick={close}
            >
              {t("steps.back")}
            </button>

            <span className="modal-step__info">
              {t("steps.indicator", { current: 1, total: 2 })}
            </span>
          </div>
        </div>

        <div className="main-form">
          <div className="main-form__wrapp mode">
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
                  "main-form__tel-input--error":
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
                  "main-form__input--error": invalidFields.has("email"),
                })}
                value={formState.email}
                onChange={handleInputChange("email")}
                required
              />
              <i></i>
            </label>
          </div>

          <div className="main-form__wrapp">
            <span className="main-form__text">
              {t("personal.datesLabel")}
            </span>
            <label
              className="main-form__label calendar"
              onClick={handleSelectDates}
            >
              <input type="text" value={renderRangeLabel()} readOnly />
              <span className="selectedDays">
                {t("personal.selectedDays", { count: totalDays })}
              </span>
            </label>

            <LocationSelect
              placeholder={t("personal.pickupPlaceholder")}
              containerClassName={clsx("rent", {
                "custom-select--error":
                  invalidFields.has("pickupLocation"),
              })}
              value={formState.pickupLocation}
              onChange={handleSelectChange("pickupLocation")}
              containerRef={setFieldRef("pickupLocation")}
              locale={locale}
              locationType="pickup"
            />

            <LocationSelect
              placeholder={t("personal.returnPlaceholder")}
              containerClassName={clsx("rent", {
                "custom-select--error":
                  invalidFields.has("returnLocation"),
              })}
              value={formState.returnLocation}
              onChange={handleSelectChange("returnLocation")}
              containerRef={setFieldRef("returnLocation")}
              locale={locale}
              locationType="return"
            />

            <label className="main-form__label number">
              <input
                type="text"
                name="number"
                id="number"
                placeholder={t("personal.flightNumber")}
                className="main-form__input"
                value={formState.flightNumber}
                onChange={handleInputChange("flightNumber")}
              />
              <span>{t("personal.flightOptional")}</span>
            </label>
            <button
              className="main-button main-button--black"
              type={"button"}
              onClick={handleNextStep}
            >
              {t("steps.next")}
            </button>
          </div>
        </div>
        {formError && step === 1 && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}
      </div>
    </div>
  );
}
