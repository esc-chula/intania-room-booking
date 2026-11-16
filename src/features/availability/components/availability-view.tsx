"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SearchInput } from "@/components/search-input";
import { STATUS_LABELS } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import type { AvailabilityStatus } from "@/domain/availability";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/use-media-query";
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
import { useBuildings, useCalendar, useSchedule } from "../hooks";
import { SheetApiError } from "../lib/sheet-api";
import { FILTER_STATUSES, FilterPanel, FilterSheet } from "./filter-panel";
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

type AvailabilityViewProps = {
  // os will see overlapping booking while user is not
  role: "os" | "user";
  today: string;
};

// toolbar (view tabs + search)
export function AvailabilityView({ role, today }: AvailabilityViewProps) {
  const isOs = role === "os";

  // Phones open on the day view, the one that fits a narrow screen. Until the
  // browser has answered (null) nothing is fetched, so no wrong view loads first.
  const isPhone = useMediaQuery("(max-width: 767px)");
  const [chosenView, setChosenView] = useState<View | null>(null);
  const view: View = chosenView ?? (isPhone ? "day" : "month");
  const ready = isPhone !== null;
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

  const buildingList = useBuildings();
  const calendar = useCalendar(
    { year, month, buildings },
    ready && view === "month",
  );
  const schedule = useSchedule(
    {
      startDate: days[0]!,
      endDate: days[days.length - 1]!,
      buildings,
    },
    ready && view !== "month",
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

  const filterProps = {
    buildingList,
    buildings,
    onBuildingsChange: setBuildings,
    from,
    to,
    onFromChange: setFrom,
    onToChange: setTo,
    statuses: filterStatuses,
    onToggleStatus: toggleStatus,
  };
  const activeFilters =
    buildings.length +
    (from || to ? 1 : 0) +
    (filterStatuses.length === FILTER_STATUSES.length ? 0 : 1);

  function clearFilters() {
    setBuildings([]);
    setFrom("");
    setTo("");
    setFilterStatuses(FILTER_STATUSES);
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
              onClick={() => setChosenView(item.value)}
              className={cn(
                "h-11 min-w-[105px] rounded-lg border px-4 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:h-[41px]",
                view === item.value
                  ? "border-border bg-card font-medium text-primary"
                  : "border-transparent text-muted-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          {/* The month API counts bookings per day and has no rooms to search. */}
          <SearchInput
            className="min-w-0 flex-1 sm:w-80 sm:flex-none lg:w-96 [&_input]:h-11 [&_input]:rounded-[10px] [&_input]:border-neutral-300"
            placeholder="ค้นหาชื่อห้อง เช่น 301"
            aria-label="ค้นหาห้อง"
            value={search}
            disabled={view === "month"}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="lg:hidden">
            <FilterSheet
              {...filterProps}
              activeCount={activeFilters}
              onClear={clearFilters}
            />
          </div>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)] 2xl:grid-cols-[340px_minmax(0,1fr)] 2xl:gap-8">
        <aside className="hidden lg:block lg:pt-2">
          <FilterPanel {...filterProps} />
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
              {query.error instanceof SheetApiError &&
              query.error.status === 401 ? (
                <>
                  เซสชันหมดอายุ{" "}
                  <Link href="/login" className="underline">
                    เข้าสู่ระบบอีกครั้ง
                  </Link>
                </>
              ) : (
                "โหลดข้อมูลไม่สำเร็จ ตรวจสอบว่า API ทำงานอยู่"
              )}
              <Button
                variant="outline"
                size="sm"
                className="ml-3"
                onClick={() => void query.refetch()}
              >
                ลองอีกครั้ง
              </Button>
              <p className="mt-2 text-xs break-words">
                รายละเอียด: {query.error?.message}
              </p>
            </div>
          ) : query.isLoading || !ready ? (
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
// On a phone they scroll sideways, each wide enough to read and tap.
function DayTabs({
  days,
  selected,
  onSelect,
}: {
  days: string[];
  selected: string;
  onSelect: (day: string) => void;
}) {
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    strip.current
      ?.querySelector('[aria-pressed="true"]')
      ?.scrollIntoView?.({ inline: "center", block: "nearest" });
  }, [selected]);

  return (
    <div
      ref={strip}
      className="flex snap-x gap-2 overflow-x-auto border-t border-line p-3 md:grid md:grid-cols-7 md:overflow-visible"
    >
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
              "h-12 min-w-24 shrink-0 snap-center rounded-lg text-sm whitespace-nowrap text-weekday-foreground md:h-[46px] md:min-w-0 md:shrink",
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
