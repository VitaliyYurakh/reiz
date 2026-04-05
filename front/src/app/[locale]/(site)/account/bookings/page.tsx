import { getTranslations } from "next-intl/server";
import { getBookingHistory } from "@/lib/api/customer";
import BookingCard from "@/components/account/BookingCard";

export default async function BookingsPage() {
  const t = await getTranslations("account");

  const history = await getBookingHistory("active");
  const items = history.items || [];

  return (
    <div className="account-page">
      <h1 className="account-page__title">{t("bookings.title")}</h1>

      {items.length === 0 ? (
        <p className="account-page__empty">{t("bookings.empty")}</p>
      ) : (
        <div className="history-year__grid">
          {items.map((item: any) => (
            <BookingCard key={`${item._type}-${item.id}`} booking={item} />
          ))}
        </div>
      )}
    </div>
  );
}
