import { env } from "@/env";

/** The Go API's URL for a path such as `/api/v1/auth/me`. */
export function apiUrl(path: string) {
  return new URL(path, env.NEXT_PUBLIC_API_BASE_URL);
}

/**
 * Calls the Go API from the browser. `credentials: "include"` sends its
 * `room_auth` cookie: the cookie belongs to the API's host, so the request must
 * go to that host and not through this site. The API allows it with credentialed
 * CORS for its `FRONTEND_URL` origin.
 */
export function apiFetch(path: string | URL, init: RequestInit = {}) {
  return fetch(typeof path === "string" ? apiUrl(path) : path, {
    cache: "no-store",
    ...init,
    credentials: "include",
  });
}
