import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "@/env";

// Response shapes from intania-room-booking-api/docs/swagger.json.
export const calendarResponse = z.object({
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

export const weeklyResponse = z.object({
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

export async function fetchSheetBookings<T>(
  path: "calendar" | "weekly",
  params: Record<string, string | undefined>,
  schema: z.ZodType<T>,
): Promise<T> {
  const url = new URL(`/api/v1/admin/sheet-bookings/${path}`, env.API_BASE_URL);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store" });
  } catch (cause) {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "Cannot reach the booking API",
      cause,
    });
  }
  if (!response.ok) {
    throw new TRPCError({
      code: response.status === 400 ? "BAD_REQUEST" : "BAD_GATEWAY",
      message: `Booking API returned ${response.status}`,
    });
  }
  const parsed = schema.safeParse(await response.json());
  if (!parsed.success) {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "Booking API returned an unexpected response",
      cause: parsed.error,
    });
  }
  return parsed.data;
}
