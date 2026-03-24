/**
 * Puente entre peticiones HTTP (fetchWithAuth, postLogin, etc.) y el toast de carga.
 * Contador: con varias peticiones en paralelo solo hay un toast hasta que todas terminen.
 */

type Bridge = {
  onLoadingStart: () => void;
  onLoadingEnd: () => void;
};

let bridge: Bridge | null = null;
let pending = 0;

export function registerApiRequestLoadingBridge(next: Bridge | null): void {
  bridge = next;
}

export function notifyApiRequestStart(): void {
  if (typeof window === "undefined") return;
  pending += 1;
  if (pending === 1) {
    bridge?.onLoadingStart();
  }
}

export function notifyApiRequestEnd(): void {
  if (typeof window === "undefined") return;
  pending = Math.max(0, pending - 1);
  if (pending === 0) {
    bridge?.onLoadingEnd();
  }
}
