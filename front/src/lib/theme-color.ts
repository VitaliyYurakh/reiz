const HOME_PATHS = ["/", "/ru", "/en"];
const INVEST_PATHS = ["/invest", "/ru/invest", "/en/invest"];
const HOME_THEME_COLOR = "#000000";
const INVEST_THEME_COLOR = "#ffffff";
const DEFAULT_THEME_COLOR = "#ffffff";
const MENU_THEME_COLOR = "#ffffff";
// Global lock flag - when true, other components should not change theme-color
export const themeColorLock = { locked: false };

export function getThemeColorForPath(pathname: string): string {
  if (HOME_PATHS.includes(pathname)) return HOME_THEME_COLOR;
  if (INVEST_PATHS.includes(pathname)) return INVEST_THEME_COLOR;
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
