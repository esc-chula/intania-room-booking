import { PageHeader } from "@/components/layout/page-header";
import { AvailabilityView } from "@/features/availability/components/availability-view";
import { todayInBangkok } from "@/features/availability/lib/dates";

export const dynamic = "force-dynamic";

// Read-only version of the OS availability page. Open question 3: there is no
// design for it yet, so it follows the OS layout without the OS-only details.
export default function UserAvailabilityPage() {
  return (
    <div className="space-y-6 2xl:space-y-14">
      <PageHeader title="ตรวจสอบห้องว่าง" />
      <AvailabilityView role="user" today={todayInBangkok()} />
    </div>
  );
}
