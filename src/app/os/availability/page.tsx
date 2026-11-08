import { PageHeader } from "@/components/layout/page-header";
import { AvailabilityView } from "@/features/availability/components/availability-view";
import { todayInBangkok } from "@/features/availability/lib/dates";

// Rendered per request so "today" is never baked in at build time.
export const dynamic = "force-dynamic";

export default function AvailabilityPage() {
  return (
    <div className="space-y-14">
      <PageHeader title="ตรวจสอบห้องว่าง" />
      <AvailabilityView role="os" today={todayInBangkok()} />
    </div>
  );
}
