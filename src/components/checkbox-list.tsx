"use client";

import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type FilterOption = { value: string; label: string };

type CheckboxListProps = {
  options: FilterOption[];
  value: string[];
  onChange: (value: string[]) => void;
  /** Adds "เลือกทั้งหมด" beside "ล้าง", as in the dropdown filter. */
  showSelectAll?: boolean;
  className?: string;
  /** Padding of each row. The default matches the dropdown filter. */
  itemClassName?: string;
};

// Shared by the dropdown filter (designs/components/multi selected filter.svg)
// and the filter dialog sections (Filter overlay.svg).
export function CheckboxList({
  options,
  value,
  onChange,
  showSelectAll = false,
  className,
  itemClassName = "py-1.5",
}: CheckboxListProps) {
  const groupId = useId();

  function toggle(optionValue: string, checked: boolean) {
    onChange(
      checked
        ? [...value, optionValue]
        : value.filter((item) => item !== optionValue),
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      <ul className="space-y-1">
        {options.map((option) => {
          const id = `${groupId}-${option.value}`;
          return (
            <li
              key={option.value}
              className={cn(
                "flex min-h-11 items-center gap-3 px-1 lg:min-h-0",
                itemClassName,
              )}
            >
              <Checkbox
                id={id}
                checked={value.includes(option.value)}
                onCheckedChange={(checked) =>
                  toggle(option.value, checked === true)
                }
              />
              <label
                htmlFor={id}
                className="flex flex-1 cursor-pointer items-center self-stretch text-sm font-medium"
              >
                {option.label}
              </label>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between pt-1 text-xs">
        {showSelectAll ? (
          <button
            type="button"
            className="min-h-11 min-w-11 px-2 text-primary hover:underline lg:min-h-0 lg:min-w-0 lg:px-1"
            onClick={() => onChange(options.map((option) => option.value))}
          >
            เลือกทั้งหมด
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          className="min-h-11 min-w-11 px-2 text-primary hover:underline disabled:text-muted-foreground disabled:no-underline lg:min-h-0 lg:min-w-0 lg:px-1"
          disabled={value.length === 0}
          onClick={() => onChange([])}
        >
          ล้าง
        </button>
      </div>
    </div>
  );
}
