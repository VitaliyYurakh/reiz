import { getTranslations } from "next-intl/server";
import { getBookingHistory } from "@/lib/api/customer";
import BookingCard from "@/components/account/BookingCard";

export default async function BookingsPage() {
  const t = await getTranslations("account");

  const history = await getBookingHistory("active");
  const items = history.items || [];

  return (
    <div className="account-page">
      <div className="acc-page-header">
        <div>
          <h1>{t("bookings.title")}</h1>
          {items.length > 0 && (
            <div className="acc-page-header__sub">
              {items.length} {t("bookings.active_count_suffix")}
            </div>
          )}
        </div>
      </div>

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
