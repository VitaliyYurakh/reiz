import { getMyComplaints } from "@/lib/api/customer";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/request";

const STATUS_LABEL_UK: Record<string, string> = {
  open: "Відкрита",
  in_review: "В роботі",
  awaiting_client: "Чекає вашої відповіді",
  resolved: "Вирішена",
  rejected: "Відхилена",
};

const CATEGORY_LABEL_UK: Record<string, string> = {
  DEPOSIT: "Застава",
  DAMAGE: "Пошкодження",
  FINE: "Штраф",
  SERVICE: "Сервіс",
  GDPR: "Персональні дані",
  OTHER: "Інше",
};

const STATUS_COLOR: Record<string, string> = {
  open: "#7C4DFF",
  in_review: "#FF9100",
  awaiting_client: "#00838F",
  resolved: "#4CAF50",
  rejected: "#90A4AE",
};

export default async function MyComplaintsPage() {
  const data = await getMyComplaints();
  const items = data?.items ?? [];
  const locale = await getLocale();

  return (
    <div className="account-page">
      <h1 className="account-page__title">Мої звернення</h1>

      {items.length === 0 ? (
        <p className="account-page__empty">У вас ще немає звернень.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((c: any) => (
            <li key={c.id}>
              <Link
                href={`/account/complaints/${c.id}`}
                className="block rounded-2xl border border-[#eee] bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-gray-500">{c.ticketNumber}</span>
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                        style={{ background: STATUS_COLOR[c.status] || "#90A4AE" }}
                      >
                        {STATUS_LABEL_UK[c.status] || c.status}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                        {CATEGORY_LABEL_UK[c.category] || c.category}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-base font-semibold text-gray-900">{c.subject}</h3>
                    {c.rental && (
                      <p className="mt-0.5 text-xs text-gray-500 font-mono">
                        {c.rental.contractNumber}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-gray-500 tabular-nums">
                    {new Date(c.createdAt).toLocaleDateString(locale, { day: "numeric", month: "short" })}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
