"use client";

import { registerApiRequestLoadingBridge } from "@/lib/api-request-loading";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ToastVariant = "success" | "error" | "info" | "loading";

type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

export type ShowToastOptions = {
  /** Si es true, el toast no se cierra solo; usa el `dismiss` que devuelve `show`. */
  persistent?: boolean;
};

type ToastContextValue = {
  show: (
    message: string,
    variant?: ToastVariant,
    options?: ShowToastOptions
  ) => () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DISMISS_MS = 5200;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback(
    (
      message: string,
      variant: ToastVariant = "info",
      options?: ShowToastOptions
    ) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, variant }]);
      const dismiss = () =>
        setToasts((prev) => prev.filter((t) => t.id !== id));
      if (!options?.persistent) {
        window.setTimeout(dismiss, DISMISS_MS);
      }
      return dismiss;
    },
    []
  );

  const value = useMemo(() => ({ show }), [show]);

  /** Toast persistente con spinner mientras haya peticiones al API en curso. */
  const loadingDismissRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    registerApiRequestLoadingBridge({
      onLoadingStart: () => {
        if (loadingDismissRef.current) return;
        loadingDismissRef.current = show(
          "Cargando respuesta…",
          "loading",
          { persistent: true }
        );
      },
      onLoadingEnd: () => {
        loadingDismissRef.current?.();
        loadingDismissRef.current = null;
      },
    });
    return () => {
      registerApiRequestLoadingBridge(null);
      loadingDismissRef.current?.();
      loadingDismissRef.current = null;
    };
  }, [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[200] flex max-w-[min(100vw-2rem,22rem)] flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
              t.variant === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : t.variant === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : t.variant === "loading"
                    ? "border-[color:var(--primary-300)] bg-white text-zinc-900"
                    : "border-[color:var(--primary-200)] bg-white text-zinc-900"
            }`}
            style={
              t.variant === "info" || t.variant === "loading"
                ? {
                    boxShadow:
                      "0 12px 40px -18px color-mix(in srgb, var(--primary-600) 40%, transparent)",
                  }
                : undefined
            }
          >
            {t.variant === "loading" ? (
              <span
                className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[color:var(--primary-200)] border-t-[color:var(--primary-600)]"
                aria-hidden
              />
            ) : null}
            <span className="min-w-0 flex-1 font-medium leading-snug">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast debe usarse dentro de ToastProvider");
  }
  return ctx;
}
