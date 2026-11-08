

[Introduction](#introduction)

[Objective](#objective)

[Timeline](#timeline)

[Keywords](#keywords)

[Role Table (Brief)](#role-table-\(brief\))

[Sprint 0](#sprint-0)

[Functional Requirement](#functional-requirement)

[Epic 1: หน้าจองสถานที่ (Booking Request Page)](#epic-1:-หน้าจองสถานที่-\(booking-request-page\))

[Epic 2: หน้าจัดการห้อง (Room & Availability Management)](#epic-2:-หน้าจัดการห้อง-\(room-&-availability-management\))

[Epic 3: หน้า Dashboard อนุมัติการจอง (Booking Approval Dashboard)](#epic-3:-หน้า-dashboard-อนุมัติการจอง-\(booking-approval-dashboard\))

[Epic 4: ระบบตรวจจับการจองชนกัน (Conflict / Double-Booking Handling)](#epic-4:-ระบบตรวจจับการจองชนกัน-\(conflict-/-double-booking-handling\))

[Epic 5: เคสพิเศษ ตึก 100 ชั้น 3 (Meeting and More Notice)](#epic-5:-เคสพิเศษ-ตึก-100-ชั้น-3-\(meeting-and-more-notice\))

[Epic 6: PDPA Annual Data Clearing](#epic-6:-pdpa-annual-data-clearing)

# **Introduction** {#introduction}

Project นี้เป็นการพัฒนาระบบจองสถานที่ (Room Booking System) เพื่อทดแทนกระบวนการเดิมที่ใช้ Google Form ในการรับคำขอจองห้อง/สถานที่ให้กับฝ่าย OS 

โดยปัจจุบันข้อมูลการจองทั้งหมดต้องอาศัยการสลับหน้าไปมาเพื่อตรวจสอบ จัดเรียง และดูรายละเอียดผู้จอง ซึ่งเสียเวลาและมีความเสี่ยงต่อการจองห้องซ้ำซ้อน (double booking)

# **Objective** {#objective}

การพัฒนา Project นี้มีเป้าหมายเพื่อ 

1. ให้ผู้ใช้งาน (User A / User B) จองสถานที่ผ่านเว็บได้โดยตรง   
2. ให้ฝ่าย OS มี Dashboard ดูภาพรวมห้องว่าง / คำขอค้าง / ห้องที่จองแล้วได้ง่ายขึ้น   
   ลดเวลาการจัดการคำขอจอง   
3. ให้ฝ่าย OS จัดการรายชื่อห้อง (เปิด/ปิดห้อง, เพิ่มห้องใหม่) ได้ด้วยตนเองโดยไม่ต้องพึ่งทีม Tech 

Device Usage:   
ผู้ใช้ส่วนใหญ่จองผ่าน Mobile แต่โครงที่มีการจองจำนวนมาก (เช่น จองหลายห้อง/หลายรายการต่อครั้ง) มักใช้คอมพิวเตอร์  

Responsive Mobile-first สำหรับการจองทั่วไป และรองรับการใช้งานบนคอมได้ดีสำหรับ Use Case ที่จอง  
จำนวนมาก

# **Timeline** {#timeline}

3 sprints, sprint ละ 2 สัปดาห์

Project (Re)planning: 26 Oct 2026-1 Nov 2026  
Sprint 0: 2 Nov 2026-8 Nov 2026  
Sprint 1: 10 Dec 2026-23 Dec 2026  
Sprint 2: 4 Jan 2027-17 Jan 2027  
Sprint 3: 18 Jan 2027-31 Jan 2027  
Sprint 4 (if necessary): 1 Mar 2027-14 Mar 2027  
Beta Testing: March

# **Keywords** {#keywords}

## **Role Table (Brief)** {#role-table-(brief)}

| Role | Who? | Description |
| :---- | :---- | :---- |
| OS | ฝ่ายดูแล/อนุมัติการจองสถานที่ทั้งหมด | จัดการห้อง (เปิด/ปิด/เพิ่มห้อง) ตั้งเงื่อนไขพิเศษของห้อง / ช่วงเวลาที่เปิดให้จอง Approve / Reject คำขอจอง (ตัดสินกรณีห้องชนกัน) |
| User A | นิสิตทั่วไป / กรุ๊ป / กิจกรรมของภาควิชา | เข้าหน้าจองแบบสั้น มี option ห้องทั้งหมด 32 ห้อง (ตึก 3\) |
| User B  | โครงการ / ESC69 / ชมรม  | เข้าหน้าจองแบบเต็ม มี option ห้องทั้งหมด 78 ห้อง (ตึก 100 / 3 / 4 / 5, ลานกลางแจ้ง, ห้องภาค, สนามกีฬา, Hall of Intania, ลานเกียร์ ฯลฯ) |

## **Booking Status**

สถานะของการกดจองห้อง ซึ่งจะแสดงออกแตกต่างกันตาม user 

| Status | Description |
| ----- | ----- |
| Pending | การจองอยู่ในระหว่างการพิจารณา |
| Approved | การจองของสำเร็จ |
| Rejected | การจองห้องไม่สำเร็จ (ถูกปฏิเสธโดย OS / ระบบ) |
| Cancelled | ยกเลิกการจองห้อง |

## **Location Status**

สถานะการใช้งานของสถานที่

| Status | Description |
| ----- | ----- |
| Vacant | สถานที่ยังสามารถเปิดให้จองได้ |
| Booked | สถานที่ถูกจองเป็นที่เรียบร้อยแล้ว ไม่สามารถขอจองสถานที่ได้ |
| Restricted | User ไม่สามารถจองได้เนื่องจากว่าไม่มี permission |
| Unavailable | สถานที่ไม่สามารถใช้งานได้ |
| Conflicted | สถานที่มีคำขอจองทับเวลากัน (เฉพาะ OS ที่เห็น) |

# **Sprint 0** {#sprint-0}

TL;DR: ทำตรวจสอบห้องว่าง \+ จัดการห้องของ OS

Sprint นี้มีมาเพื่อช่วย OS ก่อนชั่วคราวเพื่ออำนวยความสะดวกให้แก่ฝ่าย OS

คร่าว ๆ

- การจองห้องยังคงผ่านทาง Form ของ OS อยู่  
- มีหน้า Dashboard ที่ User สามารถดู slot เวลาการใช้ห้องต่าง ๆ ได้ \+ ดูได้ว่า slot นั้นมีห้อง pending อยู่หรือไม่  
- มีหน้า Dashboard ที่ OS สามารถมาดูข้อมูลการจองห้องได้  
  - ใช้ในการดูว่าแต่ละห้องมี Conflict เกิดขึ้นหรือไม่ แทนที่การดูบน Google Sheet ที่ค่อนข้างใช้งานลำบาก  
- ทำ Google Sheets ที่สามารถยิง API ไปขอ Request ห้องกับกิจนิสิตได้บนเว้บ WeWork  
- จะมี Server Sandbox สำหรับใช้การทดสอบการยิง API การส่ง Request นี้ ก่อนจะนำไปใช้กับ Server จริง

ซึ่งก็คือเราต้อทำ Epic 3 US 1-2, Epic 4 ก่อน เพื่อให้ OS ใช้งาน

เนื่องจากว่าตอนนี้ทางกิจการนิสิตยังไม่ได้ให้ Access API ที่จะใช้ยิง WeWork และก็ยังไม่มี Server สำหรับ Testing เราจึงจะทำหน้าที่เป็น Dashboard การใช้งานของห้องก่อน

# **Functional Requirement** {#functional-requirement}

(Highlight \= ระหว่างการ Review)

## **Epic 1: หน้าจองสถานที่ (Booking Request Page)** {#epic-1:-หน้าจองสถานที่-(booking-request-page)}

\*\* \= ผ่านการคุยกับ OS

| \# | Title | User Stories | Details & Notes |
| :---- | :---- | :---- | :---- |
| 1 | Differentiated Booking Form by User Type | As a User A, I want to access a short booking form limited to the 32 rooms in Building 3, so that I can quickly book a room relevant to my group/department activity. As a User B, I want to access a full booking form with a 5-service menu (Location+Equipment / Equipment / Parking Lot / Route Change / Other), so that I can request from the full \~78 locations across multiple buildings. | ต้องแยก Flow ฟอร์มตาม Role: User A เห็นเฉพาะ 32 ห้องในตึก 3, User B เห็นเมนู 5 บริการและสถานที่ \~78 แห่ง (ตึก 100/3/4/5, ลานกลางแจ้ง, ห้องภาค, สนามกีฬา, Hall of Intania, ลานเกียร์ ฯลฯ) รายชื่อห้อง/สถานที่ทั้งสองชุดต้องดึงจากข้อมูลที่ฝ่าย OS จัดการในหน้า Room Management (Epic 2\) เพื่อให้อัปเดตอยู่เสมอ  |
| 2 | Advance Booking Validation (Hard Block) | As a User (A/B), I want the system to block me from submitting a request less than 14 calendar days before the event date, so that OS has enough lead time to process my request. | Hard block เหมือนกันทั้ง User A และ User B (14 วันปฏิทิน) ไม่มีข้อยกเว้น \*ควรแสดง Error message ตั้งแต่ตอนเลือกวันที่ในฟอร์ม (ก่อนกดส่ง) เพื่อลดการกรอกฟอร์มเสียเปล่า |
| 3 | Time Slot Selection with Special Event Override | As a User, I want the available time range for a room to reflect any special-event overrides set by OS, so that I don't attempt to book outside the actual available hours. | Default: 08:00–20:00 จ.-ศ. 08:00–16:00 ส.-อา. โดย OS ตั้งค่า Override ตามห้อง/วันที่ได้ (Epic 2\) ระบบต้องดึงเงื่อนไขล่าสุดมาแสดงในฟอร์มจองเสมอ |
| 4 | Room-Specific Rule Enforcement | As a User, I want the system to warn or block me from booking a room that doesn't meet its specific rules (e.g. attendee minimum, VIP-only access), so that I don't submit an invalid request. | ตัวอย่างที่ทราบแล้ว: Hall of Intania (ขั้นต่ำ 250 คน), 116/3 (เฉพาะ VIP), สวนรวมใจ (ปิด 17:00) \[Open Question\] รายละเอียดกฎเต็มของทุกห้องรอ OS ให้ข้อมูลเพิ่มเติม — ระบบควร Config ได้แบบยืดหยุ่นต่อห้อง\*\* ตาม Room Rule / Restriction ที่มีอยู่ ปัจจุบัน \*\* ตึก 4 floor 2 closed เมษาหน้า ยาวๆ |
| 5 | Booker Detail Page (Carry-over Fields) | As a User, I want to see all of my booking details on a confirmation/detail page in the same format as the current system, so that nothing important is lost in the migration to web. | \[Open Question\] รอ Requirement รายละเอียด Field ที่ต้อง Carry-over จากฟอร์มเดิม \* field ครบ  |
| 6 | Autofill Requester Info | As a User, I want my name and contact details to be pre-filled from my account/profile every time I book, so that I don't have to retype the same information repeatedly. | มาจาก Expectation ของ OS โดยตรง ("ไม่ต้องพิมพ์ชื่อผู้ใช้ซ้ำ ๆ เวลาทำการกรอก") ดึงจากข้อมูล Account/Profile ของผู้จอง (ชื่อ, เบอร์ติดต่อ ฯลฯ) มาใส่ล่วงหน้าในฟอร์ม โดยยังแก้ไขได้หากจำเป็น |
| 7 | Room / Location Filter & Search | As a User, I want to filter or search the room/location list (e.g. by building, capacity, room type, or availability), so that I can find a suitable room quickly among the 32 / \~78 options. | สำคัญมากสำหรับ User B ที่ต้องเลือกจากสถานที่ประมาณ 78 แห่งหลายตึก — ควร Filter ได้อย่างน้อยตามตึก/ประเภทสถานที่ และแสดงเฉพาะห้องที่ว่างในช่วงเวลา/วันที่ที่เลือก \[Open Question\] รายละเอียด Filter Criteria ที่ต้องการเพิ่มเติม (เช่น ความจุ, อุปกรณ์ในห้อง) รอคุยเพิ่มกับ OS/User \*\* Amount of pp Building Time slot อุปกรณ์ในห้อง\*tech do more hw  |
| 8 | Multi-Room Booking Limit Enforcement | As a User, I want the system to enforce how many rooms I can book at once or within a period, so that my bookings stay within the limits OS allows. | \[Open Question\] OS จะลิสต์กฎ/ข้อจำกัดเรื่องจำนวนห้องต่อคนมาให้ภายหลัง — ยังไม่มีตัวเลขที่แน่นอน \*ระบบควรออกแบบให้ Config จำนวนห้องสูงสุดต่อคน/ต่อ Role ได้แบบยืดหยุ่น เผื่อกฎเปลี่ยนภายหลัง\*\*By Role: Student, Club/โครงการ/กวศ(as many as they want, no limit rn, ref from os sheet) \*\* need to follow up later with os |
| 9 | Project Code Validation (User B) | As a User B, I want to enter my project code when booking, so that the system can confirm it's a legitimate registered project before OS reviews it. | ปัจจุบัน OS Validate 3 ขั้นตอน: (1) เช็คชื่อกับใบเปิดโครง (2) เทียบกับข้อมูลโครงที่ OS เก็บไว้ (3) รหัสโครงต้องลงท้าย "21" (รหัสวิศวะ) ระบบควร Validate รูปแบบรหัส (ลงท้าย 21\) ในฟอร์มได้ทันที ส่วนการเทียบกับใบเปิดโครง/ข้อมูลโครง \[Open Question\] ยังต้องหารือว่าจะ Automate เพิ่มเติมได้แค่ไหน หรือคง Manual โดย OS เหมือนเดิม\*\* ฟัง flow จาก transcript \*\* can automate if there is database to decrease search amount |
| 10 | Late-Time Remark Requirement | As a User, I want the system to require a remark/note whenever my booking extends past 20:00, so that OS has context for late-night or overnight activities. | ตัวอย่าง: กิจกรรมลานเกียร์ที่ต้องนอนค้างคืน — บังคับกรอกหมายเหตุเมื่อเวลาสิ้นสุดการจองเกิน 20:00 (2 ทุ่ม) |

## **Epic 2: หน้าจัดการห้อง (Room & Availability Management)** {#epic-2:-หน้าจัดการห้อง-(room-&-availability-management)}

*Scope: OS เท่านั้น*

| \# | Title | User Stories | Details & Notes |
| :---- | :---- | :---- | :---- |
| 1 | Add / Disable Room | As an OS, I want to add a new room/location or disable an existing one (e.g. under maintenance), so that the booking form always reflects rooms that are actually usable. | Disable ห้อง ≠ ลบห้อง (Soft-disable) เพื่อรักษาประวัติการจองเดิมไว้ ห้องที่ Disable ต้องไม่ปรากฏเป็นตัวเลือกในฟอร์มจองของ User A/B ทันที |
| 2 | Room Metadata & Restriction Config | As an OS, I want to configure each room's capacity, restrictions (e.g. min attendees, VIP-only), and building/zone, so that booking rules are enforced automatically without manual checking. | \[Open Question\] รอ List เงื่อนไขเต็มจากฝ่าย OS \*โครงสร้างข้อมูลควรรองรับเงื่อนไขแบบยืดหยุ่น เผื่อเพิ่มกฎใหม่ในอนาคตโดยไม่ต้องแก้โค้ด |
| 3 | Special Event Hour Override | As an OS, I want to override a room's normal open/close hours for a specific date or event, so that bookings correctly reflect temporary changes (e.g. extended hours for a big event, or closure for cleaning). | ระบุห้อง \+ ช่วงวันที่ \+ เวลาที่ Override ได้ \*ระบบใช้ค่านี้แทนค่า Default เมื่อ User เลือกวันที่ตรงกับ Override |

## **Epic 3: หน้า Dashboard อนุมัติการจอง (Booking Approval Dashboard)** {#epic-3:-หน้า-dashboard-อนุมัติการจอง-(booking-approval-dashboard)}

*Scope: OS เท่านั้น*

| \# | Title | User Stories | Details & Notes |
| :---- | :---- | :---- | :---- |
| 1 | Room Availability Overview | As an OS, I want a dashboard/calendar view showing, at a glance, which rooms are available, pending, or already booked, so that I can manage bookings faster without switching between pages. | ตรงกับ Pain Point หลักที่ OS ระบุ ("อยากให้จัดการง่ายขึ้นว่าใครควรได้ห้อง และมี UI ให้เห็นว่าห้องไหนว่าง/มีคนรอ/จองแล้ว") — เป็น Requirement สำคัญที่สุดของ Epic นี้ ควรออกแบบเป็น Calendar/Timeline View แยกตามห้อง หรือ List View ที่ Filter ตามสถานะ (ว่าง / รอดำเนินการ / จองแล้ว) ได้ |
| 2 | Approve / Reject Booking Request | As an OS, I want to approve or reject a booking request directly from the dashboard, so that requesters get a clear, timely decision. \*\* เบื่อตามเอกสารกับเจ้าหน้าที่ \*\* ทำเอกสาร ขอสถานที่ เลือกตึก 100 เพราะไม่ต้องทำเอกสาร \*\*\* ตึก 100 ชั้ัน 3 301-306, meeting more เอาข้อมูลๆปให้เจ้าหน้าที่ เจ้าหน้าที่ก็ไม่อยากกรอก \*\*\*\* communication between user and os regarding meeting and more: the confusion is in os, ข้อจำกัด os จองกี่เดือนก็ได้  student 7 วันล่วงหน้า ,กวศ 30   | เมื่อ Approve/Reject ระบบควรอัปเดตสถานะให้ User เห็นทันที (ไม่ต้องรอแจ้งด้วยช่องทางอื่นเหมือนปัจจุบัน) \[Open Question\] สถานะ "กำลังทำเอกสาร" / "แก้ไขเอกสาร" เป็น Personal status ที่ OS ใช้ภายใน — รอความชัดเจนว่าจำเป็นต้องมีในระบบหรือไม่ \*\* approve/reject through mail(spam/block from repeated request by os( hypothesis: เกิดจากข้อความซ้ำและ link to line) Cancel : through line \-\> manually cancel in excel or tell directly tell เจ้าหน้าที่ ตอนที่เอกสารถึงเจ้าหน้าที่แล้ว |
| 3 | Notification on Decision | As a User, I want to be notified when my booking request is approved or rejected, so that I know the outcome without having to check manually. | ปัจจุบันแจ้งผ่าน OS โดยตรง ไม่มีช่องทางที่แน่นอน ระบบควรมี In-app/Email notification แทน เพื่อลดภาระ OS ในการแจ้งด้วยตนเอง |
| 4 | Booking Filter & Search (OS side) | As an OS, I want to filter and search bookings on the dashboard (by room, building, status, date range, or requester), so that I can assess and manage requests faster — OS is the one who owns the assessment process. | ยืนยันจาก Interview: "ตอนนี้มองว่าให้ OS เป็นคนจัดการ assess" — OS ต้องการเครื่องมือ Filter ที่ครอบคลุมเพื่อรองรับ Volume คำขอที่สูง (Peak 100+ คำขอ/สัปดาห์) Filter ขั้นต่ำที่ควรมี: ตึก/สถานที่, สถานะ (ว่าง/รอดำเนินการ/จองแล้ว), ช่วงวันที่, ประเภทผู้จอง (User A / User B) |

## **Epic 4: ระบบตรวจจับการจองชนกัน (Conflict / Double-Booking Handling)** {#epic-4:-ระบบตรวจจับการจองชนกัน-(conflict-/-double-booking-handling)}

| \# | Title | User Stories | Details & Notes |
| :---- | :---- | :---- | :---- |
| 1 | First-Submission-Wins Conflict Check | As the System, I want to detect when two requests overlap for the same room/date/time, so that OS can resolve the conflict based on submission order. | กฎหลัก \= ใครส่งคำขอก่อนมีสิทธิ์ก่อน (First Submission Wins) ระบบควร Flag คำขอที่ชนกันให้ OS เห็นชัดเจนบน Dashboard (Epic 3\) แทนที่จะปล่อยให้ Approve ซ้อนกันโดยไม่รู้ตัว |
| 1\. | Conflict Management | As an OS, I want to decide which pending room requests will be approved, so that I can resolve them manually based on the priority. |  |
| 2 | Special-Case Conflict Flagging (Manual OS Resolution) | As an OS, I want the system to flag conflicts that involve a special condition (e.g. requires checking with a professor/department head first), so that I can resolve them manually outside the standard first-come-first-served rule. | บางเคสไม่สามารถตัดสินอัตโนมัติได้ (เช่น ต้องขออนุญาตอาจารย์/หน่วยงานก่อน) — ระบบไม่ต้อง Automate การตัดสินใจส่วนนี้ เพียง Flag ให้ OS เห็นและดำเนินการนอกระบบเอง Peak load ประมาณ 100+ คำขอ/สัปดาห์ ในช่วงที่มีคนจองเยอะ — ควรออกแบบให้ Flag เห็นได้ชัดแม้ Volume สูง |
| 3 | Immediate Re-opening on Cancellation | As the System, I want a cancelled booking to immediately reopen the room/slot for new requests, so that the room isn't held unnecessarily. | ตรงกับพฤติกรรมปัจจุบัน (ห้องเปิดให้จองใหม่ทันทีเมื่อมีคนยกเลิก) \[Note\] กรณีจองวันเดียวกันคนละเวลาพบไม่บ่อย ไม่ต้องออกแบบ Flow พิเศษเพิ่มเติมในเบื้องต้น |

## **Epic 5: เคสพิเศษ ตึก 100 ชั้น 3 (Meeting and More Notice)** {#epic-5:-เคสพิเศษ-ตึก-100-ชั้น-3-(meeting-and-more-notice)}

| \# | Title | User Stories | Details & Notes |
| :---- | :---- | :---- | :---- |
| 1 | Pre-Booking Notice for Building 100 Floor 3 | As a User booking a room in Building 100 Floor 3, I want to see a clear notice that I must first reserve via the Meeting and More system before submitting this form, so that my request isn't rejected due to a missing prerequisite step. | Meeting and More เป็นระบบของทีมอื่น — ไม่ต้อง Integrate หรือเชื่อมต่อใด ๆ (Confirmed) ระบบนี้ทำหน้าที่แค่แสดง Notice/เงื่อนไขเตือนผู้จองเท่านั้น |
| 2 | OS Manual Verification | As an OS, I want to manually verify with the Meeting and More system/team that the Building 100 Floor 3 reservation exists before approving, so that no request is approved without a valid prerequisite booking. | ไม่มี Automated check — ฝ่าย OS ตรวจสอบเงื่อนไขนี้เองนอกระบบทั้งหมด (Confirmed: No integration required) |
| 3 | Separate Tracking View for Building 100 Floor 3 | As an OS, I want Building 100 Floor 3 bookings to appear in a separate track/tab from other rooms on the dashboard, so that I can manage this special-case building independently from the rest. | มาจาก Expectation ของ OS โดยตรง ("ตึก 100 ชั้น 3 มี Feature แยก Track") แนะนำให้แยกเป็น Tab/View เฉพาะบน Booking Approval Dashboard (Epic 3\) แทนการปนกับห้องอื่น |

## 

## **Epic 6: PDPA Annual Data Clearing** {#epic-6:-pdpa-annual-data-clearing}

*Scope: OS เท่านั้น*

| \# | Title | User Stories | Details & Notes |
| :---- | :---- | :---- | :---- |
| 1 | Annual Personal Data Clearing | As an OS, I want to run an annual clearing process for personal data collected through bookings, so that the system stays compliant with PDPA. | ยืนยันจาก Interview: "วาระ 1 ปี มีการจัดการ PDPA เคลียร์ทุกปี" \*\[Open Question\] ขอบเขตข้อมูลที่ต้องเคลียร์ (ลบถาวร / Anonymize / เก็บเป็น Archive), Trigger ว่าเคลียร์เมื่อไหร่ (Manual โดย OS กดเอง หรือ Auto ตามรอบปี), และข้อมูลใดที่ยังต้องเก็บไว้เพื่ออ้างอิงสถิติ  |

