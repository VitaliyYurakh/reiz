import { useEffect, useRef } from "react";

const MENU_THEME_COLOR = "#F1F0EB";

// Global lock flag - when true, other components should not change theme-color
export const themeColorLock = { locked: false };

export function useThemeColorOnOpen(isOpen: boolean) {
    const previousColor = useRef<string | null>(null);

    useEffect(() => {
        let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

        if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", "theme-color");
            meta.setAttribute("content", "#000");
            document.head.appendChild(meta);
        }

        if (isOpen) {
            previousColor.current = meta.getAttribute("content");
            meta.setAttribute("content", MENU_THEME_COLOR);
            themeColorLock.locked = true;
        } else {
            themeColorLock.locked = false;
            if (previousColor.current !== null) {
                meta.setAttribute("content", previousColor.current);
                previousColor.current = null;
            }
        }
    }, [isOpen]);
}
