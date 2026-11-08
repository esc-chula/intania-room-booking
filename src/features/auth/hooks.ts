"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "./lib/session";

export const SESSION_KEY = ["auth", "me"] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: SESSION_KEY,
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 60_000,
  });
}
