# Open questions

Decisions the team needs before, or while, building. Add new ones here. When one is answered, record the answer and move it to the "Answered" section at the end.

## Blocks Sprint 0

| #   | Question                                                                                                                                                                                                     | Why it matters                                 | Owner | Assumption until answered                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Where does Sprint 0 data come from? The EPIC says bookings stay in the OS Google Form/Sheet and the กิจการนิสิต API and sandbox are not available yet. Is there a backend, or do we read the sheet directly? | Every Sprint 0 screen needs this data          | TBD   | Build against sample data in `src/features/`                                                                                       |
| 2   | How do people sign in, and how do we tell OS, User A and User B apart? The login frame appears to mention CUNET, but the EPIC does not cover it.                                                             | Route protection, profile autofill, room lists | TBD   | Google sign-in and roles from the API, see [ADR 0002](adr/0002-auth.md). The username and password form in the design is not built |
| 3   | Sprint 0 includes a dashboard where users can see room time slots and pending status, but the only availability frames are OS ones. Should users get a read-only version, and at what route?                 | In Sprint 0 scope, no design or route exists   | TBD   | Not built                                                                                                                          |

## Design and requirement mismatches

| #   | Question                                                                                                                                                                                                                 | Owner | Assumption until answered                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | -------------------------------------------------------------------- |
| 4   | The EPIC says mobile-first, but every frame is desktop (1920px). Will there be mobile frames for the booking flow?                                                                                                       | TBD   | Developers adapt the layout themselves and show it in the PR         |
| 5   | The OS component sheet has badges for รอดำเนินการ, อนุมัติแล้ว, ยกเลิก and จองซ้อน but no rejected badge, while user screens show ไม่อนุมัติ. Does OS need a rejected status in its filters?                             | TBD   | `rejected` exists everywhere and shows ไม่อนุมัติ                    |
| 6   | Badge colours differ between `component.svg` (pending `#FEF3C7`, cancelled `#FEE2E2`) and user screens (pending `#FFFBEB`, cancelled `#F7F7F8`). Which set is right, or is it intentional per role?                      | TBD   | User screen colours, for all roles                                   |
| 7   | User screens show Buddhist years (2569) and OS screens show Gregorian years (2026). Is that intentional?                                                                                                                 | TBD   | Follow each frame                                                    |
| 8   | The `OS - หน้าหลัก.svg` frame is blank. What should the OS home page show?                                                                                                                                               | TBD   | Placeholder                                                          |
| 9   | Epic 5 story 3 asks for a separate Building 100 Floor 3 tab, and Epic 6 for PDPA clearing. I did not find frames for either: do they exist?                                                                              | TBD   | Not designed                                                         |
| 10  | The EPIC says "3 sprints" but lists Sprints 0 to 4. Which stories belong to Sprints 1-3?                                                                                                                                 | TBD   | Only Sprint 0 is marked in `design-map.md`                           |
| 11  | Which font is the design using? Text is outlined in the SVGs, so it cannot be read from the files.                                                                                                                       | TBD   | IBM Plex Sans Thai, set in `src/app/layout.tsx`, a best guess by eye |
| 12  | Can the team get the Figma file? The SVG exports have outlined text, so exact fonts, sizes and spacing are hard to inspect. The logo also needs exporting.                                                               | TBD   | Work from the SVGs                                                   |
| 21  | `Booking.svg` shows จองซ้อน as dark maroon (`#450A0A`) with a count, while `multi-select-filter-3.svg` and the badge sheet show it bright red (`#EF4444`). Which one?                                                    | TBD   | Bright red, the existing `conflicted` token                          |
| 22  | `Booking summary.svg` uses lime (`#BEF264`) and pink (`#FCA5A5`) for the ก่อน / หลัง tags, which match no status token. Are they statuses or their own style?                                                            | TBD   | `ConflictPanel` uses the approved and rejected tokens                |
| 23  | `popup สถานะโครงการ.svg` lists project statuses (กำลังดำเนินกิจกรรม, รอปิดโครงการ, ปิดโครงการเรียบร้อย) that are not in `src/domain/`. Are they real statuses, where do they apply, and are they related to question 18? | TBD   | Not built. `MultiSelectFilter` takes any options                     |
| 24  | The account control in the page header (`OS Name` with a chevron) has no open state in the designs. What does it contain (profile, sign out)?                                                                            | TBD   | A menu with name, e-mail and sign out                                |

| 25 | The API reads OS's internal statuses from the sheet (ส่งเอกสารแล้ว, ลง TIMELINE แล้ว, แก้ไขเอกสาร) and the availability page has only รอดำเนินการ, อนุมัติแล้ว, ยกเลิก and จองซ้อน. Do all three internal statuses count as pending? | TBD | All three show as รอดำเนินการ (see `toBookingStatus` in `src/domain/availability.ts`) |
| 26 | The user availability page (`/availability`) has no design. Should users see project names and OS's overlap status (จองซ้อน), and the cancelled bookings? | Users see project titles (product owner, 2026-11-09). Overlap status and the rest still open | Users see titles, time slot and status, no จองซ้อน |

## From the EPIC, waiting on OS

| #   | Question                                                                                                                                                                      | Requirement                    |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 13  | Full list of rules for each room (minimum attendees, VIP only, closing time)                                                                                                  | Epic 1 story 4, Epic 2 story 2 |
| 14  | Fields to carry over from the current form                                                                                                                                    | Epic 1 story 5                 |
| 15  | Extra filter criteria for rooms (capacity, equipment)                                                                                                                         | Epic 1 story 7                 |
| 16  | Limits on rooms per person or role                                                                                                                                            | Epic 1 story 8                 |
| 17  | How far project code checks can be automated beyond the "ends in 21" format                                                                                                   | Epic 1 story 9                 |
| 18  | Whether OS's internal statuses (กำลังทำเอกสาร, แก้ไขเอกสาร) belong in the system                                                                                              | Epic 3 story 2                 |
| 19  | PDPA scope: delete, anonymise or archive, the trigger, and what to keep for statistics                                                                                        | Epic 6 story 1                 |
| 20  | Epic 3 story 2's notes mention advance limits of 7 days for students and 30 for กวศ, and Epic 1 story 2 a hard 14 days. Do the shorter limits only apply to Meeting and More? | Epic 1 story 2, Epic 3 story 2 |

## Answered

None yet.
