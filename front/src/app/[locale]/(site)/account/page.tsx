import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import {
  getProfile,
  getReservations,
  getRentals,
  getFavorites,
} from "@/lib/api/customer";
import { Link } from "@/i18n/request";
import ProfileCard from "@/components/account/ProfileCard";
import { ProfileEditButton, ProfileEditWrapper } from "@/components/account/ProfileSection";
import LanguagesSelect from "@/components/account/LanguagesSelect";
import StackedPhotoCard from "@/components/account/StackedPhotoCard";

export default async function AccountPage() {
  const session = await auth();
  const t = await getTranslations("account");

  const [profile, reservations, activeRentals, completedRentals, favorites] =
    await Promise.all([
      getProfile(),
      getReservations("active"),
      getRentals("active"),
      getRentals("completed"),
      getFavorites(),
    ]);

  const upcomingBooking = reservations?.[0];
  const activeRental = activeRentals?.[0];
  const totalRentals =
    (completedRentals?.length || 0) + (activeRentals?.length || 0);

  return (
    <div className="account-page">
      {/* Header: About me + Edit button */}
      <div className="account-header">
        <h1 className="account-header__title">{t("overview.title")}</h1>
        <ProfileEditButton />
      </div>

      {/* Profile card + info */}
      <div className="account-profile-row">
        <div className="account-profile-col">
          <ProfileCard profile={profile} bookingsCount={totalRentals} />

          {/* Stacked photo cards — Airbnb style */}
          {(() => {
            const tripPhotos = (completedRentals || [])
              .slice(0, 3)
              .map((r: any) => {
                const photo = r.car?.carPhoto?.[0]?.url || r.car?.previewUrl;
                return photo
                  ? `${process.env.NEXT_PUBLIC_BASE_URL || "/"}static/${photo}`
                  : null;
              })
              .filter(Boolean) as string[];

            const favPhotos = (favorites || [])
              .slice(0, 3)
              .map((f: any) => {
                const photo = f.car?.carPhoto?.[0]?.url || f.car?.previewUrl;
                return photo
                  ? `${process.env.NEXT_PUBLIC_BASE_URL || "/"}static/${photo}`
                  : null;
              })
              .filter(Boolean) as string[];

            return (
              <div className="account-stacked-grid">
                <StackedPhotoCard
                  href="/account/history"
                  label={t("nav.history")}
                  photos={tripPhotos}
                />
                <StackedPhotoCard
                  href="/account/favorites"
                  label={t("nav.favorites")}
                  photos={favPhotos}
                />
              </div>
            );
          })()}
        </div>

        <div className="account-profile-info">
          <div className="account-profile-info__item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>{profile?.email || session?.user?.email || "—"}</span>
          </div>
          <div className="account-profile-info__item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{profile?.phone || "—"}</span>
          </div>
          <LanguagesSelect languages={profile?.languages} />
          <div className="account-profile-info__item account-profile-info__item--verified">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008a05" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{t("profile.identity_verified")}</span>
          </div>
        </div>
      </div>

      <ProfileEditWrapper profile={profile} />

      <hr className="account-divider" />

      {/* Active booking */}
      {(activeRental || upcomingBooking) && (
        <>
          <div className="account-overview-section">
            <h2 className="account-overview-section__title">
              {t("bookings.title")}
            </h2>
            {activeRental ? (
              <div className="account-card account-card--accent">
                <h3 className="account-card__label">
                  {t("bookings.status")}: {t("bookings.status_active")}
                </h3>
                <p className="account-card__title">
                  {activeRental.car?.brand} {activeRental.car?.model}
                </p>
                <p className="account-card__meta">
                  {t("bookings.return")}:{" "}
                  {new Date(activeRental.returnDate).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="account-card">
                <h3 className="account-card__label">
                  {t("overview.upcoming_trip")}
                </h3>
                <p className="account-card__title">
                  {upcomingBooking.car?.brand} {upcomingBooking.car?.model}
                </p>
                <p className="account-card__meta">
                  {t("bookings.pickup")}:{" "}
                  {new Date(upcomingBooking.pickupDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
          <hr className="account-divider" />
        </>
      )}

      {/* Past rentals — Airbnb "visited places" style */}
      {completedRentals && completedRentals.length > 0 && (
        <>
          <div className="account-overview-section">
            <div className="account-overview-section__header">
              <h2 className="account-overview-section__title">
                {t("history.title")}
              </h2>
              <Link
                href="/account/history"
                className="account-overview-section__link"
              >
                {t("nav.history")} →
              </Link>
            </div>
            <div className="account-past-rentals">
              {completedRentals.slice(0, 4).map((rental: any) => {
                const car = rental.car;
                if (!car) return null;
                const date = new Date(rental.pickupDate);
                const month = date.toLocaleString("uk", { month: "long" });
                const year = date.getFullYear();

                return (
                  <div key={rental.id} className="account-past-rental">
                    <div className="account-past-rental__icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                        <path d="M16 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
                        <circle cx="5.5" cy="18" r="2" />
                        <circle cx="18.5" cy="18" r="2" />
                      </svg>
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
          <hr className="account-divider" />
        </>
      )}

      {/* Favorites */}
      {favorites && favorites.length > 0 && (
        <>
          <div className="account-overview-section">
            <div className="account-overview-section__header">
              <h2 className="account-overview-section__title">
                {t("favorites.title")}
              </h2>
              <Link
                href="/account/favorites"
                className="account-overview-section__link"
              >
                {t("nav.favorites")} →
              </Link>
            </div>
            <div className="account-overview-favorites">
              {favorites.slice(0, 3).map((fav: any) => {
                const car = fav.car;
                if (!car) return null;
                const photo = car.carPhoto?.[0]?.url || car.previewUrl;
                const tariff = car.rentalTariff?.[0];

                return (
                  <Link
                    key={car.id}
                    href={`/cars/${car.id}`}
                    className="account-overview-car"
                  >
                    {photo && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BASE_URL || "/"}static/${photo}`}
                        alt={`${car.brand} ${car.model}`}
                        className="account-overview-car__img"
                      />
                    )}
                    <div className="account-overview-car__info">
                      <p className="account-overview-car__name">
                        {car.brand} {car.model}
                      </p>
                      {tariff && (
                        <p className="account-overview-car__price">
                          ${tariff.dailyPrice}/day
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          <hr className="account-divider" />
        </>
      )}
    </div>
  );
}
