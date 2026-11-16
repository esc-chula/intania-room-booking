import { TriangleAlert } from "lucide-react";
import { STATUS_LABELS } from "@/components/status-badge";
import type {
  AvailabilityRoom,
  AvailabilityStatus,
} from "@/domain/availability";
import { cn } from "@/lib/utils";
import {
  EVENT_BORDERS,
  EVENT_STYLES,
  NO_TITLE,
  timeLabel,
  visibleStatus,
} from "../lib/events";
import { datesBetween, formatRange } from "../lib/dates";

type DayListProps = {
  /** The one date to show. */
  day: string;
  rooms: AvailabilityRoom[];
  statuses: AvailabilityStatus[];
  /** Everyone sees titles. Only OS sees overlapping bookings (จองซ้อน). */
  showDetails: boolean;
  /** A day outside this range shows no bookings. Empty ends are open. */
  from?: string;
  to?: string;
};

// One layout for every width. From md the room, title, time and status are
// columns under the headings. Below md each room is a card: its name, then each
// booking as a title with the time and status on the line under it.
const HEADER =
  "hidden h-11 items-center gap-x-4 bg-surface px-4 text-sm text-weekday-foreground md:grid md:grid-cols-[220px_minmax(0,1fr)_176px_120px]";
const ROOM =
  "space-y-2 border-b border-line px-4 py-4 md:grid md:min-h-[88px] md:grid-cols-[220px_minmax(0,1fr)] md:items-center md:gap-x-4 md:space-y-0";
const BOOKING =
  "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 md:grid-cols-[minmax(0,1fr)_176px_120px] md:gap-x-4";

// designs daily.svg: one row per room listing that day's bookings, then a
// notice for overlapping bookings and a footer with the room count.
export function DayList({
  day,
  rooms,
  statuses,
  showDetails,
  from = "",
  to = "",
}: DayListProps) {
  const inRange = (!from || day >= from) && (!to || day <= to);
  const rows = rooms.map((room) => ({
    room,
    bookings: inRange
      ? room.bookings.filter(
          (booking) =>
            statuses.includes(visibleStatus(booking, showDetails)) &&
            datesBetween(booking.startAt, booking.endAt).includes(day),
        )
      : [],
  }));
  const conflictRooms = showDetails
    ? rows.filter(({ bookings }) =>
        bookings.some((b) => visibleStatus(b, true) === "conflicted"),
      )
    : [];

  if (rooms.length === 0) {
    return (
      <p className="border-t border-line py-12 text-center text-sm text-muted-foreground">
        ไม่พบห้องที่ตรงกับตัวกรอง
      </p>
    );
  }

  return (
    <div>
      <div className={HEADER}>
        <span>สถานที่</span>
        <span>รายการใช้งาน</span>
        <span>เวลาใช้งาน</span>
        <span>สถานะ</span>
      </div>

      {rows.map(({ room, bookings }) => (
        <div key={room.id} data-room={room.id} className={ROOM}>
          <span className="block font-semibold">{room.name}</span>
          {bookings.length === 0 ? (
            <div className={BOOKING}>
              <span className="col-span-2 text-sm text-muted-foreground md:col-span-1">
                ไม่มีรายการในข้อมูลอ้างอิง
              </span>
              <span className="hidden text-muted-foreground md:block">—</span>
              <span className="hidden text-muted-foreground md:block">—</span>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-2">
              {bookings.map((booking) => {
                const status = visibleStatus(booking, showDetails);
                return (
                  <div key={booking.id} className={BOOKING}>
                    <span
                      className={cn(
                        "col-span-2 flex h-9 items-center truncate rounded-sm border-l-[3px] px-2 text-sm md:col-span-1 md:h-[30px] md:px-1.5 md:text-xs",
                        EVENT_STYLES[status],
                        EVENT_BORDERS[status],
                      )}
                    >
                      {booking.title || NO_TITLE}
                    </span>
                    <span className="flex h-[30px] items-center text-sm text-weekday-foreground">
                      {timeLabel(booking)}
                    </span>
                    <span
                      className={cn(
                        "flex h-[30px] w-fit items-center justify-self-end rounded-md px-3 text-sm md:justify-self-start",
                        EVENT_STYLES[status],
                      )}
                    >
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {conflictRooms.length > 0 ? (
        <div
          role="alert"
          className="flex gap-3 bg-today-column px-4 py-5 text-sm text-status-conflicted md:px-6"
        >
          <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
          <div>
            <p className="font-medium">
              ตรวจสอบรายการซ้อน •{" "}
              {conflictRooms.map(({ room }) => room.name).join(", ")}
            </p>
            <p className="mt-1">
              ข้อมูลอ้างอิงแสดงรายการซ้อนในวันที่ {formatRange(day, day)}{" "}
              กรุณาตรวจสอบรายละเอียดคำขอก่อนยืนยันการใช้ห้อง
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between px-4 py-4 text-sm">
        <span className="text-muted-foreground">
          แสดง {rooms.length} สถานที่
        </span>
        <span className="text-primary">{formatRange(day, day)}</span>
      </div>
    </div>
  );
}
