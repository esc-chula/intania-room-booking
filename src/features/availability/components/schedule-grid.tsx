import type {
  AvailabilityRoom,
  AvailabilityStatus,
} from "@/domain/availability";
import { cn } from "@/lib/utils";
import { dayOfMonth, datesBetween, inRange, weekdayLabel } from "../lib/dates";
import { buildingLabel } from "../lib/buildings";
import {
  EVENT_BORDERS,
  EVENT_STYLES,
  NO_TITLE,
  timeLabel,
  visibleStatus,
} from "../lib/events";

type ScheduleGridProps = {
  /** The seven dates to show as columns. */
  days: string[];
  today: string;
  rooms: AvailabilityRoom[];
  /** Statuses to show. A booking with another status is hidden. */
  statuses: AvailabilityStatus[];
  /** Everyone sees titles. Only OS sees overlapping bookings (จองซ้อน). */
  showDetails: boolean;
  /** Days outside this range show no bookings. Empty ends are open. */
  from?: string;
  to?: string;
};

// designs Weekly.svg: one row per room, one column per
// day. Rooms with no bookings stay in the list because that is a vacant room.
export function ScheduleGrid({
  days,
  today,
  rooms,
  statuses,
  showDetails,
  from = "",
  to = "",
}: ScheduleGridProps) {
  if (rooms.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        ไม่พบห้องที่ตรงกับตัวกรอง
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border-t border-line">
      <table className="w-full min-w-[900px] table-fixed border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 h-[76px] w-[190px] border-r border-b border-line bg-surface px-4 text-left text-sm font-medium text-weekday-foreground">
              สถานที่ / วันที่
            </th>
            {days.map((day) => (
              <th
                key={day}
                className={cn(
                  "border-r border-b border-line px-2 text-center font-normal text-weekday-foreground last:border-r-0",
                  columnTone(day, today),
                )}
              >
                <span
                  className={cn(
                    "block text-xs",
                    day === today && "text-primary",
                  )}
                >
                  {weekdayLabel(day)}
                </span>
                <span
                  className={cn(
                    "mx-auto mt-1 flex size-8 items-center justify-center rounded-md text-base font-medium",
                    day === today && "bg-primary text-primary-foreground",
                  )}
                >
                  {dayOfMonth(day)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="h-[138px]">
              <th
                scope="row"
                className="sticky left-0 z-10 border-r border-b border-line bg-card px-4 text-left font-semibold"
                title={buildingLabel(room.building)}
              >
                {room.name}
              </th>
              {days.map((day) => {
                const bookings = room.bookings.filter(
                  (booking) =>
                    inRange(day, from, to) &&
                    statuses.includes(visibleStatus(booking, showDetails)) &&
                    datesBetween(booking.startAt, booking.endAt).includes(day),
                );
                return (
                  <td
                    key={day}
                    data-room={room.id}
                    data-date={day}
                    className={cn(
                      "space-y-1.5 border-r border-b border-line p-1.5 align-top last:border-r-0",
                      columnTone(day, today),
                    )}
                  >
                    {bookings.map((booking) => {
                      const status = visibleStatus(booking, showDetails);
                      return (
                        <div
                          key={booking.id}
                          className={cn(
                            "rounded-md border-l-[3px] px-2 py-1.5 leading-tight",
                            EVENT_STYLES[status],
                            EVENT_BORDERS[status],
                          )}
                        >
                          <p className="truncate text-sm font-semibold">
                            {booking.title || NO_TITLE}
                          </p>
                          <p className="mt-1 text-xs opacity-80">
                            {timeLabel(booking)}
                          </p>
                        </div>
                      );
                    })}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Today is tinted maroon, weekends grey (Weekly.svg).
function columnTone(day: string, today: string) {
  if (day === today) return "bg-today-column";
  const weekday = weekdayLabel(day);
  return weekday === "เสาร์" || weekday === "อาทิตย์" ? "bg-surface" : "";
}
