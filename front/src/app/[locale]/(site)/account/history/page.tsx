import { getTranslations } from "next-intl/server";
import { getReservations, getRentals } from "@/lib/api/customer";
import BookingCard from "@/components/account/BookingCard";

export default async function HistoryPage() {
  const t = await getTranslations("account");

  const [pastReservations, cancelledReservations, completedRentals] =
    await Promise.all([
      getReservations("past"),
      getReservations("cancelled"),
      getRentals("completed"),
    ]);

  const items = [
    ...(completedRentals || []).map((r: any) => ({ ...r, _type: "rental" })),
    ...(pastReservations || []).map((r: any) => ({ ...r, _type: "reservation" })),
    ...(cancelledReservations || []).map((r: any) => ({
      ...r,
      _type: "reservation",
    })),
  ];

  return (
    <div className="account-page">
      <h1 className="account-page__title">{t("history.title")}</h1>

      {items.length === 0 ? (
        <p className="account-page__empty">{t("history.empty")}</p>
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
