// Calendar maths on plain "YYYY-MM-DD" strings so nothing depends on the
// viewer's time zone. Weeks start on Monday, as in the designs.

const DAY_MS = 86_400_000;

const pad = (n: number) => String(n).padStart(2, "0");

export const toIso = (year: number, month: number, day: number) =>
  `${year}-${pad(month)}-${pad(day)}`;

function parse(iso: string) {
  const [year, month, day] = iso.split("-").map(Number) as [
    number,
    number,
    number,
  ];
  return { year, month, day };
}

const toUtc = (iso: string) => {
  const { year, month, day } = parse(iso);
  return Date.UTC(year, month - 1, day);
};

const fromUtc = (ms: number) => {
  const date = new Date(ms);
  return toIso(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  );
};

export const addDays = (iso: string, days: number) =>
  fromUtc(toUtc(iso) + days * DAY_MS);

export const addMonths = (iso: string, months: number) => {
  const { year, month } = parse(iso);
  const index = year * 12 + (month - 1) + months;
  return toIso(Math.floor(index / 12), (index % 12) + 1, 1);
};

/** Monday of the week that holds `iso`. */
export function startOfWeek(iso: string) {
  const weekday = new Date(toUtc(iso)).getUTCDay(); // 0 = Sunday
  return addDays(iso, -((weekday + 6) % 7));
}

export const weekDays = (start: string) =>
  Array.from({ length: 7 }, (_, i) => addDays(start, i));

/** The 6 x 7 grid of dates shown for a month, starting on a Monday. */
export function monthGrid(iso: string) {
  const { year, month } = parse(iso);
  const first = startOfWeek(toIso(year, month, 1));
  return Array.from({ length: 42 }, (_, i) => addDays(first, i));
}

export const monthOf = (iso: string) => {
  const { year, month } = parse(iso);
  return { year, month };
};

export const dayOfMonth = (iso: string) => parse(iso).day;

/** Today in Bangkok, whatever time zone the server or browser runs in. */
export const todayInBangkok = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok" }).format(now);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

/** The grey line under the calendar title, e.g. "วันพุธ • ตารางการใช้สถานที่รายวัน". */
export function formatSubtitle(iso: string, view: "month" | "week" | "day") {
  const { year, month } = parse(iso);
  if (view === "day")
    return `วัน${weekdayLabel(iso)} • ตารางการใช้สถานที่รายวัน`;
  const monthYear = `${THAI_MONTHS[month - 1]!} ${year}`;
  return view === "week"
    ? `${monthYear} • ตารางการใช้สถานที่รายสัปดาห์`
    : `${monthYear} • ภาพรวมรายเดือน`;
}

/** True when `date` is inside an optional from/to range (both ends inclusive). */
export const inRange = (date: string, from: string, to: string) =>
  (!from || date >= from) && (!to || date <= to);

export const monthName = (month: number) => MONTHS[month - 1]!;

export function formatMonthTitle(iso: string) {
  const { year, month } = parse(iso);
  return `${monthName(month)} ${year}`;
}

const short = (month: number) => monthName(month).slice(0, 3);

/** "11 - 17 Nov 2024", or with both months when the range crosses one. */
export function formatRange(start: string, end: string) {
  const a = parse(start);
  const b = parse(end);
  if (start === end) return `${a.day} ${short(a.month)} ${a.year}`;
  if (a.month === b.month && a.year === b.year) {
    return `${a.day} - ${b.day} ${short(b.month)} ${b.year}`;
  }
  return `${a.day} ${short(a.month)} - ${b.day} ${short(b.month)} ${b.year}`;
}

export const WEEKDAY_LABELS = [
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
  "อาทิตย์",
] as const;

export const weekdayLabel = (iso: string) =>
  WEEKDAY_LABELS[(new Date(toUtc(iso)).getUTCDay() + 6) % 7]!;

/** Date part of an API timestamp such as 2026-08-08T08:00:00+07:00. */
export const datePart = (timestamp: string) => timestamp.slice(0, 10);

/** HH:MM part of an API timestamp. */
export const timePart = (timestamp: string) => timestamp.slice(11, 16);

/** Every date a booking touches, so a multi-day booking shows on each day. */
export function datesBetween(startAt: string, endAt: string) {
  const first = datePart(startAt);
  const last = datePart(endAt);
  const dates = [first];
  for (let day = addDays(first, 1); day <= last; day = addDays(day, 1)) {
    dates.push(day);
  }
  return dates;
}

/** 2026-08-05 -> 05/08/2026, the format the date fields show. */
export function isoToDisplay(iso: string) {
  if (!iso) return "";
  const { year, month, day } = parse(iso);
  return `${pad(day)}/${pad(month)}/${year}`;
}

/** 05/08/2026 -> 2026-08-05, or null when it is not a real date. */
export function displayToIso(text: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text.trim());
  if (!match) return null;
  const [, day, month, year] = match.map(Number) as [
    number,
    number,
    number,
    number,
  ];
  const iso = toIso(year, month, day);
  return fromUtc(toUtc(iso)) === iso ? iso : null;
}
