import { getTranslations } from "next-intl/server";
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
        </div>
      </div>

      <ProfileEditWrapper profile={profile} />

      <ProfileCompletionBanner profile={profile} />

      <hr className="account-divider" />

      {/* Active booking */}
      {(activeRental || upcomingBooking) && (
        <>
          <div className="account-overview-section">
            <div className="account-overview-section__header">
              <h2 className="account-overview-section__title">
                {t("bookings.title")}
              </h2>
              <Link
                href="/account/bookings"
                className="account-overview-section__link"
              >
                {t("nav.bookings")} →
              </Link>
            </div>
            {activeRental ? (() => {
              const car = activeRental.car;
              const rawPhoto = car?.previewUrl;
              const photoSrc = rawPhoto
                ? rawPhoto.startsWith("http")
                  ? rawPhoto
                  : `${process.env.NEXT_PUBLIC_BASE_URL || "/"}static/${rawPhoto}`
                : null;
              const pickup = new Date(activeRental.pickupDate);
              const ret = new Date(activeRental.returnDate);
              const fmtD = (d: Date) => d.toLocaleDateString("uk-UA", { day: "numeric", month: "short" });

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
                    <span className="active-booking-card__status">
                      {t("bookings.status_active")}
                    </span>
                  </div>
                  <div className="active-booking-card__body">
                    <h3 className="active-booking-card__name">
                      {car?.brand} {car?.model}
                    </h3>
                    <p className="active-booking-card__dates">
                      {fmtD(pickup)} — {fmtD(ret)}
                    </p>
                    <p className="active-booking-card__location">
                      {activeRental.pickupLocation}
                    </p>
                  </div>
                </Link>
              );
            })() : (() => {
              const car = upcomingBooking.car;
              const rawPhoto = car?.previewUrl;
              const photoSrc = rawPhoto
                ? rawPhoto.startsWith("http")
                  ? rawPhoto
                  : `${process.env.NEXT_PUBLIC_BASE_URL || "/"}static/${rawPhoto}`
                : null;
              const pickup = new Date(upcomingBooking.pickupDate);
              const ret = new Date(upcomingBooking.returnDate);
              const fmtD = (d: Date) => d.toLocaleDateString("uk-UA", { day: "numeric", month: "short" });

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
                    <span className="active-booking-card__status active-booking-card__status--upcoming">
                      {t("overview.upcoming_trip")}
                    </span>
                  </div>
                  <div className="active-booking-card__body">
                    <h3 className="active-booking-card__name">
                      {car?.brand} {car?.model}
                    </h3>
                    <p className="active-booking-card__dates">
                      {fmtD(pickup)} — {fmtD(ret)}
                    </p>
                    <p className="active-booking-card__location">
                      {upcomingBooking.pickupLocation}
                    </p>
                  </div>
                </Link>
              );
            })()}
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
                const rawPhoto = car.carPhoto?.[0]?.url || car.previewUrl;
                const photo = rawPhoto
                  ? rawPhoto.startsWith("http")
                    ? rawPhoto
                    : `${process.env.NEXT_PUBLIC_BASE_URL || "/"}static/${rawPhoto}`
                  : null;
                const tariff = car.rentalTariff?.[0];

                return (
                  <Link
                    key={car.id}
                    href={`/cars/${car.id}`}
                    className="account-overview-car"
                  >
                    {photo && (
                      <img
                        src={photo}
                        alt={`${car.brand} ${car.model}`}
                        className="account-overview-car__img"
                      />
                    )}
                    <div className="account-overview-car__info">
                      <div className="account-overview-car__row">
                        <p className="account-overview-car__name">
                          {car.brand} {car.model}
                        </p>
                        <div className="account-overview-car__badges">
                          {car.isAvailable && (
                            <span className="account-overview-car__badge account-overview-car__badge--green">
                              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                <path d="M4.667 1.304c0-.344.298-.623.666-.623.369 0 .667.279.667.623v.622h4V1.304c0-.344.299-.623.667-.623s.667.279.667.623v.622h1.333c1.105 0 2 .836 2 1.867v8.711c0 1.03-.895 1.866-2 1.866H3.333c-1.104 0-2-.836-2-1.866V3.793c0-1.031.896-1.867 2-1.867h1.334V1.304Z" fill="#0EA548"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.333 5.841a.6.6 0 0 1 0 .88L7.805 10.203a.667.667 0 0 1-.943 0L4.862 8.336a.6.6 0 0 1 .943-.88l1.528 1.427 3.058-3.041a.6.6 0 0 1 .942 0Z" fill="white"/>
                              </svg>
                              Доступне
                            </span>
                          )}
                          {car.isNew && (
                            <span className="account-overview-car__badge account-overview-car__badge--new">
                              NEW
                            </span>
                          )}
                          {car.discount > 0 && (
                            <span className="account-overview-car__badge account-overview-car__badge--red">
                              -{car.discount}%
                            </span>
                          )}
                        </div>
                      </div>
                      {tariff && (
                        <p className="account-overview-car__price">
                          від {tariff.dailyPrice} USD/{t("favorites.perDay")}
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

      {/* History */}
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
        </>
      )}
    </div>
  );
}
