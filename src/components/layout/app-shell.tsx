import type { ReactNode } from "react";
import type { NavItem } from "@/config/navigation";
import { Logo } from "./logo";
import { SidebarNav } from "./sidebar-nav";

type AppShellProps = {
  subtitle?: string;
  navigation: NavItem[];
  children: ReactNode;
};

// Mobile-first: the sidebar becomes a scrolling top bar below xl. A 224px sidebar
// leaves a tablet too little room for the month calendar (640px minimum).
export function AppShell({ subtitle, navigation, children }: AppShellProps) {
  return (
    <div className="min-h-dvh xl:flex">
      <aside className="space-y-3 bg-sidebar p-3 text-sidebar-foreground xl:w-60 xl:shrink-0 xl:space-y-6 xl:px-4 xl:pt-8 xl:pb-6 2xl:w-70 2xl:space-y-8 2xl:px-5 2xl:pt-12 2xl:pb-8">
        <div className="xl:space-y-5 xl:text-center 2xl:space-y-8">
          <Logo onDark className="hidden size-9 xl:mx-auto xl:block" />
          <div className="text-sm leading-6 font-medium">
            <p>Room Booking System</p>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        </div>
        <hr className="hidden border-sidebar-foreground xl:block" />
        <SidebarNav items={navigation} />
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-6 xl:px-8 2xl:px-16 2xl:py-8">
        {/* The designs lay content out in a 1500px block at 1920px wide. */}
        <div className="max-w-[1500px]">{children}</div>
      </main>
    </div>
  );
}
