"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  CircleUser,
  FileText,
  House,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import type { NavIcon, NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

const ICONS: Record<NavIcon, LucideIcon> = {
  home: House,
  requests: FileText,
  calendar: Calendar,
  rooms: SlidersHorizontal,
  profile: CircleUser,
};

function isActive(pathname: string, href: string) {
  if (href === "/os") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

// States from designs/components/sidebar-main-button-* and submenu-button-*:
// default, hover and open (sidebar-hover fill), active (white pill, maroon text).
// Measured from designs/components/Sidebar.svg: main rows are 44px tall with a
// 14px inset, 16px icon, 8px gap and a 10px radius; submenu rows are 32px tall.
const ITEM =
  "flex w-full items-center gap-2 rounded-[10px] text-left text-sm whitespace-nowrap outline-none focus-visible:ring-[3px] focus-visible:ring-sidebar-foreground/50";
const MAIN_ITEM = "h-11 px-3.5";
const SUB_ITEM = "h-8 px-[18px]";
const ITEM_IDLE = "hover:bg-sidebar-hover";
const ITEM_ACTIVE = "bg-sidebar-foreground text-primary";

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="เมนูหลัก"
      className="flex gap-1 overflow-x-auto md:flex-col md:gap-3 md:overflow-visible md:px-px"
    >
      {items.map((item) =>
        item.children ? (
          <SidebarGroup key={item.href} item={item} pathname={pathname} />
        ) : (
          <div key={item.href} className="shrink-0">
            <SidebarLink item={item} active={isActive(pathname, item.href)} />
          </div>
        ),
      )}
    </nav>
  );
}

function SidebarGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const children = item.children ?? [];
  const hasActiveChild = children.some((child) =>
    isActive(pathname, child.href),
  );
  const [open, setOpen] = useState(hasActiveChild);
  const Icon = item.icon ? ICONS[item.icon] : null;
  const Chevron = open ? ChevronUp : ChevronDown;

  return (
    <div className="shrink-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(ITEM, MAIN_ITEM, ITEM_IDLE)}
      >
        {Icon ? <Icon aria-hidden className="size-4 shrink-0" /> : null}
        <span className="flex-1">{item.label}</span>
        <Chevron aria-hidden className="size-4 shrink-0" />
      </button>
      {open ? (
        <ul className="relative flex gap-1 md:ml-[26px] md:flex-col md:gap-0 md:before:absolute md:before:inset-y-1 md:before:-left-1.5 md:before:w-px md:before:bg-sidebar-foreground">
          {children.map((child) => (
            <li key={child.href} className="shrink-0">
              <SidebarLink
                item={child}
                active={isActive(pathname, child.href)}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function SidebarLink({
  item,
  active,
  sub = false,
}: {
  item: NavItem;
  active: boolean;
  sub?: boolean;
}) {
  const Icon = item.icon ? ICONS[item.icon] : null;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        ITEM,
        sub ? SUB_ITEM : MAIN_ITEM,
        active ? ITEM_ACTIVE : ITEM_IDLE,
      )}
    >
      {Icon ? <Icon aria-hidden className="size-4 shrink-0" /> : null}
      {item.label}
    </Link>
  );
}
