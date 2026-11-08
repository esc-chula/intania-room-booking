"use client";

import { ChevronDown, X } from "lucide-react";
import { CheckboxList, type FilterOption } from "@/components/checkbox-list";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type MultiSelectFilterProps = {
  label: string;
  options: FilterOption[];
  value: string[];
  onChange: (value: string[]) => void;
};

// designs/components/multi selected filter.svg and filter/ตึก/สถานที่.svg:
// a dropdown trigger plus one removable chip per selected option.
export function MultiSelectFilter({
  label,
  options,
  value,
  onChange,
}: MultiSelectFilterProps) {
  const selected = options.filter((option) => value.includes(option.value));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger className="inline-flex h-8 items-center gap-2 rounded-full bg-card px-4 text-sm font-medium shadow-xs ring-1 ring-border outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:bg-muted">
          {label}
          <ChevronDown aria-hidden className="size-4" />
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <CheckboxList
            options={options}
            value={value}
            onChange={onChange}
            showSelectAll
          />
        </PopoverContent>
      </Popover>
      {selected.map((option) => (
        <FilterChip
          key={option.value}
          onRemove={() =>
            onChange(value.filter((item) => item !== option.value))
          }
        >
          {option.label}
        </FilterChip>
      ))}
    </div>
  );
}

export function FilterChip({
  children,
  onRemove,
}: {
  children: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex h-8 items-center gap-2 rounded-full bg-primary pr-2 pl-4 text-sm font-medium whitespace-nowrap text-primary-foreground">
      {children}
      <button
        type="button"
        aria-label={`เอาตัวกรอง ${children} ออก`}
        onClick={onRemove}
        className="rounded-full p-0.5 outline-none hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary-foreground"
      >
        <X aria-hidden className="size-4" />
      </button>
    </span>
  );
}
