"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { formatMoney } from "@/lib/utils/format-money";
import { requestCancellation } from "@/lib/api/customer";
import BookingModal from "./BookingModal";

interface PricingSummary {
  dailyRateMinor?: number | null;
  totalMinor?: number | null;
  currency?: string;
  totalPaidMinor?: number;
  depositAmountMinor?: number | null;
  depositReturned?: boolean;
  totalFinesMinor?: number;
  totalFinesPaidMinor?: number;
  fines?: {
    type: string;
    description: string;
    amountMinor: number;
    currency: string;
    isPaid: boolean;
  }[];
  addOns?: {
    name: string;
    nameLocalized?: Record<string, string> | null;
    quantity: number;
    totalMinor: number;
    currency: string;
  }[];
  extensionsCount?: number;
  extensionsTotalMinor?: number;
}

interface BookingCardProps {
  booking: any;
}

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "/";

export default function BookingCard({ booking }: BookingCardProps) {
  const t = useTranslations("account.bookings");
  const locale = useLocale();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSent, setCancelSent] = useState(false);

  const car = booking.car;
  const pricing: PricingSummary | undefined = booking.pricingSummary;

  const pickupDate = new Date(booking.pickupDate);
  const returnDate = new Date(booking.actualReturnDate || booking.returnDate);

  const fmtDate = (d: Date) =>
    d.toLocaleDateString("uk-UA", { day: "numeric", month: "short" });

  const dateRange = `${fmtDate(pickupDate)} — ${fmtDate(returnDate)}`;

  const statusKey = `status_${booking.status || booking._type}`;
  const statusLabel = t.has(statusKey)
    ? t(statusKey)
    : (booking.status || booking._type);

  const photoUrl = car?.previewUrl
    ? car.previewUrl.startsWith("http")
      ? car.previewUrl
      : `${BASE}static/${car.previewUrl}`
    : null;

  const hasDetails =
    (pricing?.addOns && pricing.addOns.length > 0) ||
    (pricing?.fines && pricing.fines.length > 0) ||
    (pricing?.extensionsCount ?? 0) > 0;

  // Can request cancellation for confirmed/pending reservations
  const canRequestCancel =
    booking._type === "reservation" &&
    (booking.status === "confirmed" || booking.status === "pending") &&
    !booking.cancellationRequestedAt;

  // Already requested cancellation
  const cancelRequested = !!booking.cancellationRequestedAt;

  async function handleRequestCancel(e: React.MouseEvent) {
    e.stopPropagation();
    setCancelLoading(true);
    await requestCancellation(booking.id, cancelReason || undefined);
    setCancelLoading(false);
    setCancelSent(true);
    router.refresh();
  }

  return (
    <div className="trip-card" onClick={(e) => { e.stopPropagation(); if (!showModal) setShowModal(true); }}>
      <div className="trip-card__photo">
        {photoUrl ? (
          <img src={photoUrl} alt={`${car?.brand} ${car?.model}`} />
        ) : (
          <div className="trip-card__photo-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
              <circle cx="5.5" cy="18" r="2" />
              <circle cx="18.5" cy="18" r="2" />
            </svg>
          </div>
        )}
        <span className={`trip-card__status trip-card__status--${booking.status || booking._type}`}>
          {statusLabel}
        </span>
      </div>

      <div className="trip-card__body">
        <h3 className="trip-card__title">
          {car?.brand} {car?.model}
          {car?.yearOfManufacture ? ` '${String(car.yearOfManufacture).slice(2)}` : ""}
        </h3>
        <p className="trip-card__dates">{dateRange}</p>
        <p className="trip-card__location">{booking.pickupLocation}</p>

        {pricing && (
          <div className="trip-card__price">
            {pricing.totalPaidMinor != null && pricing.totalPaidMinor > 0 ? (
              <span className="trip-card__amount">
                {formatMoney(pricing.totalPaidMinor, pricing.currency)}
              </span>
            ) : pricing.totalMinor != null ? (
              <span className="trip-card__amount">
                {formatMoney(pricing.totalMinor, pricing.currency)}
              </span>
            ) : null}
            {pricing.dailyRateMinor != null && (
              <span className="trip-card__rate">
                {formatMoney(pricing.dailyRateMinor, pricing.currency)}/{t("per_day")}
              </span>
            )}
          </div>
        )}

        {(pricing?.totalFinesMinor ?? 0) > 0 && (
          <div className="trip-card__fines-badge">
            {t("fines")}: {formatMoney(pricing!.totalFinesMinor, pricing!.currency)}
          </div>
        )}

        {booking._type === "rental" && pricing?.depositAmountMinor != null && pricing.depositAmountMinor > 0 && (
          <div className={`trip-card__deposit trip-card__deposit--${pricing.depositReturned ? "returned" : "held"}`}>
            {t("deposit")} {formatMoney(pricing.depositAmountMinor, pricing.currency)}
            {" · "}
            {pricing.depositReturned ? t("deposit_returned") : t("deposit_held")}
          </div>
        )}

        {cancelRequested && (
          <div className="trip-card__cancel-requested">
            {t("cancel_requested")}
          </div>
        )}
      </div>

      {/* Expandable details */}
      {expanded && hasDetails && (
        <div className="trip-card__details">
          {pricing?.addOns && pricing.addOns.length > 0 && (
            <div className="trip-card__detail-section">
              <h4>{t("add_ons")}</h4>
              {pricing.addOns.map((addon, i) => (
                <div key={i} className="trip-card__detail-row">
                  <span>{addon.nameLocalized?.[locale] || addon.name}{addon.quantity > 1 ? ` ×${addon.quantity}` : ""}</span>
                  <span>{formatMoney(addon.totalMinor, addon.currency)}</span>
                </div>
              ))}
            </div>
          )}

          {(pricing?.extensionsCount ?? 0) > 0 && (
            <div className="trip-card__detail-section">
              <h4>{t("extensions")} ({pricing!.extensionsCount})</h4>
              <div className="trip-card__detail-row">
                <span>{t("extensions")}</span>
                <span>{formatMoney(pricing!.extensionsTotalMinor, pricing!.currency)}</span>
              </div>
            </div>
          )}

          {pricing?.fines && pricing.fines.length > 0 && (
            <div className="trip-card__detail-section">
              <h4>{t("fines")}</h4>
              {pricing.fines.map((fine, i) => (
                <div key={i} className="trip-card__detail-row">
                  <span>
                    {fine.description || fine.type}
                    {fine.isPaid && <span className="trip-card__paid">{t("paid")}</span>}
                  </span>
                  <span>{formatMoney(fine.amountMinor, fine.currency)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {hasDetails && (
        <button
          type="button"
          className="trip-card__expand"
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        >
          {expanded ? t("hide_details") : t("show_details")}
        </button>
      )}

      {/* Cancel request */}
      {canRequestCancel && !showCancelForm && !cancelSent && (
        <button
          type="button"
          className="trip-card__cancel-btn"
          onClick={(e) => { e.stopPropagation(); setShowCancelForm(true); }}
        >
          {t("request_cancel")}
        </button>
      )}

      {showCancelForm && !cancelSent && (
        <div className="trip-card__cancel-form" onClick={(e) => e.stopPropagation()}>
          <textarea
            className="trip-card__cancel-input"
            placeholder={t("cancel_reason_placeholder")}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={2}
          />
          <div className="trip-card__cancel-actions">
            <button
              type="button"
              className="trip-card__cancel-confirm"
              disabled={cancelLoading}
              onClick={handleRequestCancel}
            >
              {cancelLoading ? "..." : t("send_request")}
            </button>
            <button
              type="button"
              className="trip-card__cancel-back"
              onClick={() => setShowCancelForm(false)}
            >
              {t("cancel_back")}
            </button>
          </div>
        </div>
      )}

      {cancelSent && (
        <div className="trip-card__cancel-sent">
          {t("cancel_request_sent")}
        </div>
      )}

      {showModal && (
        <BookingModal booking={booking} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
