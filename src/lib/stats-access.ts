/**
 * Quién puede ver Estadísticas en el cliente.
 *
 * - Si defines `NEXT_PUBLIC_STATS_ALLOWED_USERNAMES` (lista separada por comas),
 *   solo esos usuarios ven estadísticas (modo lista blanca). Si está definida y no vacía,
 *   se ignora `NEXT_PUBLIC_HIDE_STATS_USERNAMES`.
 * - Si no hay lista blanca, y defines `NEXT_PUBLIC_HIDE_STATS_USERNAMES`, esos usuarios
 *   no ven el menú ni la página (lista negra).
 * - Si no hay ninguna variable, todos los usuarios autenticados ven estadísticas.
 *
 * El nombre de usuario es el que se guarda al iniciar sesión (mismo string que en el login).
 * Comparación sin distinguir mayúsculas.
 *
 * Nota: esto solo oculta UI. La API debe negar datos sensibles si hace falta.
 */

function norm(s: string): string {
  return s.trim().toLowerCase();
}

export function canAccessStats(username: string | null | undefined): boolean {
  const allowRaw =
    typeof process !== "undefined" &&
    typeof process.env.NEXT_PUBLIC_STATS_ALLOWED_USERNAMES === "string"
      ? process.env.NEXT_PUBLIC_STATS_ALLOWED_USERNAMES.trim()
      : "";

  if (allowRaw) {
    const allowed = allowRaw.split(",").map(norm).filter(Boolean);
    if (allowed.length === 0) return true;
    const u = username?.trim();
    if (!u) return false;
    return allowed.includes(norm(u));
  }

  const hideRaw =
    typeof process !== "undefined" &&
    typeof process.env.NEXT_PUBLIC_HIDE_STATS_USERNAMES === "string"
      ? process.env.NEXT_PUBLIC_HIDE_STATS_USERNAMES.trim()
      : "";

  if (!hideRaw) return true;
  const hidden = hideRaw.split(",").map(norm).filter(Boolean);
  const u = username?.trim();
  if (!u) return true;
  return !hidden.includes(norm(u));
}
