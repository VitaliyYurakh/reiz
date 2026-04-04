"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

interface ProfileCardProps {
  profile: any;
  bookingsCount?: number;
}

function pluralize(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const lastDigit = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (lastDigit > 1 && lastDigit < 5) return few;
  if (lastDigit === 1) return one;
  return many;
}

export default function ProfileCard({ profile, bookingsCount = 0 }: ProfileCardProps) {
  const { data: session } = useSession();
  const t = useTranslations("account.card");
  const name = profile
    ? `${profile.firstName} ${profile.lastName}`
    : session?.user?.name || "";
  const firstName = profile?.firstName || session?.user?.name?.split(" ")[0] || "";
  const lastName = profile?.lastName || session?.user?.name?.split(" ").slice(1).join(" ") || "";
  const avatar = session?.user?.image;
  const city = profile?.city || "";
  const country = profile?.country || "";
  const location = [city, country].filter(Boolean).join(", ");
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt)
    : new Date();
  const now = new Date();
  const diffMs = now.getTime() - memberSince.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  let timeUnit: string;
  let timeValue: number;
  if (diffYears >= 1) {
    timeValue = diffYears;
    timeUnit = pluralize(diffYears, t("year_one"), t("year_few"), t("year_many"));
  } else if (diffMonths >= 1) {
    timeValue = diffMonths;
    timeUnit = pluralize(diffMonths, t("month_one"), t("month_few"), t("month_many"));
  } else {
    timeValue = Math.max(diffDays, 1);
    timeUnit = pluralize(timeValue, t("day_one"), t("day_few"), t("day_many"));
  }

  return (
    <div className="profile-card">
      <div className="profile-card__left">
        <div className="profile-card__avatar-wrap">
          {avatar ? (
            <img src={avatar} alt={name} className="profile-card__avatar" referrerPolicy="no-referrer" />
          ) : (
            <div className="profile-card__avatar profile-card__avatar--placeholder">
              {firstName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="profile-card__badge">✓</div>
        </div>
        <p className="profile-card__name">{firstName} {lastName}</p>
        {location && <p className="profile-card__location">{location}</p>}
      </div>
      <div className="profile-card__right">
        <div className="profile-card__stat">
          <span className="profile-card__stat-value">{bookingsCount}</span>
          <span className="profile-card__stat-label">{t("trips")}</span>
        </div>
        <div className="profile-card__stat-divider" />
        <div className="profile-card__stat">
          <span className="profile-card__stat-value">
            {profile?.discount ? `${profile.discount}%` : "—"}
          </span>
          <span className="profile-card__stat-label">{t("discount")}</span>
        </div>
        <div className="profile-card__stat-divider" />
        <div className="profile-card__stat">
          <span className="profile-card__stat-value">{timeValue}</span>
          <span className="profile-card__stat-label">
            {t("time_with_reiz", { value: timeValue, unit: timeUnit })}
          </span>
        </div>
      </div>
    </div>
  );
}
