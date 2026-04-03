export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://reiz.com.ua/";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://reiz.com.ua/api";

// Server-side only: use internal Docker URL when available (faster, no external roundtrip)
export const API_URL_SERVER =
  process.env.API_URL_INTERNAL ?? API_URL;
