"use client";

import { useRef, useState } from "react";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { displayToIso, isoToDisplay } from "../lib/dates";

type DateFieldProps = {
  label: string;
  /** ISO date, or "" for none. */
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
};

// designs/ Mouthly.svg: a text field showing วว/ดด/ปปปป with a calendar icon.
// People can type a date or open the browser's date picker from the icon.
export function DateField({
  label,
  value,
  onChange,
  min,
  max,
}: DateFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const picker = useRef<HTMLInputElement>(null);

  function handleType(text: string) {
    setDraft(text);
    const iso = displayToIso(text);
    if (iso) {
      onChange(iso);
      setDraft(null);
    } else if (text === "") {
      onChange("");
      setDraft(null);
    }
  }

  return (
    <label className="block space-y-2 text-sm leading-6 font-medium">
      {label}
      <span className="relative block">
        <Input
          inputMode="numeric"
          maxLength={10}
          placeholder="วว/ดด/ปปปป"
          value={draft ?? isoToDisplay(value)}
          onChange={(event) => handleType(event.target.value)}
          onBlur={() => setDraft(null)}
          className="h-11 rounded-[10px] px-3 pr-8 text-sm font-normal"
        />
        <button
          type="button"
          aria-label={`เลือก${label}`}
          onClick={() => picker.current?.showPicker()}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded text-muted-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Calendar aria-hidden className="size-4" />
        </button>
        {/* Only used to open the browser's picker. */}
        <input
          ref={picker}
          type="date"
          tabIndex={-1}
          aria-hidden
          value={value}
          min={min}
          max={max}
          onChange={(event) => onChange(event.target.value)}
          className="pointer-events-none absolute right-0 bottom-0 size-px opacity-0"
        />
      </span>
    </label>
  );
}
