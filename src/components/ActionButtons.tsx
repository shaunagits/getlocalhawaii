import { cn } from "@/lib/cn";
import { type VendorSummary, dialable, directionsUrl } from "@/lib/types";

/**
 * Call and directions sit at thumb height on every card and page. Buttons are
 * plain links so they work with no JavaScript, which is the point on a phone
 * standing at a lei stand.
 */

const PRIMARY =
  "flex-1 rounded-[11px] bg-kai-800 px-3 py-[13px] text-center text-[14.5px] font-semibold text-cream";
const SECONDARY =
  "flex-1 rounded-[11px] bg-kai-tint px-3 py-[13px] text-center text-[14.5px] font-semibold text-kai-800";
const ICON =
  "w-[50px] shrink-0 rounded-[11px] bg-kai-tint py-[13px] text-center text-[15px] font-semibold text-kai-800";

export interface ActionButtonsProps {
  vendor: Pick<VendorSummary, "name" | "area" | "phone" | "contactMethod" | "status">;
  /** Show the save affordance. Off on compact cards. */
  showSave?: boolean;
  className?: string;
}

export function ActionButtons({ vendor, showSave = false, className }: ActionButtonsProps) {
  const { phone, contactMethod, status } = vendor;
  const isText = contactMethod === "text";
  // A sold-out stand should be asked to hold one, not called to visit.
  const contactLabel = isText
    ? status.kind === "sold_out"
      ? "Text to preorder"
      : "Text"
    : "Call";

  return (
    <div className={cn("flex gap-2", className)}>
      {phone ? (
        <a className={PRIMARY} href={`${isText ? "sms" : "tel"}:${dialable(phone)}`}>
          {contactLabel}
        </a>
      ) : null}
      <a
        className={phone ? SECONDARY : PRIMARY}
        href={directionsUrl(vendor.name, vendor.area)}
        target="_blank"
        rel="noreferrer"
      >
        Directions
      </a>
      {showSave ? (
        <button className={ICON} type="button" aria-label={`Save ${vendor.name}`}>
          <span aria-hidden="true">✦</span>
        </button>
      ) : null}
    </div>
  );
}
