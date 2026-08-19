import Link from "next/link";

import { cn } from "@/lib/cn";

/**
 * Pill used for filters and search suggestions. Renders on the dark header by
 * default, since that is where every mockup puts them.
 */
export interface FilterChipProps {
  label: string;
  href?: string;
  active?: boolean;
  /** Use the light palette for chips on the cream background. */
  onLight?: boolean;
  className?: string;
}

export function FilterChip({ label, href, active = false, onLight = false, className }: FilterChipProps) {
  const tone = active
    ? onLight
      ? "bg-kai-800 text-cream"
      : "bg-coral-light text-[#2a0c05]"
    : onLight
      ? "border border-hairline text-kai-800"
      : "border border-mint-line text-cream-muted";

  const classes = cn(
    "inline-block rounded-full px-3.5 py-2 text-[12px] font-semibold whitespace-nowrap",
    tone,
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn(classes, "hover:opacity-90")}>
        {label}
      </Link>
    );
  }

  return <span className={classes}>{label}</span>;
}
