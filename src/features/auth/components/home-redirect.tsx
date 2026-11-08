"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { homeFor } from "@/domain/auth";
import { useCurrentUser } from "../hooks";
import { takeNextPath } from "../lib/next-path";

// The API sends people back to the site root after Google sign-in, so "/" sends
// them on to the page they wanted, or to their home page.
export function HomeRedirect() {
  const router = useRouter();
  const { data: user, isError, refetch } = useCurrentUser();

  useEffect(() => {
    if (user === null) router.replace("/login");
    else if (user) router.replace(takeNextPath() ?? homeFor(user.role));
  }, [user, router]);

  if (isError) {
    return (
      <div role="alert" className="p-8 text-center text-sm">
        ไม่สามารถตรวจสอบการเข้าสู่ระบบได้{" "}
        <button
          className="text-primary underline"
          onClick={() => void refetch()}
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }
  return (
    <p role="status" className="p-8 text-center text-sm text-muted-foreground">
      กำลังโหลด...
    </p>
  );
}
