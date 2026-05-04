"use client";

import { useTranslations } from "next-intl";
import { useFavorites } from "@/context/FavoritesContext";
import CarCard from "@/app/[locale]/components/CarCard";
import type { Car } from "@/types/cars";

interface FavoritesListProps {
  favorites: Array<{ car: Car | null }>;
}

export default function FavoritesList({ favorites }: FavoritesListProps) {
  const t = useTranslations("account.favorites");
  // Filter against the live favorites set so cards disappear immediately
  // when the user un-favorites a car via the heart toggle inside CarCard.
  // The page-level fetch only re-runs on navigation/refresh, so without
  // this we'd leave a stale removed card on screen until the next refresh.
  const { isFavorited } = useFavorites();

  const visible = favorites.filter(
    (fav) => fav.car != null && isFavorited(fav.car.id),
  );

  if (visible.length === 0) {
    return <p className="account-page__empty">{t("empty")}</p>;
  }

  return (
    <ul className="fav-grid">
      {visible.map((fav) => (
        <CarCard key={fav.car!.id} car={fav.car!} />
      ))}
    </ul>
  );
}
