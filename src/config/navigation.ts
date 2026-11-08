import { SERVICES } from "./services";

export type NavIcon = "home" | "requests" | "calendar" | "rooms" | "profile";

export type NavItem = {
  label: string;
  href: string;
  /** Key, not a component, so this config can cross the server to client boundary. */
  icon?: NavIcon;
  children?: NavItem[];
};

export const userNavigation: NavItem[] = [
  { label: "หน้าหลัก", href: "/home", icon: "home" },
  { label: "ประวัติคำขอ", href: "/requests", icon: "requests" },
  { label: "ตรวจสอบห้องว่าง", href: "/availability", icon: "calendar" },
  { label: "บัญชีผู้ใช้", href: "/profile", icon: "profile" },
];

export const osNavigation: NavItem[] = [
  { label: "หน้าหลัก", href: "/os", icon: "home" },
  {
    label: "รายการคำขอ",
    href: "/os/requests",
    icon: "requests",
    children: SERVICES.map((service) => ({
      label: service.label,
      href: `/os/requests/${service.slug}`,
    })),
  },
  { label: "ตรวจสอบห้องว่าง", href: "/os/availability", icon: "calendar" },
  { label: "จัดการห้อง", href: "/os/rooms", icon: "rooms" },
];
