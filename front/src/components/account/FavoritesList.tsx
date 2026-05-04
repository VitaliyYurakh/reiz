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

// Cars store transmission/driveType either as a localized object or a
// plain legacy string; the shared `localized()` helper only handles
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

const RANGE_KEYS = [
  "rates.range1",
  "rates.range2",
  "rates.range3",
  "rates.range4",
] as const;

export default function FavoritesList({ favorites }: FavoritesListProps) {
  const t = useTranslations("account.favorites");
  const tCatalog = useTranslations("homePage.catalog_aside.catalog_list");
  const locale = useLocale();
  const { formatPrice, formatDeposit } = useCurrency();
  const { isFavorited } = useFavorites();

  // Filter against the live favorites set so cards disappear immediately
  // when the user un-favorites a car via the heart toggle.
  const visible = favorites.filter(
    (fav) => fav.car != null && isFavorited(fav.car.id),
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
            {/* ── Photo ── */}
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
            </Link>

            {/* ── Body (everything to the right of the photo) ── */}
            <div className="fav-card__body">
              {/* Title bar */}
              <div className="fav-card__head">
                <Link href={`/cars/${slug}`} className="fav-card__name">
                  {car.brand} {car.model}
                  {car.yearOfManufacture ? (
                    <span className="fav-card__year">{car.yearOfManufacture}</span>
                  ) : null}
                </Link>
                <div className="fav-card__badges">
                  {car.isAvailable ? (
                    <span className="fav-card__badge fav-card__badge--green">
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
              </div>

              {/* Main: tariffs left, specs right */}
              <div className="fav-card__main">
                <ul className="fav-card__tariffs">
                  {tariffs.slice(0, 4).map((tariff, i) => (
                    <li key={tariff.id ?? i} className="fav-card__tariff-row">
                      <span className="fav-card__tariff-label">
                        {tCatalog(RANGE_KEYS[Math.min(i, RANGE_KEYS.length - 1)])}
                      </span>
                      <span className="fav-card__tariff-value">
                        <strong>
                          {formatPrice((tariff.dailyPriceMinor ?? 0) / 100)}
                        </strong>
                        /{tCatalog("rates.perDay")}
                      </span>
                    </li>
                  ))}
                </ul>

                <ul className="fav-card__specs">
                  <li className="fav-card__spec">
                    <i className="fav-card__spec-icon">
                      <svg width="22" height="22"><use href="/img/sprite/sprite.svg#engine" /></svg>
                    </i>
                    <span className="fav-card__spec-label">{tCatalog("features.engine")}</span>
                    <span className="fav-card__spec-value">{engineText}</span>
                  </li>
                  <li className="fav-card__spec">
                    <i className="fav-card__spec-icon">
                      <svg width="22" height="22"><use href="/img/sprite/sprite.svg#gearbox" /></svg>
                    </i>
                    <span className="fav-card__spec-label">{tCatalog("features.transmission")}</span>
                    <span className="fav-card__spec-value">{transmissionText}</span>
                  </li>
                  <li className="fav-card__spec">
                    <i className="fav-card__spec-icon">
                      <svg width="22" height="22"><use href="/img/sprite/sprite.svg#drivetrain" /></svg>
                    </i>
                    <span className="fav-card__spec-label">{tCatalog("features.drive")}</span>
                    <span className="fav-card__spec-value">{driveText}</span>
                  </li>
                  <li className="fav-card__spec">
                    <i className="fav-card__spec-icon">
                      <svg width="22" height="22"><use href="/img/sprite/sprite.svg#seats" /></svg>
                    </i>
                    <span className="fav-card__spec-label">{tCatalog("features.seatsLabel")}</span>
                    <span className="fav-card__spec-value">{seatsText}</span>
                  </li>
                </ul>
              </div>

              {/* Footer: deposit + CTA */}
              <div className="fav-card__footer">
                {deposit != null ? (
                  <div className="fav-card__deposit">
                    <span>{tCatalog("total.depositLabel")}:</span>
                    <strong>{formatDeposit(deposit)}</strong>
                  </div>
                ) : <span className="fav-card__deposit" />}
                <Link href={`/cars/${slug}`} className="fav-card__cta">
                  {tCatalog("actions.details")}
                </Link>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
