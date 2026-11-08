export const API_ROLES = ["USER_A", "USER_B", "OS", "ADMIN"] as const;
export type ApiRole = (typeof API_ROLES)[number];

export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: ApiRole;
};

export type Area = "os" | "user" | "any";

export function canAccess(role: ApiRole, area: Area) {
  if (area === "any" || role === "ADMIN") return true;
  return area === "os" ? role === "OS" : role === "USER_A" || role === "USER_B";
}

export const homeFor = (role: ApiRole) =>
  role === "OS" || role === "ADMIN" ? "/os" : "/home";

export function displayName(user: SessionUser) {
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
}
