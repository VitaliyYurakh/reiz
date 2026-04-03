import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { getReservations, getRentals } from "@/lib/api/customer";
import { Link } from "@/i18n/request";

export default async function AccountOverview() {
  const session = await auth();
  const t = await getTranslations("account");

  const [reservations, rentals] = await Promise.all([
    getReservations("active"),
    getRentals("active"),
  ]);

  const upcomingBooking = reservations?.[0];
  const activeRental = rentals?.[0];

  return (
    <div className="account-page">
      <h1 className="account-page__title">{t("overview.title")}</h1>
      <p className="account-page__welcome">
        {t("overview.welcome", { name: session?.user?.name || "" })}
      </p>

      <div className="account-page__cards">
        {activeRental ? (
          <div className="account-card account-card--accent">
            <h3 className="account-card__label">
              {t("bookings.status")}: Active
            </h3>
            <p className="account-card__title">
              {activeRental.car?.brand} {activeRental.car?.model}
            </p>
            <p className="account-card__meta">
              {t("bookings.return")}:{" "}
              {new Date(activeRental.returnDate).toLocaleDateString()}
            </p>
          </div>
        ) : upcomingBooking ? (
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
        ) : (
          <div className="account-card">
            <p className="account-card__empty">{t("overview.no_bookings")}</p>
          </div>
        )}
      </div>

      <div className="account-page__quick-links">
        <Link href="/account/bookings" className="account-quick-link">
          {t("nav.bookings")}
        </Link>
        <Link href="/account/favorites" className="account-quick-link">
          {t("nav.favorites")}
        </Link>
        <Link href="/account/profile" className="account-quick-link">
          {t("nav.profile")}
        </Link>
      </div>
    </div>
  );
}
