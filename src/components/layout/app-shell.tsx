import type { ReactNode } from "react";
import type { NavItem } from "@/config/navigation";
import { Logo } from "./logo";
import { SidebarNav } from "./sidebar-nav";

type AppShellProps = {
  subtitle?: string;
  navigation: NavItem[];
  children: ReactNode;
};

// Mobile-first: the sidebar becomes a scrolling top bar below lg (1024px). A
// sidebar leaves a 768px tablet too little room for the month calendar (640px
// minimum). From lg the widths follow the 1920px design as percentages: the
// sidebar is 280px of 1920 (14.58vw) and the content inset is 64px (3.33vw),
// with a floor so the Thai labels still fit on a 1024px laptop.
export function AppShell({ subtitle, navigation, children }: AppShellProps) {
  return (
    <div className="min-h-dvh lg:flex">
      <aside className="space-y-3 bg-sidebar p-3 text-sidebar-foreground lg:w-[14.58vw] lg:max-w-70 lg:min-w-52 lg:shrink-0 lg:space-y-6 lg:px-[1.3vw] lg:pt-8 lg:pb-6 2xl:space-y-8 2xl:pt-12 2xl:pb-8">
        <div className="lg:space-y-5 lg:text-center 2xl:space-y-8">
          <Logo onDark className="hidden size-9 lg:mx-auto lg:block" />
          <div className="text-sm leading-6 font-medium">
            <p>Room Booking System</p>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        </div>
        <hr className="hidden border-sidebar-foreground lg:block" />
        <SidebarNav items={navigation} />
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-6 lg:px-[3.33vw] 2xl:py-8">
        {/* The designs lay content out in a 1500px block at 1920px wide. */}
        <div className="max-w-[1500px]">{children}</div>
      </main>
    </div>
  );
}
