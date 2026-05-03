import { getMyComplaints } from "@/lib/api/customer";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/request";

const STATUS_LABEL: Record<string, Record<string, string>> = {
  uk: {
    open: "Відкрита",
    in_review: "В роботі",
    awaiting_client: "Чекає вашої відповіді",
    resolved: "Вирішена",
    rejected: "Відхилена",
  },
  ru: {
    open: "Открыта",
    in_review: "В работе",
    awaiting_client: "Ждёт вашего ответа",
    resolved: "Решена",
    rejected: "Отклонена",
  },
  en: {
    open: "Open",
    in_review: "In review",
    awaiting_client: "Awaiting reply",
    resolved: "Resolved",
    rejected: "Rejected",
  },
  pl: {
    open: "Otwarte",
    in_review: "W trakcie",
    awaiting_client: "Czeka na odpowiedź",
    resolved: "Rozwiązane",
    rejected: "Odrzucone",
  },
  ro: {
    open: "Deschis",
    in_review: "În curs",
    awaiting_client: "Așteaptă răspuns",
    resolved: "Rezolvat",
    rejected: "Respins",
  },
};

const CATEGORY_LABEL: Record<string, Record<string, string>> = {
  uk: { DEPOSIT: "Застава", DAMAGE: "Пошкодження", FINE: "Штраф", SERVICE: "Сервіс", GDPR: "Персональні дані", OTHER: "Інше" },
  ru: { DEPOSIT: "Залог", DAMAGE: "Повреждение", FINE: "Штраф", SERVICE: "Сервис", GDPR: "Персональные данные", OTHER: "Другое" },
  en: { DEPOSIT: "Deposit", DAMAGE: "Damage", FINE: "Fine", SERVICE: "Service", GDPR: "Personal data", OTHER: "Other" },
  pl: { DEPOSIT: "Depozyt", DAMAGE: "Uszkodzenie", FINE: "Mandat", SERVICE: "Serwis", GDPR: "Dane osobowe", OTHER: "Inne" },
  ro: { DEPOSIT: "Garanție", DAMAGE: "Daune", FINE: "Amendă", SERVICE: "Serviciu", GDPR: "Date personale", OTHER: "Altele" },
};

export default async function MyComplaintsPage() {
  const data = await getMyComplaints();
  const items = data?.items ?? [];
  const locale = await getLocale();
  const t = await getTranslations("account");
  const statusMap = STATUS_LABEL[locale] || STATUS_LABEL.uk;
  const categoryMap = CATEGORY_LABEL[locale] || CATEGORY_LABEL.uk;

  return (
    <div className="account-page">
      <div className="acc-page-header">
        <div>
          <h1>{t("complaints.title")}</h1>
          {items.length > 0 && (
            <div className="acc-page-header__sub">
              {items.length} {t("complaints.count_suffix")}
            </div>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="account-page__empty">{t("complaints.empty")}</p>
      ) : (
        <div className="complaints-list">
          {items.map((c: any) => (
            <Link
              key={c.id}
              href={`/account/complaints/${c.id}`}
              className="complaint-row"
            >
              <div className="complaint-row__id">{c.ticketNumber}</div>
              <span className={`acc-chip acc-chip--${c.status}`}>
                <span className="acc-chip__dot" />
                {statusMap[c.status] || c.status}
              </span>
              <span className="acc-chip acc-chip--neutral">
                {categoryMap[c.category] || c.category}
              </span>
              <div className="complaint-row__meta">
                <div className="complaint-row__theme">{c.subject}</div>
                {c.rental && (
                  <div className="complaint-row__contract">
                    {c.rental.contractNumber}
                  </div>
                )}
              </div>
              <div className="complaint-row__date">
                {new Date(c.createdAt).toLocaleDateString(locale, {
                  day: "numeric",
                  month: "short",
                })}
              </div>
              <svg
                className="complaint-row__chev"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
