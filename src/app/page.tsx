import { AnswerCard } from "@/components/AnswerCard";
import { FilterChip } from "@/components/FilterChip";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAnswers } from "@/lib/queries";
import { clockLabel } from "@/lib/time";

// Status is computed against the current time, so nothing here can be cached.
export const dynamic = "force-dynamic";

const SUGGESTIONS = ["lei", "poi", "fish off the boat", "mango", "Saturday market", "maile"];

/** The query words carry a coral underline in both home frames. */
function Term({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-b-2 border-coral-light text-coral-light md:border-b-[3px]">
      {children}
    </span>
  );
}

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
    // The desktop frame is dark all the way down, with the results floating on
    // it as a cream panel. On a phone the panel becomes the page.
    <div className="md:min-h-dvh md:bg-kai-800">
      <SiteHeader clock={clockLabel(now)}>
        <div className="md:mx-auto md:mt-[52px] md:max-w-[760px] md:text-center">
          <p className="font-display text-[32px] leading-[1.1] tracking-[-0.8px] text-cream md:text-[52px] md:leading-[1.3] md:tracking-[-1.4px] md:text-balance">
            I need <Term>{subject}</Term> near <Term>Kalihi</Term>{" "}
            <Term>this afternoon</Term>.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 md:mt-[26px] md:justify-center md:gap-2.5">
            {SUGGESTIONS.filter((suggestion) => suggestion !== subject).map((suggestion) => (
              <FilterChip
                key={suggestion}
                label={suggestion}
                href={`/?q=${encodeURIComponent(suggestion)}`}
              />
            ))}
          </div>
        </div>
      </SiteHeader>

      <main className="mx-auto max-w-(--container-column) px-4 md:max-w-(--container-shell) md:px-8">
        <div className="md:mt-[46px] md:rounded-[18px] md:bg-cream md:px-7 md:py-6">
          <div className="flex items-baseline justify-between gap-4 pt-4 pb-2 md:pt-0 md:border-b md:border-hairline md:pb-3.5">
            <h2 className="text-[13.5px] font-semibold text-kai-800 md:text-[15px]">
              {stats.total} {stats.total === 1 ? "answer" : "answers"} · {stats.openNow} open now
            </h2>
            <p className="mono-label hidden text-slate-light md:block md:text-[12px]">
              Sorted by open, then distance
            </p>
          </div>
          <p className="mono-label pb-3 text-slate-light md:hidden">
            Sorted by open, then distance
          </p>

          {vendors.length === 0 ? (
            <p className="py-6 text-[14px] text-slate">
              Nothing verified for that yet. Try one of the suggestions above.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5 md:mt-[18px] md:grid md:grid-cols-3 md:gap-3.5">
              {vendors.map((vendor) => (
                <AnswerCard key={vendor.slug} vendor={vendor} />
              ))}
            </div>
          )}
        </div>
      </main>

      <div className="md:h-11" />
      <SiteFooter />
    </div>
  );
}
