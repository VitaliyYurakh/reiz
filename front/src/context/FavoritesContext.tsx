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
import { useSession } from "next-auth/react";
import { addFavorite, removeFavorite } from "@/lib/api/customer";

interface FavoritesContextValue {
  favoriteIds: ReadonlySet<number>;
  toggle: (carId: number) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favoriteIds: new Set(),
  toggle: async () => {},
  isAuthenticated: false,
  isLoading: true,
});

export function FavoritesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user?.clientId;
  const [ids, setIds] = useState<Set<number>>(() => new Set());
  const [isLoading, setIsLoading] = useState(true);
  const idsRef = useRef(ids);
  idsRef.current = ids;

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (!isAuthenticated) {
      setIds(new Set());
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void fetch("/api/auth/favorites", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load favorites");
        return (await response.json()) as { favoriteIds?: unknown };
      })
      .then((data) => {
        if (cancelled) return;
        const favoriteIds = Array.isArray(data.favoriteIds)
          ? data.favoriteIds.filter((id): id is number => typeof id === "number")
          : [];
        setIds(new Set(favoriteIds));
      })
      .catch(() => {
        if (!cancelled) setIds(new Set());
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, status]);

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
    () => ({ favoriteIds: ids as ReadonlySet<number>, toggle, isAuthenticated, isLoading }),
    [ids, toggle, isAuthenticated, isLoading],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const { favoriteIds, toggle, isAuthenticated, isLoading } = useContext(FavoritesContext);

  const isFavorited = useCallback(
    (carId: number) => favoriteIds.has(carId),
    [favoriteIds],
  );

  return { isFavorited, toggle, isAuthenticated, isLoading };
}
