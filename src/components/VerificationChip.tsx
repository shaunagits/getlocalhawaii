import { cn } from "@/lib/cn";
import type { Freshness } from "@/lib/status";

/**
 * Sits opposite the status chip in the same spot on every card and page, so
 * the answer to "when did anyone last check this?" is always in one place.
 */
export interface VerificationChipProps {
  freshness: Freshness;
  /** Drop the time of day, for narrow cards: "VERIFIED TODAY". */
  short?: boolean;
  /** Mint on the dark hero, where slate would disappear. */
  onDark?: boolean;
  className?: string;
}

export function VerificationChip({
  freshness,
  short = false,
  onDark = false,
  className,
}: VerificationChipProps) {
  const tone = onDark
    ? "text-mint"
    : freshness.kind === "today"
      ? "text-green-700"
      : "text-slate-light";

  return (
    <span className={cn("mono-label font-medium", onDark && "text-[11.5px]", tone, className)}>
      {short ? freshness.shortLabel : freshness.label}
    </span>
  );
}
