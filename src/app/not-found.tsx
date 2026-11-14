import { ErrorScreen } from "@/components/error-screen";

export default function NotFound() {
  return (
    <ErrorScreen
      title="ไม่พบหน้าที่ต้องการ"
      description="ลิงก์อาจไม่ถูกต้อง หรือหน้านี้ถูกย้ายไปแล้ว"
    />
  );
}
