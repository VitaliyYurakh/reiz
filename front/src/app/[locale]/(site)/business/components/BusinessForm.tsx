"use client";

import { type FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { submitBusinessRequest } from "@/lib/api/feedback";

export default function BusinessForm() {
  const t = useTranslations("businessPage");
  const [feedback, setFeedback] = useState<"success" | "error" | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setIsSubmitting(true);
    setFeedback("");

    try {
      await submitBusinessRequest({
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        email: formData.get("mail") as string,
        message: formData.get("message") as string,
      });
      setFeedback("success");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      setFeedback("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="main-form mode" onSubmit={handleSubmit}>
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

        {feedback === "success" && (
          <div className="form-feedback form-feedback--success" style={{ marginBottom: "1rem", color: "green" }}>
            {t("order.form.success") || "Your request has been sent successfully!"}
          </div>
        )}
        {feedback === "error" && (
          <div className="form-feedback form-feedback--error" style={{ marginBottom: "1rem", color: "red" }}>
            {t("order.form.error") || "Failed to send request. Please try again."}
          </div>
        )}

        <button className="main-button main-button--black" type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("order.form.submitting") || "Sending..." : t("order.form.submit")}
        </button>
      </form>
    </>
  );
}
