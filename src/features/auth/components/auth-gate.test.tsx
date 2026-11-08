import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import type { SessionUser } from "@/domain/auth";

import { navigation } from "@/test/next-navigation";

const replace = navigation.replace;

let result: () => Promise<SessionUser | null> = () => Promise.resolve(null);
class AuthUnavailableError extends Error {}
void mock.module("../lib/session", () => ({
  fetchCurrentUser: () => result(),
  signOut: () => Promise.resolve(),
  AuthUnavailableError,
}));

const { AuthGate } = await import("./auth-gate");

const user = (role: SessionUser["role"]): SessionUser => ({
  id: "1",
  email: "a@student.chula.ac.th",
  firstName: "A",
  lastName: "B",
  role,
});

function renderGate(area: "os" | "user") {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <AuthGate area={area}>
        <p>secret page</p>
      </AuthGate>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  replace.mockClear();
  navigation.pathname = "/os/availability";
});
afterEach(() => sessionStorage.clear());

describe("AuthGate", () => {
  it("sends a signed-out visitor to /login and hides the page", async () => {
    result = () => Promise.resolve(null);
    renderGate("os");
    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith("/login?next=%2Fos%2Favailability"),
    );
    expect(screen.queryByText("secret page")).toBeNull();
    expect(sessionStorage.getItem("auth:next")).toBe("/os/availability");
  });

  it("shows the page to a user with the right role", async () => {
    result = () => Promise.resolve(user("OS"));
    renderGate("os");
    expect(await screen.findByText("secret page")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("sends a student away from OS pages to their own home", async () => {
    result = () => Promise.resolve(user("USER_A"));
    renderGate("os");
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/home"));
    expect(screen.queryByText("secret page")).toBeNull();
  });

  it("shows an error, not a redirect, when the API cannot answer", async () => {
    result = () => Promise.reject(new AuthUnavailableError("down"));
    renderGate("user");
    expect(await screen.findByRole("alert")).toHaveTextContent("API");
    expect(replace).not.toHaveBeenCalled();
  });
});
