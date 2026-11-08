import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// Smallest possible router, to copy when adding a feature's data access.
export const healthRouter = createTRPCRouter({
  ping: publicProcedure.query(() => ({ status: "ok" as const })),
});
