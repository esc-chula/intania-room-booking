// Codes the API puts in /login?auth_error= (auth/google.go, redirectError).
const MESSAGES: Record<string, string> = {
  access_denied: "คุณยกเลิกการเข้าสู่ระบบ",
  invalid_callback: "การเข้าสู่ระบบหมดอายุหรือไม่สมบูรณ์ กรุณาลองอีกครั้ง",
  ineligible:
    "บัญชีนี้ไม่มีสิทธิ์ใช้งาน กรุณาใช้อีเมลนิสิต @student.chula.ac.th ของคณะวิศวกรรมศาสตร์",
  account_unavailable: "บัญชีนี้ถูกปิดการใช้งาน กรุณาติดต่อฝ่าย OS",
  identity_conflict: "บัญชี Google นี้ไม่ตรงกับข้อมูลในระบบ กรุณาติดต่อฝ่าย OS",
  server_error: "ระบบขัดข้อง กรุณาลองอีกครั้งภายหลัง",
};

export function authErrorMessage(code: string | undefined) {
  if (!code) return null;
  return MESSAGES[code] ?? "เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง";
}
