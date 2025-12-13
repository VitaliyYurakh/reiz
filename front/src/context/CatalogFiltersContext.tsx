"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type CatalogFiltersContextValue = {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  closeFilters: () => void;
};

const CatalogFiltersContext = createContext<CatalogFiltersContextValue | null>(
  null,
);

type CatalogFiltersProviderProps = {
  children: ReactNode;
};

export function CatalogFiltersProvider({
  children,
}: CatalogFiltersProviderProps) {
  const [filtersOpen, setFiltersOpenState] = useState(false);

  const setFiltersOpen = useCallback((open: boolean) => {
    setFiltersOpenState(open);
  }, []);

  const closeFilters = useCallback(() => {
    setFiltersOpenState(false);
  }, []);

  const value = useMemo(
    () => ({ filtersOpen, setFiltersOpen, closeFilters }),
    [filtersOpen, setFiltersOpen, closeFilters],
  );

  return (
    <CatalogFiltersContext.Provider value={value}>
      {children}
    </CatalogFiltersContext.Provider>
  );
}

export function useCatalogFilters() {
  return useContext(CatalogFiltersContext);
}
