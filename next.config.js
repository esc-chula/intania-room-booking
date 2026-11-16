/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { env } from "./src/env.js";
import { apiRewrites } from "./src/lib/api-proxy.js";

// By default the browser calls the Go API directly (docs/adr/0002-auth.md).
// With API_PROXY_TARGET set, the API is forwarded through this site instead, so
// its sign-in cookie is first-party and Safari and iOS do not block it.
/** @type {import("next").NextConfig} */
const config = {
  rewrites: async () => apiRewrites(env.API_PROXY_TARGET),
};

export default config;
