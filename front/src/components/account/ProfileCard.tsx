"use client";

import { useSession } from "next-auth/react";

interface ProfileCardProps {
  profile: any;
  bookingsCount?: number;
}

export default function ProfileCard({ profile, bookingsCount = 0 }: ProfileCardProps) {
  const { data: session } = useSession();
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

  let timeLabel: string;
  let timeValue: number;
  if (diffYears >= 1) {
    timeValue = diffYears;
    timeLabel = diffYears === 1 ? "рік" : diffYears < 5 ? "роки" : "років";
  } else if (diffMonths >= 1) {
    timeValue = diffMonths;
    timeLabel = diffMonths === 1 ? "місяць" : diffMonths < 5 ? "місяці" : "місяців";
  } else {
    timeValue = Math.max(diffDays, 1);
    const d = timeValue;
    timeLabel = d === 1 ? "день" : (d >= 2 && d <= 4) ? "дні" : "днів";
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
          <span className="profile-card__stat-label">поїздок</span>
        </div>
        <div className="profile-card__stat-divider" />
        <div className="profile-card__stat">
          <span className="profile-card__stat-value">
            {profile?.rating ? `${(profile.rating / 10).toFixed(1)}★` : "—"}
          </span>
          <span className="profile-card__stat-label">Рейтинг</span>
        </div>
        <div className="profile-card__stat-divider" />
        <div className="profile-card__stat">
          <span className="profile-card__stat-value">{timeValue}</span>
          <span className="profile-card__stat-label">
            {timeLabel} з REIZ
          </span>
        </div>
      </div>
    </div>
  );
}
