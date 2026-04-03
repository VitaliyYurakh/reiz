import { getTranslations } from "next-intl/server";
import { getReservations, getRentals } from "@/lib/api/customer";
import BookingCard from "@/components/account/BookingCard";

export default async function BookingsPage() {
  const t = await getTranslations("account");

  const [reservations, rentals] = await Promise.all([
    getReservations("active"),
    getRentals("active"),
  ]);

  const items = [
    ...(rentals || []).map((r: any) => ({ ...r, _type: "rental" })),
    ...(reservations || []).map((r: any) => ({ ...r, _type: "reservation" })),
  ];

  return (
    <div className="account-page">
      <h1 className="account-page__title">{t("bookings.title")}</h1>

      {items.length === 0 ? (
        <p className="account-page__empty">{t("bookings.empty")}</p>
      ) : (
        <div className="account-page__list">
          {items.map((item: any) => (
            <BookingCard key={`${item._type}-${item.id}`} booking={item} />
          ))}
        </div>
      )}
    </div>
  );
}
