"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { homeFor } from "@/domain/auth";
import { useCurrentUser } from "../hooks";
import { describeAuthError } from "../lib/errors";
import { rememberNextPath, safeNextPath } from "../lib/next-path";

export function LoginCard({ next, error }: { next?: string; error?: string }) {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const target = safeNextPath(next);
  const failure = describeAuthError(error);

  // Pass by auth users
  useEffect(() => {
    if (user) router.replace(target ?? homeFor(user.role));
  }, [user, target, router]);

  return (
    <div className="h-auto w-full max-w-5xl rounded-2xl bg-card p-10 shadow-lg md:p-12">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-8">
          <Logo className="size-16" />
          <h1 className="pt-4 text-3xl font-semibold">เข้าสู่ระบบ</h1>
          <p className="text-6xl font-bold tracking-wide text-primary">
            INTANIA
          </p>
          <p className="text-sm text-muted-foreground">
            ใช้อีเมลนิสิต @student.chula.ac.th เพื่อเข้าสู่ระบบ
          </p>
        </div>
        <div className="w-full space-y-3 md:max-w-xs">
          {failure ? (
            <div
              role="alert"
              className="space-y-1 rounded-md bg-status-rejected p-3 text-sm text-status-rejected-foreground"
            >
              <p>{failure.message}</p>
              {failure.code ? (
                <p className="text-xs break-all">
                  รหัสข้อผิดพลาด: <code>{failure.code}</code>
                </p>
              ) : null}
            </div>
          ) : null}
          {/* A full page load, not a router link: this leaves the site for Google. */}
          <a
            href="/auth/google/login"
            onClick={() => rememberNextPath(target)}
            className="flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground outline-none hover:bg-primary-hover focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            เข้าสู่ระบบด้วย Google
          </a>
          {/* <p className="text-xs text-muted-foreground">
            ใช้อีเมลนิสิต @student.chula.ac.th
          </p> */}
        </div>
      </div>
    </div>
  );
}
