"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchBuildings,
  fetchCalendar,
  fetchSchedule,
  SheetApiError,
  type CalendarInput,
  type ScheduleInput,
} from "./lib/sheet-api";

// A 4xx answer (not signed in, bad query) will not change on a retry.
const retry = (failures: number, error: Error) =>
  failures < 2 &&
  !(
    error instanceof SheetApiError &&
    error.status !== null &&
    error.status < 500
  );

// The browser console is the only place a failed call from a person's own
// browser can be read, so write the cause there before React Query keeps it.
function logged<T>(name: string, load: () => Promise<T>) {
  return async () => {
    try {
      return await load();
    } catch (error) {
      console.error(`Availability request failed (${name})`, error);
      throw error;
    }
  };
}

export function useBuildings() {
  return useQuery({
    queryKey: ["availability", "buildings"],
    queryFn: logged("buildings", fetchBuildings),
    retry,
  });
}

export function useCalendar(input: CalendarInput, enabled: boolean) {
  return useQuery({
    queryKey: ["availability", "calendar", input],
    queryFn: logged("calendar", () => fetchCalendar(input)),
    enabled,
    retry,
  });
}

export function useSchedule(input: ScheduleInput, enabled: boolean) {
  return useQuery({
    queryKey: ["availability", "schedule", input],
    queryFn: logged("schedule", () => fetchSchedule(input)),
    enabled,
    retry,
  });
}
