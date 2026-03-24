/**
 * Interpreta el string de valor que viene del backend (puede ser "5000", "5000.00",
 * "5.000,00", "13300,5", etc.) y devuelve un número.
 */
export function parseMoneyFromApi(raw: string): number {
  const t = raw.trim().replace(/\$/g, "").replace(/\s/g, "");
  if (!t) return NaN;

  const lastComma = t.lastIndexOf(",");
  const lastDot = t.lastIndexOf(".");

  // Formato es-CO: miles con punto, decimales con coma (ej. 13.300,50)
  if (lastComma > lastDot) {
    const normalized = t.replace(/\./g, "").replace(",", ".");
    const n = Number.parseFloat(normalized);
    return Number.isFinite(n) ? n : NaN;
  }

  // Solo coma como decimal (5000,50)
  if (lastComma !== -1 && lastDot === -1) {
    const n = Number.parseFloat(t.replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }

  // Punto: decimal inglés (5000.50) o miles (1.000 sin decimales ambiguos)
  if (lastDot !== -1) {
    const after = t.slice(lastDot + 1);
    if (/^\d{1,2}$/.test(after) && t.length > lastDot + 1) {
      const intPart = t.slice(0, lastDot).replace(/\./g, "");
      const n = Number.parseFloat(`${intPart}.${after}`);
      return Number.isFinite(n) ? n : NaN;
    }
    const n = Number.parseFloat(t.replace(/\./g, ""));
    return Number.isFinite(n) ? n : NaN;
  }

  const n = Number.parseFloat(t);
  return Number.isFinite(n) ? n : NaN;
}

/** Muestra como en tabla: `$5.000,00` (pesos CO, 2 decimales). */
export function formatValorCOPTable(raw: string): string {
  const n = parseMoneyFromApi(raw);
  if (!Number.isFinite(n)) return raw.trim() || "—";
  const body = n.toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `$${body}`;
}
