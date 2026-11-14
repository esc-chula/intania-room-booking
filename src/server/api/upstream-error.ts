const MAX_BODY_LENGTH = 300;

/**
 * What the Go API answered when it did not say 200. It is the `cause` of the
 * TRPCError a procedure throws, so the log line can show the API's own reason
 * while the browser only gets a short message.
 */
export class UpstreamApiError extends Error {
  readonly status: number;
  readonly body: string;
  /** The request that failed, such as `GET /api/v1/admin/sheet-bookings/weekly`. */
  readonly target: string;

  constructor(details: { status: number; body: string; target: string }) {
    super(`${details.target} returned ${details.status}`);
    this.name = "UpstreamApiError";
    this.status = details.status;
    this.body = details.body.slice(0, MAX_BODY_LENGTH);
    this.target = details.target;
  }
}
