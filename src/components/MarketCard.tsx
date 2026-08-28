import Link from "next/link";

import { StatusChip } from "@/components/StatusChip";
import { VerificationChip } from "@/components/VerificationChip";
import { cn } from "@/lib/cn";
import type { MarketOccurrence } from "@/lib/queries";
import { longTime, minutesFromTime, shortTime } from "@/lib/time";

/**
 * One market on one day, for the markets listing.
 *
 * Cards lead with the chip, the same way the vendor cards do, so status reads
 * as a column down the list. See the note in VendorCard for why detail pages
 * do the opposite.
 *
 * Only today gets a live status chip. A market three days out is not "opens
 * 10a" in any useful sense, so later days put the window itself in the chip
 * slot and leave the countdown alone until the day arrives.
 */
export interface MarketCardProps {
  occurrence: MarketOccurrence;
  /** Today's cards get the live chip; the rest get their window. */
  isToday: boolean;
  className?: string;
}

export function MarketCard({ occurrence, isToday, className }: MarketCardProps) {
  const { market, starts, ends, hasEnded } = occurrence;

  const meta = [
    market.locationNotes,
    market.area,
    market.ebtTokens ? "EBT tokens" : null,
  ].filter(Boolean);

  return (
    <article
      className={cn(
        "rounded-2xl border border-hairline bg-white p-3.5 md:rounded-[14px] md:p-[18px]",
        // A finished session stays on the page: "you missed it, and the next
        // one is Thursday" is still an answer to the question being asked.
        hasEnded && "opacity-70",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
        {/* shortTime, not longTime: every other mono chip on the site drops the
            :00, so "7A" here and "7:00a" in the prose line below is correct. */}
        {isToday && hasEnded ? (
          <span className="mono-chip inline-flex items-center rounded-md bg-kai-tint px-2 py-1 text-slate">
            ENDED {shortTime(minutesFromTime(ends))}
          </span>
        ) : isToday ? (
          <StatusChip status={market.status} />
        ) : (
          <span className="mono-chip inline-flex items-center rounded-md bg-kai-tint px-2 py-1 text-slate">
            {shortTime(minutesFromTime(starts))} TO {shortTime(minutesFromTime(ends))}
          </span>
        )}

        <VerificationChip freshness={market.freshness} short />
      </div>

      <h3 className="mt-2.5 text-[18px] leading-tight font-semibold text-kai-800 md:mt-2 md:text-[20px]">
        <Link href={`/farmers-markets/${market.slug}`} className="text-kai-800 hover:text-coral">
          {market.name}
        </Link>
      </h3>

      <p className="mt-0.5 text-[13px] leading-[1.45] text-slate md:text-[13.5px] md:leading-[1.5]">
        {isToday ? `${longTime(starts)} to ${longTime(ends)}` : null}
        {isToday && meta.length > 0 ? " · " : null}
        {meta.join(" · ")}
      </p>

      {market.description ? (
        <p className="mt-1 text-[13px] leading-[1.45] text-slate-light md:text-[13.5px]">
          {market.description}
        </p>
      ) : null}
    </article>
  );
}
