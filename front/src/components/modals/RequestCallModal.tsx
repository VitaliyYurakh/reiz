"use client";

import { useTranslations } from "next-intl";
import clsx from "classnames";
import TelInput from "@/components/TelInput";
import Icon from "@/components/Icon";
import { SideBarModalSpec } from "@/components/modals/index";
import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { submitCallbackRequest } from "@/lib/api/feedback";

export default function RequestCallModal({
  close,
  isClosing,
  runCallback,
}: {
  id: string;
  data?: SideBarModalSpec["requestCall"]["data"];
  close: () => void;
  isClosing: boolean;
  runCallback: (phone: string) => void;
}) {
  const t = useTranslations("requestCallModal");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [selectedContactMethod, setSelectedContactMethod] = useState("phone");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
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

  const handlePhoneChange = useCallback((val: any) => {
    setPhone(val as string);
    setErrors((prev) => ({ ...prev, phone: undefined }));
  }, []);

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
      await submitCallbackRequest({
        name: name,
        phone: phone,
        contactMethod: selectedContactMethod,
      });

      runCallback(phone);
      close();
    } catch (error) {
      console.error(error);
      setErrors({ consent: t("errors.submitFailed") || "Failed to submit request" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`modal request-call-modal ${!isClosing ? "active" : ""}`}
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
        <div className="request-call-modal__header">
          <h2>{t("title")}</h2>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="modal-form__label">
            <input
              value={name}
              onChange={handleNameChange}
              type="text"
              name="name_offer"
              id="name_offer"
              placeholder={t("placeholder.name")}
              className={clsx("modal-form__input", {
                "main-form__input--error": Boolean(errors.name),
              })}
              aria-invalid={Boolean(errors.name)}
            />
          </label>
          {errors.name && <span className="form-error">{errors.name}</span>}

          <label className="main-form__label tel">
            <TelInput
              name="step_phone"
              id="step_phone"
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

          <div className="request-call-modal__contact">
            <div className="request-call-modal__contact-title">
              {t("contactMethods.title")}
            </div>
            <div className="request-call-modal__methods">
              <button
                type="button"
                className={clsx("request-call-modal__method", {
                  "request-call-modal__method--active": selectedContactMethod === "phone",
                })}
                onClick={() => setSelectedContactMethod("phone")}
              >
                <img
                  src="/img/icons/phone-call-icon.svg"
                  alt=""
                  width={22}
                  height={22}
                  aria-hidden="true"
                />
                <span>{t("contactMethods.options.phone.title")}</span>
              </button>
              <button
                type="button"
                className={clsx("request-call-modal__method", {
                  "request-call-modal__method--active": selectedContactMethod === "whatsapp",
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
                <span>{t("contactMethods.options.whatsapp.title")}</span>
              </button>
              <button
                type="button"
                className={clsx("request-call-modal__method", {
                  "request-call-modal__method--active": selectedContactMethod === "telegram",
                })}
                onClick={() => setSelectedContactMethod("telegram")}
              >
                <img
                  src="/img/icons/Telegram_logo.svg"
                  alt=""
                  width={22}
                  height={22}
                  aria-hidden="true"
                />
                <span>{t("contactMethods.options.telegram.title")}</span>
              </button>
              <button
                type="button"
                className={clsx("request-call-modal__method", {
                  "request-call-modal__method--active": selectedContactMethod === "viber",
                })}
                onClick={() => setSelectedContactMethod("viber")}
              >
                <img
                  src="/img/icons/viber-color-svgrepo-com.svg"
                  alt=""
                  width={22}
                  height={22}
                  aria-hidden="true"
                />
                <span>{t("contactMethods.options.viber.title")}</span>
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
            {isSubmitting ? t("submitting") || "Submitting..." : t("button")}
          </button>
          <div className="terms_and_conditions_subtitle">{t("text")}</div>
        </form>
      </div>
    </div>
  );
}
