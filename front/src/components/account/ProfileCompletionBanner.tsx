"use client";

import { useTranslations } from "next-intl";

interface ProfileCompletionBannerProps {
  profile: any;
}

interface Field {
  key: string;
  label: string;
  filled: boolean;
}

export default function ProfileCompletionBanner({ profile }: ProfileCompletionBannerProps) {
  const t = useTranslations("account.completion");

  if (!profile) return null;

  const fields: Field[] = [
    { key: "firstName", label: t("first_name"), filled: !!profile.firstName },
    { key: "lastName", label: t("last_name"), filled: !!profile.lastName },
    { key: "phone", label: t("phone"), filled: !!profile.phone },
    { key: "email", label: t("email"), filled: !!profile.email },
    { key: "driverLicenseNo", label: t("driver_license"), filled: !!profile.driverLicenseNo },
    { key: "driverLicenseExpiry", label: t("license_expiry"), filled: !!profile.driverLicenseExpiry },
    { key: "dateOfBirth", label: t("date_of_birth"), filled: !!profile.dateOfBirth },
    { key: "drivingSince", label: t("driving_since"), filled: !!profile.drivingSince },
  ];

  const filled = fields.filter((f) => f.filled).length;
  const total = fields.length;
  const percent = Math.round((filled / total) * 100);

  if (percent === 100) return null;

  const missing = fields.filter((f) => !f.filled);

  return (
    <div className="profile-completion">
      <div className="profile-completion__header">
        <div className="profile-completion__info">
          <h3 className="profile-completion__title">{t("title")}</h3>
          <p className="profile-completion__subtitle">{t("subtitle")}</p>
        </div>
        <span className="profile-completion__percent">{percent}%</span>
      </div>

      <div className="profile-completion__bar">
        <div
          className="profile-completion__fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="profile-completion__missing">
        {missing.map((f) => (
          <span key={f.key} className="profile-completion__tag">
            {f.label}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="profile-completion__link"
        onClick={() => window.dispatchEvent(new CustomEvent("open-profile-edit"))}
      >
        {t("complete_btn")}
      </button>
    </div>
  );
}
