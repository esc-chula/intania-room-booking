"use client";

import { SlidersHorizontal } from "lucide-react";
import { CheckboxList } from "@/components/checkbox-list";
import { STATUS_LABELS } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AvailabilityStatus } from "@/domain/availability";
import { cn } from "@/lib/utils";
import { buildingLabel, sortBuildings } from "../lib/buildings";
import { DateField } from "./date-field";

// define status
export const FILTER_STATUSES: AvailabilityStatus[] = [
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

export type FilterPanelProps = {
  buildingList: {
    data?: string[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => unknown;
  };
  buildings: string[];
  onBuildingsChange: (buildings: string[]) => void;
  from: string;
  to: string;
  onFromChange: (date: string) => void;
  onToChange: (date: string) => void;
  statuses: AvailabilityStatus[];
  onToggleStatus: (status: AvailabilityStatus) => void;
};

// The filters of the availability screens. Beside the calendar from lg up, and
// in a bottom sheet (FilterSheet) below that, so a phone sees the calendar first.
export function FilterPanel({
  buildingList,
  buildings,
  onBuildingsChange,
  from,
  to,
  onFromChange,
  onToChange,
  statuses,
  onToggleStatus,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <div>
          <h2 className="text-base font-semibold">อาคาร/สถานที่</h2>
          <p className="text-sm text-muted-foreground">
            เลือกได้มากกว่า 1 รายการ
          </p>
        </div>
        <div className="rounded-[10px] border bg-card p-1">
          {buildingList.isLoading ? (
            <p className="p-2 text-xs text-muted-foreground">กำลังโหลด...</p>
          ) : buildingList.isError ? (
            <div role="alert" className="space-y-1 p-2 text-sm">
              <p className="text-status-rejected-foreground">
                โหลดรายชื่ออาคารไม่สำเร็จ
              </p>
              <button
                type="button"
                className="min-h-11 text-primary underline lg:min-h-0"
                onClick={() => void buildingList.refetch()}
              >
                ลองอีกครั้ง
              </button>
            </div>
          ) : (
            <CheckboxList
              options={sortBuildings(buildingList.data ?? []).map(
                (building) => ({
                  value: building,
                  label: buildingLabel(building),
                }),
              )}
              value={buildings}
              onChange={onBuildingsChange}
              itemClassName="py-2"
            />
          )}
        </div>
      </section>

      <hr className="border-border" />

      <section className="space-y-3">
        <h2 className="text-base font-semibold">ช่วงวันที่ใช้งาน</h2>
        {/* Two fields side by side only where each has room for its placeholder. */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
          <DateField
            label="วันเริ่มต้น"
            value={from}
            max={to || undefined}
            onChange={onFromChange}
          />
          <DateField
            label="วันสิ้นสุด"
            value={to}
            min={from || undefined}
            onChange={onToChange}
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
              aria-pressed={statuses.includes(status)}
              onClick={() => onToggleStatus(status)}
              className={cn(
                "h-11 min-w-[100px] rounded-full px-4 text-sm font-medium whitespace-nowrap text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:h-8",
                FILTER_CHIP_STYLES[status],
                !statuses.includes(status) && "opacity-40",
              )}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

// The same filters as a bottom sheet, for screens narrower than lg.
export function FilterSheet({
  activeCount,
  onClear,
  ...panel
}: FilterPanelProps & { activeCount: number; onClear: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="shrink-0 gap-2 bg-card">
          <SlidersHorizontal aria-hidden />
          ตัวกรอง
          {activeCount > 0 ? (
            <span className="grid size-5 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="top-auto bottom-0 left-0 max-h-[90dvh] w-full max-w-none translate-x-0 translate-y-0 rounded-t-2xl rounded-b-none md:left-1/2 md:max-w-xl md:-translate-x-1/2">
        <DialogHeader className="space-y-1 px-4 pt-4 pb-3 md:px-6">
          <DialogTitle className="text-xl">ตัวกรอง</DialogTitle>
          <DialogDescription>เลือกอาคาร ช่วงวันที่ และสถานะ</DialogDescription>
        </DialogHeader>
        <DialogBody className="px-4 py-4 md:px-6">
          <FilterPanel {...panel} />
        </DialogBody>
        <DialogFooter className="px-4 py-3 md:px-6">
          <Button
            variant="outline"
            disabled={activeCount === 0}
            onClick={onClear}
          >
            ล้างตัวกรอง
          </Button>
          <DialogClose asChild>
            <Button>ดูผลลัพธ์</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
