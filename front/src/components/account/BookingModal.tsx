"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import { formatMoney } from "@/lib/utils/format-money";

interface BookingModalProps {
  booking: any;
  onClose: () => void;
}

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "/";

export default function BookingModal({ booking, onClose }: BookingModalProps) {
  const t = useTranslations("account.bookings");
  const locale = useLocale();
  const [closing, setClosing] = useState(false);
  const car = booking.car;
  const pricing = booking.pricingSummary;

  const pickupDate = new Date(booking.pickupDate);
  const returnDate = new Date(
    booking.actualReturnDate || booking.returnDate,
  );

  const fmtDate = (d: Date) =>
    d.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const dateRange = `${fmtDate(pickupDate)} — ${fmtDate(returnDate)}`;

  const photoUrl = car?.previewUrl
    ? car.previewUrl.startsWith("http")
      ? car.previewUrl
      : `${BASE}static/${car.previewUrl}`
    : null;

  const carName = `${car?.brand || ""} ${car?.model || ""}`.trim();
  const carPageUrl = car?.id
    ? `${window.location.origin}${locale === "uk" ? "" : `/${locale}`}/cars/${car.id}`
    : null;

  const statusKey = `status_${booking.status || booking._type}`;
  const statusLabel = t.has(statusKey)
    ? t(statusKey)
    : (booking.status || booking._type);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => onClose(), 250);
  }, [onClose]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    },
    [handleClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [handleKeyDown]);

  async function handleShare() {
    const shareData = {
      title: carName,
      text: `${carName} — ${dateRange}`,
      url: carPageUrl || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert(t("link_copied"));
    }
  }

  return createPortal(
    <div className={`booking-modal__overlay ${closing ? "booking-modal__overlay--closing" : ""}`} onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div
        className={`booking-modal ${closing ? "booking-modal--closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="booking-modal__close"
          onClick={handleClose}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Car icon header */}
        <div className="booking-modal__header">
          <div className="booking-modal__icon">
            <span className="booking-modal__icon-city">
              {booking.pickupLocation?.replace(/\s*(центр|аеропорт|вокзал|airport|center|downtown)/gi, "").trim()}
            </span>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="10" width="7" height="11" rx="1" />
              <rect x="14" y="6" width="7" height="15" rx="1" />
              <rect x="8" y="3" width="8" height="18" rx="1" />
              <line x1="5" y1="13" x2="8" y2="13" />
              <line x1="5" y1="16" x2="8" y2="16" />
              <line x1="10" y1="7" x2="14" y2="7" />
              <line x1="10" y1="10" x2="14" y2="10" />
              <line x1="10" y1="13" x2="14" y2="13" />
              <line x1="16" y1="10" x2="19" y2="10" />
              <line x1="16" y1="13" x2="19" y2="13" />
              <line x1="16" y1="16" x2="19" y2="16" />
            </svg>
          </div>
          <h2 className="booking-modal__car-name">{carName}</h2>
          <p className="booking-modal__dates">{dateRange}</p>
          <span className={`booking-modal__status booking-modal__status--${booking.status || booking._type}`}>
            {statusLabel}
          </span>
        </div>

        {/* Car photo */}
        <div className="booking-modal__photo">
          {photoUrl ? (
            <img src={photoUrl} alt={carName} />
          ) : (
            <div className="booking-modal__photo-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          )}
          <button
            type="button"
            className="booking-modal__share"
            onClick={handleShare}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
        </div>

        {/* Details */}
        <div className="booking-modal__details">
          <div className="booking-modal__detail-row">
            <span className="booking-modal__label">{t("pickup")}</span>
            <span>{fmtDate(pickupDate)} · {booking.pickupLocation}</span>
          </div>
          <div className="booking-modal__detail-row">
            <span className="booking-modal__label">{t("return")}</span>
            <span>{fmtDate(returnDate)} · {booking.returnLocation}</span>
          </div>

          {pricing && (
            <>
              {pricing.dailyRateMinor != null && (
                <div className="booking-modal__detail-row">
                  <span className="booking-modal__label">{t("daily_rate")}</span>
                  <span>{formatMoney(pricing.dailyRateMinor, pricing.currency)}/{t("per_day")}</span>
                </div>
              )}
              {(pricing.totalPaidMinor > 0 || pricing.totalMinor) && (
                <div className="booking-modal__detail-row booking-modal__detail-row--bold">
                  <span className="booking-modal__label">{t("total_paid")}</span>
                  <span>
                    {formatMoney(
                      pricing.totalPaidMinor > 0 ? pricing.totalPaidMinor : pricing.totalMinor,
                      pricing.currency,
                    )}
                  </span>
                </div>
              )}
              {pricing.addOns?.length > 0 && (
                <div className="booking-modal__addon-list">
                  <span className="booking-modal__label">{t("add_ons")}</span>
                  {pricing.addOns.map((a: any, i: number) => (
                    <div key={i} className="booking-modal__addon-item">
                      <span>{a.nameLocalized?.[locale] || a.name}{a.quantity > 1 ? ` ×${a.quantity}` : ""}</span>
                      <span>{formatMoney(a.totalMinor, a.currency)}</span>
                    </div>
                  ))}
                </div>
              )}
              {pricing.fines?.length > 0 && (
                <div className="booking-modal__addon-list">
                  <span className="booking-modal__label">{t("fines")}</span>
                  {pricing.fines.map((f: any, i: number) => (
                    <div key={i} className="booking-modal__addon-item">
                      <span>{f.description || f.type}</span>
                      <span>{formatMoney(f.amountMinor, f.currency)}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Link to car page */}
        {carPageUrl && (
          <a
            href={carPageUrl}
            className="booking-modal__car-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("view_car")}
          </a>
        )}
      </div>
    </div>,
    document.body,
  );
}
