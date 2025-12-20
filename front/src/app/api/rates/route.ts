import { NextResponse } from "next/server";

// ISO 4217 коди валют
const USD_CODE = 840;
const EUR_CODE = 978;
const UAH_CODE = 980;

// Кеш курсів (серверний)
let cachedRates: {
  USD_UAH: number;
  EUR_UAH: number;
  USD_EUR: number;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 годин

// Fallback курси (приблизні, використовуються тільки якщо API недоступний)
const FALLBACK_RATES = {
  USD_UAH: 42.7,
  EUR_UAH: 49.5,
  USD_EUR: 42.7 / 49.5,
};

type MonobankRate = {
  currencyCodeA: number;
  currencyCodeB: number;
  date: number;
  rateBuy?: number;
  rateSell?: number;
  rateCross?: number;
};

function getRate(rate: MonobankRate): number | null {
  // Пріоритет: rateSell → rateCross
  if (rate.rateSell != null && rate.rateSell > 0) {
    return rate.rateSell;
  }
  if (rate.rateCross != null && rate.rateCross > 0) {
    return rate.rateCross;
  }
  return null;
}

async function fetchRatesFromMonobank() {
  const response = await fetch(
    "https://api.monobank.ua/bank/currency",
    {
      next: { revalidate: 43200 }, // 12 годин кеш Next.js
    }
  );

  if (!response.ok) {
    throw new Error(`Monobank API error: ${response.status}`);
  }

  const data: MonobankRate[] = await response.json();

  // Знаходимо курси USD/UAH і EUR/UAH
  const usdUahRate = data.find(
    (r) => r.currencyCodeA === USD_CODE && r.currencyCodeB === UAH_CODE
  );
  const eurUahRate = data.find(
    (r) => r.currencyCodeA === EUR_CODE && r.currencyCodeB === UAH_CODE
  );

  if (!usdUahRate || !eurUahRate) {
    throw new Error("Currency rates not found in Monobank API response");
  }

  const usdRate = getRate(usdUahRate);
  const eurRate = getRate(eurUahRate);

  if (usdRate === null || eurRate === null) {
    throw new Error("Unable to get sell/cross rates from Monobank");
  }

  // Курси без жодних корекцій/маржі
  const USD_UAH = usdRate;
  const EUR_UAH = eurRate;
  // USD → EUR через UAH
  const USD_EUR = USD_UAH / EUR_UAH;

  return {
    USD_UAH,
    EUR_UAH,
    USD_EUR,
    timestamp: Date.now(),
  };
}

export async function GET() {
  try {
    // Перевіряємо кеш (12 годин)
    const now = Date.now();
    if (cachedRates && now - cachedRates.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        rates: {
          USD_UAH: cachedRates.USD_UAH,
          EUR_UAH: cachedRates.EUR_UAH,
          USD_EUR: cachedRates.USD_EUR,
        },
        cached: true,
        cacheAge: Math.round((now - cachedRates.timestamp) / 1000),
      });
    }

    // Отримуємо свіжі курси
    const rates = await fetchRatesFromMonobank();
    cachedRates = rates;

    return NextResponse.json({
      success: true,
      rates: {
        USD_UAH: rates.USD_UAH,
        EUR_UAH: rates.EUR_UAH,
        USD_EUR: rates.USD_EUR,
      },
      cached: false,
    });
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);

    // Якщо є застарілий кеш - використовуємо його
    if (cachedRates) {
      return NextResponse.json({
        success: true,
        rates: {
          USD_UAH: cachedRates.USD_UAH,
          EUR_UAH: cachedRates.EUR_UAH,
          USD_EUR: cachedRates.USD_EUR,
        },
        cached: true,
        stale: true,
      });
    }

    // Fallback курси
    return NextResponse.json({
      success: true,
      rates: FALLBACK_RATES,
      fallback: true,
    });
  }
}
