// Kept as plain JS because next.config.js imports it. Forwards the API through
// this site so the sign-in cookie is first-party. See docs/adr/0002-auth.md.

/**
 * Rewrites that send the API's paths to its real origin. The API also owns
 * `/auth/google/*`, because Google must return the browser to this site's host
 * for the OAuth state cookie to come back with it.
 *
 * @param {string | undefined} target Origin of the Go API, without a trailing slash.
 * @returns {{ source: string; destination: string }[]}
 */
export function apiRewrites(target) {
  if (!target) return [];
  return [
    { source: "/api/v1/:path*", destination: `${target}/api/v1/:path*` },
    {
      source: "/auth/google/:path*",
      destination: `${target}/auth/google/:path*`,
    },
  ];
}
