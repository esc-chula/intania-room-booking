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
      <aside className="space-y-3 bg-sidebar p-3 text-sidebar-foreground md:w-56 md:shrink-0 md:space-y-6 md:px-4 md:pt-8 md:pb-6 lg:w-56 xl:w-60 2xl:w-70 2xl:space-y-8 2xl:px-5 2xl:pt-12 2xl:pb-8">
        <div className="md:space-y-5 md:text-center 2xl:space-y-8">
          <Logo onDark className="hidden size-9 md:mx-auto md:block" />
          <div className="text-sm leading-6 font-medium">
            <p>Room Booking System</p>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        </div>
        <hr className="hidden border-sidebar-foreground md:block" />
        <SidebarNav items={navigation} />
      </aside>
      <main className="min-w-0 flex-1 p-4 md:px-6 md:py-6 lg:px-6 xl:px-8 2xl:px-16 2xl:py-8">
        {/* The designs lay content out in a 1500px block at 1920px wide. */}
        <div className="max-w-[1500px]">{children}</div>
      </main>
    </div>
  );
}
