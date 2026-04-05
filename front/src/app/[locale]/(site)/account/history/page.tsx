import { getTranslations } from "next-intl/server";
import { getBookingHistory, getCustomerStats } from "@/lib/api/customer";
import BookingCard from "@/components/account/BookingCard";

export default async function HistoryPage() {
  const t = await getTranslations("account");

  const [history, cancelled, stats] = await Promise.all([
    getBookingHistory("history"),
    getBookingHistory("cancelled"),
    getCustomerStats(),
  ]);

  const items = history.items || [];
  const cancelledItems = cancelled.items || [];

  // Group completed by year
  const grouped: Record<number, any[]> = {};
  for (const item of items) {
    const year = new Date(item.pickupDate).getFullYear();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(item);
  }
  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="account-page">
      <h1 className="account-page__title">{t("history.title")}</h1>

      {stats && (
        <div className="history-stats">
          <div className="history-stats__item">
            <span className="history-stats__number">
              {stats.totalCompletedRentals}
            </span>
            <span className="history-stats__label">
              {t("history.completed_rentals")}
            </span>
          </div>
          <div className="history-stats__divider" />
          <div className="history-stats__item">
            <span className="history-stats__number">
              {stats.memberSince
                ? new Date(stats.memberSince).toLocaleDateString("uk-UA", {
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </span>
            <span className="history-stats__label">
              {t("history.member_since")}
            </span>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="account-page__empty">{t("history.empty")}</p>
      ) : (
        <div className="history-timeline">
          {years.map((year) => (
            <div key={year} className="history-year">
              <div className="history-year__badge">{year}</div>
              <div className="history-year__grid">
                {grouped[year].map((item: any) => (
                  <BookingCard
                    key={`${item._type}-${item.id}`}
                    booking={item}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {cancelledItems.length > 0 && (
        <div className="history-cancelled">
          <h2 className="history-cancelled__title">
            {t("history.cancelled_title")}
          </h2>
          <div className="history-year__grid">
            {cancelledItems.map((item: any) => (
              <BookingCard
                key={`${item._type}-${item.id}`}
                booking={item}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
