import { notFound } from "next/navigation";
import { getMyComplaint } from "@/lib/api/customer";
import { Link } from "@/i18n/request";
import { getLocale, getTranslations } from "next-intl/server";
import ComplaintReplyForm from "./ComplaintReplyForm";

export default async function MyComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getMyComplaint(Number(id));
  if (!data?.complaint) notFound();
  const c = data.complaint;
  const locale = await getLocale();
  const t = await getTranslations("account.complaints");

  const closed = c.status === "resolved" || c.status === "rejected";

  return (
    <div className="account-page">
      <Link href="/account/complaints" className="complaint-detail__back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        {t("back_to_list")}
      </Link>

      <div className="complaint-detail__header">
        <div>
          <h1 className="complaint-detail__subject">{c.subject}</h1>
          <div className="complaint-detail__meta">
            <span className="complaint-detail__ticket">{c.ticketNumber}</span>
            <span className="complaint-detail__sep">·</span>
            <span className="acc-chip acc-chip--neutral">
              {t(`category.${c.category}` as Parameters<typeof t>[0])}
            </span>
            <span className={`acc-chip acc-chip--${c.status}`}>
              <span className="acc-chip__dot" />
              {t(`status.${c.status}` as Parameters<typeof t>[0])}
            </span>
          </div>
        </div>
      </div>

      <div className="complaint-thread">
        {c.messages.map((msg: any) => {
          const isStaff = msg.authorType === "staff";
          const isSystem = msg.authorType === "system";
          const authorLabel = isStaff
            ? t("author_staff")
            : isSystem
              ? t("author_system")
              : t("author_client");
          return (
            <article
              key={msg.id}
              className={`complaint-msg complaint-msg--${msg.authorType}`}
            >
              <header className="complaint-msg__head">
                <div className="complaint-msg__author">
                  <span className="complaint-msg__avatar" aria-hidden="true">
                    {isStaff ? "R" : isSystem ? "·" : authorLabel.slice(0, 1)}
                  </span>
                  <span className="complaint-msg__name">{authorLabel}</span>
                </div>
                <time className="complaint-msg__time" dateTime={msg.createdAt}>
                  {new Date(msg.createdAt).toLocaleString(locale, {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </header>
              <p className="complaint-msg__body">{msg.body}</p>
              {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                <ul className="complaint-msg__attachments">
                  {msg.attachments.map((url: string, i: number) => (
                    <li key={i}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 1 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                        {`#${i + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>

      {!closed ? (
        <ComplaintReplyForm complaintId={c.id} />
      ) : (
        <p className="complaint-closed-note">{t("closed_note")}</p>
      )}
    </div>
  );
}
