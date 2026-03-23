import LoginCard from "./LoginCard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Login",
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("auth_user")?.value;
  if (raw) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[color:var(--primary-50)] via-white to-white p-4">
      <LoginCard />
    </div>
  );
}

