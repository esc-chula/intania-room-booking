import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import type { AvailabilityRoom } from "@/domain/availability";
import { DayList } from "./day-list";
import { MonthCalendar } from "./month-calendar";
import { ScheduleGrid } from "./schedule-grid";

const rooms: AvailabilityRoom[] = [
  {
    id: "r1",
    building: "ENG 100",
    name: "201A",
    bookings: [
      {
        id: "1",
        title: "Job Fair",
        startAt: "2026-08-03T09:00:00+07:00",
        endAt: "2026-08-04T16:00:00+07:00",
        status: "approved",
        hasConflict: true,
      },
    ],
  },
  { id: "r2", building: "ENG 100", name: "201B", bookings: [] },
];

const week = ["2026-08-03", "2026-08-04", "2026-08-05"];

describe("MonthCalendar", () => {
  it("shows a count per status and skips zero counts and hidden statuses", () => {
    const { container } = render(
      <MonthCalendar
        month="2026-08-10"
        today="2026-08-03"
        days={{
          "2026-08-03": {
            approved: 11,
            pending: 0,
            cancelled: 6,
            conflicted: 2,
          },
        }}
        statuses={["approved", "pending", "conflicted"]}
      />,
    );
    const cell = container.querySelector<HTMLElement>(
      '[data-date="2026-08-03"]',
    )!;
    expect(within(cell).getByText("อนุมัติแล้ว (11)")).toBeInTheDocument();
    expect(within(cell).getByText("จองซ้อน (2)")).toBeInTheDocument();
    expect(within(cell).queryByText(/รอดำเนินการ/)).toBeNull();
    expect(within(cell).queryByText(/ยกเลิก/)).toBeNull();
  });

  it("does not show counts on days outside the month", () => {
    const { container } = render(
      <MonthCalendar
        month="2026-08-10"
        today="2026-08-03"
        days={{
          "2026-07-31": {
            approved: 9,
            pending: 0,
            cancelled: 0,
            conflicted: 0,
          },
        }}
        statuses={["approved"]}
      />,
    );
    expect(
      container.querySelector('[data-date="2026-07-31"]'),
    ).toHaveTextContent(/^31$/);
  });
});

describe("ScheduleGrid", () => {
  it("lists rooms without bookings and repeats a multi-day booking on each day", () => {
    const { container } = render(
      <ScheduleGrid
        days={week}
        today="2026-08-03"
        rooms={rooms}
        statuses={["approved", "conflicted"]}
        showDetails
      />,
    );
    expect(screen.getByText("201B")).toBeInTheDocument();
    for (const day of ["2026-08-03", "2026-08-04"]) {
      const cell = container.querySelector<HTMLElement>(
        `[data-room="r1"][data-date="${day}"]`,
      )!;
      expect(within(cell).getByText("Job Fair")).toBeInTheDocument();
    }
    const empty = container.querySelector(
      '[data-room="r1"][data-date="2026-08-05"]',
    );
    expect(empty).toBeEmptyDOMElement();
  });

  it("shows titles to users but hides the overlap status", () => {
    const { container } = render(
      <ScheduleGrid
        days={week}
        today="2026-08-03"
        rooms={rooms}
        statuses={["approved"]}
        showDetails={false}
      />,
    );
    expect(screen.getAllByText("Job Fair").length).toBeGreaterThan(0);
    const cell = container.querySelector(
      '[data-room="r1"][data-date="2026-08-03"]',
    )!;
    expect(cell).toHaveTextContent("09:00 - 16:00");
    expect(cell.firstElementChild).toHaveClass("bg-event-approved");
  });

  it("shows overlapping bookings as จองซ้อน to OS", () => {
    const { container } = render(
      <ScheduleGrid
        days={week}
        today="2026-08-03"
        rooms={rooms}
        statuses={["conflicted"]}
        showDetails
      />,
    );
    const cell = container.querySelector(
      '[data-room="r1"][data-date="2026-08-03"]',
    )!;
    expect(cell.firstElementChild).toHaveClass("bg-status-conflicted");
  });
});

describe("DayList", () => {
  it("lists every room with its bookings and flags overlaps to OS", () => {
    render(
      <DayList
        day="2026-08-03"
        rooms={rooms}
        statuses={["approved", "conflicted"]}
        showDetails
      />,
    );
    expect(screen.getByText("Job Fair")).toBeInTheDocument();
    expect(screen.getByText("09:00 - 16:00")).toBeInTheDocument();
    expect(screen.getByText("201B")).toBeInTheDocument();
    expect(screen.getByText("ไม่มีรายการในข้อมูลอ้างอิง")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("201A");
    expect(screen.getByText("แสดง 2 สถานที่")).toBeInTheDocument();
  });

  it("shows titles to users but hides the overlap notice", () => {
    render(
      <DayList
        day="2026-08-03"
        rooms={rooms}
        statuses={["approved"]}
        showDetails={false}
      />,
    );
    expect(screen.getByText("Job Fair")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
