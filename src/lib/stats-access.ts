/**
 * Admin = mismo usuario que ve estadísticas (ADMIN_USER en el API).
 * El resto (p. ej. BASIC_USER) tiene UI restringida (fechas, etc.).
 *
 * Nombre = login guardado en localStorage. Comparación sin mayúsculas.
 */

export const STATS_VISIBLE_USERNAME = "drsortega";

function norm(s: string): string {
  return s.trim().toLowerCase();
}

export function canAccessStats(username: string | null | undefined): boolean {
  const u = username?.trim();
  if (!u) return false;
  return norm(u) === norm(STATS_VISIBLE_USERNAME);
}
