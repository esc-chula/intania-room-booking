"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CheckboxList } from "@/components/checkbox-list";
import { SearchInput } from "@/components/search-input";
import { STATUS_LABELS } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import type { AvailabilityStatus } from "@/domain/availability";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  addDays,
  addMonths,
  dayOfMonth,
  formatMonthTitle,
  formatRange,
  formatSubtitle,
  monthOf,
  startOfWeek,
  weekDays,
  weekdayLabel,
} from "../lib/dates";
import { buildingLabel, sortBuildings } from "../lib/buildings";
import { DateField } from "./date-field";
import { MonthCalendar } from "./month-calendar";
import { DayList } from "./day-list";
import { ScheduleGrid } from "./schedule-grid";
import { EVENT_DOTS } from "../lib/events";

type View = "month" | "week" | "day";

const VIEWS: { value: View; label: string }[] = [
  { value: "month", label: "รายเดือน" },
  { value: "week", label: "รายสัปดาห์" },
  { value: "day", label: "รายวัน" },
];

// define status
const FILTER_STATUSES: AvailabilityStatus[] = [
  "approved",
  "pending",
  "cancelled",
];

// Chip colours of the filter panel, which differ from the calendar chips.
const FILTER_CHIP_STYLES: Partial<Record<AvailabilityStatus, string>> = {
  pending: "bg-filter-pending",
  approved: "bg-status-approved",
  cancelled: "bg-filter-cancelled",
};

type AvailabilityViewProps = {
  // os will see overlapping booking while user is not
  role: "os" | "user";
  today: string;
};

// toolbar (view tabs + search)
export function AvailabilityView({ role, today }: AvailabilityViewProps) {
  const isOs = role === "os";

  const [view, setView] = useState<View>("month");
  const [cursor, setCursor] = useState(today);
  const [buildings, setBuildings] = useState<string[]>([]);
  const [filterStatuses, setFilterStatuses] =
    useState<AvailabilityStatus[]>(FILTER_STATUSES);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");

  // overlaping booking is set to OS only sees it.
  const statuses: AvailabilityStatus[] = isOs
    ? [...filterStatuses, "conflicted"]
    : filterStatuses;

  const { year, month } = monthOf(cursor);
  const weekStart = startOfWeek(cursor);
  const days = view === "day" ? [cursor] : weekDays(weekStart);

  const buildingList = api.availability.buildings.useQuery();
  const calendar = api.availability.calendar.useQuery(
    { year, month, buildings },
    { enabled: view === "month" },
  );
  const schedule = api.availability.schedule.useQuery(
    {
      startDate: days[0]!,
      endDate: days[days.length - 1]!,
      buildings,
    },
    { enabled: view !== "month" },
  );

  const query = view === "month" ? calendar : schedule;

  const rooms = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (schedule.data?.rooms ?? []).filter(
      (room) =>
        !term || `${room.building} ${room.name}`.toLowerCase().includes(term),
    );
  }, [schedule.data, search]);

  function step(direction: 1 | -1) {
    if (view === "month") setCursor(addMonths(cursor, direction));
    else setCursor(addDays(cursor, direction * (view === "week" ? 7 : 1)));
  }

  function toggleStatus(status: AvailabilityStatus) {
    setFilterStatuses((current) =>
      current.includes(status)
        ? current.filter((item) => item !== status)
        : [...current, status],
    );
  }

  const title =
    view === "month"
      ? formatMonthTitle(cursor)
      : formatRange(days[0]!, days[days.length - 1]!);

  return (
    <div className="space-y-5 2xl:space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          className="flex gap-[5px] rounded-[10px] bg-surface p-1"
        >
          {VIEWS.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={view === item.value}
              onClick={() => setView(item.value)}
              className={cn(
                "h-[41px] min-w-[105px] rounded-lg border px-4 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                view === item.value
                  ? "border-border bg-card font-medium text-primary"
                  : "border-transparent text-muted-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        {/* The month API counts bookings per day and has no rooms to search. */}
        <SearchInput
          className="w-full sm:w-96 [&_input]:h-11 [&_input]:rounded-[10px] [&_input]:border-neutral-300"
          placeholder="ค้นหาชื่อห้อง เช่น 301"
          aria-label="ค้นหาห้อง"
          value={search}
          disabled={view === "month"}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)] 2xl:grid-cols-[340px_minmax(0,1fr)] 2xl:gap-8">
        <aside className="space-y-6 lg:pt-2">
          <section className="space-y-2">
            <div>
              <h2 className="text-base font-semibold">อาคาร/สถานที่</h2>
              <p className="text-sm text-muted-foreground">
                เลือกได้มากกว่า 1 รายการ
              </p>
            </div>
            <div className="rounded-[10px] border bg-card p-1">
              {buildingList.isLoading ? (
                <p className="text-xs text-muted-foreground">กำลังโหลด...</p>
              ) : (
                <CheckboxList
                  options={sortBuildings(buildingList.data ?? []).map(
                    (building) => ({
                      value: building,
                      label: buildingLabel(building),
                    }),
                  )}
                  value={buildings}
                  onChange={setBuildings}
                  itemClassName="py-2"
                />
              )}
            </div>
          </section>

          <hr className="border-border" />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">ช่วงวันที่ใช้งาน</h2>
            <div className="grid grid-cols-2 gap-3">
              <DateField
                label="วันเริ่มต้น"
                value={from}
                max={to || undefined}
                onChange={setFrom}
              />
              <DateField
                label="วันสิ้นสุด"
                value={to}
                min={from || undefined}
                onChange={setTo}
              />
            </div>
          </section>

          <hr className="border-border" />

          <section className="space-y-4">
            <div>
              <h2 className="text-base font-semibold">สถานะเอกสาร</h2>
              <p className="text-sm text-muted-foreground">
                เลือกสถานะที่ต้องการแสดง
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTER_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  aria-pressed={filterStatuses.includes(status)}
                  onClick={() => toggleStatus(status)}
                  className={cn(
                    "h-8 min-w-[100px] rounded-full px-4 text-sm font-medium whitespace-nowrap text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    FILTER_CHIP_STYLES[status],
                    !filterStatuses.includes(status) && "opacity-40",
                  )}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="min-w-0 overflow-hidden rounded-xl border border-line bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 p-6">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl leading-8 font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">
                  {formatSubtitle(cursor, view)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="ก่อนหน้า"
                  className="border-line"
                  onClick={() => step(-1)}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="ถัดไป"
                  className="border-line"
                  onClick={() => step(1)}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
            {view !== "month" ? <Legend statuses={statuses} /> : null}
          </div>

          {query.isError ? (
            <div
              role="alert"
              className="m-4 rounded-md border border-destructive/30 bg-status-rejected p-4 text-sm text-status-rejected-foreground"
            >
              โหลดข้อมูลไม่สำเร็จ ตรวจสอบว่า API ทำงานอยู่
              <Button
                variant="outline"
                size="sm"
                className="ml-3"
                onClick={() => void query.refetch()}
              >
                ลองอีกครั้ง
              </Button>
            </div>
          ) : query.isLoading ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              กำลังโหลด...
            </p>
          ) : view === "month" ? (
            <MonthCalendar
              month={cursor}
              today={today}
              days={calendar.data?.days ?? {}}
              statuses={statuses}
              from={from}
              to={to}
            />
          ) : view === "day" ? (
            <>
              <DayTabs
                days={weekDays(weekStart)}
                selected={cursor}
                onSelect={setCursor}
              />
              <DayList
                day={cursor}
                rooms={rooms}
                statuses={statuses}
                showDetails={isOs}
                from={from}
                to={to}
              />
            </>
          ) : (
            <ScheduleGrid
              days={days}
              today={today}
              rooms={rooms}
              statuses={statuses}
              showDetails={isOs}
              from={from}
              to={to}
            />
          )}
        </section>
      </div>
    </div>
  );
}

// Colour key shown beside the week and day views.
function Legend({ statuses }: { statuses: AvailabilityStatus[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-weekday-foreground">
      {statuses.map((status) => (
        <li key={status} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className={cn("size-2.5 rounded-[3px]", EVENT_DOTS[status])}
          />
          {STATUS_LABELS[status]}
        </li>
      ))}
    </ul>
  );
}

// The seven days of the selected week, shown above the day list (daily.svg).
function DayTabs({
  days,
  selected,
  onSelect,
}: {
  days: string[];
  selected: string;
  onSelect: (day: string) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-2 border-t border-line p-3">
      {days.map((day) => {
        const weekday = weekdayLabel(day);
        const weekend = weekday === "เสาร์" || weekday === "อาทิตย์";
        return (
          <button
            key={day}
            type="button"
            aria-pressed={day === selected}
            onClick={() => onSelect(day)}
            className={cn(
              "h-[46px] rounded-lg text-sm text-weekday-foreground",
              weekend && "bg-surface",
              day === selected && "bg-primary text-primary-foreground",
            )}
          >
            {weekday}{" "}
            <span className="ml-1 text-base font-medium">
              {dayOfMonth(day)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
