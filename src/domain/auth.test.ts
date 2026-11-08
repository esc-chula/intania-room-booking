import { describe, expect, it } from "bun:test";
import { canAccess, displayName, homeFor } from "./auth";

describe("auth domain", () => {
  it("keeps users out of OS pages and OS out of user pages", () => {
    expect(canAccess("OS", "os")).toBe(true);
    expect(canAccess("USER_A", "os")).toBe(false);
    expect(canAccess("USER_B", "os")).toBe(false);
    expect(canAccess("USER_A", "user")).toBe(true);
    expect(canAccess("OS", "user")).toBe(false);
  });

  it("lets ADMIN into both areas and anyone into shared pages", () => {
    expect(canAccess("ADMIN", "os")).toBe(true);
    expect(canAccess("ADMIN", "user")).toBe(true);
    expect(canAccess("USER_B", "any")).toBe(true);
  });

  it("sends each role to its home page", () => {
    expect(homeFor("OS")).toBe("/os");
    expect(homeFor("ADMIN")).toBe("/os");
    expect(homeFor("USER_A")).toBe("/home");
    expect(homeFor("USER_B")).toBe("/home");
  });

  it("falls back to the e-mail when there is no name", () => {
    const base = {
      id: "1",
      email: "a@student.chula.ac.th",
      role: "OS",
    } as const;
    expect(displayName({ ...base, firstName: "", lastName: "" })).toBe(
      base.email,
    );
    expect(displayName({ ...base, firstName: "Sira", lastName: "S" })).toBe(
      "Sira S",
    );
  });
});
