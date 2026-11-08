import { LoginCard } from "@/features/auth/components/login-card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ auth_error?: string; next?: string }>;
}) {
  const { auth_error, next } = await searchParams;
  return (
    <main className="flex min-h-dvh items-center justify-center bg-white bg-[url(/background.svg)] bg-cover bg-center p-4">
      <LoginCard next={next} error={auth_error} />
    </main>
  );
}
