import { notFound } from "next/navigation";
import { getMyComplaint } from "@/lib/api/customer";
import { Link } from "@/i18n/request";
import { getLocale } from "next-intl/server";
import ComplaintReplyForm from "./ComplaintReplyForm";

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

  const closed = c.status === "resolved" || c.status === "rejected";

  return (
    <div className="account-page">
      <Link
        href="/account/complaints"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:underline"
        style={{ textDecoration: "none" }}
      >
        ← Назад до звернень
      </Link>

      <div className="mt-3 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{c.subject}</h1>
          <div className="mt-1 flex items-center gap-2 flex-wrap text-xs text-gray-500">
            <span className="font-mono">{c.ticketNumber}</span>
            <span>·</span>
            <span>{CATEGORY_LABEL_UK[c.category] || c.category}</span>
            <span>·</span>
            <span>{STATUS_LABEL_UK[c.status] || c.status}</span>
          </div>
        </div>
      </div>

      {/* Thread */}
      <div className="mt-5 space-y-3">
        {c.messages.map((msg: any) => (
          <div
            key={msg.id}
            className="rounded-2xl border bg-white p-4 shadow-sm"
            style={{
              borderColor: "#eee",
              borderLeft: `3px solid ${msg.authorType === "staff" ? "#26C6DA" : msg.authorType === "system" ? "#90A4AE" : "#FFB547"}`,
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                  style={{ background: msg.authorType === "staff" ? "#26C6DA" : "#FFB547" }}
                >
                  {msg.authorType === "staff" ? "R" : "Я"}
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {msg.authorType === "staff"
                    ? "Команда Reiz"
                    : msg.authorType === "system"
                      ? "Система"
                      : "Ви"}
                </div>
              </div>
              <span className="text-xs text-gray-500 tabular-nums">
                {new Date(msg.createdAt).toLocaleString(locale, {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-gray-800">{msg.body}</p>
            {msg.attachments && msg.attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {msg.attachments.map((url: string, i: number) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-700 hover:underline"
                  >
                    📎 файл {i + 1}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {!closed ? (
        <ComplaintReplyForm complaintId={c.id} />
      ) : (
        <p className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          Звернення закрите. Якщо у вас залишились питання — створіть нове через сторінку «Контакти».
        </p>
      )}
    </div>
  );
}
