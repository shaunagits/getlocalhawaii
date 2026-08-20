import Link from "next/link";

import { ActionButtons } from "@/components/ActionButtons";
import { StatusChip } from "@/components/StatusChip";
import { VerificationChip } from "@/components/VerificationChip";
import { cn } from "@/lib/cn";
import type { VendorSummary } from "@/lib/types";

/**
 * The result card for the category sections. Status chip first, last-verified
 * beside it, then the name, then the actions. On desktop the card turns into a
 * row: everything left, the action buttons in a fixed column on the right.
 */
export interface VendorCardProps {
  vendor: VendorSummary;
  className?: string;
}

export function VendorCard({ vendor, className }: VendorCardProps) {
  const { status, freshness } = vendor;

  // Today's report is the most useful line there is, so it takes the slot.
  const line = vendor.reportNote ?? vendor.description;

  const meta = [
    vendor.area,
    vendor.distanceMi === null ? null : `${vendor.distanceMi} mi`,
    vendor.paymentNotes,
  ].filter(Boolean);

  return (
    <article
      className={cn(
        "rounded-2xl border border-hairline bg-white p-3.5 md:rounded-[14px] md:p-[18px]",
        // A sold-out listing is still useful, but it should not shout.
        status.kind === "sold_out" && "md:opacity-70",
        "md:grid md:grid-cols-[minmax(0,1fr)_236px] md:items-center md:gap-6",
        className,
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2 md:justify-start md:gap-2.5">
          <StatusChip status={status} />
          {status.note ? (
            <span className="mono-chip font-medium text-slate-light">{status.note}</span>
          ) : (
            <VerificationChip freshness={freshness} short className="md:hidden" />
          )}
          {status.note ? null : (
            <VerificationChip freshness={freshness} className="hidden md:inline" />
          )}
        </div>

        <h3 className="mt-2.5 text-[18px] leading-tight font-semibold text-kai-800 md:mt-2 md:text-[20px]">
          <Link href={`/${vendor.categorySlug}/${vendor.slug}`} className="text-kai-800 hover:text-coral">
            {vendor.name}
          </Link>
        </h3>

        <p className="mt-0.5 text-[13px] leading-[1.45] text-slate md:text-[13.5px] md:leading-[1.5]">
          {line}
          {line && meta.length > 0 ? <br className="md:hidden" /> : null}
          {line && meta.length > 0 ? <span className="hidden md:inline"> · </span> : null}
          {meta.join(" · ")}
        </p>
      </div>

      <ActionButtons vendor={vendor} className="mt-3 md:mt-0" />
    </article>
  );
}
