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
  formatDeposit: (amountUSD: number) => string;
  getCurrencySymbol: () => string;
  isLoading: boolean;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

// localStorage ключі
const CURRENCY_STORAGE_KEY = "reiz_currency";
const RATES_STORAGE_KEY = "reiz_rates";
const RATES_TIMESTAMP_KEY = "reiz_rates_timestamp";

// Кеш на клієнті (12 годин)
const CLIENT_CACHE_DURATION = 12 * 60 * 60 * 1000;

// Fallback курси
const FALLBACK_RATES: ExchangeRates = {
  USD_UAH: 41.5,
  EUR_UAH: 49.5,
  USD_EUR: 41.5 / 49.5,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  UAH: "₴",
};

function isValidCurrency(value: unknown): value is Currency {
  return value === "USD" || value === "EUR" || value === "UAH";
}

function getSavedCurrency(): Currency {
  if (typeof window === "undefined") return "USD";
  try {
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (saved && isValidCurrency(saved)) {
      return saved;
    }
  } catch {
    // localStorage недоступний
  }
  return "USD";
}

function saveCurrency(currency: Currency): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  } catch {
    // localStorage недоступний
  }
}

function getSavedRates(): { rates: ExchangeRates; timestamp: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const ratesStr = localStorage.getItem(RATES_STORAGE_KEY);
    const timestampStr = localStorage.getItem(RATES_TIMESTAMP_KEY);
    if (ratesStr && timestampStr) {
      const rates = JSON.parse(ratesStr) as ExchangeRates;
      const timestamp = parseInt(timestampStr, 10);
      if (rates.USD_UAH && rates.EUR_UAH && rates.USD_EUR && !isNaN(timestamp)) {
        return { rates, timestamp };
      }
    }
  } catch {
    // localStorage недоступний або дані пошкоджені
  }
  return null;
}

function saveRates(rates: ExchangeRates): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(rates));
    localStorage.setItem(RATES_TIMESTAMP_KEY, String(Date.now()));
  } catch {
    // localStorage недоступний
  }
}

async function fetchExchangeRates(): Promise<ExchangeRates> {
  // Перевіряємо локальний кеш (12 годин)
  const saved = getSavedRates();
  if (saved && Date.now() - saved.timestamp < CLIENT_CACHE_DURATION) {
    return saved.rates;
  }

  try {
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

    // Зберігаємо в localStorage
    saveRates(rates);

    return rates;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    // Якщо є збережені курси - використовуємо їх
    if (saved) {
      return saved.rates;
    }
    return FALLBACK_RATES;
  }
}

type ProviderProps = {
  children: ReactNode;
};

export function CurrencyProvider({ children }: ProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Ініціалізація з localStorage (тільки на клієнті)
  useEffect(() => {
    const savedCurrency = getSavedCurrency();
    setCurrencyState(savedCurrency);

    const savedRates = getSavedRates();
    if (savedRates && Date.now() - savedRates.timestamp < CLIENT_CACHE_DURATION) {
      setRates(savedRates.rates);
      setIsLoading(false);
    }

    setIsInitialized(true);
  }, []);

  // Завантажуємо курси
  useEffect(() => {
    if (!isInitialized) return;

    fetchExchangeRates().then((fetchedRates) => {
      setRates(fetchedRates);
      setIsLoading(false);
    });
  }, [isInitialized]);

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    saveCurrency(newCurrency);
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

  // Форматування ціни з валютою (цілі числа)
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
        // Округлення до цілих чисел
        formatted = Math.round(converted).toLocaleString("uk-UA");
      }

      return `${formatted} ${currency}`;
    },
    [convert, currency]
  );

  // Форматування застави (для UAH округлення до сотень вгору)
  const formatDeposit = useCallback(
    (amountUSD: number): string => {
      const converted = convert(amountUSD);

      let rounded: number;
      if (currency === "UAH") {
        // Округлення до сотень вгору
        rounded = Math.ceil(converted / 100) * 100;
      } else {
        // Для USD/EUR - звичайне округлення до цілих
        rounded = Math.round(converted);
      }

      return `${rounded.toLocaleString("uk-UA")} ${currency}`;
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
      formatDeposit,
      getCurrencySymbol,
      isLoading,
    }),
    [currency, setCurrency, convert, convertToUSD, formatPrice, formatDeposit, getCurrencySymbol, isLoading]
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
    formatDeposit: (amount: number) => {
      return `${Math.round(amount).toLocaleString("uk-UA")} USD`;
    },
    getCurrencySymbol: () => "$",
    isLoading: false,
  }), []);

  return ctx ?? fallback;
}
