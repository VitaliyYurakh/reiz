"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { updateProfile } from "@/lib/api/customer";

interface ProfileFormProps {
  profile: any;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const t = useTranslations("account");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    for (const [key, value] of fd.entries()) {
      data[key] = value as string;
    }

    await updateProfile(data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="account-form">
      <div className="auth-form__row">
        <div className="auth-form__field">
          <label htmlFor="firstName">{t("fields.first_name")}</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            defaultValue={profile?.firstName || ""}
          />
        </div>
        <div className="auth-form__field">
          <label htmlFor="lastName">{t("fields.last_name")}</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            defaultValue={profile?.lastName || ""}
          />
        </div>
      </div>

      <div className="auth-form__field">
        <label htmlFor="phone">{t("fields.phone")}</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={profile?.phone || ""}
        />
      </div>

      <div className="auth-form__row">
        <div className="auth-form__field">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            defaultValue={profile?.city || ""}
          />
        </div>
        <div className="auth-form__field">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            name="country"
            type="text"
            autoComplete="country-name"
            defaultValue={profile?.country || ""}
          />
        </div>
      </div>

      <div className="auth-form__field">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          autoComplete="street-address"
          defaultValue={profile?.address || ""}
        />
      </div>

      <button type="submit" className="auth-form__submit" disabled={saving}>
        {saved ? t("profile.saved") : saving ? "..." : t("profile.save")}
      </button>
    </form>
  );
}
