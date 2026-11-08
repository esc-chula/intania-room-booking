import type { ReactNode } from "react";
import type { NavItem } from "@/config/navigation";
import { Logo } from "./logo";
import { SidebarNav } from "./sidebar-nav";

type AppShellProps = {
  subtitle?: string;
  navigation: NavItem[];
  children: ReactNode;
};

// Mobile-first: the sidebar becomes a scrolling top bar below md.
export function AppShell({ subtitle, navigation, children }: AppShellProps) {
  return (
    <div className="min-h-dvh md:flex">
      <aside className="space-y-3 bg-sidebar p-3 text-sidebar-foreground md:w-70 md:shrink-0 md:space-y-8 md:px-5 md:pt-12 md:pb-8">
        <div className="md:space-y-8 md:text-center">
          <Logo onDark className="hidden size-9 md:mx-auto md:block" />
          <div className="text-sm leading-6 font-medium">
            <p>Room Booking System</p>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        </div>
        <hr className="hidden border-sidebar-foreground md:block" />
        <SidebarNav items={navigation} />
      </aside>
      <main className="min-w-0 flex-1 p-4 md:px-16 md:py-8">
        {/* The designs lay content out in a 1500px block at 1920px wide. */}
        <div className="max-w-[1500px]">{children}</div>
      </main>
    </div>
  );
}
