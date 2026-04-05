"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { removeFavorite } from "@/lib/api/customer";
import { useCurrency } from "@/context/CurrencyContext";
import { formatEngine } from "@/lib/utils/catalog-utils";
import { Link } from "@/i18n/request";
import { createCarIdSlug } from "@/lib/utils/carSlug";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "/";

interface FavoritesListProps {
  favorites: any[];
}

export default function FavoritesList({
  favorites: initial,
}: FavoritesListProps) {
  const t = useTranslations("account.favorites");
  const tCatalog = useTranslations("homePage.catalog_aside.catalog_list");
  const locale = useLocale();
  const router = useRouter();
  const { formatPrice, formatDeposit } = useCurrency();
  const [favorites, setFavorites] = useState(initial);
  const [removing, setRemoving] = useState<number | null>(null);

  async function handleRemove(e: React.MouseEvent, carId: number) {
    e.preventDefault();
    e.stopPropagation();
    setRemoving(carId);
    await removeFavorite(carId);
    setFavorites((prev) => prev.filter((f) => f.car?.id !== carId));
    setRemoving(null);
    router.refresh();
  }

  if (favorites.length === 0) {
    return <p className="account-page__empty">{t("empty")}</p>;
  }

  const rangeLabelKeys = [
    "rates.range1",
    "rates.range2",
    "rates.range3",
    "rates.range4",
  ] as const;

  return (
    <div className="fav-grid">
      {favorites.map((fav) => {
        const car = fav.car;
        if (!car) return null;

        const rawPhoto = car.carPhoto?.[0]?.url || car.previewUrl;
        const photo = rawPhoto
          ? rawPhoto.startsWith("http")
            ? rawPhoto
            : `${BASE}static/${rawPhoto}`
          : null;
        const tariffs = [...(car.rentalTariff || [])].sort(
          (a: any, b: any) => a.minDays - b.minDays,
        );
        const deposit = tariffs[0]?.deposit;
        const slug = createCarIdSlug(car);

        return (
          <div
            key={car.id}
            className={`fav-card${removing === car.id ? " fav-card--removing" : ""}`}
          >
            {/* Photo */}
            <Link href={`/cars/${slug}`} className="fav-card__photo">
              {photo ? (
                <img src={photo} alt={`${car.brand} ${car.model}`} />
              ) : (
                <div className="fav-card__no-photo">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1">
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <path d="M16 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
                    <circle cx="5.5" cy="18" r="2" />
                    <circle cx="18.5" cy="18" r="2" />
                  </svg>
                </div>
              )}
              <button
                type="button"
                className="fav-card__heart"
                onClick={(e) => handleRemove(e, car.id)}
                title={t("remove_tooltip")}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#e63946" stroke="#e63946" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </Link>

            {/* Info block */}
            <div className="fav-card__info">
              {/* Row: name + badges */}
              <div className="fav-card__top">
                <Link href={`/cars/${slug}`} className="fav-card__name">
                  {car.brand} {car.model}
                </Link>
                <div className="fav-card__badges">
                  {car.isAvailable ? (
                    <span className="fav-card__badge fav-card__badge--green">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M4.667 1.304c0-.344.298-.623.666-.623.369 0 .667.279.667.623v.622h4V1.304c0-.344.299-.623.667-.623s.667.279.667.623v.622h1.333c1.105 0 2 .836 2 1.867v8.711c0 1.03-.895 1.866-2 1.866H3.333c-1.104 0-2-.836-2-1.866V3.793c0-1.031.896-1.867 2-1.867h1.334V1.304Z" fill="#0EA548"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.333 5.841a.6.6 0 0 1 0 .88L7.805 10.203a.667.667 0 0 1-.943 0L4.862 8.336a.6.6 0 0 1 .943-.88l1.528 1.427 3.058-3.041a.6.6 0 0 1 .942 0Z" fill="white"/>
                      </svg>
                      {tCatalog("badges.available")}
                    </span>
                  ) : null}
                  {car.discount > 0 && (
                    <span className="fav-card__badge fav-card__badge--red">
                      -{car.discount}%
                    </span>
                  )}
                </div>
              </div>

              {/* Specs */}
              <div className="fav-card__specs">
                <span>
                  <svg width="20" height="20"><use href="/img/sprite/sprite.svg#engine" /></svg>
                  {formatEngine(car.engineVolume, car.engineType, locale)}
                </span>
                <span>
                  <svg width="20" height="20"><use href="/img/sprite/sprite.svg#gearbox" /></svg>
                  {typeof car.transmission === "object"
                    ? car.transmission?.[locale] || car.transmission?.uk
                    : car.transmission}
                </span>
                <span>
                  <svg width="20" height="20"><use href="/img/sprite/sprite.svg#drivetrain" /></svg>
                  {typeof car.driveType === "object"
                    ? car.driveType?.[locale] || car.driveType?.uk
                    : car.driveType}
                </span>
              </div>

              {/* Tariffs */}
              {tariffs.length > 0 && (
                <div className="fav-card__tariffs">
                  {tariffs.map((tariff: any, i: number) => (
                    <div key={tariff.id ?? i} className="fav-card__tariff-row">
                      <span>
                        {tCatalog(
                          rangeLabelKeys[
                            Math.min(i, rangeLabelKeys.length - 1)
                          ],
                        )}
                      </span>
                      <span>
                        <strong>{formatPrice(tariff.dailyPrice)}</strong>/
                        {tCatalog("rates.perDay")}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Deposit */}
              {deposit != null && (
                <div className="fav-card__deposit">
                  <span>{tCatalog("total.depositLabel")}:</span>
                  <strong>{formatDeposit(deposit)}</strong>
                </div>
              )}

              {/* Button */}
              <div className="fav-card__buttons">
                <Link href={`/cars/${slug}`} className="fav-card__btn fav-card__btn--primary">
                  {tCatalog("actions.details")}
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
