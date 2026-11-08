import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it.each([
    ["pending", "รอดำเนินการ"],
    ["approved", "อนุมัติแล้ว"],
    ["rejected", "ไม่อนุมัติ"],
    ["cancelled", "ยกเลิก"],
    ["conflicted", "จองซ้อน"],
  ] as const)("shows the %s label from the designs", (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toHaveClass(`bg-status-${status}`);
  });
});
