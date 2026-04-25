"use client";

import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import TelInput from "@/components/TelInput";
import { submitContactRequest, submitComplaint } from "@/lib/api/feedback";

const CATEGORY_VALUES = ["OTHER", "DEPOSIT", "DAMAGE", "FINE", "SERVICE", "GDPR"] as const;
type CategoryValue = (typeof CATEGORY_VALUES)[number];

type CategoryDropdownProps = {
  value: CategoryValue;
  onChange: (value: CategoryValue) => void;
  options: { value: CategoryValue; label: string }[];
  placeholder: string;
};

function CategoryDropdown({ value, onChange, options, placeholder }: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number>(() =>
    Math.max(0, options.findIndex((o) => o.value === value)),
  );
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleTriggerKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleListKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + options.length) % options.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      onChange(options[highlight].value);
      setOpen(false);
    }
  };

  return (
    <div className={`category-dropdown${open ? " category-dropdown--open" : ""}`} ref={ref}>
      <button
        type="button"
        className="category-dropdown__trigger"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleTriggerKey}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
      >
        <span className={selected ? "" : "category-dropdown__placeholder"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className="category-dropdown__chevron"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1.5 6 6.5l5-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        id={listId}
        role="listbox"
        className="category-dropdown__menu"
        tabIndex={-1}
        onKeyDown={handleListKey}
      >
        {options.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            role="option"
            aria-selected={opt.value === value}
            className={`category-dropdown__option${
              opt.value === value ? " category-dropdown__option--active" : ""
            }${i === highlight ? " category-dropdown__option--highlight" : ""}`}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
            onMouseEnter={() => setHighlight(i)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ContactsForm() {
  const t = useTranslations("contactsPage");
  const [feedback, setFeedback] = useState<"success" | "error" | "">("");
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneInputKey, setPhoneInputKey] = useState(0);
  const [category, setCategory] = useState<CategoryValue>("OTHER");

  const categoryOptions = CATEGORY_VALUES.map((value) => ({
    value,
    label: t(`form.categories.${value}`),
  }));

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
          category,
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
        <input
          type="text"
          name="subject"
          id="subject"
          placeholder={t("form.placeholders.subject")}
          className="main-form__input"
        />
      </label>
      <div className="main-form__label main-form__label--select">
        <input type="hidden" name="category" value={category} />
        <CategoryDropdown
          value={category}
          onChange={setCategory}
          options={categoryOptions}
          placeholder={t("form.placeholders.category")}
        />
      </div>
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
