// Statuses the Go API reads from the OS Google Sheet (column AE).
export const SHEET_STATUSES = [
  "approved",
  "submitted",
  "timeline",
  "needs_revision",
  "cancelled",
  "unknown",
] as const;
export type SheetStatus = (typeof SHEET_STATUSES)[number];

export function toBookingStatus(
  status: string,
): Exclude<AvailabilityStatus, "conflicted"> {
  if (status === "approved") return "approved";
  if (status === "cancelled") return "cancelled";
  return "pending";
}

export type AvailabilityStatus = keyof DayStatusCounts;

export type DayStatusCounts = {
  approved: number;
  pending: number;
  cancelled: number;
  conflicted: number;
};

export type AvailabilityBooking = {
  id: string;
  title: string;
  /** Local Bangkok time, e.g. 2026-08-08T08:00:00+07:00 */
  startAt: string;
  endAt: string;
  status: Exclude<AvailabilityStatus, "conflicted">;
  hasConflict: boolean;
};

export type AvailabilityRoom = {
  id: string;
  building: string;
  name: string;
  bookings: AvailabilityBooking[];
};
