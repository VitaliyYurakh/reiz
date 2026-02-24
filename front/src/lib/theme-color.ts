const HOME_PATHS = ["/", "/ru", "/en"];
const HOME_THEME_COLOR = "#000000";
const DEFAULT_THEME_COLOR = "#f1f0eb";
const MENU_THEME_COLOR = "#F1F0EB";

// Global lock flag - when true, other components should not change theme-color
export const themeColorLock = { locked: false };

export function getThemeColorForPath(pathname: string): string {
  const isHomePage = HOME_PATHS.includes(pathname);
  return isHomePage ? HOME_THEME_COLOR : DEFAULT_THEME_COLOR;
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
