/** localStorage: "light" | "dark" */
export const APP_THEME_KEY = "app_theme";

/** localStorage: color primario #RRGGBB */
export const APP_PRIMARY_KEY = "app_primary_hex";

export const DEFAULT_PRIMARY_HEX = "#2563eb";

export type AppTheme = "light" | "dark";

export function isValidHex6(s: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(s.trim());
}
