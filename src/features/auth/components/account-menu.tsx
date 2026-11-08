"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { displayName } from "@/domain/auth";
import { SESSION_KEY } from "../hooks";
import { signOut } from "../lib/session";
import { useSessionUser } from "./session-context";

// The account control in the page header (open question 24): name, e-mail and sign out.
export function AccountMenu() {
  const user = useSessionUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    try {
      await signOut();
    } catch {
      // The cookie is still set, so stay signed in rather than bounce back.
      setPending(false);
      return;
    }
    // Drop every cached answer so the next person cannot see this one's data,
    // then record "signed out" so /login does not read a stale user and send
    // them straight back to the home page.
    queryClient.clear();
    queryClient.setQueryData(SESSION_KEY, null);
    router.replace("/login");
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Logo className="size-6" />
          {user ? displayName(user) : "บัญชี"}
          <ChevronDown aria-hidden className="size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 space-y-3">
        {user ? (
          <div className="text-sm">
            <p className="font-medium">{displayName(user)}</p>
            <p className="break-all text-muted-foreground">{user.email}</p>
          </div>
        ) : null}
        <Button
          variant="outline"
          className="w-full"
          disabled={pending}
          onClick={() => void handleSignOut()}
        >
          ออกจากระบบ
        </Button>
      </PopoverContent>
    </Popover>
  );
}
