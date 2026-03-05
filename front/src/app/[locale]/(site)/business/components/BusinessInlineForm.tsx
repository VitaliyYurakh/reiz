"use client";

import { useTranslations } from "next-intl";
import clsx from "classnames";
import TelInput from "@/components/TelInput";
import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { submitBusinessRequest } from "@/lib/api/feedback";
import CustomSelect from "@/app/[locale]/components/CustomSelect";

export default function BusinessInlineForm() {
  const t = useTranslations("businessOfferModal");

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleCount, setVehicleCount] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [selectedContactMethod, setSelectedContactMethod] = useState("phone");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<"" | "success" | "error">("");
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    vehicleCount?: string;
    consent?: string;
  }>({});

  const phoneValidator = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 8;
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors: typeof errors = {};
    if (!name.trim()) validationErrors.name = t("errors.nameRequired");
    if (!phone.trim()) validationErrors.phone = t("errors.phoneRequired");
    else if (!phoneValidator(phone)) validationErrors.phone = t("errors.phoneInvalid");
    if (!vehicleCount) validationErrors.vehicleCount = t("errors.vehicleCountRequired");
    if (!consent) validationErrors.consent = t("errors.consentRequired");

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setFeedback("");

    try {
      const messageParts = [];
      if (company.trim()) messageParts.push(`Компанія: ${company.trim()}`);
      if (vehicleCount) messageParts.push(`Кількість авто: ${vehicleCount}`);
      messageParts.push(`Зв'язок: ${selectedContactMethod}`);

      await submitBusinessRequest({
        name: name.trim(),
        phone,
        email: "",
        message: messageParts.join(", "),
      });

      setFeedback("success");
      setName("");
      setCompany("");
      setPhone("");
      setVehicleCount(null);
      setConsent(false);
      setSelectedContactMethod("phone");
    } catch {
      setFeedback("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (feedback === "success") {
    return (
      <div className="business-inline-form__success">
        <svg viewBox="0 0 24 24" fill="none" width={40} height={40}>
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#214230" />
        </svg>
        <p>{t("success")}</p>
      </div>
    );
  }

  return (
    <form className="business-inline-form" onSubmit={handleSubmit}>
      <div className="business-inline-form__fields">
        <label className="business-inline-form__label">
          <input
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
              setErrors((p) => ({ ...p, name: undefined }));
            }}
            type="text"
            placeholder={t("placeholder.name")}
            className={clsx("business-inline-form__input", {
              "business-inline-form__input--error": Boolean(errors.name),
            })}
          />
          {errors.name && <span className="business-inline-form__error">{errors.name}</span>}
        </label>

        <label className="business-inline-form__label">
          <input
            value={company}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCompany(e.target.value)}
            type="text"
            placeholder={t("placeholder.company")}
            className="business-inline-form__input"
          />
        </label>

        <label className="business-inline-form__label business-inline-form__label--tel">
          <TelInput
            name="step_phone"
            required
            placeholder={t("placeholder.phone")}
            className={clsx("business-inline-form__input", {
              "business-inline-form__input--error": Boolean(errors.phone),
            })}
            defaultValue={phone}
            onChange={(val: any) => {
              setPhone(val as string);
              setErrors((p) => ({ ...p, phone: undefined }));
            }}
          />
          {errors.phone && <span className="business-inline-form__error">{errors.phone}</span>}
        </label>

        <div className="business-inline-form__label">
          <CustomSelect
            options={[
              t("vehicleCount.options.1"),
              t("vehicleCount.options.2-5"),
              t("vehicleCount.options.5-10"),
              t("vehicleCount.options.10+"),
            ]}
            value={vehicleCount}
            onChange={(val) => {
              setVehicleCount(val);
              setErrors((p) => ({ ...p, vehicleCount: undefined }));
            }}
            placeholder={t("vehicleCount.label")}
            ariaLabel={t("vehicleCount.label")}
            containerClassName={clsx("business-inline-select", {
              "business-inline-select--error": Boolean(errors.vehicleCount),
            })}
          />
          {errors.vehicleCount && <span className="business-inline-form__error">{errors.vehicleCount}</span>}
        </div>
      </div>

      <div className="business-inline-form__messenger">
        <span className="business-inline-form__messenger-title">{t("contactMethods.title")}</span>
        <div className="business-inline-form__methods">
          {(["phone", "whatsapp", "telegram", "viber"] as const).map((m) => (
            <button
              key={m}
              type="button"
              className={clsx("business-inline-form__method", {
                "business-inline-form__method--active": selectedContactMethod === m,
              })}
              onClick={() => setSelectedContactMethod(m)}
            >
              <img
                src={`/img/icons/${m === "phone" ? "phone-receiver" : m}${m === "viber" ? "-color" : ""}.svg`}
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
              />
              <span>{t(`contactMethods.options.${m}`)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="business-inline-form__bottom">
        <label className="custom-checkbox">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setConsent(e.target.checked);
              setErrors((p) => ({ ...p, consent: undefined }));
            }}
            className="custom-checkbox__field"
          />
          <span className="custom-checkbox__content">{t("checkbox")}</span>
        </label>
        {errors.consent && <span className="business-inline-form__error">{errors.consent}</span>}

        <button className="business-inline-form__submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("button")}
        </button>
      </div>

      {feedback === "error" && (
        <p className="business-inline-form__error-msg">{t("errors.submitFailed")}</p>
      )}
    </form>
  );
}
