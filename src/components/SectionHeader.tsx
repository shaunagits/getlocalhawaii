import { cn } from "@/lib/cn";

/**
 * The mono rule above every group of results: "OPEN NOW · 9", "WHAT THEY HAVE".
 */
export interface SectionHeaderProps {
  title: string;
  /** Appended after a middot, for example a result count. */
  count?: number | string;
  /** Right-aligned control such as the sort link. */
  action?: React.ReactNode;
  /** Draw the hairline under the row, as on the wider layouts. */
  rule?: boolean;
  className?: string;
}

export function SectionHeader({ title, count, action, rule = false, className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-3 pt-4 pb-2",
        rule && "border-b border-hairline",
        className,
      )}
    >
      <h2 className="mono-label text-slate">
        {title}
        {count === undefined ? null : ` · ${count}`}
      </h2>
      {action}
    </div>
  );
}
