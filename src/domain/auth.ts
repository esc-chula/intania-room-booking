// Roles come from the Go API (internal/core/domain/user/entity.go).
export const API_ROLES = ["USER_A", "USER_B", "OS", "ADMIN"] as const;
export type ApiRole = (typeof API_ROLES)[number];

export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: ApiRole;
};

/** Which part of the site a page belongs to. */
export type Area = "os" | "user" | "any";

// ADMIN can open both areas, as in the API's RequireRoles.
export function canAccess(role: ApiRole, area: Area) {
  if (area === "any" || role === "ADMIN") return true;
  return area === "os" ? role === "OS" : role === "USER_A" || role === "USER_B";
}

export const homeFor = (role: ApiRole) =>
  role === "OS" || role === "ADMIN" ? "/os" : "/home";

export function displayName(user: SessionUser) {
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
}
