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
    <div className="privacy-actions">
      <button
        type="button"
        onClick={handleExport}
        className="privacy-actions__export"
        disabled={exporting}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {exporting ? "..." : exported ? "✓ Завантажено" : t("export_btn")}
      </button>

      {!showConfirm ? (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="privacy-actions__delete"
        >
          {t("delete_btn")}
        </button>
      ) : (
        <div className="privacy-actions__confirm">
          <div className="privacy-actions__confirm-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c13515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
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
  );
}
