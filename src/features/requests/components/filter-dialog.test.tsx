import { describe, expect, it, mock } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";

import { Button } from "@/components/ui/button";
import { EMPTY_REQUEST_FILTERS, RequestFilterDialog } from "./filter-dialog";

function setup() {
  const onApply = mock(() => undefined);
  render(
    <RequestFilterDialog
      trigger={<Button>ตัวกรอง</Button>}
      value={EMPTY_REQUEST_FILTERS}
      onApply={onApply}
      locationOptions={[{ value: "b3", label: "อาคาร 3" }]}
      requesterTypeOptions={[{ value: "esc69", label: "ESC69" }]}
      bookingTypeOptions={[{ value: "day", label: "ภายใน 1 วัน" }]}
    />,
  );
  return onApply;
}

describe("RequestFilterDialog", () => {
  it("applies the chosen filters only on confirm", () => {
    const onApply = setup();
    fireEvent.click(screen.getByRole("button", { name: "ตัวกรอง" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "อาคาร 3" }));
    fireEvent.click(screen.getByRole("button", { name: "อนุมัติแล้ว" }));
    expect(onApply).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "ยืนยัน" }));
    expect(onApply).toHaveBeenCalledWith({
      ...EMPTY_REQUEST_FILTERS,
      locations: ["b3"],
      statuses: ["approved"],
    });
  });

  it("clears the draft with ล้างตัวกรอง", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: "ตัวกรอง" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "อาคาร 3" }));
    fireEvent.click(screen.getByRole("button", { name: "ล้างตัวกรอง" }));
    expect(screen.getByRole("checkbox", { name: "อาคาร 3" })).not.toBeChecked();
  });
});
