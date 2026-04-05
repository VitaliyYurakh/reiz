"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { removeFavorite } from "@/lib/api/customer";
import { useCurrency } from "@/context/CurrencyContext";
import { Link } from "@/i18n/request";

interface FavoritesListProps {
  favorites: any[];
}

export default function FavoritesList({ favorites: initial }: FavoritesListProps) {
  const t = useTranslations("account.favorites");
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [favorites, setFavorites] = useState(initial);

  async function handleRemove(carId: number) {
    await removeFavorite(carId);
    setFavorites((prev) => prev.filter((f) => f.car?.id !== carId));
    router.refresh();
  }

  if (favorites.length === 0) {
    return <p className="account-page__empty">{t("empty")}</p>;
  }

  return (
    <div className="account-favorites-grid">
      {favorites.map((fav) => {
        const car = fav.car;
        if (!car) return null;

        const photo = car.carPhoto?.[0]?.url || car.previewUrl;
        const tariff = car.rentalTariff?.[0];

        return (
          <div key={car.id} className="account-favorite-card">
            {photo && (
              <Link href={`/cars/${car.id}`}>
                <img
                  src={photo}
                  alt={`${car.brand} ${car.model}`}
                  className="account-favorite-card__img"
                />
              </Link>
            )}
            <div className="account-favorite-card__info">
              <Link href={`/cars/${car.id}`} className="account-favorite-card__name">
                {car.brand} {car.model}
                {car.yearOfManufacture ? ` ${car.yearOfManufacture}` : ""}
              </Link>
              {tariff && (
                <p className="account-favorite-card__price">
                  {formatPrice(tariff.dailyPrice)}/{t("perDay")}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleRemove(car.id)}
              className="account-favorite-card__remove"
            >
              {t("remove")}
            </button>
          </div>
        );
      })}
    </div>
  );
}
