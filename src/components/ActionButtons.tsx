import { cn } from "@/lib/cn";
import { type VendorSummary, dialable, directionsUrl } from "@/lib/types";

/**
 * Call and directions sit at thumb height on every card and page. Buttons are
 * plain links so they work with no JavaScript, which is the point on a phone
 * standing at a lei stand.
 *
 * On the dark hero the primary button flips to coral-light with dark text and
 * the secondaries go translucent cream, per the 940px frames.
 */

const BASE = "rounded-[11px] px-3 py-[13px] text-center text-[14.5px] font-semibold";

export interface ActionButtonsProps {
  vendor: Pick<VendorSummary, "name" | "area" | "phone" | "contactMethod" | "status">;
  /** Show the save affordance. Off on compact cards. */
  showSave?: boolean;
  /** Palette for the dark teal hero. */
  onDark?: boolean;
  /** Stack the rows, as the hero side rail does on desktop. */
  stacked?: boolean;
  /** Paint Directions coral, as the detail frames do. Cards keep it quiet. */
  prominentDirections?: boolean;
  className?: string;
}

export function ActionButtons({
  vendor,
  showSave = false,
  onDark = false,
  stacked = false,
  prominentDirections = false,
  className,
}: ActionButtonsProps) {
  const { phone, contactMethod, status } = vendor;
  const isText = contactMethod === "text";
  // A sold-out stand should be asked to hold one, not called to visit.
  const contactLabel = isText
    ? status.kind === "sold_out"
      ? "Text to preorder"
      : "Text"
    : "Call";

  const primary = cn(BASE, "flex-1", onDark ? "bg-coral-light text-coral-ink" : "bg-kai-800 text-cream");
  const secondary = cn(
    BASE,
    "flex-1",
    onDark ? "bg-cream-panel text-cream" : "bg-kai-tint text-kai-800",
  );
  const icon = cn(
    BASE,
    "w-[50px] shrink-0 md:w-14",
    onDark ? "bg-cream-panel text-cream" : "bg-kai-tint text-kai-800",
  );

  const contact = phone ? (
    <a className={primary} href={`${isText ? "sms" : "tel"}:${dialable(phone)}`}>
      {contactLabel}
      {onDark && !isText ? ` ${phone}` : ""}
    </a>
  ) : null;

  const directionsTone = !phone
    ? primary
    : prominentDirections && !onDark
      ? cn(BASE, "flex-1 bg-coral-light text-coral-ink")
      : secondary;

  const directions = (
    <a
      className={directionsTone}
      href={directionsUrl(vendor.name, vendor.area)}
      target="_blank"
      rel="noreferrer"
    >
      Directions
    </a>
  );

  const save = showSave ? (
    <button className={icon} type="button" aria-label={`Save ${vendor.name}`}>
      <span aria-hidden="true">✦</span>
    </button>
  ) : null;

  if (stacked) {
    return (
      <div className={cn("flex flex-col gap-2.5", className)}>
        {contact ? <div className="flex gap-2.5">{contact}</div> : null}
        <div className="flex gap-2.5">
          {directions}
          {save}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {contact}
      {directions}
      {save}
    </div>
  );
}
