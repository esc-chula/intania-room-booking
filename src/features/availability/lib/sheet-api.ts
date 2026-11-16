import { z } from "zod";
import {
  toBookingStatus,
  type AvailabilityRoom,
  type DayStatusCounts,
} from "@/domain/availability";
import { apiFetch, apiUrl } from "@/lib/api";

// Response shapes from intania-room-booking-api/docs/swagger.json.
const calendarResponse = z.object({
  year: z.number(),
  month: z.number(),
  days: z.array(
    z.object({
      date: z.string(),
      counts: z.object({
        approved: z.number(),
        cancelled: z.number(),
        submitted: z.number(),
        timeline: z.number(),
        needs_revision: z.number(),
        conflicted: z.number(),
      }),
    }),
  ),
});

const weeklyResponse = z.object({
  start_date: z.string(),
  end_date: z.string(),
  rooms: z.array(
    z.object({
      id: z.string(),
      building: z.string(),
      name: z.string(),
      bookings: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          start_at: z.string(),
          end_at: z.string(),
          status: z.string(),
          has_conflict: z.boolean(),
        }),
      ),
    }),
  ),
});

export type CalendarInput = {
  year: number;
  month: number;
  buildings: string[];
};

export type ScheduleInput = {
  startDate: string;
  endDate?: string;
  buildings: string[];
};

/** The Go API did not give us data. `status` is null when it never answered. */
export class SheetApiError extends Error {
  readonly status: number | null;
  /** The start of what the API answered, for the browser console. */
  readonly body: string;

  constructor(
    message: string,
    options: { status?: number; body?: string; cause?: unknown } = {},
  ) {
    super(
      message,
      options.cause === undefined ? undefined : { cause: options.cause },
    );
    this.name = "SheetApiError";
    this.status = options.status ?? null;
    this.body = options.body ?? "";
  }
}

// The sheet endpoints need the person's sign-in cookie, which the browser sends
// because the request goes straight to the API (see docs/adr/0002-auth.md).
async function fetchSheet<T>(
  path: "calendar" | "weekly",
  params: Record<string, string | undefined>,
  schema: z.ZodType<T>,
): Promise<T> {
  const url = apiUrl(`/api/v1/admin/sheet-bookings/${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  let response: Response;
  try {
    response = await apiFetch(url);
  } catch (cause) {
    // Offline, the API is down, or the browser blocked the call (CORS).
    throw new SheetApiError("Cannot reach the booking API", { cause });
  }
  if (!response.ok) {
    throw new SheetApiError(`Booking API returned ${response.status}`, {
      status: response.status,
      body: (await response.text().catch(() => "")).slice(0, 300),
    });
  }
  const parsed = schema.safeParse(await response.json().catch(() => null));
  if (!parsed.success) {
    throw new SheetApiError("Booking API returned an unexpected response", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

// No buildings selected means all of them, which the API does with no filter.
const buildingFilters = (selected: string[]) =>
  selected.length > 0 ? selected : [undefined];

/** Building names for the filter. The weekly endpoint lists every room. */
export async function fetchBuildings() {
  const week = await fetchSheet("weekly", {}, weeklyResponse);
  return [...new Set(week.rooms.map((room) => room.building))];
}

/** Daily counts per status for one month (the month view). */
export async function fetchCalendar(input: CalendarInput) {
  const results = await Promise.all(
    buildingFilters(input.buildings).map((building) =>
      fetchSheet(
        "calendar",
        {
          year: String(input.year),
          month: String(input.month),
          building,
        },
        calendarResponse,
      ),
    ),
  );

  const days = new Map<string, DayStatusCounts>();
  for (const result of results) {
    for (const day of result.days) {
      const total = days.get(day.date) ?? {
        approved: 0,
        pending: 0,
        cancelled: 0,
        conflicted: 0,
      };
      total.approved += day.counts.approved;
      total.pending +=
        day.counts.submitted + day.counts.timeline + day.counts.needs_revision;
      total.cancelled += day.counts.cancelled;
      total.conflicted += day.counts.conflicted;
      days.set(day.date, total);
    }
  }
  return {
    year: input.year,
    month: input.month,
    days: Object.fromEntries(days),
  };
}

/** Every room with its bookings for up to seven days (the week and day views). */
export async function fetchSchedule(input: ScheduleInput) {
  const results = await Promise.all(
    buildingFilters(input.buildings).map((building) =>
      fetchSheet(
        "weekly",
        {
          start_date: input.startDate,
          end_date: input.endDate,
          building,
        },
        weeklyResponse,
      ),
    ),
  );

  const rooms: AvailabilityRoom[] = results.flatMap((result) =>
    result.rooms.map((room) => ({
      id: room.id,
      building: room.building,
      name: room.name,
      bookings: room.bookings.map((booking) => ({
        id: booking.id,
        title: booking.title,
        startAt: booking.start_at,
        endAt: booking.end_at,
        status: toBookingStatus(booking.status),
        hasConflict: booking.has_conflict,
      })),
    })),
  );
  return {
    startDate: results[0]?.start_date ?? input.startDate,
    endDate: results[0]?.end_date ?? input.endDate ?? input.startDate,
    rooms,
  };
}
