"use client";

import { type FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import TelInput from "@/components/TelInput";
import { submitContactRequest } from "@/lib/api/feedback";

export default function ContactsForm() {
  const t = useTranslations("contactsPage");
  const [feedback, setFeedback] = useState<"success" | "error" | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneInputKey, setPhoneInputKey] = useState(0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setIsSubmitting(true);
    setFeedback("");

    try {
      await submitContactRequest({
        name: formData.get("name") as string,
        email: formData.get("mail") as string,
        phone,
        message: formData.get("mess") as string,
      });
      setFeedback("success");
      e.currentTarget.reset();
      setPhone("");
      setPhoneInputKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      setFeedback("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="main-form mode" onSubmit={handleSubmit}>
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
      <label className="main-form__label tel">
        <TelInput
          key={phoneInputKey}
          name="phone"
          id="phone"
          onChange={setPhone}
          placeholder={t("form.placeholders.phone")}
          className="contacts-phone-input"
        />
      </label>
      <label className="main-form__label">
        <input
          type="text"
          name="subject"
          id="subject"
          placeholder={t("form.placeholders.subject")}
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

      {feedback === "success" && (
        <div className="form-feedback form-feedback--success" style={{ marginBottom: "1rem", color: "green" }}>
          {t("form.success") || "Your message has been sent successfully!"}
        </div>
      )}
      {feedback === "error" && (
        <div className="form-feedback form-feedback--error" style={{ marginBottom: "1rem", color: "red" }}>
          {t("form.error") || "Failed to send message. Please try again."}
        </div>
      )}

      <button className="main-button main-button--black" type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("form.submitting") || "Sending..." : t("form.submit")}
      </button>
    </form>
  );
}
