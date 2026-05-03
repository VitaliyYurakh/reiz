import { getMyComplaints } from "@/lib/api/customer";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/request";

export default async function MyComplaintsPage() {
  const data = await getMyComplaints();
  const items = data?.items ?? [];
  const locale = await getLocale();
  const t = await getTranslations("account.complaints");

  return (
    <div className="account-page">
      <div className="acc-page-header">
        <div>
          <h1>{t("title")}</h1>
          {items.length > 0 && (
            <div className="acc-page-header__sub">
              {items.length} {t("count_suffix")}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <Link href="/account/complaints/new" className="acc-btn acc-btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {t("create_btn")}
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="complaints-empty">
          <div className="complaints-empty__icon" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h2 className="complaints-empty__title">{t("empty_title")}</h2>
          <p className="complaints-empty__hint">{t("empty_hint")}</p>
          <Link href="/account/complaints/new" className="acc-btn acc-btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {t("create_btn")}
          </Link>
        </div>
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
                {t(`status.${c.status}` as Parameters<typeof t>[0])}
              </span>
              <span className="acc-chip acc-chip--neutral">
                {t(`category.${c.category}` as Parameters<typeof t>[0])}
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
