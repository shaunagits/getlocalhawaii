import { FilterChip } from "@/components/FilterChip";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VendorCard } from "@/components/VendorCard";
import { type OpeningHours, getFreshness, getStatus } from "@/lib/status";
import { clockLabel } from "@/lib/time";
import type { VendorSummary } from "@/lib/types";

// Placeholder until phase 5 wires these pages to Supabase. The shapes match
// the seed migration so swapping the source in is a query, not a rewrite.

const WEEKDAYS: OpeningHours[] = [1, 2, 3, 4, 5].map((dayOfWeek) => ({
  dayOfWeek,
  opens: "07:00",
  closes: "14:00",
}));

const SWAP_MEET: OpeningHours[] = [3, 6, 0].map((dayOfWeek) => ({
  dayOfWeek,
  opens: "15:00",
  closes: "20:00",
}));

function build(now: Date): VendorSummary[] {
  const today = new Date(now.getTime() - 90 * 60_000);
  const lastWeek = new Date(now.getTime() - 7 * 86_400_000);

  const napua = {
    slug: "napua-lei-stand",
    name: "Nāpua Lei Stand",
    categorySlug: "lei",
    description: "Pīkake, tuberose, crown lei to order",
    area: "Kalihi",
    distanceMi: 1.2,
    paymentNotes: "cash + Venmo",
    phone: "(808) 555-0148",
    contactMethod: "call" as const,
    status: getStatus({ hours: WEEKDAYS, verifications: [{ verifiedAt: today, method: "called" }] }, now),
    freshness: getFreshness([{ verifiedAt: today, method: "called" }], now),
  };

  const kalihi = {
    slug: "kalihi-lei-flowers",
    name: "Kalihi Lei & Flowers",
    categorySlug: "lei",
    description: "Ti leaf and ribbon lei, plumeria in the morning",
    reportNote: "Back tomorrow 7a, preorder by text",
    area: "Kalihi",
    distanceMi: 3.4,
    paymentNotes: null,
    phone: "(808) 555-0110",
    contactMethod: "text" as const,
    status: getStatus(
      {
        hours: WEEKDAYS,
        verifications: [{ verifiedAt: today, method: "called" }],
        reports: [{ kind: "sold_out", reportedAt: new Date(now.getTime() - 60 * 60_000) }],
      },
      now,
    ),
    freshness: getFreshness([{ verifiedAt: today, method: "called" }], now),
  };

  const auntyD = {
    slug: "aunty-ds-lei-table",
    name: "Aunty D's Lei Table",
    categorySlug: "lei",
    description: "Outside the swap meet gate, cash only",
    area: "ʻAiea",
    distanceMi: 8.2,
    paymentNotes: null,
    phone: null,
    contactMethod: "call" as const,
    status: getStatus({ hours: SWAP_MEET, verifications: [{ verifiedAt: lastWeek, method: "visited" }] }, now),
    freshness: getFreshness([{ verifiedAt: lastWeek, method: "visited" }], now),
  };

  return [napua, kalihi, auntyD];
}

export const dynamic = "force-dynamic";

export default function Home() {
  const now = new Date();
  const vendors = build(now);
  const openCount = vendors.filter((vendor) => vendor.status.isOpenNow).length;

  return (
    <>
      <SiteHeader
        clock={clockLabel(now)}
        title="I need lei near Kalihi this afternoon."
        subtitle={`${vendors.length} answers · ${openCount} open now`}
      >
        <div className="flex flex-wrap gap-2">
          {["poi", "fish off the boat", "mango", "Saturday market", "maile"].map((label) => (
            <FilterChip key={label} label={label} />
          ))}
        </div>
      </SiteHeader>

      <main className="mx-auto max-w-(--container-column) px-4 pb-4">
        <SectionHeader title="Sorted by open, then distance" />
        <div className="flex flex-col gap-2.5">
          {vendors.map((vendor) => (
            <VendorCard key={vendor.slug} vendor={vendor} />
          ))}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
