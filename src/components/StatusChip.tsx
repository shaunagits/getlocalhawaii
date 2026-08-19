import { cn } from "@/lib/cn";
import type { MarketStatus, VendorStatus } from "@/lib/status";

/**
 * The one chip that carries the whole product promise, so it is built once
 * and reused. Colour and marker come from the status kind, never from the
 * caller, so the same state cannot be styled two different ways on two pages.
 */

type ChipKind = VendorStatus["kind"] | MarketStatus["kind"];

const MARKER: Partial<Record<ChipKind, string>> = {
  open: "●",
  sold_out: "●",
  opens_later: "◆",
  on_now: "◆",
  starts_later: "◆",
};

const TONE: Record<ChipKind, string> = {
  open: "bg-mint-tint text-green-700",
  on_now: "bg-gold-tint text-gold-dark",
  opens_later: "bg-gold-tint text-gold-dark",
  starts_later: "bg-gold-tint text-gold-dark",
  sold_out: "bg-coral-tint text-coral-dark",
  closed: "bg-kai-tint text-slate",
  unconfirmed: "bg-kai-tint text-slate-light",
};

const TONE_ON_DARK: Record<ChipKind, string> = {
  open: "bg-mint/18 text-mint",
  on_now: "bg-gold/22 text-gold-tint",
  opens_later: "bg-gold/22 text-gold-tint",
  starts_later: "bg-gold/22 text-gold-tint",
  sold_out: "bg-coral-light/20 text-coral-light",
  closed: "bg-cream/12 text-cream-dim",
  unconfirmed: "bg-cream/12 text-cream-dim",
};

export interface StatusChipProps {
  status: VendorStatus | MarketStatus;
  /** Override the default chip text, for example "OPEN NOW · CLOSES 2P". */
  label?: string;
  /** Use the translucent palette for chips sitting on the dark teal header. */
  onDark?: boolean;
  className?: string;
}

export function StatusChip({ status, label, onDark = false, className }: StatusChipProps) {
  const marker = MARKER[status.kind];
  const tone = onDark ? TONE_ON_DARK[status.kind] : TONE[status.kind];

  return (
    <span className={cn("mono-label inline-flex items-center gap-1.5 rounded-md px-2 py-1", tone, className)}>
      {marker ? <span aria-hidden="true">{marker}</span> : null}
      {label ?? status.label}
    </span>
  );
}
