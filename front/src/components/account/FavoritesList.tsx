"use client";

import { useTranslations, useLocale } from "next-intl";
import { useFavorites } from "@/context/FavoritesContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Link } from "@/i18n/request";
import { createCarIdSlug } from "@/lib/utils/carSlug";
import { formatEngine } from "@/lib/utils/catalog-utils";
import FavoriteToggle from "@/components/account/FavoriteToggle";
import type { Car } from "@/types/cars";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "/";

// Cars store transmission/driveType either as a localized object or
// a plain legacy string; the shared `localized()` helper only handles
// the object case, so cover both here.
function localizedSpec(value: unknown, locale: string): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const o = value as Record<string, string>;
    return o[locale] || o.uk || o.en || "";
  }
  return "";
}

interface FavoritesListProps {
  favorites: Array<{ car: Car | null }>;
}

export default function FavoritesList({ favorites }: FavoritesListProps) {
  const t = useTranslations("account.favorites");
  const tCatalog = useTranslations("homePage.catalog_aside.catalog_list");
  const locale = useLocale();
  const { formatPrice, formatDeposit } = useCurrency();
  const { isFavorited, isLoading } = useFavorites();

  // Filter against the live favorites set so a card disappears
  // immediately when the user un-favorites it via the heart toggle.
  const visible = favorites.filter(
    (fav) => fav.car != null && (isLoading || isFavorited(fav.car.id)),
  );

  if (visible.length === 0) {
    return <p className="account-page__empty">{t("empty")}</p>;
  }

  return (
    <ul className="fav-grid">
      {visible.map((fav) => {
        const car = fav.car!;
        const slug = createCarIdSlug(car);
        const tariffs = [...(car.rentalTariff || [])].sort(
          (a, b) => a.minDays - b.minDays,
        );
        const cheapestDaily = tariffs.length
          ? Math.min(...tariffs.map((t) => t.dailyPriceMinor ?? Infinity)) / 100
          : null;
        const deposit =
          tariffs[0]?.depositMinor != null ? tariffs[0].depositMinor / 100 : null;

        const rawPhoto = car.carPhoto?.find((p) => p.type === "PC")?.url
          ?? car.carPhoto?.[0]?.url
          ?? car.previewUrl;
        const photo = rawPhoto
          ? rawPhoto.startsWith("http") ? rawPhoto : `${BASE}static/${rawPhoto}`
          : null;

        const engineText =
          formatEngine(car.engineVolume, car.engineType, locale) || "—";
        const transmissionText = localizedSpec(car.transmission, locale) || "—";
        const driveText = localizedSpec(car.driveType, locale) || "—";
        const seatsText =
          car.seats != null
            ? tCatalog("features.seatsValue", { count: String(car.seats) })
            : "—";

        return (
          <li key={car.id} className="fav-card">
            {/* Hero image */}
            <Link href={`/cars/${slug}`} className="fav-card__photo">
              {photo ? (
                <img src={photo} alt={`${car.brand} ${car.model}`} />
              ) : (
                <div className="fav-card__no-photo" />
              )}
              <FavoriteToggle
                carId={car.id}
                className="fav-card__heart"
                showTooltip={false}
              />
              <div className="fav-card__photo-badges">
                {car.isAvailable ? (
                  <span className="fav-card__badge fav-card__badge--green">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="3" fill="currentColor" />
                    </svg>
                    {tCatalog("badges.available")}
                  </span>
                ) : (
                  <span className="fav-card__badge fav-card__badge--muted">
                    {tCatalog("badges.contact")}
                  </span>
                )}
                {car.discount != null && car.discount > 0 ? (
                  <span className="fav-card__badge fav-card__badge--red">
                    -{car.discount}%
                  </span>
                ) : null}
              </div>
            </Link>

            {/* Body */}
            <div className="fav-card__body">
              {/* Title */}
              <Link href={`/cars/${slug}`} className="fav-card__title">
                <span className="fav-card__title-name">
                  {car.brand} {car.model}
                </span>
                {car.yearOfManufacture ? (
                  <span className="fav-card__title-year">
                    {car.yearOfManufacture}
                  </span>
                ) : null}
              </Link>

              {/* Specs as 2x2 inline grid */}
              <ul className="fav-card__specs">
                <li className="fav-card__spec">
                  <svg className="fav-card__spec-icon" width="20" height="20">
                    <use href="/img/sprite/sprite.svg#engine" />
                  </svg>
                  <span className="fav-card__spec-text">{engineText}</span>
                </li>
                <li className="fav-card__spec">
                  <svg className="fav-card__spec-icon" width="20" height="20">
                    <use href="/img/sprite/sprite.svg#gearbox" />
                  </svg>
                  <span className="fav-card__spec-text">{transmissionText}</span>
                </li>
                <li className="fav-card__spec">
                  <svg className="fav-card__spec-icon" width="20" height="20">
                    <use href="/img/sprite/sprite.svg#drivetrain" />
                  </svg>
                  <span className="fav-card__spec-text">{driveText}</span>
                </li>
                <li className="fav-card__spec">
                  <svg className="fav-card__spec-icon" width="20" height="20">
                    <use href="/img/sprite/sprite.svg#seats" />
                  </svg>
                  <span className="fav-card__spec-text">{seatsText}</span>
                </li>
              </ul>

              {/* Price block */}
              <div className="fav-card__price">
                {cheapestDaily != null ? (
                  <div className="fav-card__price-from">
                    <span className="fav-card__price-label">
                      {t("price_from")}
                    </span>
                    <span className="fav-card__price-value">
                      <strong>{formatPrice(cheapestDaily)}</strong>
                      <small>/{tCatalog("rates.perDay")}</small>
                    </span>
                  </div>
                ) : null}
                {deposit != null ? (
                  <div className="fav-card__price-deposit">
                    <span>{tCatalog("total.depositLabel")}</span>
                    <strong>{formatDeposit(deposit)}</strong>
                  </div>
                ) : null}
              </div>

              {/* CTA */}
              <Link href={`/cars/${slug}`} className="fav-card__cta">
                {tCatalog("actions.details")}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
