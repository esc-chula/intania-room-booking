import { describe, expect, it } from "bun:test";
import { createCaller } from "./root";
import { createTRPCContext } from "./trpc";

describe("appRouter", () => {
  it("serves procedures through tRPC", async () => {
    const caller = createCaller(
      await createTRPCContext({ headers: new Headers() }),
    );
    expect(await caller.health.ping()).toEqual({ status: "ok" });
  });
});
