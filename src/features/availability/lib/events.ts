import type {
  AvailabilityBooking,
  AvailabilityRoom,
  AvailabilityStatus,
} from "@/domain/availability";
import { timePart } from "./dates";

// Booking cards in the week and day views use their own colours for approved
// and pending (Weekly.svg, daily.svg). Conflicted and cancelled keep the badge
// colours, so จองซ้อน looks the same in every view.
export const EVENT_STYLES: Record<AvailabilityStatus, string> = {
  approved: "bg-event-approved text-event-approved-foreground",
  pending: "bg-event-pending text-event-pending-foreground",
  conflicted: "bg-status-conflicted text-status-conflicted-foreground",
  cancelled: "bg-status-cancelled text-status-cancelled-foreground",
};

// Colour of the accent bar on the left edge of a card.
export const EVENT_BORDERS: Record<AvailabilityStatus, string> = {
  approved: "border-event-approved-foreground",
  pending: "border-event-pending-foreground",
  conflicted: "border-status-conflicted-foreground/60",
  cancelled: "border-status-cancelled-foreground",
};

// Dot in the legend above the week and day views.
export const EVENT_DOTS: Record<AvailabilityStatus, string> = {
  approved: "bg-event-approved-foreground",
  pending: "bg-event-pending-foreground",
  conflicted: "bg-status-conflicted",
  cancelled: "bg-status-cancelled-foreground",
};

export const NO_TITLE = "ไม่ระบุชื่อรายการ";
export const NO_TIME = "ไม่ระบุเวลา";

/** "09:00 - 16:00", or "ไม่ระบุเวลา" when the sheet gave no usable times. */
export function timeLabel(booking: AvailabilityBooking) {
  const start = timePart(booking.startAt);
  const end = timePart(booking.endAt);
  return start === end ? NO_TIME : `${start} - ${end}`;
}

// Overlapping bookings (จองซ้อน) are an OS-only status, so users see the
// plain booking status instead.
export function visibleStatus(
  booking: AvailabilityRoom["bookings"][number],
  showDetails: boolean,
): AvailabilityStatus {
  return showDetails && booking.hasConflict && booking.status !== "cancelled"
    ? "conflicted"
    : booking.status;
}
