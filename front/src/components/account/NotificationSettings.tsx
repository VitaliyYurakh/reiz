"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { updateNotificationPreferences } from "@/lib/api/customer";

interface NotificationSettingsProps {
  preferences: {
    emailDeals: boolean;
    emailReminders: boolean;
    emailReceipts: boolean;
  };
}

export default function NotificationSettings({
  preferences,
}: NotificationSettingsProps) {
  const t = useTranslations("account.notifications");
  const [prefs, setPrefs] = useState(preferences);
  const [saved, setSaved] = useState(false);

  async function toggle(key: keyof typeof prefs) {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    await updateNotificationPreferences(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const items: { key: keyof typeof prefs; label: string; sub: string }[] = [
    { key: "emailReceipts", label: t("email_receipts"), sub: t("email_receipts_sub") },
    { key: "emailReminders", label: t("email_reminders"), sub: t("email_reminders_sub") },
    { key: "emailDeals", label: t("email_deals"), sub: t("email_deals_sub") },
  ];

  return (
    <div className="account-notifications">
      <div className="account-notifications__head">
        <div>{t("col_event")}</div>
        <div>Email</div>
      </div>
      {items.map(({ key, label, sub }) => (
        <label key={key} className="account-notifications__item">
          <div>
            <div className="account-notifications__title">{label}</div>
            <div className="account-notifications__sub">{sub}</div>
          </div>
          <input
            type="checkbox"
            checked={prefs[key]}
            onChange={() => toggle(key)}
            className="account-notifications__toggle"
          />
        </label>
      ))}
      {saved && <p className="account-notifications__saved">{t("saved")}</p>}
    </div>
  );
}
