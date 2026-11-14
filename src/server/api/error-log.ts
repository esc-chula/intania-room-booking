import { type TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { UpstreamApiError } from "./upstream-error";

type Failure = {
  path: string | undefined;
  error: TRPCError;
  requestId: string;
};

/**
 * One log entry for a failed procedure. It never holds the cookie or request
 * headers: only the procedure, the error, the request id and what the Go API
 * answered. The same request id is sent to the API, so its log line matches.
 */
export function formatTrpcError({ path, error, requestId }: Failure) {
  const upstream =
    error.cause instanceof UpstreamApiError ? error.cause : undefined;
  return {
    event: "trpc_error" as const,
    level: getHTTPStatusCodeFromError(error) >= 500 ? "error" : "warn",
    path: path ?? null,
    code: error.code,
    requestId,
    message: error.message,
    upstreamStatus: upstream?.status,
    upstreamTarget: upstream?.target,
    upstreamBody: upstream?.body,
  };
}

/** Writes one JSON line, which Vercel's log search can filter by field. */
export function logTrpcError(failure: Failure) {
  const entry = formatTrpcError(failure);
  const write = entry.level === "error" ? console.error : console.warn;
  write(JSON.stringify(entry));
}
