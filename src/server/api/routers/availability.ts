import { z } from "zod";
import {
  toBookingStatus,
  type AvailabilityRoom,
  type DayStatusCounts,
} from "@/domain/availability";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  calendarResponse,
  fetchSheetBookings,
  weeklyResponse,
} from "@/server/api/sheet-bookings";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const buildings = z.array(z.string()).max(20).default([]);

// No buildings selected means all of them, which the API does with no filter.
const buildingFilters = (selected: string[]) =>
  selected.length > 0 ? selected : [undefined];

export const availabilityRouter = createTRPCRouter({
  // Building names for the filter. The weekly endpoint lists every room.
  buildings: publicProcedure.query(async () => {
    const week = await fetchSheetBookings("weekly", {}, weeklyResponse);
    return [...new Set(week.rooms.map((room) => room.building))];
  }),

  // Daily counts per status for one month (the month view).
  calendar: publicProcedure
    .input(
      z.object({
        year: z.number().int().min(2000).max(2100),
        month: z.number().int().min(1).max(12),
        buildings,
      }),
    )
    .query(async ({ input }) => {
      const results = await Promise.all(
        buildingFilters(input.buildings).map((building) =>
          fetchSheetBookings(
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
            day.counts.submitted +
            day.counts.timeline +
            day.counts.needs_revision;
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
    }),

  // Every room with its bookings for up to seven days (the week and day views).
  schedule: publicProcedure
    .input(
      z.object({
        startDate: isoDate,
        endDate: isoDate.optional(),
        buildings,
      }),
    )
    .query(async ({ input }) => {
      const results = await Promise.all(
        buildingFilters(input.buildings).map((building) =>
          fetchSheetBookings(
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
    }),
});
