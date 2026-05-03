"use client";

import { type FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/request";
import { createMyComplaint, type ComplaintCategory } from "@/lib/api/customer";

const CATEGORIES: ComplaintCategory[] = [
  "DEPOSIT",
  "DAMAGE",
  "FINE",
  "SERVICE",
  "GDPR",
  "OTHER",
];

interface RentalOption {
  id: number;
  contractNumber: string | null;
  label: string;
}

interface Props {
  rentals: RentalOption[];
  initialRentalId?: number;
  initialCategory?: ComplaintCategory;
}

export default function NewComplaintForm({ rentals, initialRentalId, initialCategory }: Props) {
  const t = useTranslations("account.complaints");
  const router = useRouter();

  const [category, setCategory] = useState<ComplaintCategory>(initialCategory ?? "OTHER");
  const [rentalId, setRentalId] = useState<string>(initialRentalId ? String(initialRentalId) : "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (subject.trim().length < 3) {
      setError(t("new.validation_subject"));
      return;
    }
    if (message.trim().length < 5) {
      setError(t("new.validation_message"));
      return;
    }

    setSubmitting(true);
    const result = await createMyComplaint({
      category,
      subject: subject.trim(),
      initialMessage: message.trim(),
      rentalId: rentalId ? Number(rentalId) : undefined,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error === "not_authenticated" ? t("new.auth_required") : t("new.error"));
      return;
    }

    setSuccessTicket(result.ticketNumber);
    // Give the user a beat to see the success message before redirect.
    setTimeout(() => router.push(`/account/complaints/${result.id}`), 900);
  };

  return (
    <form className="complaint-form" onSubmit={handleSubmit} noValidate>
      <div className="complaint-form__grid">
        <label className="complaint-form__field complaint-form__field--full">
          <span className="complaint-form__label">{t("new.category_label")}</span>
          <div className="complaint-form__chips" role="radiogroup">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={category === c}
                className={`complaint-form__chip${category === c ? " complaint-form__chip--active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {t(`category.${c}`)}
              </button>
            ))}
          </div>
          <span className="complaint-form__hint">{t(`category_hint.${category}`)}</span>
        </label>

        {rentals.length > 0 && (
          <label className="complaint-form__field complaint-form__field--full">
            <span className="complaint-form__label">{t("new.rental_label")}</span>
            <select
              className="complaint-form__select"
              value={rentalId}
              onChange={(e) => setRentalId(e.target.value)}
            >
              <option value="">{t("new.rental_placeholder")}</option>
              {rentals.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
            <span className="complaint-form__hint">{t("new.rental_hint")}</span>
          </label>
        )}

        <label className="complaint-form__field complaint-form__field--full">
          <span className="complaint-form__label">{t("new.subject_label")}</span>
          <input
            type="text"
            className="complaint-form__input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t("new.subject_placeholder")}
            maxLength={500}
            required
          />
        </label>

        <label className="complaint-form__field complaint-form__field--full">
          <span className="complaint-form__label">{t("new.message_label")}</span>
          <textarea
            className="complaint-form__textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("new.message_placeholder")}
            maxLength={20000}
            rows={8}
            required
          />
        </label>
      </div>

      {error && <p className="complaint-form__error">{error}</p>}
      {successTicket && (
        <p className="complaint-form__success">{t("new.success", { ticketNumber: successTicket })}</p>
      )}

      <div className="complaint-form__actions">
        <Link href="/account/complaints" className="acc-btn acc-btn--ghost">
          {t("new.back")}
        </Link>
        <button
          type="submit"
          className="acc-btn acc-btn--primary"
          disabled={submitting || successTicket !== null}
        >
          {submitting ? t("new.submitting") : t("new.submit")}
        </button>
      </div>
    </form>
  );
}
