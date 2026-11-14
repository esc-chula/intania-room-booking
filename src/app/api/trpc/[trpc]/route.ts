import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { appRouter } from "@/server/api/root";
import { logTrpcError } from "@/server/api/error-log";
import { createTRPCContext } from "@/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

// The browser calls /api/v1/trpc, because the API's sign-in cookie is only sent
// on /api/v1 paths. next.config.js rewrites that to /api/trpc, so this route
// has to accept either prefix.
function endpointFor(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const marker = pathname.indexOf("/trpc");
  return marker === -1
    ? "/api/trpc"
    : pathname.slice(0, marker + "/trpc".length);
}

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: endpointFor(req),
    req,
    router: appRouter,
    createContext: () => createContext(req),
    // In every environment: a failure that only logs in development cannot be
    // diagnosed on the deployed site.
    onError: ({ path, error, ctx }) =>
      logTrpcError({ path, error, requestId: ctx?.requestId ?? "unknown" }),
  });

export { handler as GET, handler as POST };
