/** Clave en localStorage para el token Bearer del admin. */
export const AUTH_TOKEN_KEY = "auth_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    // ignore quota / private mode
  }
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignore
  }
}
