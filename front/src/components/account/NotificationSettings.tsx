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

  const items = [
    { key: "emailDeals" as const, label: t("email_deals") },
    { key: "emailReminders" as const, label: t("email_reminders") },
    { key: "emailReceipts" as const, label: t("email_receipts") },
  ];

  return (
    <div className="account-notifications">
      {items.map(({ key, label }) => (
        <label key={key} className="account-notifications__item">
          <span>{label}</span>
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
