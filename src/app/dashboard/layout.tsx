import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("auth_user")?.value;

  if (!raw) redirect("/login");

  return (
    <DashboardShell>{children}</DashboardShell>
  );
}

