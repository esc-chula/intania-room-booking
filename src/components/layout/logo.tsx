import Image from "next/image";
import { cn } from "@/lib/utils";

// The logo is public/logo.svg, maroon. On a dark background pass `onDark` to turn it white.
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
