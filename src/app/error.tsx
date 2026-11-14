"use client";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/error-screen";
import { Button } from "@/components/ui/button";

// Shown when a page throws while rendering. `digest` is the id Next.js logged
// next to the server-side stack trace, so quoting it finds that trace.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page failed to render", error);
  }, [error]);

  return (
    <ErrorScreen
      alert
      title="เกิดข้อผิดพลาดในการแสดงหน้านี้"
      description="ลองโหลดใหม่อีกครั้ง หากยังไม่หาย กรุณาแจ้งฝ่าย OS พร้อมรหัสอ้างอิง"
      reference={error.digest}
    >
      <Button className="h-11 md:h-9" onClick={reset}>
        ลองอีกครั้ง
      </Button>
    </ErrorScreen>
  );
}
