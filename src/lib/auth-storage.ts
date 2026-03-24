/** Clave en localStorage para el token Bearer del admin. */
export const AUTH_TOKEN_KEY = "auth_token";

/** Usuario con el que se inició sesión (para permisos de UI en el cliente). */
export const AUTH_USERNAME_KEY = "auth_username";

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

export function getAuthUsername(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(AUTH_USERNAME_KEY);
    return v && v.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}

export function setAuthUsername(username: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AUTH_USERNAME_KEY, username.trim());
  } catch {
    // ignore
  }
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USERNAME_KEY);
  } catch {
    // ignore
  }
}
