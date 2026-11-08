import { availabilityRouter } from "@/server/api/routers/availability";
import { healthRouter } from "@/server/api/routers/health";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  availability: availabilityRouter,
  health: healthRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.health.ping();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
