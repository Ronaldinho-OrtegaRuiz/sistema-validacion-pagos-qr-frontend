"use client";

import { useToast } from "@/components/ToastProvider";
import {
  LoginRequestError,
  loginErrorMessage,
  postLogin,
} from "@/lib/api";
import { getToken, setAuthUsername, setToken } from "@/lib/auth-storage";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginCard() {
  const router = useRouter();
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Inicializa con vars para que el render inicial ya use el primary real.
  const [iconSquareBg, setIconSquareBg] = useState("var(--primary-600)");
  const [iconCapsuleFill, setIconCapsuleFill] = useState("var(--primary-800)");

  useEffect(() => {
    // Ajuste de contraste:
    // - cuadradito: primary-600
    // - cápsula: más oscura si primary-600 es claro; más clara si primary-600 es oscuro.
    const cssColorToRgb = (color: string) => {
      const c = color.trim();
      // Hex: #RRGGBB
      const hexMatch = c.match(/^#([0-9a-f]{6})$/i);
      if (hexMatch) {
        const normalized = hexMatch[1];
        const r = Number.parseInt(normalized.slice(0, 2), 16);
        const g = Number.parseInt(normalized.slice(2, 4), 16);
        const b = Number.parseInt(normalized.slice(4, 6), 16);
        return { r, g, b };
      }

      // rgb(r, g, b) / rgb(r g b)
      const rgbMatch = c.match(
        /^rgba?\(\s*([0-9]{1,3})\s*[,\s]\s*([0-9]{1,3})\s*[,\s]\s*([0-9]{1,3})/
      );
      if (rgbMatch) {
        const r = Number.parseInt(rgbMatch[1], 10);
        const g = Number.parseInt(rgbMatch[2], 10);
        const b = Number.parseInt(rgbMatch[3], 10);
        return { r, g, b };
      }

      return null;
    };

    const compute = () => {
      const root = document.documentElement;
      const style = getComputedStyle(root);

      const p600 = style.getPropertyValue("--primary-600").trim();
      const p800 = style.getPropertyValue("--primary-800").trim();
      const p100 = style.getPropertyValue("--primary-100").trim();
      if (!p600 || !p800 || !p100) return;

      const rgb = cssColorToRgb(p600);
      if (!rgb) return;

      // Luminancia percibida (0..1).
      const luminance =
        (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;

      setIconSquareBg(p600);
      // Si el primary-600 es claro, usamos capsule “más oscuro”; si es oscuro, capsule “más clara”.
      setIconCapsuleFill(luminance > 0.55 ? p800 : p100);
    };

    compute();
    // Recalcular para que el ícono responda a cambios del primary sin depender del remount.
    const id = window.setInterval(compute, 500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const u = username.trim();
    if (!u || !password) {
      setError("Ingresa usuario y contraseña.");
      return;
    }

    setSubmitting(true);
    try {
      const { token } = await postLogin(u, password);
      setToken(token);
      setAuthUsername(u);
      toast.show("Inicio de sesión exitoso", "success");
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof LoginRequestError) {
        const msg = loginErrorMessage(err.status, err.body);
        setError(msg);
        toast.show(msg, "error");
      } else {
        const msg = "No se pudo iniciar sesión. Intenta nuevamente.";
        setError(msg);
        toast.show(msg, "error");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="w-full max-w-sm rounded-2xl border bg-white p-6"
      style={{
        borderColor: "var(--primary-100)",
        boxShadow:
          "0 18px 50px -25px color-mix(in srgb, var(--primary-600) 35%, transparent)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconSquareBg }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M19.778 4.222c2.343 2.343 2.343 6.142 0 8.485l-2.122 2.12-4.949 4.951c-2.343 2.343-6.142 2.343-8.485 0-2.343-2.343-2.343-6.142 0-8.485l7.07-7.071c2.344-2.343 6.143-2.343 8.486 0zm-4.95 10.606L9.172 9.172l-3.536 3.535c-1.562 1.562-1.562 4.095 0 5.657 1.562 1.562 4.095 1.562 5.657 0l3.535-3.536z"
              fill={iconCapsuleFill}
            />
          </svg>
        </span>
        <h1 className="text-xl font-semibold text-zinc-950">
        Iniciar sesión
        </h1>
      </div>
      <p className="mt-2 text-sm text-zinc-600">
        Accede a tu cuenta con tu usuario y contraseña.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="text-sm font-medium text-zinc-900"
          >
            Usuario
          </label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-11 w-full rounded-xl border bg-white px-3 text-sm text-zinc-950 outline-none transition-colors"
            style={{
              borderColor: "var(--primary-400, var(--primary-200))",
            }}
            placeholder="tu.usuario"
            disabled={submitting}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-900"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-xl border bg-white px-3 text-sm text-zinc-950 outline-none transition-colors"
            style={{
              borderColor: "var(--primary-400, var(--primary-200))",
            }}
            disabled={submitting}
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-90"
          style={{
            backgroundColor: "var(--primary-600)",
          }}
          onMouseEnter={(e) => {
            if (!submitting) e.currentTarget.style.backgroundColor = "var(--primary-700)";
          }}
          onMouseLeave={(e) => {
            if (!submitting) e.currentTarget.style.backgroundColor = "var(--primary-600)";
          }}
        >
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

