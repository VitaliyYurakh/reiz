"use client";

import { useEffect, useRef } from "react";

const CERTIFICATE_THEME_COLOR = "#F1F0EB";

export default function CertificateThemeColorSetter() {
  const themeColorMeta = useRef<HTMLMetaElement | null>(null);

  useEffect(() => {
    themeColorMeta.current = document.querySelector('meta[name="theme-color"]');

    if (!themeColorMeta.current) {
      themeColorMeta.current = document.createElement("meta");
      themeColorMeta.current.setAttribute("name", "theme-color");
      document.head.appendChild(themeColorMeta.current);
    }

    themeColorMeta.current.setAttribute("content", CERTIFICATE_THEME_COLOR);

    return () => {
      if (themeColorMeta.current) {
        themeColorMeta.current.setAttribute("content", "#000");
      }
    };
  }, []);

  return null;
}
