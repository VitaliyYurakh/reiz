import { NextResponse } from "next/server";

// Кеш курсів (серверний)
let cachedRates: {
  USD_UAH: number;
  EUR_UAH: number;
  USD_EUR: number;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 30 * 60 * 1000; // 30 хвилин
const COMMISSION = 1.01; // +1% комісія

// Fallback курси (приблизні)
const FALLBACK_RATES = {
  USD_UAH: 41.5 * COMMISSION,
  EUR_UAH: 45.0 * COMMISSION,
  USD_EUR: (41.5 * COMMISSION) / (45.0 * COMMISSION),
};

async function fetchRatesFromPrivatBank() {
  const response = await fetch(
    "https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=11",
    {
      next: { revalidate: 1800 }, // 30 хвилин кеш Next.js
    }
  );

  if (!response.ok) {
    throw new Error(`PrivatBank API error: ${response.status}`);
  }

  const data = await response.json();

  // Знаходимо курси USD і EUR
  const usdRate = data.find((item: any) => item.ccy === "USD");
  const eurRate = data.find((item: any) => item.ccy === "EUR");

  if (!usdRate || !eurRate) {
    throw new Error("Currency rates not found in API response");
  }

  // Беремо курс продажу (sale) і додаємо +1% комісію
  const USD_UAH = parseFloat(usdRate.sale) * COMMISSION;
  const EUR_UAH = parseFloat(eurRate.sale) * COMMISSION;
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
    // Перевіряємо кеш
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
    const rates = await fetchRatesFromPrivatBank();
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
