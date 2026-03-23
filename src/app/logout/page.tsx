import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Logout",
};

export default async function LogoutPage() {
  const cookieStore = await cookies();
  cookieStore.set("auth_user", "", { path: "/", expires: new Date(0) });

  redirect("/login");
}

