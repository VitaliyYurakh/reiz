import { Inter, Merriweather } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  fallback: ["Arial", "sans-serif"],
  display: "swap",
});

export const merriweather = Merriweather({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  style: "italic",
  variable: "--font-merriweather",
  fallback: ["Georgia", "serif"],
  display: "swap",
});

export const halvar = localFont({
  src: [
    {
      path: "../public/fonts/HalvarBreit-Md.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  adjustFontFallback: "Arial",
  variable: "--font-halvar",
  display: "swap",
});

export const gowunDodum = localFont({
  src: [
    {
      path: "../public/fonts/GowunDodum-Regular.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  adjustFontFallback: "Arial",
  variable: "--font-gowun",
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
