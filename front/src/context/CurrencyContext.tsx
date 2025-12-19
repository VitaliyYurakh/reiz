"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Currency = "USD" | "EUR" | "UAH";

type ExchangeRates = {
  USD_UAH: number;
  EUR_UAH: number;
  USD_EUR: number;
};

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convert: (amountUSD: number) => number;
  convertToUSD: (amount: number) => number;
  formatPrice: (amountUSD: number, showDecimals?: boolean) => string;
  getCurrencySymbol: () => string;
  isLoading: boolean;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

// Кеш курсів (глобальний)
let cachedRates: ExchangeRates | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 хвилин

// Fallback курси
const FALLBACK_RATES: ExchangeRates = {
  USD_UAH: 41.5 * 1.01,
  EUR_UAH: 45.0 * 1.01,
  USD_EUR: (41.5 * 1.01) / (45.0 * 1.01),
};

async function fetchExchangeRates(): Promise<ExchangeRates> {
  const now = Date.now();
  if (cachedRates && now - cacheTimestamp < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    // Запит до нашого серверного API (без CORS проблем)
    const response = await fetch("/api/rates");
    const data = await response.json();

    if (!data.success || !data.rates) {
      throw new Error("Invalid API response");
    }

    const rates: ExchangeRates = {
      USD_UAH: data.rates.USD_UAH,
      EUR_UAH: data.rates.EUR_UAH,
      USD_EUR: data.rates.USD_EUR,
    };

    cachedRates = rates;
    cacheTimestamp = now;

    return rates;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    // Якщо є застарілий кеш - використовуємо його
    if (cachedRates) {
      return cachedRates;
    }
    return FALLBACK_RATES;
  }
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  UAH: "₴",
};

type ProviderProps = {
  children: ReactNode;
};

export function CurrencyProvider({ children }: ProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [rates, setRates] = useState<ExchangeRates | null>(cachedRates);
  const [isLoading, setIsLoading] = useState(!cachedRates);

  useEffect(() => {
    fetchExchangeRates().then((fetchedRates) => {
      setRates(fetchedRates);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchExchangeRates().then(setRates);
    }, CACHE_DURATION);

    return () => clearInterval(interval);
  }, []);

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  }, []);

  // Конвертація з USD в обрану валюту
  const convert = useCallback(
    (amountUSD: number): number => {
      if (!rates || currency === "USD") {
        return amountUSD;
      }

      if (currency === "UAH") {
        return amountUSD * rates.USD_UAH;
      }

      if (currency === "EUR") {
        return amountUSD * rates.USD_EUR;
      }

      return amountUSD;
    },
    [currency, rates]
  );

  // Зворотня конвертація: з поточної валюти в USD
  const convertToUSD = useCallback(
    (amount: number): number => {
      if (!rates || currency === "USD") {
        return amount;
      }

      if (currency === "UAH") {
        return amount / rates.USD_UAH;
      }

      if (currency === "EUR") {
        return amount / rates.USD_EUR;
      }

      return amount;
    },
    [currency, rates]
  );

  // Символ поточної валюти
  const getCurrencySymbol = useCallback((): string => {
    return CURRENCY_SYMBOLS[currency];
  }, [currency]);

  // Форматування ціни з валютою
  const formatPrice = useCallback(
    (amountUSD: number, showDecimals = false): string => {
      const converted = convert(amountUSD);

      let formatted: string;
      if (showDecimals) {
        formatted = converted.toLocaleString("uk-UA", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        formatted = Math.round(converted).toLocaleString("uk-UA");
      }

      return `${formatted} ${currency}`;
    },
    [convert, currency]
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      convert,
      convertToUSD,
      formatPrice,
      getCurrencySymbol,
      isLoading,
    }),
    [currency, setCurrency, convert, convertToUSD, formatPrice, getCurrencySymbol, isLoading]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}

// Хук для безпечного використання поза провайдером (fallback до USD)
export function useCurrencySafe() {
  const ctx = useContext(CurrencyContext);

  const fallback: CurrencyContextValue = useMemo(() => ({
    currency: "USD",
    setCurrency: () => {},
    convert: (amount: number) => amount,
    convertToUSD: (amount: number) => amount,
    formatPrice: (amount: number, showDecimals = false) => {
      const formatted = showDecimals
        ? amount.toLocaleString("uk-UA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : Math.round(amount).toLocaleString("uk-UA");
      return `${formatted} USD`;
    },
    getCurrencySymbol: () => "$",
    isLoading: false,
  }), []);

  return ctx ?? fallback;
}
