"use client";

import "@/styles/globals.css";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/error-screen";
import { Button } from "@/components/ui/button";

// Shown when the root layout itself fails. It replaces the layout, so it has to
// bring its own <html> and <body>, and the stylesheet.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application failed to render", error);
  }, [error]);

  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full">
        <ErrorScreen
          alert
          title="ระบบขัดข้อง"
          description="ลองโหลดใหม่อีกครั้ง หากยังไม่หาย กรุณาแจ้งฝ่าย OS พร้อมรหัสอ้างอิง"
          reference={error.digest}
        >
          <Button className="h-11 md:h-9" onClick={reset}>
            ลองอีกครั้ง
          </Button>
        </ErrorScreen>
      </body>
    </html>
  );
}
