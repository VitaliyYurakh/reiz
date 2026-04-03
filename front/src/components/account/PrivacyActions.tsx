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

  async function handleExport() {
    setExporting(true);
    const data = await exportUserData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-data.json";
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  }

  async function handleDelete() {
    await deleteAccount();
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="account-privacy-actions">
      <button
        type="button"
        onClick={handleExport}
        className="auth-form__submit"
        disabled={exporting}
        style={{ maxWidth: 280 }}
      >
        {exporting ? "..." : t("export_btn")}
      </button>

      {!showConfirm ? (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="account-privacy-actions__delete"
        >
          {t("delete_btn")}
        </button>
      ) : (
        <div className="account-privacy-actions__confirm">
          <p>{t("delete_confirm")}</p>
          <div className="account-privacy-actions__confirm-btns">
            <button
              type="button"
              onClick={handleDelete}
              className="account-privacy-actions__confirm-yes"
            >
              {t("delete_yes")}
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="account-privacy-actions__confirm-no"
            >
              {t("delete_cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
