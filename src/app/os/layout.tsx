import { AppShell } from "@/components/layout/app-shell";
import { osNavigation } from "@/config/navigation";
import { AuthGate } from "@/features/auth/components/auth-gate";

export default function OsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate area="os">
      <AppShell subtitle="OS" navigation={osNavigation}>
        {children}
      </AppShell>
    </AuthGate>
  );
}
