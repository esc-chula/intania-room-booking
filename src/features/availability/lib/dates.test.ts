import { describe, expect, it } from "bun:test";
import {
  addDays,
  displayToIso,
  isoToDisplay,
  formatSubtitle,
  inRange,
  addMonths,
  datesBetween,
  formatRange,
  monthGrid,
  startOfWeek,
  todayInBangkok,
  weekdayLabel,
} from "./dates";

describe("dates", () => {
  it("starts weeks on Monday", () => {
    expect(startOfWeek("2024-11-13")).toBe("2024-11-11"); // Wednesday
    expect(startOfWeek("2024-11-17")).toBe("2024-11-11"); // Sunday
    expect(startOfWeek("2024-11-11")).toBe("2024-11-11");
  });

  it("adds days and months across boundaries", () => {
    expect(addDays("2026-12-30", 3)).toBe("2027-01-02");
    expect(addMonths("2026-12-15", 1)).toBe("2027-01-01");
    expect(addMonths("2026-01-15", -1)).toBe("2025-12-01");
  });

  it("builds a six-week month grid that begins on a Monday", () => {
    const grid = monthGrid("2024-11-13");
    expect(grid).toHaveLength(42);
    expect(grid[0]).toBe("2024-10-28");
    expect(grid[41]).toBe("2024-12-08");
  });

  it("formats ranges", () => {
    expect(formatRange("2024-11-11", "2024-11-17")).toBe("11 - 17 Nov 2024");
    expect(formatRange("2024-10-28", "2024-11-03")).toBe("28 Oct - 3 Nov 2024");
    expect(formatRange("2024-11-11", "2024-11-11")).toBe("11 Nov 2024");
  });

  it("labels weekdays in Thai", () => {
    expect(weekdayLabel("2024-11-11")).toBe("จันทร์");
    expect(weekdayLabel("2024-11-17")).toBe("อาทิตย์");
  });

  it("lists every date of a multi-day booking", () => {
    expect(
      datesBetween("2026-08-01T16:00:00+07:00", "2026-08-03T20:00:00+07:00"),
    ).toEqual(["2026-08-01", "2026-08-02", "2026-08-03"]);
  });

  it("uses the Bangkok date", () => {
    // 20:00 UTC on the 8th is already the 9th in Bangkok.
    expect(todayInBangkok(new Date("2026-11-08T20:00:00Z"))).toBe("2026-11-09");
  });

  it("formats the calendar subtitle in Thai", () => {
    expect(formatSubtitle("2024-11-13", "month")).toBe(
      "พฤศจิกายน 2024 • ภาพรวมรายเดือน",
    );
    expect(formatSubtitle("2024-11-13", "week")).toBe(
      "พฤศจิกายน 2024 • ตารางการใช้สถานที่รายสัปดาห์",
    );
    expect(formatSubtitle("2024-11-13", "day")).toBe(
      "วันพุธ • ตารางการใช้สถานที่รายวัน",
    );
  });

  it("treats empty range ends as open", () => {
    expect(inRange("2026-08-05", "", "")).toBe(true);
    expect(inRange("2026-08-05", "2026-08-06", "")).toBe(false);
    expect(inRange("2026-08-05", "", "2026-08-04")).toBe(false);
    expect(inRange("2026-08-05", "2026-08-05", "2026-08-05")).toBe(true);
  });

  it("converts between ISO dates and the field format", () => {
    expect(isoToDisplay("2026-08-05")).toBe("05/08/2026");
    expect(isoToDisplay("")).toBe("");
    expect(displayToIso("05/08/2026")).toBe("2026-08-05");
    expect(displayToIso("31/02/2026")).toBeNull();
    expect(displayToIso("5/8/2026")).toBeNull();
    expect(displayToIso("")).toBeNull();
  });
});
