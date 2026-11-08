import { AppShell } from "@/components/layout/app-shell";
import { userNavigation } from "@/config/navigation";
import { AuthGate } from "@/features/auth/components/auth-gate";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate area="user">
      <AppShell navigation={userNavigation}>{children}</AppShell>
    </AuthGate>
  );
}
