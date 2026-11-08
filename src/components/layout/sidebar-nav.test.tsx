import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { osNavigation } from "@/config/navigation";
import { navigation } from "@/test/next-navigation";

const { SidebarNav } = await import("./sidebar-nav");

describe("SidebarNav", () => {
  it("marks only the OS home link as current on /os", () => {
    navigation.pathname = "/os";
    render(<SidebarNav items={osNavigation} />);
    expect(screen.getByRole("link", { name: "หน้าหลัก" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "จัดการห้อง" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("keeps a section current on its nested pages", () => {
    navigation.pathname = "/os/rooms/123/edit";
    render(<SidebarNav items={osNavigation} />);
    expect(screen.getByRole("link", { name: "จัดการห้อง" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "หน้าหลัก" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("lists every request type under รายการคำขอ", () => {
    navigation.pathname = "/os/requests/parking";
    render(<SidebarNav items={osNavigation} />);
    expect(screen.getByRole("link", { name: "ลานจอดรถ" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "ติดต่อเรื่องอื่น ๆ" }),
    ).toBeInTheDocument();
  });
});
