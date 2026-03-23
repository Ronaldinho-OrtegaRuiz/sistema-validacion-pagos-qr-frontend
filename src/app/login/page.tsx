import LoginCard from "./LoginCard";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[color:var(--primary-50)] via-white to-white p-4">
      <LoginCard />
    </div>
  );
}

