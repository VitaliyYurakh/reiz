"use client";

import { useTranslations } from "next-intl";
import clsx from "classnames";
import TelInput from "@/components/TelInput";
import Icon from "@/components/Icon";
import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { submitBusinessRequest } from "@/lib/api/feedback";

export default function BusinessOfferModal({
  close,
  isClosing,
}: {
  id: string;
  data?: {};
  close: () => void;
  isClosing: boolean;
  runCallback: (phone: string) => void;
}) {
  const t = useTranslations("businessOfferModal");

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleCount, setVehicleCount] = useState("");
  const [consent, setConsent] = useState(false);
  const [selectedContactMethod, setSelectedContactMethod] = useState("phone");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
      setErrors((prev) => ({ ...prev, name: undefined }));
    },
    [],
  );

  const handleCompanyChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setCompany(event.target.value);
    },
    [],
  );

  const handlePhoneChange = useCallback((val: any) => {
    setPhone(val as string);
    setErrors((prev) => ({ ...prev, phone: undefined }));
  }, []);

  const handleVehicleCountChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setVehicleCount(event.target.value);
      setErrors((prev) => ({ ...prev, vehicleCount: undefined }));
    },
    [],
  );

  const handleConsentChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setConsent(event.target.checked);
      setErrors((prev) => ({ ...prev, consent: undefined }));
    },
    [],
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors: {
      name?: string;
      phone?: string;
      vehicleCount?: string;
      consent?: string;
    } = {};

    if (!name.trim()) {
      validationErrors.name = t("errors.nameRequired");
    }

    if (!phone.trim()) {
      validationErrors.phone = t("errors.phoneRequired");
    } else if (!phoneValidator(phone)) {
      validationErrors.phone = t("errors.phoneInvalid");
    }

    if (!vehicleCount) {
      validationErrors.vehicleCount = t("errors.vehicleCountRequired");
    }

    if (!consent) {
      validationErrors.consent = t("errors.consentRequired");
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const messageParts = [];
      if (company.trim()) messageParts.push(`Компанія: ${company.trim()}`);
      messageParts.push(`Кількість авто: ${vehicleCount}`);
      messageParts.push(`Зв'язок: ${selectedContactMethod}`);

      await submitBusinessRequest({
        name: name.trim(),
        phone: phone,
        email: "",
        message: messageParts.join(", "),
      });

      close();
    } catch (error) {
      console.error(error);
      setErrors({ consent: t("errors.submitFailed") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`modal business-offer-modal ${!isClosing ? "active" : ""}`}
      style={
        !isClosing
          ? { opacity: 1, display: "flex", transition: "200ms" }
          : { opacity: "0", display: "flex", transition: "300ms" }
      }
    >
      <button className="close modal__close" onClick={close} aria-label="Close">
        <Icon id="cross" width={12} height={12} />
      </button>

      <div className="editor">
        <div className="business-offer-modal__header">
          <h2>{t("title")}</h2>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="modal-form__label">
            <input
              value={name}
              onChange={handleNameChange}
              type="text"
              name="name_offer"
              placeholder={t("placeholder.name")}
              className={clsx("modal-form__input", {
                "main-form__input--error": Boolean(errors.name),
              })}
              aria-invalid={Boolean(errors.name)}
            />
          </label>
          {errors.name && <span className="form-error">{errors.name}</span>}

          <label className="modal-form__label">
            <input
              value={company}
              onChange={handleCompanyChange}
              type="text"
              name="company_offer"
              placeholder={t("placeholder.company")}
              className="modal-form__input"
            />
          </label>

          <label className="main-form__label tel">
            <TelInput
              name="step_phone"
              required
              placeholder={t("placeholder.phone")}
              className={clsx("modal-form__input2", {
                "main-form__tel-input--error": Boolean(errors.phone),
              })}
              defaultValue={phone}
              onChange={handlePhoneChange}
              aria-invalid={Boolean(errors.phone)}
            />
          </label>
          {errors.phone && <span className="form-error">{errors.phone}</span>}

          <label className="modal-form__label">
            <select
              value={vehicleCount}
              onChange={handleVehicleCountChange}
              className={clsx("modal-form__input modal-form__select", {
                "main-form__input--error": Boolean(errors.vehicleCount),
                "modal-form__select--placeholder": !vehicleCount,
              })}
              aria-invalid={Boolean(errors.vehicleCount)}
            >
              <option value="" disabled>
                {t("vehicleCount.label")}
              </option>
              <option value="1">{t("vehicleCount.options.1")}</option>
              <option value="2-5">{t("vehicleCount.options.2-5")}</option>
              <option value="5-10">{t("vehicleCount.options.5-10")}</option>
              <option value="10+">{t("vehicleCount.options.10+")}</option>
            </select>
          </label>
          {errors.vehicleCount && (
            <span className="form-error">{errors.vehicleCount}</span>
          )}

          <div className="business-offer-modal__contact">
            <div className="business-offer-modal__contact-title">
              {t("contactMethods.title")}
            </div>
            <div className="business-offer-modal__methods">
              <button
                type="button"
                className={clsx("business-offer-modal__method", {
                  "business-offer-modal__method--active":
                    selectedContactMethod === "phone",
                })}
                onClick={() => setSelectedContactMethod("phone")}
              >
                <img
                  src="/img/icons/phone-receiver.svg"
                  alt=""
                  width={22}
                  height={22}
                  aria-hidden="true"
                />
                <span>{t("contactMethods.options.phone")}</span>
              </button>
              <button
                type="button"
                className={clsx("business-offer-modal__method", {
                  "business-offer-modal__method--active":
                    selectedContactMethod === "whatsapp",
                })}
                onClick={() => setSelectedContactMethod("whatsapp")}
              >
                <img
                  src="/img/icons/whatsapp.svg"
                  alt=""
                  width={22}
                  height={22}
                  aria-hidden="true"
                />
                <span>{t("contactMethods.options.whatsapp")}</span>
              </button>
              <button
                type="button"
                className={clsx("business-offer-modal__method", {
                  "business-offer-modal__method--active":
                    selectedContactMethod === "telegram",
                })}
                onClick={() => setSelectedContactMethod("telegram")}
              >
                <img
                  src="/img/icons/telegram.svg"
                  alt=""
                  width={22}
                  height={22}
                  aria-hidden="true"
                />
                <span>{t("contactMethods.options.telegram")}</span>
              </button>
              <button
                type="button"
                className={clsx("business-offer-modal__method", {
                  "business-offer-modal__method--active":
                    selectedContactMethod === "viber",
                })}
                onClick={() => setSelectedContactMethod("viber")}
              >
                <img
                  src="/img/icons/viber-color.svg"
                  alt=""
                  width={22}
                  height={22}
                  aria-hidden="true"
                />
                <span>{t("contactMethods.options.viber")}</span>
              </button>
            </div>
          </div>

          <label className="custom-checkbox">
            <input
              type="checkbox"
              checked={consent}
              onChange={handleConsentChange}
              className="custom-checkbox__field"
            />
            <span className="custom-checkbox__content">{t("checkbox")}</span>
          </label>
          {errors.consent && (
            <span className="form-error" style={{ marginBottom: 0 }}>
              {errors.consent}
            </span>
          )}

          <button className="main-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("submitting") : t("button")}
          </button>
          <div className="terms_and_conditions_subtitle">{t("text")}</div>
        </form>
      </div>
    </div>
  );
}
