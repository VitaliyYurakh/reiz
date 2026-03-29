"use client";

import { useCurrencySafe } from "@/context/CurrencyContext";

/**
 * Replaces "XX USD" in a structured price string like "88 USD / 100 km"
 */
export default function CurrencyPrice({
  value,
  free,
}: { value: string; free?: string }) {
  const { formatPrice } = useCurrencySafe();

  if (free && value === free) return <>{value}</>;

  const match = value.match(/^(\d+)\s*USD(.*)$/);
  if (!match) return <>{value}</>;

  const amount = Number.parseInt(match[1]);
  const suffix = match[2].trim();

  return (
    <>
      {formatPrice(amount)}
      {suffix ? ` ${suffix}` : ""}
    </>
  );
}

/**
 * Replaces all "XX USD" occurrences inside prose text
 */
export function CurrencyText({ text }: { text: string }) {
  const { formatPrice } = useCurrencySafe();

  const parts = text.split(/(\d+\s*USD)/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^(\d+)\s*USD$/);
        if (match) {
          const key = `${i}-${match[1]}`;
          return <span key={key}>{formatPrice(Number.parseInt(match[1]))}</span>;
        }
        return part;
      })}
    </>
  );
}
