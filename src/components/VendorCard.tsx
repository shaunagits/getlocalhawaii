import Link from "next/link";

import { ActionButtons } from "@/components/ActionButtons";
import { StatusChip } from "@/components/StatusChip";
import { VerificationChip } from "@/components/VerificationChip";
import { cn } from "@/lib/cn";
import type { VendorSummary } from "@/lib/types";

/**
 * The result card, used by the home answers, the category sections and the
 * also-nearby list. Status chip first, last-verified opposite it, then the
 * name, then the actions.
 */
export interface VendorCardProps {
  vendor: VendorSummary;
  /** Hide the call and directions buttons, as in the also-nearby list. */
  compact?: boolean;
  className?: string;
}

export function VendorCard({ vendor, compact = false, className }: VendorCardProps) {
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
        "rounded-2xl border border-hairline bg-white p-3.5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <StatusChip status={status} />
        {status.note ? (
          <span className="mono-label font-medium text-coral-dark">{status.note}</span>
        ) : (
          <VerificationChip freshness={freshness} short />
        )}
      </div>

      <h3 className="mt-2.5 text-[18px] leading-tight font-semibold text-kai-800">
        <Link href={`/${vendor.categorySlug}/${vendor.slug}`} className="text-kai-800 hover:text-coral">
          {vendor.name}
        </Link>
      </h3>

      <p className="mt-0.5 text-[13px] leading-[1.45] text-slate">
        {line}
        {line && meta.length > 0 ? <br /> : null}
        {meta.join(" · ")}
      </p>

      {compact ? null : <ActionButtons vendor={vendor} className="mt-3" />}
    </article>
  );
}
