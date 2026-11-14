import { Bell } from "lucide-react";
import { AccountMenu } from "@/features/auth/components/account-menu";

type PageHeaderProps = {
  title: string;
  /** Unread notifications. The badge is hidden at 0. */
  notificationCount?: number;
};

// designs/components/admin - Title/*.svg: page title on the left, bell and
// account on the right. The three exports differ only by the title.
export function PageHeader({ title, notificationCount = 0 }: PageHeaderProps) {
  return (
    <header className="flex min-h-12 items-center justify-between gap-4">
      <h1 className="text-2xl font-bold text-primary md:text-3xl 2xl:text-4xl">
        {title}
      </h1>
      <div className="flex shrink-0 items-center gap-4">
        <button
          type="button"
          aria-label={
            notificationCount > 0
              ? `การแจ้งเตือน ${notificationCount} รายการ`
              : "การแจ้งเตือน"
          }
          className="relative rounded-md p-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Bell aria-hidden className="size-6 fill-current" />
          {notificationCount > 0 ? (
            <span
              aria-hidden
              className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] leading-none text-primary-foreground"
            >
              {notificationCount}
            </span>
          ) : null}
        </button>
        <div aria-hidden className="h-10 w-px bg-border" />
        <AccountMenu />
      </div>
    </header>
  );
}
