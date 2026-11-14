import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * A full-page message for something that went wrong: a crashed page, a missing
 * page. `reference` is the code that finds the matching server log line.
 * It always offers a way back to the start.
 */
export function ErrorScreen({
  title,
  description,
  reference,
  alert = false,
  children,
}: {
  title: string;
  description: string;
  reference?: string;
  alert?: boolean;
  children?: ReactNode;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-4">
      <div
        role={alert ? "alert" : undefined}
        className="w-full max-w-md space-y-4 rounded-2xl bg-card p-6 text-center shadow-lg md:p-8"
      >
        <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
        <p className="text-base break-words text-muted-foreground">
          {description}
        </p>
        {reference ? (
          <p className="text-xs break-all text-muted-foreground">
            รหัสอ้างอิง: <code>{reference}</code>
          </p>
        ) : null}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          {children}
          <Button asChild variant="outline" className="h-11 md:h-9">
            <Link href="/" prefetch={false}>
              กลับหน้าหลัก
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
