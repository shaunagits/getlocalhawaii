import Link from "next/link";

import type { VendorStatus } from "@/lib/status";
import type { VendorSummary } from "@/lib/types";

/**
 * Also-nearby, as the 940px frame draws it: not cards, just rule-separated
 * rows with the status as plain coloured mono text. It sits in the side rail
 * next to the page it belongs to, so a second stack of white cards there would
 * compete with the listing the reader came for.
 */

const STATUS_TONE: Record<VendorStatus["kind"], string> = {
  open: "text-green-700",
  opens_later: "text-gold-dark",
  sold_out: "text-coral-dark",
  closed: "text-slate",
  unconfirmed: "text-slate-light",
};

const MARKER: Partial<Record<VendorStatus["kind"], string>> = {
  open: "●",
  sold_out: "●",
  opens_later: "◆",
};

export function NearbyList({ vendors }: { vendors: VendorSummary[] }) {
  return (
    <ul className="mt-2.5 flex flex-col gap-3">
      {vendors.map((vendor, index) => {
        const { status, freshness } = vendor;
        // "1.6 mi · verified today", or the report when there is one.
        const meta = [
          vendor.distanceMi === null ? null : `${vendor.distanceMi} mi`,
          (status.note ?? freshness.shortLabel).toLowerCase(),
        ]
          .filter(Boolean)
          .join(" · ");

        return (
          <li
            key={vendor.slug}
            className={
              index < vendors.length - 1 ? "border-b border-hairline-soft pb-3" : undefined
            }
          >
            <p className={`mono-chip ${STATUS_TONE[status.kind]}`}>
              {MARKER[status.kind] ? (
                <span aria-hidden="true">{MARKER[status.kind]} </span>
              ) : null}
              {status.label}
            </p>
            <h3 className="mt-1 text-[15px] leading-tight font-semibold text-kai-800">
              <Link
                href={`/${vendor.categorySlug}/${vendor.slug}`}
                className="text-kai-800 hover:text-coral"
              >
                {vendor.name}
              </Link>
            </h3>
            <p className="text-[12.5px] text-slate">{meta}</p>
          </li>
        );
      })}
    </ul>
  );
}
