const HOME_PATHS = ["/", "/ru", "/en"];
const DARK_PATHS = ["/insurance", "/ru/insurance", "/en/insurance", "/pl/insurance", "/ro/insurance"];
const HOME_THEME_COLOR = "#000000";
const DARK_THEME_COLOR = "#1a1a1a";
const DEFAULT_THEME_COLOR = "#f1f0eb";
const MENU_THEME_COLOR = "#F1F0EB";

// Global lock flag - when true, other components should not change theme-color
export const themeColorLock = { locked: false };

export function getThemeColorForPath(pathname: string): string {
  if (HOME_PATHS.includes(pathname)) return HOME_THEME_COLOR;
  if (DARK_PATHS.includes(pathname)) return DARK_THEME_COLOR;
  return DEFAULT_THEME_COLOR;
}

export function getMenuThemeColor(): string {
  return MENU_THEME_COLOR;
}

export function updateThemeColorMeta(color: string): void {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

  if (meta) {
    meta.setAttribute("content", color);
  } else {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    meta.setAttribute("content", color);
    document.head.appendChild(meta);
  }
}
