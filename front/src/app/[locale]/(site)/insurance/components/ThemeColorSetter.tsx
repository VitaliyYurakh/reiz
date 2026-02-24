"use client";

import { useEffect, useRef } from "react";
import { updateThemeColorMeta } from "@/lib/theme-color";

const INSURANCE_THEME_COLOR = "#1a1a1a";
const DEFAULT_THEME_COLOR = "#f1f0eb";

export default function InsuranceThemeColorSetter() {
  const prevColor = useRef<string>(DEFAULT_THEME_COLOR);

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) {
      prevColor.current = meta.getAttribute("content") || DEFAULT_THEME_COLOR;
    }

    updateThemeColorMeta(INSURANCE_THEME_COLOR);

    return () => {
      updateThemeColorMeta(prevColor.current);
    };
  }, []);

  return null;
}
