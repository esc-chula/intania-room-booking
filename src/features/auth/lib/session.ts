import { z } from "zod";
import { API_ROLES, type SessionUser } from "@/domain/auth";

// Raised when the API cannot answer (down, or sign-in switched off), which is
// different from "you are not signed in" and must not send people to /login.
export class AuthUnavailableError extends Error {}

const meResponse = z.object({
  id: z.string(),
  email: z.string(),
  first_name: z.string().default(""),
  last_name: z.string().default(""),
  role: z.enum(API_ROLES),
});

/** The signed-in user, or null when there is no valid cookie. */
export async function fetchCurrentUser(): Promise<SessionUser | null> {
  let response: Response;
  try {
    response = await fetch("/api/v1/auth/me", { cache: "no-store" });
  } catch {
    throw new AuthUnavailableError("Cannot reach the API");
  }
  if (response.status === 401) return null;
  if (!response.ok) {
    throw new AuthUnavailableError(`Auth API returned ${response.status}`);
  }
  const parsed = meResponse.safeParse(await response.json());
  if (!parsed.success) throw new AuthUnavailableError("Unexpected response");
  const user = parsed.data;
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
  };
}

export async function signOut() {
  const response = await fetch("/api/v1/auth/logout", { method: "POST" });
  if (!response.ok) throw new Error(`Logout failed with ${response.status}`);
}
