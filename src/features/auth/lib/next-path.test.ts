import { describe, expect, it } from "bun:test";
import { authErrorMessage } from "./errors";
import { rememberNextPath, safeNextPath, takeNextPath } from "./next-path";

describe("safeNextPath", () => {
  it("accepts site paths", () => {
    expect(safeNextPath("/os/availability")).toBe("/os/availability");
    expect(safeNextPath("/requests?page=2")).toBe("/requests?page=2");
  });

  it.each([
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/login?next=/home",
    "home",
    "",
    null,
    undefined,
  ])("rejects %p", (value) => {
    expect(safeNextPath(value)).toBeNull();
  });
});

describe("remembered path", () => {
  it("is returned once and then cleared", () => {
    rememberNextPath("/os/rooms");
    expect(takeNextPath()).toBe("/os/rooms");
    expect(takeNextPath()).toBeNull();
  });
});

describe("authErrorMessage", () => {
  it("has a message for each code the API sends and a fallback", () => {
    for (const code of [
      "access_denied",
      "invalid_callback",
      "ineligible",
      "account_unavailable",
      "identity_conflict",
      "server_error",
    ]) {
      expect(authErrorMessage(code)).toBeTruthy();
    }
    expect(authErrorMessage("something_new")).toContain("ไม่สำเร็จ");
    expect(authErrorMessage(undefined)).toBeNull();
  });
});
