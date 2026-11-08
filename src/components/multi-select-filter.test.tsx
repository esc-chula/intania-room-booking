import { describe, expect, it, mock } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";

import { CheckboxList } from "./checkbox-list";
import { FilterChip } from "./multi-select-filter";
import { StatusFilterChip } from "./status-filter-chip";

const options = [
  { value: "b3", label: "อาคาร 3" },
  { value: "b4", label: "อาคาร 4" },
];

describe("CheckboxList", () => {
  it("adds and removes values", () => {
    const onChange = mock((_value: string[]) => undefined);
    const { rerender } = render(
      <CheckboxList options={options} value={[]} onChange={onChange} />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "อาคาร 3" }));
    expect(onChange).toHaveBeenLastCalledWith(["b3"]);

    rerender(
      <CheckboxList options={options} value={["b3"]} onChange={onChange} />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "อาคาร 3" }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("selects all and clears", () => {
    const onChange = mock((_value: string[]) => undefined);
    render(
      <CheckboxList
        options={options}
        value={["b3"]}
        onChange={onChange}
        showSelectAll
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "เลือกทั้งหมด" }));
    expect(onChange).toHaveBeenLastCalledWith(["b3", "b4"]);
    fireEvent.click(screen.getByRole("button", { name: "ล้าง" }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });
});

describe("FilterChip", () => {
  it("calls onRemove from its close button", () => {
    const onRemove = mock(() => undefined);
    render(<FilterChip onRemove={onRemove}>อาคาร 3</FilterChip>);
    fireEvent.click(screen.getByRole("button", { name: /อาคาร 3/ }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

describe("StatusFilterChip", () => {
  it("shows the count and the pressed state", () => {
    render(
      <StatusFilterChip
        status="approved"
        count={57}
        selected
        onClick={() => undefined}
      />,
    );
    expect(
      screen.getByRole("button", { name: "อนุมัติแล้ว (57)" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
