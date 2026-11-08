import { describe, expect, it } from "bun:test";
import { createCaller } from "./root";

describe("appRouter", () => {
  it("serves procedures through tRPC", async () => {
    const caller = createCaller({ headers: new Headers() });
    expect(await caller.health.ping()).toEqual({ status: "ok" });
  });
});
