import { type TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

type Failure = {
  path: string | undefined;
  error: TRPCError;
  requestId: string;
};

/**
 * One log entry for a failed procedure. It holds only the procedure, the error
 * and the request id, never the cookie or request headers. The same request id
 * is in the failed response, so a report can be matched to its log line.
 */
export function formatTrpcError({ path, error, requestId }: Failure) {
  return {
    event: "trpc_error" as const,
    level: getHTTPStatusCodeFromError(error) >= 500 ? "error" : "warn",
    path: path ?? null,
    code: error.code,
    requestId,
    message: error.message,
  };
}

/** Writes one JSON line, which Vercel's log search can filter by field. */
export function logTrpcError(failure: Failure) {
  const entry = formatTrpcError(failure);
  const write = entry.level === "error" ? console.error : console.warn;
  write(JSON.stringify(entry));
}
