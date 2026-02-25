"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { InvestModalSpec } from "@/app/[locale]/(site)/invest/components/modals";
import { submitInvestRequest } from "@/lib/api/feedback";

export default function ConfirmTicket({
  data,
  close,
  isClosing,
}: {
  id: string;
  data?: InvestModalSpec["confirm"]["data"];
  close: () => void;
  isClosing: boolean;
}) {
  const t = useTranslations("applyModal");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !data?.formData || loading) return;

    setLoading(true);
    setError(false);

    try {
      await submitInvestRequest(data.formData);
      setSuccess(true);
      setTimeout(() => close(), 2000);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`modal ${!isClosing ? "active" : ""}`}
      style={
        !isClosing
          ? { opacity: 1, display: "flex", transition: "200ms" }
          : { opacity: "0", display: "flex", transition: "300ms" }
      }
    >
      <button className="close modal__close" onClick={close} aria-label="Close">
        <svg width="24" height="24">
          <use href="/img/sprite/sprite.svg#close"></use>
        </svg>
      </button>

      <div className="editor">
        {success ? (
          <>
            <h2>{t("successTitle")}</h2>
            <p>{t("successMessage")}</p>
          </>
        ) : (
          <>
            <h2>{t("title")}</h2>
            <p>{t("consent")}</p>

            <form className="modal-form" onSubmit={handleSubmit}>
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-checkbox__field"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span className="custom-checkbox__content">
                  {t("checkboxLabel")}
                </span>
              </label>
              {error && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  {t("errorMessage")}
                </p>
              )}
              <button
                className="main-button"
                type="submit"
                disabled={!agreed || loading}
              >
                {loading ? t("loading") : t("submit")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
