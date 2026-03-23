import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Home",
};

export default async function Home() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("auth_user")?.value;

  if (!raw) redirect("/login");

  // El home solo actúa como "root redirect" al dashboard.
  redirect("/dashboard");
}
