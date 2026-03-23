import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Home",
};

export default async function Home() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("auth_user")?.value;

  if (!raw) redirect("/login");

  let username = raw;
  try {
    username = decodeURIComponent(raw);
  } catch {
    // Si la cookie viene corrupta, mostramos un valor seguro.
    username = raw;
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-gradient-to-b from-[color:var(--primary-50)] via-white to-white"
    >
      <header className="flex w-full items-center justify-between border-b bg-white px-6 py-4">
        <div className="text-sm text-zinc-700">
          Sesión iniciada
          <span className="ml-2 font-semibold text-zinc-950">
            {username}
          </span>
        </div>
        <a
          href="/logout"
          className="rounded-lg border bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-[color:var(--primary-50)]"
          style={{
            borderColor: "var(--primary-100)",
            color: "var(--primary-700)",
          }}
        >
          Salir
        </a>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <div
          className="w-full max-w-2xl rounded-2xl border bg-white p-6"
          style={{
            borderColor: "var(--primary-100)",
            boxShadow:
              "0 18px 50px -25px color-mix(in srgb, var(--primary-600) 28%, transparent)",
          }}
        >
          <h1 className="text-lg font-semibold text-zinc-950">
            Flujo inicial listo
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Este es un placeholder. Cuando conectemos tu backend, aquí
            renderizaremos el resto de pantallas protegidas.
          </p>
        </div>
      </main>
    </div>
  );
}
