import { afterEach, describe, expect, it, spyOn } from "bun:test";
import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

// Signed in: the sheet endpoints need the sign-in cookie.
const caller = createCaller(
  await createTRPCContext({
    headers: new Headers({ cookie: "room_auth=session-token" }),
  }),
);

const counts = (over: Partial<Record<string, number>> = {}) => ({
  approved: 0,
  cancelled: 0,
  submitted: 0,
  timeline: 0,
  needs_revision: 0,
  conflicted: 0,
  ...over,
});

let spy: ReturnType<typeof spyOn<typeof globalThis, "fetch">> | undefined;
afterEach(() => spy?.mockRestore());

function mockApi(body: (url: URL) => unknown, status = 200) {
  spy = spyOn(globalThis, "fetch").mockImplementation(((input: URL) =>
    Promise.resolve(
      new Response(JSON.stringify(body(input)), { status }),
    )) as unknown as typeof fetch);
}

describe("availability router", () => {
  it("sums the calendar over buildings and folds internal statuses into pending", async () => {
    mockApi((url) => ({
      year: 2026,
      month: 8,
      days: [
        {
          date: "2026-08-03",
          counts: counts({
            approved: url.searchParams.get("building") === "ENG 3" ? 2 : 1,
            submitted: 1,
            timeline: 1,
            needs_revision: 1,
            conflicted: 1,
          }),
        },
      ],
    }));
    const result = await caller.availability.calendar({
      year: 2026,
      month: 8,
      buildings: ["ENG 3", "ENG 4"],
    });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(result.days["2026-08-03"]).toEqual({
      approved: 3,
      pending: 6,
      cancelled: 0,
      conflicted: 2,
    });
  });

  it("calls the API once with no building filter when none is selected", async () => {
    mockApi(() => ({ year: 2026, month: 8, days: [] }));
    await caller.availability.calendar({ year: 2026, month: 8, buildings: [] });
    expect(spy).toHaveBeenCalledTimes(1);
    const url = (spy!.mock.calls[0] as [URL])[0];
    expect(url.pathname).toBe("/api/v1/admin/sheet-bookings/calendar");
    expect(url.searchParams.has("building")).toBe(false);
  });

  it("maps weekly bookings to camelCase and booking statuses", async () => {
    mockApi(() => ({
      start_date: "2026-08-03",
      end_date: "2026-08-09",
      rooms: [
        {
          id: "r1",
          building: "ENG 100",
          name: "201A",
          bookings: [
            {
              id: "1",
              title: "Club",
              start_at: "2026-08-08T08:00:00+07:00",
              end_at: "2026-08-08T16:00:00+07:00",
              status: "submitted",
              has_conflict: true,
            },
          ],
        },
      ],
    }));
    const result = await caller.availability.schedule({
      startDate: "2026-08-03",
      buildings: [],
    });
    expect(result.rooms[0]?.bookings[0]).toEqual({
      id: "1",
      title: "Club",
      startAt: "2026-08-08T08:00:00+07:00",
      endAt: "2026-08-08T16:00:00+07:00",
      status: "pending",
      hasConflict: true,
    });
  });

  it("lists unique buildings", async () => {
    mockApi(() => ({
      start_date: "a",
      end_date: "b",
      rooms: ["ENG 100", "ENG 100", "ENG 3"].map((building, i) => ({
        id: String(i),
        building,
        name: "x",
        bookings: [],
      })),
    }));
    expect(await caller.availability.buildings()).toEqual(["ENG 100", "ENG 3"]);
  });

  it("reports an unreachable API as BAD_GATEWAY", async () => {
    mockApi(() => ({ error: "x" }), 502);
    const error = await caller.availability
      .buildings()
      .catch((cause: unknown) => cause);
    expect(error).toMatchObject({ code: "BAD_GATEWAY" });
  });
});
