import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
    themeColorLock,
    getThemeColorForPath,
    getMenuThemeColor,
    updateThemeColorMeta,
} from "@/lib/theme-color";

// Re-export for backward compatibility
export { themeColorLock };

export function useThemeColorOnOpen(isOpen: boolean) {
    const pathname = usePathname();

    useEffect(() => {
        if (isOpen) {
            updateThemeColorMeta(getMenuThemeColor());
            themeColorLock.locked = true;
        } else {
            themeColorLock.locked = false;
            // Restore color based on current path
            updateThemeColorMeta(getThemeColorForPath(pathname));
        }
    }, [isOpen, pathname]);
}
