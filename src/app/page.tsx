import { FilterChip } from "@/components/FilterChip";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VendorCard } from "@/components/VendorCard";
import { getAnswers } from "@/lib/queries";
import { clockLabel } from "@/lib/time";

// Status is computed against the current time, so nothing here can be cached.
export const dynamic = "force-dynamic";

const SUGGESTIONS = ["lei", "poi", "fish off the boat", "mango", "Saturday market", "maile"];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const subject = q?.trim() || "lei";

  const now = new Date();
  const { vendors, stats } = await getAnswers(subject, now);

  return (
    <>
      <SiteHeader clock={clockLabel(now)}>
        <p className="font-display text-[32px] leading-[1.1] tracking-[-0.8px] text-cream">
          I need <span className="text-coral-light">{subject}</span> near{" "}
          <span className="text-coral-light">Kalihi</span> this afternoon.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.filter((suggestion) => suggestion !== subject).map((suggestion) => (
            <FilterChip
              key={suggestion}
              label={suggestion}
              href={`/?q=${encodeURIComponent(suggestion)}`}
            />
          ))}
        </div>
      </SiteHeader>

      <main className="mx-auto max-w-(--container-column) px-4 pb-4">
        <SectionHeader
          title={`${stats.total} ${stats.total === 1 ? "answer" : "answers"} · ${stats.openNow} open now`}
        />
        <p className="mono-label -mt-1 pb-3 text-slate-light">Sorted by open, then distance</p>

        {vendors.length === 0 ? (
          <p className="py-6 text-[14px] text-slate">
            Nothing verified for that yet. Try one of the suggestions above.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.slug} vendor={vendor} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
