import { getTranslations, getLocale } from "next-intl/server";
import { auth } from "@/auth";
import {
  getProfile,
  getReservations,
  getRentals,
  getFavorites,
  getCustomerStats,
} from "@/lib/api/customer";
import { Link } from "@/i18n/request";
import ProfileCard from "@/components/account/ProfileCard";
import { ProfileEditButton, ProfileEditWrapper } from "@/components/account/ProfileSection";
import ProfileCompletionBanner from "@/components/account/ProfileCompletionBanner";

export default async function AccountPage() {
  const session = await auth();
  const t = await getTranslations("account");
  const locale = await getLocale();

  const [profile, reservations, activeRentals, completedRentals, favorites, stats] =
    await Promise.all([
      getProfile(),
      getReservations("active"),
      getRentals("active"),
      getRentals("completed"),
      getFavorites(),
      getCustomerStats(),
    ]);

  const upcomingBooking = reservations?.[0];
  const activeRental = activeRentals?.[0];
  const totalRentals = stats?.totalCompletedRentals ??
    ((completedRentals?.length || 0) + (activeRentals?.length || 0));
  const favoritesCount = favorites?.length || 0;

  const fmtD = (d: Date) =>
    d.toLocaleDateString(locale, { day: "numeric", month: "short" });

  const renderActiveCard = (booking: any, statusKey: string, statusLabel: string) => {
    const car = booking.car;
    const rawPhoto = car?.previewUrl;
    const photoSrc = rawPhoto
      ? rawPhoto.startsWith("http")
        ? rawPhoto
        : `${process.env.NEXT_PUBLIC_BASE_URL || "/"}static/${rawPhoto}`
      : null;
    const pickup = new Date(booking.pickupDate);
    const ret = new Date(booking.returnDate);

    return (
      <Link href="/account/bookings" className="active-booking-card">
        <div className="active-booking-card__photo">
          {photoSrc ? (
            <img src={photoSrc} alt={`${car?.brand} ${car?.model}`} />
          ) : (
            <div className="active-booking-card__no-photo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <path d="M16 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
                <circle cx="5.5" cy="18" r="2" />
                <circle cx="18.5" cy="18" r="2" />
              </svg>
            </div>
          )}
          <span className={`active-booking-card__status active-booking-card__status--${statusKey}`}>
            {statusLabel}
          </span>
        </div>
        <div className="active-booking-card__body">
          <h3 className="active-booking-card__name">
            {car?.brand} {car?.model}
          </h3>
          <p className="active-booking-card__dates">
            {fmtD(pickup)} — {fmtD(ret)}
          </p>
          <p className="active-booking-card__location">{booking.pickupLocation}</p>
        </div>
      </Link>
    );
  };

  return (
    <div className="account-page">
      {/* Header: About me + Edit button */}
      <div className="account-header">
        <h1 className="account-header__title">{t("overview.title")}</h1>
        <ProfileEditButton />
      </div>

      {/* Profile card */}
      <div className="account-profile-row">
        <ProfileCard profile={profile} bookingsCount={totalRentals} />

        <div className="account-profile-info">
          <div className="account-profile-info__item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 7l10 6 10-6" />
            </svg>
            <span>{profile?.email || session?.user?.email || "—"}</span>
          </div>
          <div className="account-profile-info__item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{profile?.phone || "—"}</span>
          </div>
        </div>
      </div>

      <ProfileEditWrapper profile={profile} />

      <ProfileCompletionBanner profile={profile} />

      {/* Active booking */}
      {(activeRental || upcomingBooking) && (
        <>
          <hr className="acc-divider" />
          <div className="acc-section" style={{ marginTop: 0 }}>
            <div className="acc-section__head">
              <h2>{t("bookings.title")}</h2>
              <Link href="/account/bookings">{t("nav.bookings")} →</Link>
            </div>
            {activeRental
              ? renderActiveCard(activeRental, "active", t("bookings.status_active"))
              : renderActiveCard(upcomingBooking, "upcoming", t("overview.upcoming_trip"))}
          </div>
        </>
      )}

      {/* Past rentals */}
      {completedRentals && completedRentals.length > 0 && (
        <div className="acc-section">
          <div className="acc-section__head">
            <h2>{t("history.title")}</h2>
            <Link href="/account/history">{t("nav.history")} →</Link>
          </div>
          <div className="account-past-rentals">
            {completedRentals.slice(0, 4).map((rental: any) => {
              const car = rental.car;
              if (!car) return null;
              const date = new Date(rental.pickupDate);
              const month = date.toLocaleString(locale, { month: "long" });
              const year = date.getFullYear();
              const photoSrc = car.previewUrl
                ? car.previewUrl.startsWith("http")
                  ? car.previewUrl
                  : `${process.env.NEXT_PUBLIC_BASE_URL || "/"}static/${car.previewUrl}`
                : null;

              return (
                <div key={rental.id} className="account-past-rental">
                  <div className="account-past-rental__photo">
                    {photoSrc ? (
                      <img src={photoSrc} alt={`${car.brand} ${car.model}`} />
                    ) : (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5">
                        <rect x="1" y="3" width="15" height="13" rx="2" />
                        <path d="M16 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
                        <circle cx="5.5" cy="18" r="2" />
                        <circle cx="18.5" cy="18" r="2" />
                      </svg>
                    )}
                  </div>
                  <p className="account-past-rental__name">
                    {car.brand} {car.model}
                  </p>
                  <p className="account-past-rental__date">
                    {month} {year}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="quick-links">
        <Link href="/account/favorites" className="quick-link">
          <div className="quick-link__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.6a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.07a5.5 5.5 0 0 0-7.78 7.78l1.06 1.07L12 21.23l7.78-7.78 1.06-1.07a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div className="quick-link__body">
            <div className="quick-link__title">{t("favorites.title")}</div>
            <div className="quick-link__sub">
              {favoritesCount > 0
                ? `${favoritesCount} ${t("favorites.count_suffix")}`
                : t("favorites.empty")}
            </div>
          </div>
          <svg className="quick-link__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
        <Link href="/account/notifications" className="quick-link">
          <div className="quick-link__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </div>
          <div className="quick-link__body">
            <div className="quick-link__title">{t("notifications.title")}</div>
            <div className="quick-link__sub">{t("notifications.subtitle")}</div>
          </div>
          <svg className="quick-link__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
