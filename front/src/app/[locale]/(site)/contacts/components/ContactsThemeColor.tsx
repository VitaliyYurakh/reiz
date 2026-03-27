"use client";

import { useEffect, useRef } from "react";
import { updateThemeColorMeta } from "@/lib/theme-color";

const DARK = "#000000";
const LIGHT = "#ffffff";

export default function ContactsThemeColor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = document.querySelector(".contacts-hero-bg");
    if (!hero) return;

    updateThemeColorMeta(DARK);

    const observer = new IntersectionObserver(
      ([entry]) => {
        updateThemeColorMeta(entry.isIntersecting ? DARK : LIGHT);
      },
      { threshold: 0 },
    );

    observer.observe(hero);

    return () => {
      observer.disconnect();
      updateThemeColorMeta(LIGHT);
    };
  }, []);

  return <div ref={ref} style={{ display: "none" }} />;
}
