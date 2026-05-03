import { notFound } from "next/navigation";
import { getMyRentalInspections } from "@/lib/api/customer";
import { Link } from "@/i18n/request";
import { getLocale, getTranslations } from "next-intl/server";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "/";

const TYPE_LABEL_UK: Record<string, string> = {
  PICKUP: "Видача (PICKUP)",
  RETURN: "Повернення (RETURN)",
};

export default async function MyInspectionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getMyRentalInspections(Number(id));
  if (!data?.rental) notFound();
  const { rental, inspections } = data;
  const locale = await getLocale();
  const tComplaints = await getTranslations("account.complaints");

  return (
    <div className="account-page">
      <Link
        href="/account/bookings"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:underline"
        style={{ textDecoration: "none" }}
      >
        ← Назад до бронювань
      </Link>

      <div className="mt-3">
        <h1 className="text-xl font-bold text-gray-900">
          Огляди {rental.car.brand} {rental.car.model}
        </h1>
        <p className="mt-1 text-sm text-gray-500 font-mono">{rental.contractNumber}</p>
      </div>

      <div className="inspection-cta">
        <p className="inspection-cta__text">
          Це повний фотозвіт із документації стану авто на момент видачі та повернення.
          Якщо ви не згодні з описом пошкоджень або сумою застави — створіть звернення, і
          менеджер перегляне його у межах SLA.
        </p>
        <Link
          href={`/account/complaints/new?rentalId=${id}&category=DAMAGE`}
          className="acc-btn acc-btn--primary acc-btn--sm"
        >
          {tComplaints("cta.from_inspection")}
        </Link>
      </div>

      {inspections.length === 0 ? (
        <p className="account-page__empty mt-5">Огляди ще не проведені.</p>
      ) : (
        <div className="mt-5 space-y-6">
          {inspections.map((insp: any) => (
            <section
              key={insp.id}
              className="rounded-2xl border border-[#eee] bg-white p-4 shadow-sm"
            >
              <header className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {TYPE_LABEL_UK[insp.type] || insp.type}
                  </h2>
                  {insp.completedAt && (
                    <p className="text-xs text-gray-500 tabular-nums">
                      {new Date(insp.completedAt).toLocaleString(locale, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 text-xs">
                  {insp.odometer != null && (
                    <span className="text-gray-700">
                      <strong className="text-gray-900">{insp.odometer.toLocaleString()} км</strong>
                    </span>
                  )}
                  {insp.fuelLevel != null && (
                    <span className="text-gray-700">
                      Паливо: <strong className="text-gray-900">{insp.fuelLevel}%</strong>
                    </span>
                  )}
                </div>
              </header>

              {Array.isArray(insp.damages) && insp.damages.length > 0 && (
                <div className="mt-3 rounded-lg bg-amber-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                    Зафіксовані пошкодження ({insp.damages.length})
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-amber-900">
                    {insp.damages.map((d: any, i: number) => (
                      <li key={i}>
                        • {typeof d === "string" ? d : d.description || JSON.stringify(d)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {insp.notes && (
                <div className="mt-3">
                  <p className="text-xs uppercase tracking-wider text-gray-500">Нотатки</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{insp.notes}</p>
                </div>
              )}

              {insp.photos.length > 0 ? (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                    Фото ({insp.photos.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {insp.photos.map((photo: any) => (
                      <a
                        key={photo.id}
                        href={photo.url.startsWith("http") ? photo.url : `${BASE}static/${photo.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-lg border border-gray-200 transition-transform hover:scale-[1.02]"
                      >
                        <img
                          src={photo.url.startsWith("http") ? photo.url : `${BASE}static/${photo.url}`}
                          alt={photo.caption || "Inspection photo"}
                          className="aspect-square w-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-xs text-gray-400">Фото не додано.</p>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
