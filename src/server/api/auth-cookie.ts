/** The cookie the Go API sets after Google sign-in. See docs/adr/0002-auth.md. */
export const AUTH_COOKIE_NAME = "room_auth";

/**
 * The sign-in cookie's value from a `Cookie` request header, or null. Only this
 * cookie is read, so nothing else the browser sent is passed on to the API.
 */
export function readAuthCookie(header: string | null) {
  if (!header) return null;
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    if (part.slice(0, separator).trim() === AUTH_COOKIE_NAME) {
      return part.slice(separator + 1).trim() || null;
    }
  }
  return null;
}
