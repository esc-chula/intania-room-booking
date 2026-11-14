// Codes the API puts in /login?auth_error=, from `redirectError` in
// intania-room-booking-api/internal/adapter/primary/http/auth/google.go.
// What each one means and where to look: docs/troubleshooting.md.
const MESSAGES: Record<string, string> = {
  access_denied: "คุณยกเลิกการเข้าสู่ระบบ",
  invalid_callback: "การเข้าสู่ระบบหมดอายุหรือไม่สมบูรณ์ กรุณาลองอีกครั้ง",
  ineligible:
    "บัญชีนี้ไม่มีสิทธิ์ใช้งาน กรุณาใช้อีเมลนิสิต @student.chula.ac.th ของคณะวิศวกรรมศาสตร์",
  account_unavailable: "บัญชีนี้ถูกปิดการใช้งาน กรุณาติดต่อฝ่าย OS",
  identity_conflict: "บัญชี Google นี้ไม่ตรงกับข้อมูลในระบบ กรุณาติดต่อฝ่าย OS",
  server_error: "ระบบขัดข้อง กรุณาลองอีกครั้งภายหลัง",
};

const FALLBACK = "เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง";

// The code comes from the address bar, so only show it when it looks like one
// of ours. This keeps a crafted link from putting other text in the error box.
const CODE_PATTERN = /^[a-z][a-z_]{0,39}$/;

/**
 * What to show for `?auth_error=`: the Thai message, plus the code itself so a
 * report can say which failure it was (even one this app has no message for).
 */
export function describeAuthError(code: string | undefined) {
  if (!code) return null;
  return {
    message: MESSAGES[code] ?? FALLBACK,
    code: CODE_PATTERN.test(code) ? code : null,
  };
}
