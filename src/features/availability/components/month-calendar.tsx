import { STATUS_LABELS, STATUS_STYLES } from "@/components/status-badge";
import type {
  AvailabilityStatus,
  DayStatusCounts,
} from "@/domain/availability";
import { cn } from "@/lib/utils";
import {
  WEEKDAY_LABELS,
  dayOfMonth,
  inRange,
  monthGrid,
  monthOf,
} from "../lib/dates";

type MonthCalendarProps = {
  /** Any date in the month to show. */
  month: string;
  today: string;
  days: Record<string, DayStatusCounts>;
  /** Statuses to show, in display order. */
  statuses: AvailabilityStatus[];
  /** Days outside this range show no counts. Empty ends are open. */
  from?: string;
  to?: string;
};

// designs/OS -ตรวจสอบห้องว่าง.svg, รายเดือน: a Monday-first grid where each day
// lists how many bookings it has per status. It sits inside the calendar card,
// so the grid draws only its inner lines.
export function MonthCalendar({
  month,
  today,
  days,
  statuses,
  from = "",
  to = "",
}: MonthCalendarProps) {
  const current = monthOf(month).month;

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[640px] grid-cols-7 text-sm">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex h-11 items-center justify-center bg-surface text-sm text-weekday-foreground"
          >
            {label}
          </div>
        ))}
        {monthGrid(month).map((date, index) => {
          const inMonth = monthOf(date).month === current;
          const counts =
            inMonth && inRange(date, from, to) ? days[date] : undefined;
          const isToday = date === today;
          const isWeekend = index % 7 >= 5;
          return (
            <div
              key={date}
              data-date={date}
              className={cn(
                "flex min-h-24 flex-col gap-1 border-t border-r border-line p-1.5 2xl:min-h-[108px] 2xl:p-2 [&:nth-child(7n+7)]:border-r-0",
                (!inMonth || isWeekend) && "bg-surface",
                isToday && "bg-secondary",
              )}
            >
              <span
                className={cn(
                  "flex h-[26px] min-w-7 items-center justify-center self-start rounded-md px-1.5 text-sm",
                  !inMonth && "text-faint-foreground",
                  isToday && "bg-primary font-medium text-primary-foreground",
                )}
              >
                {dayOfMonth(date)}
              </span>
              {statuses.map((status) => {
                const count = counts?.[status] ?? 0;
                if (count === 0) return null;
                return (
                  <span
                    key={status}
                    className={cn(
                      "flex h-6 items-center justify-center truncate rounded-md px-1 text-[11px] font-medium whitespace-nowrap xl:text-xs",
                      STATUS_STYLES[status],
                    )}
                  >
                    {STATUS_LABELS[status]} ({count})
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
