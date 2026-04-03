"use client";

import { useTranslations } from "next-intl";

interface BookingCardProps {
  booking: any;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const t = useTranslations("account.bookings");

  const car = booking.car;
  const pickupDate = new Date(booking.pickupDate).toLocaleDateString();
  const returnDate = new Date(booking.returnDate).toLocaleDateString();

  return (
    <div className="account-card">
      <div className="account-card__header">
        {car?.previewUrl && (
          <img
            src={car.previewUrl}
            alt={`${car.brand} ${car.model}`}
            className="account-card__image"
          />
        )}
        <div>
          <p className="account-card__title">
            {car?.brand} {car?.model}
            {car?.yearOfManufacture ? ` ${car.yearOfManufacture}` : ""}
          </p>
          <span className="account-card__badge">
            {booking.status || booking._type}
          </span>
        </div>
      </div>
      <div className="account-card__details">
        <p>
          <strong>{t("pickup")}:</strong> {pickupDate} — {booking.pickupLocation}
        </p>
        <p>
          <strong>{t("return")}:</strong> {returnDate} — {booking.returnLocation}
        </p>
      </div>
    </div>
  );
}
