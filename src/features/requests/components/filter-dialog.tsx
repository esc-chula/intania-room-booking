"use client";

import { useState, type ReactNode } from "react";
import { CheckboxList, type FilterOption } from "@/components/checkbox-list";
import { StatusFilterChip } from "@/components/status-filter-chip";
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
import { Input } from "@/components/ui/input";
import type { BookingStatus } from "@/domain/booking";

export type RequestFilters = {
  locations: string[];
  startDate: string;
  endDate: string;
  statuses: BookingStatus[];
  requesterTypes: string[];
  bookingTypes: string[];
};

export const EMPTY_REQUEST_FILTERS: RequestFilters = {
  locations: [],
  startDate: "",
  endDate: "",
  statuses: [],
  requesterTypes: [],
  bookingTypes: [],
};

type RequestFilterDialogProps = {
  trigger: ReactNode;
  value: RequestFilters;
  onApply: (filters: RequestFilters) => void;
  locationOptions: FilterOption[];
  requesterTypeOptions: FilterOption[];
  bookingTypeOptions: FilterOption[];
  /** The design offers pending, approved and cancelled only (open question 5). */
  statuses?: BookingStatus[];
};

// designs/components/Filter overlay.svg. Edits are held as a draft until "ยืนยัน".
export function RequestFilterDialog({
  trigger,
  value,
  onApply,
  locationOptions,
  requesterTypeOptions,
  bookingTypeOptions,
  statuses = ["pending", "approved", "cancelled"],
}: RequestFilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  function patch(update: Partial<RequestFilters>) {
    setDraft((current) => ({ ...current, ...update }));
  }

  function toggleStatus(status: BookingStatus) {
    patch({
      statuses: draft.statuses.includes(status)
        ? draft.statuses.filter((item) => item !== status)
        : [...draft.statuses, status],
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(value);
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>รายละเอียดตัวกรอง</DialogTitle>
          <DialogDescription>
            เลือกเงื่อนไขเพื่อค้นหารายการคำขอ กรณีที่ไม่มีการเลือกจะแสดงทั้งหมด
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-8 md:grid-cols-2 md:gap-0 md:divide-x">
            <div className="space-y-6 md:pr-8">
              <FilterSection
                step={1}
                title="อาคาร/สถานที่"
                hint="เลือกได้มากกว่า 1 รายการ"
              >
                <CheckboxList
                  className="rounded-lg border p-2"
                  options={locationOptions}
                  value={draft.locations}
                  onChange={(locations) => patch({ locations })}
                />
              </FilterSection>
              <FilterSection step={2} title="ช่วงวันที่ใช้งาน">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium">
                    วันเริ่มต้น
                    <Input
                      type="date"
                      value={draft.startDate}
                      max={draft.endDate || undefined}
                      onChange={(event) =>
                        patch({ startDate: event.target.value })
                      }
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium">
                    วันสิ้นสุด
                    <Input
                      type="date"
                      value={draft.endDate}
                      min={draft.startDate || undefined}
                      onChange={(event) =>
                        patch({ endDate: event.target.value })
                      }
                    />
                  </label>
                </div>
              </FilterSection>
              <FilterSection
                step={3}
                title="สถานะเอกสาร"
                hint="เลือกสถานะที่ต้องการแสดง"
              >
                <div className="flex flex-wrap gap-3">
                  {statuses.map((status) => (
                    <StatusFilterChip
                      key={status}
                      status={status}
                      selected={draft.statuses.includes(status)}
                      onClick={() => toggleStatus(status)}
                    />
                  ))}
                </div>
              </FilterSection>
            </div>
            <div className="space-y-6 md:pl-8">
              <FilterSection step={4} title="ประเภทผู้จอง">
                <CheckboxList
                  className="rounded-lg border p-2"
                  options={requesterTypeOptions}
                  value={draft.requesterTypes}
                  onChange={(requesterTypes) => patch({ requesterTypes })}
                />
              </FilterSection>
              <FilterSection
                step={5}
                title="ประเภทการจอง"
                hint="เลือกได้มากกว่า 1 รายการ"
              >
                <CheckboxList
                  className="rounded-lg border p-2"
                  options={bookingTypeOptions}
                  value={draft.bookingTypes}
                  onChange={(bookingTypes) => patch({ bookingTypes })}
                />
              </FilterSection>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDraft(EMPTY_REQUEST_FILTERS)}
          >
            ล้างตัวกรอง
          </Button>
          <DialogClose asChild>
            <Button type="button" onClick={() => onApply(draft)}>
              ยืนยัน
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FilterSection({
  step,
  title,
  hint,
  children,
}: {
  step: number;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <span
            aria-hidden
            className="flex size-6 items-center justify-center rounded bg-muted text-sm text-primary"
          >
            {step}
          </span>
          {title}
        </h3>
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}
