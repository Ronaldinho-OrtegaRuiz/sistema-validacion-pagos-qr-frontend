/** localStorage: color primario #RRGGBB */
export const APP_PRIMARY_KEY = "app_primary_hex";

export const DEFAULT_PRIMARY_HEX = "#2563eb";

export function isValidHex6(s: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(s.trim());
}
