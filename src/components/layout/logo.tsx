import Image from "next/image";
import { cn } from "@/lib/utils";

// Note add varience later
export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Image
      src="/logo.svg"
      alt="กวศ."
      width={65}
      height={65}
      unoptimized
      priority
      className={cn(
        "h-auto w-auto",
        onDark && "brightness-0 invert",
        className,
      )}
    />
  );
}
