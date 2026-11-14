"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { canAccess, homeFor, type Area } from "@/domain/auth";
import { useCurrentUser } from "../hooks";
import { rememberNextPath } from "../lib/next-path";
import { SessionProvider } from "./session-context";

// The API's cookie is only sent on /api/v1 requests, so the server cannot see
// it when it renders a page. The check therefore runs in the browser, and
// nothing below the gate renders until it passes. See docs/adr/0002-auth.md.
export function AuthGate({
  area,
  children,
}: {
  area: Area;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, error, isPending, isError, refetch } = useCurrentUser();

  const allowed = user ? canAccess(user.role, area) : false;

  useEffect(() => {
    if (user === null) {
      rememberNextPath(pathname);
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (user && !allowed) {
      router.replace(homeFor(user.role));
    }
  }, [user, allowed, pathname, router]);

  useEffect(() => {
    if (error) console.error("Sign-in check failed", error);
  }, [error]);

  if (isError) {
    return (
      <div role="alert" className="mx-auto max-w-md space-y-3 p-8 text-center">
        <p className="font-medium">ไม่สามารถตรวจสอบการเข้าสู่ระบบได้</p>
        <p className="text-sm text-muted-foreground">
          ตรวจสอบว่า API ทำงานอยู่ และเปิดระบบเข้าสู่ระบบแล้ว
        </p>
        <p className="text-xs break-words text-muted-foreground">
          รายละเอียด: {error.message}
        </p>
        <Button variant="outline" onClick={() => void refetch()}>
          ลองอีกครั้ง
        </Button>
      </div>
    );
  }
  if (isPending || !user || !allowed) {
    return (
      <p
        role="status"
        className="p-8 text-center text-sm text-muted-foreground"
      >
        กำลังตรวจสอบการเข้าสู่ระบบ...
      </p>
    );
  }
  return <SessionProvider value={user}>{children}</SessionProvider>;
}
