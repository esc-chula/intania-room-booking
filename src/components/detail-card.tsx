import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// designs/components/Booking information.svg: a titled card of label/value
// pairs in two columns, split into sections by dividers.
export function DetailCard({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("overflow-hidden rounded-xl border bg-card", className)}
    >
      <h2 className="bg-background px-6 py-4 text-base font-semibold text-primary">
        {title}
      </h2>
      <div className="divide-y">{children}</div>
    </section>
  );
}

export function DetailSection({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4 px-6 py-5">
      {title ? (
        <h3 className="text-sm text-muted-foreground">{title}</h3>
      ) : null}
      <dl className="grid gap-x-8 gap-y-5 md:grid-cols-2">{children}</dl>
    </div>
  );
}

export function DetailField({
  label,
  children,
  wide = false,
}: {
  label: string;
  children?: ReactNode;
  /** Spans both columns. */
  wide?: boolean;
}) {
  const empty = children === undefined || children === null || children === "";
  return (
    <div className={cn("space-y-1", wide && "md:col-span-2")}>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-base">{empty ? "—" : children}</dd>
    </div>
  );
}
