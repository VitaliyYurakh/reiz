"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  themeColorLock,
  getThemeColorForPath,
  updateThemeColorMeta,
} from "@/lib/theme-color";

export function useThemeColor() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip if theme color is locked (menu is open)
    if (themeColorLock.locked) {
      return;
    }

    const themeColor = getThemeColorForPath(pathname);
    updateThemeColorMeta(themeColor);
  }, [pathname]);
}
