import {
  STATUS_LABELS,
  STATUS_STYLES,
  type BadgeStatus,
} from "@/components/status-badge";
import { cn } from "@/lib/utils";

type StatusFilterChipProps = {
  status: BadgeStatus;
  /** Shown as "อนุมัติแล้ว (57)" when given. */
  count?: number;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

// Variants from designs/components/multi-select-filter-*.svg and Booking.svg:
// a status pill, outlined when selected, optionally with a count.
// Without onClick it renders a plain label so it can sit in a summary.
export function StatusFilterChip({
  status,
  count,
  selected = false,
  onClick,
  className,
}: StatusFilterChipProps) {
  const classes = cn(
    "inline-flex h-8 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap",
    STATUS_STYLES[status],
    selected ? "border-foreground" : "border-transparent",
    className,
  );
  const label =
    count === undefined
      ? STATUS_LABELS[status]
      : `${STATUS_LABELS[status]} (${count})`;

  if (!onClick) return <span className={classes}>{label}</span>;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        classes,
        "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
      )}
    >
      {label}
    </button>
  );
}
