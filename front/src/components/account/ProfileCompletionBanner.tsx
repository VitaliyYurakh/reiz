"use client";

import { useTranslations } from "next-intl";

interface ProfileCompletionBannerProps {
  profile: any;
}

interface Field {
  key: string;
  label: string;
  filled: boolean;
  icon: "phone" | "id-card" | "calendar" | "cake" | "award" | "mail" | "user";
}

function StepIcon({ name, done }: { name: Field["icon"]; done: boolean }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (done) {
    return (
      <svg {...common}>
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }
  switch (name) {
    case "phone":
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "id-card":
      return (
        <svg {...common}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <circle cx="9" cy="11" r="2.5" />
          <path d="M5 18c0-2 2-3 4-3s4 1 4 3M15 9h4M15 13h3" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      );
    case "cake":
      return (
        <svg {...common}>
          <path d="M20 21V11a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10M2 21h20M12 9V5M9 5a3 3 0 1 1 6 0M4 14c0 0 1.5 2 4 2s4-2 4-2 1.5 2 4 2 4-2 4-2" />
        </svg>
      );
    case "award":
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="6" />
          <path d="M9 14l-2 7 5-3 5 3-2-7" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 7l10 6 10-6" />
        </svg>
      );
    case "user":
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7" />
        </svg>
      );
  }
}

export default function ProfileCompletionBanner({ profile }: ProfileCompletionBannerProps) {
  const t = useTranslations("account.completion");

  if (!profile) return null;

  const fields: Field[] = [
    { key: "firstName", label: t("first_name"), filled: !!profile.firstName, icon: "user" },
    { key: "lastName", label: t("last_name"), filled: !!profile.lastName, icon: "user" },
    { key: "phone", label: t("phone"), filled: !!profile.phone, icon: "phone" },
    { key: "email", label: t("email"), filled: !!profile.email, icon: "mail" },
    { key: "driverLicenseNo", label: t("driver_license"), filled: !!profile.driverLicenseNo, icon: "id-card" },
    { key: "driverLicenseExpiry", label: t("license_expiry"), filled: !!profile.driverLicenseExpiry, icon: "calendar" },
    { key: "dateOfBirth", label: t("date_of_birth"), filled: !!profile.dateOfBirth, icon: "cake" },
    { key: "drivingSince", label: t("driving_since"), filled: !!profile.drivingSince, icon: "award" },
  ];

  const filled = fields.filter((f) => f.filled).length;
  const total = fields.length;
  const percent = Math.round((filled / total) * 100);

  if (percent === 100) return null;

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
        <div className="profile-completion__fill" style={{ width: `${percent}%` }} />
      </div>

      <div className="profile-completion__steps">
        {fields.map((f) => (
          <div
            key={f.key}
            className={`profile-completion__step${f.filled ? " profile-completion__step--done" : ""}`}
          >
            <div className="profile-completion__step-icon">
              <StepIcon name={f.icon} done={f.filled} />
            </div>
            <div className="profile-completion__step-meta">
              <span className="profile-completion__step-label">{f.label}</span>
              <span className="profile-completion__step-status">
                {f.filled ? t("status_done") : t("status_needed")}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="profile-completion__cta">
        <button
          type="button"
          className="acc-btn acc-btn--primary"
          onClick={() => window.dispatchEvent(new CustomEvent("open-profile-edit"))}
        >
          {t("complete_btn")}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
