import { ScreenPlaceholder } from "@/components/layout/screen-placeholder";

export default function UserHomePage() {
  return (
    <ScreenPlaceholder
      title="หน้าหลัก"
      epics="Epic 1 story 1, Epic 3 story 3"
      design={["User A - home.svg", "User B - home.svg"]}
    />
  );
}
