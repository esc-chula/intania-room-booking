import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConflictEntry = {
  kind: "current" | "overlapping";
  requestId: string;
  timeRange: string;
  /** Whether this request was submitted before or after the other. */
  order: "before" | "after";
};

const KIND_LABELS: Record<ConflictEntry["kind"], string> = {
  current: "คำขอปัจจุบัน",
  overlapping: "คำขอที่ซ้อนทับ",
};

const ORDER_LABELS: Record<ConflictEntry["order"], string> = {
  before: "ก่อน",
  after: "หลัง",
};

// designs/components/Booking summary.svg
export function ConflictPanel({ entries }: { entries: ConflictEntry[] }) {
  return (
    <section role="alert" className="space-y-4 rounded-xl border bg-card p-6">
      <h2 className="flex items-center gap-3 text-xl font-semibold text-destructive">
        <TriangleAlert aria-hidden className="size-8" />
        ตรวจพบการจองซ้อนทับกันคำขอ
      </h2>
      <ul className="space-y-3">
        {entries.map((entry) => (
          <li
            key={entry.requestId}
            className="flex items-center justify-between gap-4 rounded-lg bg-muted px-4 py-3 text-sm"
          >
            <div className="space-y-1">
              <p>{KIND_LABELS[entry.kind]}</p>
              <p>
                <span className="text-primary">#{entry.requestId}</span> เวลา{" "}
                {entry.timeRange}
              </p>
            </div>
            {/* Tokens stand in for the design's lime and pink, see open question 22 */}
            <span
              className={cn(
                "rounded-xl px-3 py-1 text-sm font-medium",
                entry.order === "before"
                  ? "bg-status-approved text-status-approved-foreground"
                  : "bg-status-rejected text-status-rejected-foreground",
              )}
            >
              {ORDER_LABELS[entry.order]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
