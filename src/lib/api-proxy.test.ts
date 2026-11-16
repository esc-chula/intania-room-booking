import { describe, expect, test } from "bun:test";
import { apiRewrites } from "./api-proxy.js";

describe("apiRewrites", () => {
  test("does nothing without a target", () => {
    expect(apiRewrites(undefined)).toEqual([]);
    expect(apiRewrites("")).toEqual([]);
  });

  test("forwards the API and the Google sign-in paths to the target", () => {
    expect(apiRewrites("https://api.example.run.app")).toEqual([
      {
        source: "/api/v1/:path*",
        destination: "https://api.example.run.app/api/v1/:path*",
      },
      {
        source: "/auth/google/:path*",
        destination: "https://api.example.run.app/auth/google/:path*",
      },
    ]);
  });
});
