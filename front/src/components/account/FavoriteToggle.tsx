"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addFavorite, removeFavorite } from "@/lib/api/customer";

interface FavoriteToggleProps {
  carId: number;
  isFavorited?: boolean;
  isAuthenticated?: boolean;
  className?: string;
}

export default function FavoriteToggle({
  carId,
  isFavorited = false,
  isAuthenticated = false,
  className = "",
}: FavoriteToggleProps) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(isFavorited);
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    if (favorited) {
      await removeFavorite(carId);
      setFavorited(false);
    } else {
      await addFavorite(carId);
      setFavorited(true);
    }
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`favorite-toggle ${favorited ? "favorite-toggle--active" : ""} ${className}`}
      disabled={loading}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
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
