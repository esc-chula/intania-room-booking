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

const COLUMNS =
  "grid grid-cols-[220px_minmax(0,1fr)_176px_120px] items-center gap-x-4 px-4";

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
    <div className="overflow-x-auto">
      <div className="min-w-[760px]">
        <div
          className={cn(
            COLUMNS,
            "h-11 bg-surface text-sm text-weekday-foreground",
          )}
        >
          <span>สถานที่</span>
          <span>รายการใช้งาน</span>
          <span>เวลาใช้งาน</span>
          <span>สถานะ</span>
        </div>

        {rows.map(({ room, bookings }) => (
          <div
            key={room.id}
            data-room={room.id}
            className={cn(COLUMNS, "min-h-[88px] border-b border-line py-4")}
          >
            <span className="font-semibold">{room.name}</span>
            {bookings.length === 0 ? (
              <>
                <span className="text-sm text-muted-foreground">
                  ไม่มีรายการในข้อมูลอ้างอิง
                </span>
                <span className="text-muted-foreground">—</span>
                <span className="text-muted-foreground">—</span>
              </>
            ) : (
              <>
                <Stack>
                  {bookings.map((booking) => {
                    const status = visibleStatus(booking, showDetails);
                    return (
                      <span
                        key={booking.id}
                        className={cn(
                          "flex h-[30px] items-center truncate rounded-sm border-l-[3px] px-1.5 text-xs",
                          EVENT_STYLES[status],
                          EVENT_BORDERS[status],
                        )}
                      >
                        {booking.title || NO_TITLE}
                      </span>
                    );
                  })}
                </Stack>
                <Stack>
                  {bookings.map((booking) => (
                    <span
                      key={booking.id}
                      className="flex h-[30px] items-center text-sm text-weekday-foreground"
                    >
                      {timeLabel(booking)}
                    </span>
                  ))}
                </Stack>
                <Stack>
                  {bookings.map((booking) => {
                    const status = visibleStatus(booking, showDetails);
                    return (
                      <span
                        key={booking.id}
                        className={cn(
                          "flex h-[30px] w-fit items-center rounded-md px-3 text-sm",
                          EVENT_STYLES[status],
                        )}
                      >
                        {STATUS_LABELS[status]}
                      </span>
                    );
                  })}
                </Stack>
              </>
            )}
          </div>
        ))}

        {conflictRooms.length > 0 ? (
          <div
            role="alert"
            className="flex gap-3 bg-today-column px-6 py-5 text-sm text-event-conflicted-foreground"
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
    </div>
  );
}

// Keeps each column's items on the same rows as the other columns.
function Stack({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}
