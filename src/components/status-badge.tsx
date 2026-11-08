import { BOOKING_STATUS_LABELS, type BookingStatus } from "@/domain/booking";
import { cn } from "@/lib/utils";

export type BadgeStatus = BookingStatus | "conflicted";

export const STATUS_STYLES: Record<BadgeStatus, string> = {
  pending: "bg-status-pending text-status-pending-foreground",
  approved: "bg-status-approved text-status-approved-foreground",
  rejected: "bg-status-rejected text-status-rejected-foreground",
  cancelled: "bg-status-cancelled text-status-cancelled-foreground",
  conflicted: "bg-status-conflicted text-status-conflicted-foreground",
};

export const STATUS_LABELS: Record<BadgeStatus, string> = {
  ...BOOKING_STATUS_LABELS,
  conflicted: "จองซ้อน",
};

export function StatusBadge({
  status,
  className,
}: {
  status: BadgeStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium whitespace-nowrap",
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
