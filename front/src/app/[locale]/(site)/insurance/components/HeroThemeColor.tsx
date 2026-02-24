"use client";

import { useEffect, useRef } from "react";
import { updateThemeColorMeta } from "@/lib/theme-color";

const DARK = "#000000";
const LIGHT = "#f1f0eb";

export default function HeroThemeColor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = ref.current?.closest(".insurance-section__mob-hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        updateThemeColorMeta(entry.isIntersecting ? DARK : LIGHT);
      },
      { threshold: 0 }
    );

    observer.observe(hero);

    return () => {
      observer.disconnect();
      updateThemeColorMeta(LIGHT);
    };
  }, []);

  return <div ref={ref} style={{ display: "none" }} />;
}
