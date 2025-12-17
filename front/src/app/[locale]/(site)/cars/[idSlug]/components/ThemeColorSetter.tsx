"use client";

import { useEffect, useRef } from "react";

const LIGHT_THEME_COLOR = "#F1F0EB";

export default function ThemeColorSetter() {
    const themeColorMeta = useRef<HTMLMetaElement | null>(null);

    useEffect(() => {
        themeColorMeta.current = document.querySelector('meta[name="theme-color"]');

        if (!themeColorMeta.current) {
            themeColorMeta.current = document.createElement("meta");
            themeColorMeta.current.setAttribute("name", "theme-color");
            document.head.appendChild(themeColorMeta.current);
        }

        themeColorMeta.current.setAttribute("content", LIGHT_THEME_COLOR);

        return () => {
            if (themeColorMeta.current) {
                themeColorMeta.current.setAttribute("content", LIGHT_THEME_COLOR);
            }
        };
    }, []);

    return null;
}
