"use client";

import { useCurrencySafe } from "@/context/CurrencyContext";

/**
 * Replaces "XX USD" in a structured price string like "88 USD / 100 km"
 */
export default function CurrencyPrice({
  value,
  free,
}: { value: string; free?: string }) {
  const { formatPrice, isLoading, currency } = useCurrencySafe();

  if (free && value === free) return <>{value}</>;

  const match = value.match(/^(\d+(?:\.\d+)?)\s*USD(.*)$/);
  if (!match) return <>{value}</>;

  const amount = Number.parseFloat(match[1]);
  const suffix = match[2].trim();
  const needDecimals = amount % 1 !== 0;

  if (isLoading && currency !== "USD") {
    return <span className="currency-loading" />;
  }

  return (
    <>
      {formatPrice(amount, needDecimals)}
      {suffix ? ` ${suffix}` : ""}
    </>
  );
}

/**
 * Replaces all "XX USD" occurrences inside prose text
 */
export function CurrencyText({ text, showDecimals }: { text: string; showDecimals?: boolean }) {
  const { formatPrice, isLoading, currency } = useCurrencySafe();

  if (isLoading && currency !== "USD") {
    return <span className="currency-loading" />;
  }

  const parts = text.split(/(\d+(?:\.\d+)?\s*USD)/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^(\d+(?:\.\d+)?)\s*USD$/);
        if (match) {
          const amount = Number.parseFloat(match[1]);
          const needDecimals = showDecimals ?? amount % 1 !== 0;
          const key = `${i}-${match[1]}`;
          return <span key={key}>{formatPrice(amount, needDecimals)}</span>;
        }
        return part;
      })}
    </>
  );
}
