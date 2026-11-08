// Terms follow "Keywords" in docs/Room_Booking_System_EPIC.md. Labels follow the designs.

export const BOOKING_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "cancelled",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "รอดำเนินการ",
  approved: "อนุมัติแล้ว",
  rejected: "ไม่อนุมัติ",
  cancelled: "ยกเลิก",
};

export const LOCATION_STATUSES = [
  "vacant",
  "booked",
  "restricted",
  "unavailable",
  "conflicted", // OS only
] as const;
export type LocationStatus = (typeof LOCATION_STATUSES)[number];

export type UserRole = "os" | "user-a" | "user-b";
