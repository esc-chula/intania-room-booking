"use client";

import { createContext, useContext } from "react";
import type { SessionUser } from "@/domain/auth";

const SessionContext = createContext<SessionUser | null>(null);

export const SessionProvider = SessionContext.Provider;

/** The signed-in user. Only available below an AuthGate. */
export const useSessionUser = () => useContext(SessionContext);
