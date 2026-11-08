import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// designs/components/input.svg: Input with a leading search icon.
export function SearchInput({
  className,
  "aria-label": ariaLabel = "ค้นหา",
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input type="search" aria-label={ariaLabel} className="pl-9" {...props} />
    </div>
  );
}
