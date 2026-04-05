"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { addFavorite, removeFavorite } from "@/lib/api/customer";

interface FavoritesContextValue {
  favoriteIds: ReadonlySet<number>;
  toggle: (carId: number) => Promise<void>;
  isAuthenticated: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favoriteIds: new Set(),
  toggle: async () => {},
  isAuthenticated: false,
});

export function FavoritesProvider({
  initialFavoriteIds,
  isAuthenticated,
  children,
}: {
  initialFavoriteIds: number[];
  isAuthenticated: boolean;
  children: ReactNode;
}) {
  const [ids, setIds] = useState(() => new Set(initialFavoriteIds));
  const idsRef = useRef(ids);
  idsRef.current = ids;

  // Stable key to detect when server data actually changed (e.g. after login + refresh)
  const serverKey = useMemo(
    () => [...initialFavoriteIds].sort().join(","),
    [initialFavoriteIds],
  );

  useEffect(() => {
    setIds(new Set(initialFavoriteIds));
  }, [serverKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = useCallback(async (carId: number) => {
    const wasFavorited = idsRef.current.has(carId);

    setIds((prev) => {
      const next = new Set(prev);
      if (wasFavorited) {
        next.delete(carId);
      } else {
        next.add(carId);
      }
      return next;
    });

    try {
      if (wasFavorited) {
        await removeFavorite(carId);
      } else {
        await addFavorite(carId);
      }
    } catch {
      setIds((prev) => {
        const next = new Set(prev);
        if (wasFavorited) {
          next.add(carId);
        } else {
          next.delete(carId);
        }
        return next;
      });
    }
  }, []);

  const value = useMemo(
    () => ({ favoriteIds: ids as ReadonlySet<number>, toggle, isAuthenticated }),
    [ids, toggle, isAuthenticated],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const { favoriteIds, toggle, isAuthenticated } = useContext(FavoritesContext);

  const isFavorited = useCallback(
    (carId: number) => favoriteIds.has(carId),
    [favoriteIds],
  );

  return { isFavorited, toggle, isAuthenticated };
}
