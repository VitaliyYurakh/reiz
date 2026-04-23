"use client";

import { type FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import TelInput from "@/components/TelInput";
import { submitContactRequest, submitComplaint } from "@/lib/api/feedback";

const CATEGORY_OPTIONS = [
  { value: "OTHER", label: "Загальне питання" },
  { value: "DEPOSIT", label: "Спір по заставі" },
  { value: "DAMAGE", label: "Пошкодження авто" },
  { value: "FINE", label: "Спір по штрафу" },
  { value: "SERVICE", label: "Якість сервісу" },
  { value: "GDPR", label: "Персональні дані / GDPR" },
] as const;

export default function ContactsForm() {
  const t = useTranslations("contactsPage");
  const [feedback, setFeedback] = useState<"success" | "error" | "">("");
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneInputKey, setPhoneInputKey] = useState(0);
  const [category, setCategory] = useState<string>("OTHER");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = (formData.get("name") as string) || "";
    const email = (formData.get("mail") as string) || "";
    const subject = (formData.get("subject") as string) || `Звернення від ${name || "клієнта"}`;
    const message = (formData.get("mess") as string) || "";

    setIsSubmitting(true);
    setFeedback("");
    setTicketNumber(null);

    try {
      // Open a tracked Complaint for the dispute / support categories so it
      // gets a ticket number, SLA timer, and shows up in the admin queue.
      // Plain "OTHER" still goes through the legacy contact-request path
      // (managers' email inbox) for now.
      if (category !== "OTHER") {
        const res = await submitComplaint({
          category: category as any,
          subject: subject || `[${category}] звернення`,
          initialMessage: message || `(порожнє повідомлення)`,
          contactName: name || undefined,
          contactEmail: email || undefined,
          contactPhone: phone || undefined,
        });
        setTicketNumber(res.complaint.ticketNumber);
      } else {
        await submitContactRequest({ name, email, phone, message });
      }
      setFeedback("success");
      e.currentTarget.reset();
      setPhone("");
      setCategory("OTHER");
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
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="main-form__input"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
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
          {ticketNumber
            ? `Ваше звернення зареєстровано: ${ticketNumber}`
            : t("form.success") || "Your message has been sent successfully!"}
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
