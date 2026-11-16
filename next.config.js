/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

// The browser calls the Go API directly (see docs/adr/0002-auth.md), so there
// are no rewrites to it. Importing the env file above still validates it at build time.
/** @type {import("next").NextConfig} */
const config = {};

export default config;
