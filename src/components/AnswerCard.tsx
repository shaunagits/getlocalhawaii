import Link from "next/link";

import { ActionButtons } from "@/components/ActionButtons";
import { StatusChip } from "@/components/StatusChip";
import { VerificationChip } from "@/components/VerificationChip";
import { cn } from "@/lib/cn";
import type { VendorSummary } from "@/lib/types";

/**
 * The home answer card. Distinct from VendorCard: the chip states only that
 * the stand is open, and the closing time folds down into the description line
 * ("1.2 mi · closes 2p"), which is how both home frames read it. Sits in a
 * single column on a phone and a three-up grid on desktop.
 */
/** Short chip text so the row still fits in a third of the desktop panel. */
const SHORT_LABEL: Partial<Record<VendorSummary["status"]["kind"], string>> = {
  open: "OPEN NOW",
  closed: "CLOSED",
};

export function AnswerCard({ vendor, className }: { vendor: VendorSummary; className?: string }) {
  const { status, freshness } = vendor;

  // Today's report is the most useful line there is, so it takes the slot.
  const line = vendor.reportNote ?? vendor.description;

  // The chip states only what is happening; the timing folds into the line
  // below it, which is how both home frames read ("1.2 mi · closes 2p").
  const when =
    status.kind === "open" && status.closesAt
      ? `closes ${status.closesAt.toLowerCase()}`
      : status.kind === "closed" && status.opensAt
        ? `opens ${status.opensDay ? `${status.opensDay.toLowerCase()} ` : ""}${status.opensAt.toLowerCase()}`
        : null;

  const meta = [
    vendor.distanceMi === null ? null : `${vendor.distanceMi} mi`,
    when,
    vendor.paymentNotes,
  ].filter(Boolean);

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border border-hairline bg-white p-3.5 md:rounded-[14px] md:p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <StatusChip status={status} label={SHORT_LABEL[status.kind]} className="shrink-0" />
        {status.note ? (
          <span className="mono-chip overflow-hidden text-ellipsis font-medium text-slate-light">
            {status.note}
          </span>
        ) : (
          <VerificationChip
            freshness={freshness}
            short
            className="overflow-hidden text-ellipsis"
          />
        )}
      </div>

      <h3 className="mt-2.5 text-[18px] leading-tight font-semibold text-kai-800">
        <Link href={`/${vendor.categorySlug}/${vendor.slug}`} className="text-kai-800 hover:text-coral">
          {vendor.name}
        </Link>
      </h3>

      <p className="mt-0.5 text-[13px] leading-[1.45] text-slate md:leading-[1.5]">
        {line ? `${line.replace(/\.$/, "")}.` : null}
        {line && meta.length > 0 ? <br className="md:hidden" /> : null}
        {line && meta.length > 0 ? <span className="hidden md:inline"> </span> : null}
        {meta.join(" · ")}
      </p>

      <ActionButtons vendor={vendor} className="mt-3.5 md:mt-auto md:pt-3.5" />
    </article>
  );
}
