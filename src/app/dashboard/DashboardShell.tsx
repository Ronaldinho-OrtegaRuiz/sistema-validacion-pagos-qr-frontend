"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[color:var(--primary-50)] via-white to-white"
      style={{ overflowX: "hidden" }}
    >
      {/* Botón hamburger (solo móvil) */}
      <button
        type="button"
        aria-label={open ? "Cerrar sidebar" : "Abrir sidebar"}
        onClick={() => setOpen((v) => !v)}
        className={[
          "fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl p-0 shadow-sm transition-colors lg:hidden",
          open ? "hidden" : "",
        ].join(" ")}
        style={{
          backgroundColor: "var(--primary-600)",
          color: "white",
        }}
      >
        {/* Hamburger */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="block"
          style={{ display: open ? "none" : "block" }}
        >
          <path
            d="M4 7H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 12H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 17H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

      </button>

      <div className="flex min-h-screen">
        {/* Sidebar (desktop siempre visible, móvil controlado por estado) */}
        <div
          className={[
            "fixed left-0 top-0 z-40 h-screen w-64 transform transition-transform duration-200 lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <DashboardSidebar onRequestClose={() => setOpen(false)} />
        </div>

        {/* Overlay (móvil) */}
        {open ? (
          <button
            type="button"
            aria-label="Cerrar sidebar"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          />
        ) : null}

        <main className="flex-1 p-6 pt-16 lg:p-6 lg:pl-10 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}

