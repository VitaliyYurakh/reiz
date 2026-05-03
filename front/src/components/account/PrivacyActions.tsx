"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { exportUserData, deleteAccount } from "@/lib/api/customer";

export default function PrivacyActions() {
  const t = useTranslations("account.privacy");
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  async function handleExport() {
    setExporting(true);
    const data = await exportUserData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-reiz-data.json";
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  }

  async function handleDelete() {
    await deleteAccount();
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="privacy-cards">
      <div className="privacy-card">
        <div className="privacy-card__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M7 10l5 5 5-5M12 15V3" />
          </svg>
        </div>
        <div className="privacy-card__content">
          <h3 className="privacy-card__title">{t("export_title")}</h3>
          <p className="privacy-card__desc">{t("export_desc")}</p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="acc-btn acc-btn--secondary"
          disabled={exporting}
          style={{ alignSelf: "flex-start" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M7 10l5 5 5-5M12 15V3" />
          </svg>
          {exporting ? "..." : exported ? "✓" : t("export_btn")}
        </button>
      </div>

      <div className="privacy-card privacy-card--danger">
        <div className="privacy-card__icon privacy-card__icon--danger">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        </div>
        <div className="privacy-card__content">
          <h3 className="privacy-card__title">{t("delete_title")}</h3>
          <p className="privacy-card__desc">{t("delete_desc")}</p>
        </div>
        {!showConfirm ? (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="acc-btn acc-btn--danger"
            style={{ alignSelf: "flex-start" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            {t("delete_btn")}
          </button>
        ) : (
          <div className="privacy-actions__confirm">
            <p className="privacy-actions__confirm-text">{t("delete_confirm")}</p>
            <div className="privacy-actions__confirm-btns">
              <button
                type="button"
                onClick={handleDelete}
                className="privacy-actions__confirm-yes"
              >
                {t("delete_yes")}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="privacy-actions__confirm-no"
              >
                {t("delete_cancel")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
