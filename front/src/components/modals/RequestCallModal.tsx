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

  const handleContactMethodChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSelectedContactMethod(event.target.value);
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
      <button className="close modal__close" onClick={close}>
        <Icon id="cross" width={14} height={14} />
      </button>

      <div className="editor">
        <h2>{t("title")}</h2>
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
          <div className="group">
            <div className="group-title">{t("contactMethods.title")}</div>
            <label className="custom-checkbox">
              <input
                type="radio"
                name="contactMethod"
                value="phone"
                className="custom-checkbox__field"
                checked={selectedContactMethod === "phone"}
                onChange={handleContactMethodChange}
              />
              <span className="custom-checkbox__content">
                <div>
                  {t("contactMethods.options.phone.title")}{" "}
                  <span className="gray">
                    {t("contactMethods.options.phone.description")}
                  </span>
                </div>
              </span>
            </label>
            <label className="custom-checkbox">
              <input
                type="radio"
                name="contactMethod"
                value="whatsapp"
                className="custom-checkbox__field"
                checked={selectedContactMethod === "whatsapp"}
                onChange={handleContactMethodChange}
              />
              <span className="custom-checkbox__content">
                <div>
                  {t("contactMethods.options.whatsapp.title")}{" "}
                  <span className="gray">
                    {t("contactMethods.options.whatsapp.description")}
                  </span>
                </div>
              </span>
            </label>
            <label className="custom-checkbox">
              <input
                type="radio"
                name="contactMethod"
                value="telegram"
                className="custom-checkbox__field"
                checked={selectedContactMethod === "telegram"}
                onChange={handleContactMethodChange}
              />
              <span className="custom-checkbox__content">
                <div>
                  {t("contactMethods.options.telegram.title")}{" "}
                  <span className="gray">
                    {t("contactMethods.options.telegram.description")}
                  </span>
                </div>
              </span>
            </label>
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
