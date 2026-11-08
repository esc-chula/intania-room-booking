# Design map

Links each route to its design file and requirement. Epic and story numbers refer to [Room_Booking_System_EPIC.md](Room_Booking_System_EPIC.md). The routes were chosen for this repo and are not in the design files.

Each SVG holds several frames on a dark canvas, at 1920px wide. Open one in a browser and zoom in, or ask the designer for the Figma link (see open question 12).

## Sprint 0

The EPIC scopes Sprint 0 to Epic 3 stories 1-2 and Epic 4, as dashboards that help OS.

| Route                                | Screen                                              | Design file               | Requirement                            |
| ------------------------------------ | --------------------------------------------------- | ------------------------- | -------------------------------------- |
| `/os/availability`                   | ตรวจสอบห้องว่าง (month, week, day)                  | `OS -ตรวจสอบห้องว่าง.svg` | Epic 3 story 1, Epic 4 story 1         |
| `/availability`                      | Read-only version for users (no design, question 3) | `OS -ตรวจสอบห้องว่าง.svg` | Epic 3 story 1                         |
| `/os/requests/[service]`             | รายการคำขอ, filter dialog                           | `OS - รายการคำขอ.svg`     | Epic 3 stories 2 and 4, Epic 4         |
| `/os/requests/[service]/[requestId]` | Request detail, conflict panel, approve and reject  | `OS - รายการคำขอ.svg`     | Epic 3 story 2, Epic 4, Epic 5 story 2 |

## OS

| Route                     | Screen                             | Design file           | Requirement        |
| ------------------------- | ---------------------------------- | --------------------- | ------------------ |
| `/os`                     | หน้าหลัก (the frame is blank)      | `OS - หน้าหลัก.svg`   | Not specified      |
| `/os/rooms`               | Room list                          | `OS - จัดการห้อง.svg` | Epic 2 story 1     |
| `/os/rooms/[roomId]`      | Room detail                        | `OS - จัดการห้อง.svg` | Epic 2 story 2     |
| `/os/rooms/[roomId]/edit` | Edit room                          | `OS - จัดการห้อง.svg` | Epic 2 stories 2-3 |
| `/os/rooms/bulk-edit`     | Edit several rooms, confirm dialog | `OS - จัดการห้อง.svg` | Epic 2 stories 2-3 |

## User A and B

| Route                     | Screen                                      | Design file                        | Requirement                         |
| ------------------------- | ------------------------------------------- | ---------------------------------- | ----------------------------------- |
| `/login`                  | Sign in (Google button, not the CUNET form) | none (no design file)              | Open question 2, ADR 0002           |
| `/home`                   | Home for User A, notification dialog        | `User A - home.svg`                | Epic 3 story 3                      |
| `/home`                   | Home for User B, 5 service cards            | `User B - home.svg`                | Epic 1 story 1, Epic 3 story 3      |
| `/requests`               | ประวัติคำขอ                                 | `User A & B - History Request.svg` | Epic 3 story 2                      |
| `/requests/[requestId]`   | Request detail with progress                | `User A & B - History Request.svg` | Epic 1 story 5                      |
| `/requests/new`           | User A form: 3 steps                        | `User A - Create New Request.svg`  | Epic 1 stories 1-10, Epic 5 story 1 |
| `/requests/new/[service]` | User B forms, one for each service          | `User B -  Create New Request.svg` | Epic 1 stories 1-10                 |
| `/profile`                | บัญชีผู้ใช้                                 | `User A & B - Profile.svg`         | Epic 1 story 6                      |

`[service]` is one of `location-equipment`, `equipment`, `parking`, `traffic-route`, `other` (see `src/config/services.ts`).

## Shared parts

| Design file | Contains | Build as |
| ----------- | -------- | -------- |

## Component exports

`components/` holds one export per component state. Many files are variants of one component, so they share an implementation.

| Design files                                                                                                                                                               | Component                                                          | Location                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------- |
| `components/Sidebar.svg`, `components/Sidebar - User.svg`, and the `sidebar-buton-group`, `sidebar-main-button-หน้าหลัก` and `submenu-button` files with the `icon-` files | `SidebarNav` (group, link, active, hover, open states), `AppShell` | `src/components/layout/sidebar-nav.tsx`, `app-shell.tsx`   |
| `components/admin - Title/home.svg`, `components/admin - Title/Calendar.svg`, `components/admin - Title/รายการคำขอ.svg`                                                    | `PageHeader` (one component, the title is a prop)                  | `src/components/layout/page-header.tsx`                    |
| `components/Booking.svg`, `components/multi-select-filter.svg`, and the `multi-select-filter-1` to `-3` files                                                              | `StatusFilterChip` (count, selected), built on `StatusBadge`       | `src/components/status-filter-chip.tsx`                    |
| `components/multi selected filter.svg`, `components/filter/ตึก/สถานที่.svg`, `components/popup สถานะโครงการ.svg`                                                           | `MultiSelectFilter`, `FilterChip`, `CheckboxList`                  | `src/components/`                                          |
| `components/input.svg`                                                                                                                                                     | `Input`, `SearchInput`                                             | `src/components/ui/input.tsx`, `search-input.tsx`          |
| `components/Filter overlay.svg`                                                                                                                                            | `RequestFilterDialog` on `Dialog`                                  | `src/features/requests/components/filter-dialog.tsx`       |
| `components/Booking information.svg`                                                                                                                                       | `BookingInformation` on `DetailCard`                               | `src/features/requests/components/booking-information.tsx` |
| `components/Booking summary.svg`                                                                                                                                           | `ConflictPanel`                                                    | `src/features/requests/components/conflict-panel.tsx`      |

Not built: `components/navigation menu item.svg` and `components/section items.svg` are unmodified shadcn samples.

## Design tokens

Values read from the SVGs and defined in `src/styles/globals.css`:

| Token                      | Value             | Used for                     |
| -------------------------- | ----------------- | ---------------------------- |
| `primary`                  | `#821923`         | Buttons, titles              |
| `primary-hover`, `sidebar` | `#68141C`         | Hover state, sidebar         |
| `secondary`, `accent`      | `#F8EDEF`         | Tinted notices, active chips |
| `foreground`               | `#262626`         | Text                         |
| `muted-foreground`         | `#737373`         | Secondary text               |
| `border`                   | `#E5E5E5`         | Borders, dividers            |
| `status-*`                 | See `globals.css` | Status badges                |

`#9747FF` in the design sheets is the design tool's component outline, not a project colour.
