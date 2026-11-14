/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { env } from "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // The API sets its sign-in cookie for /api/v1 only, so the browser must reach
  // the API through this origin for the cookie to be first-party. See docs/adr/0002-auth.md.
  async rewrites() {
    return {
      // tRPC is served under /api/v1 too, so the browser sends the cookie and
      // the server can pass it on to the API. This has to run before the proxy
      // rule below, which would otherwise send /api/v1/trpc to the Go API.
      beforeFiles: [
        { source: "/api/v1/trpc/:path*", destination: "/api/trpc/:path*" },
      ],
      afterFiles: [
        {
          source: "/api/v1/:path*",
          destination: `${env.API_BASE_URL}/api/v1/:path*`,
        },
        {
          source: "/auth/google/:path*",
          destination: `${env.API_BASE_URL}/auth/google/:path*`,
        },
      ],
    };
  },
};

export default config;
