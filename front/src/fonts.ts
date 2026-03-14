import { Merriweather } from "next/font/google";
import localFont from "next/font/local";

export const merriweather = Merriweather({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  style: "italic",
  variable: "--font-merriweather",
  fallback: ["Georgia", "serif"],
  display: "swap",
});

export const kyivType = localFont({
  src: [
    {
      path: "../public/fonts/KyivTypeSans-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  adjustFontFallback: "Arial",
  variable: "--font-kyiv",
  display: "swap",
});
