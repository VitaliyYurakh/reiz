"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useFavorites } from "@/context/FavoritesContext";
import { useSideBarModal } from "@/components/modals";

interface FavoriteToggleProps {
  carId: number;
  className?: string;
}

export default function FavoriteToggle({
  carId,
  className = "",
}: FavoriteToggleProps) {
  const t = useTranslations("account.favorites");
  const { isFavorited, toggle, isAuthenticated } = useFavorites();
  const { open } = useSideBarModal("loginRequired");
  const [loading, setLoading] = useState(false);

  const favorited = isFavorited(carId);
  const label = favorited ? t("remove_tooltip") : t("add_tooltip");

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      open({});
      return;
    }

    setLoading(true);
    try {
      await toggle(carId);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`favorite-toggle ${favorited ? "favorite-toggle--active" : ""} ${className}`}
      disabled={loading}
      aria-label={label}
      data-tooltip={label}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={favorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
