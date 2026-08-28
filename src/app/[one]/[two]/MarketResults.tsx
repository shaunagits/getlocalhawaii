import Link from "next/link";
import { notFound } from "next/navigation";

import { Explainer } from "@/components/Explainer";
import { JsonLd } from "@/components/JsonLd";
import { MarketCard } from "@/components/MarketCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { MARKETS_CATEGORY, type MarketDayGroup, loadMarketListing } from "@/lib/queries";
import { breadcrumbSchema, marketListSchema } from "@/lib/schema";
import { clockLabel, longTime } from "@/lib/time";

/**
 * The farmers markets listing, and the markets calendar: one page, not two.
 *
 * Grouped by day rather than by open or closed. Thirteen of the seventeen
 * markets are City People's Open Market stops that run for an hour a week, so
 * an open-now grouping would render an empty page for most of the week. The
 * question is which day to turn up on, and today is simply the first group.
 */
export interface MarketResultsProps {
  islandSlug: string;
}

export async function MarketResults({ islandSlug }: MarketResultsProps) {
  const { now, listing } = await loadMarketListing(islandSlug);
  if (!listing) notFound();

  // Built from the island in the URL, not hardcoded: the heading already says
  // which island this is, so the links underneath it had better agree.
  const base = `/${islandSlug}/${MARKETS_CATEGORY}`;

  const today = listing.week[0];
  const rest = listing.week.slice(1).filter((day) => day.occurrences.length > 0);

  const stillToCome = today.occurrences.filter((entry) => !entry.hasEnded);
  const nextUp =
    stillToCome.length === 0 && listing.nextDay && !listing.nextDay.isToday
      ? listing.nextDay
      : null;

  const stats = [
    `${listing.stats.total} markets`,
    listing.stats.onNow > 0 ? `${listing.stats.onNow} on now` : null,
    `${stillToCome.length} left today`,
  ]
    .filter(Boolean)
    .join(" · ");

  const operators = new Map<string, number>();
  for (const market of listing.markets) {
    const name = market.operator ?? "Independent";
    operators.set(name, (operators.get(name) ?? 0) + 1);
  }

  return (
    <>
      <JsonLd
        data={marketListSchema(listing.markets, {
          name: `Farmers markets on ${listing.islandName}`,
          path: base,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: `Farmers markets on ${listing.islandName}`, path: base },
        ])}
      />

      <SiteHeader clock={clockLabel(now)} back={{ href: "/", label: "Back" }}>
        <div>
          <h1 className="font-display text-[28px] leading-[1.1] tracking-[-0.6px] text-cream md:text-[42px] md:leading-[1.05] md:tracking-[-1.2px]">
            Farmers markets on {listing.islandName}
          </h1>
          <p className="mt-1.5 text-[13px] leading-[1.45] text-cream-dim md:max-w-[58ch] md:text-[14.5px]">
            Every market runs to a fixed weekly schedule, so this page is the week rather than a
            list. Most City markets are open for under an hour, which is why the times matter more
            than the addresses.
          </p>
          <p className="mono-label mt-2.5 text-mint">
            {stats}
            <span className="ml-3 text-mint/70">{clockLabel(now)}</span>
          </p>
        </div>
      </SiteHeader>

      <div className="mx-auto max-w-(--container-column) px-4 pb-4 md:grid md:max-w-(--container-shell) md:grid-cols-[minmax(0,1fr)_300px] md:gap-7 md:px-8 md:pt-6 md:pb-9">
        <main>
          <Day group={today} />

          {/* The honest empty state. A one-hour market is closed for about 99%
              of the week, so "nothing on" has to answer the next question
              rather than just report the absence. */}
          {nextUp ? (
            <div className="mt-3 rounded-2xl border border-hairline bg-white p-4 md:rounded-[14px]">
              <p className="mono-label text-gold-dark">
                {today.occurrences.length === 0 ? "Nothing on today" : "Everything today has ended"}
              </p>
              <p className="mt-2 text-[14px] leading-[1.55] text-slate">
                Next up is{" "}
                <Link
                  href={`/farmers-markets/${nextUp.occurrences[0].market.slug}`}
                  className="font-medium text-kai-800 hover:text-coral"
                >
                  {nextUp.occurrences[0].market.name}
                </Link>{" "}
                {/* "Tomorrow" is an adverb and "Saturday" is a noun, so only
                    one of the two takes a preposition. */}
                {nextUp.label === "Tomorrow" ? "tomorrow" : `on ${nextUp.label}`}, opening at{" "}
                {longTime(nextUp.occurrences[0].starts)}.
              </p>
            </div>
          ) : null}

          {rest.map((day) => (
            <Day key={day.date} group={day} />
          ))}
        </main>

        <aside className="md:border-l md:border-hairline md:pl-6">
          <Explainer variant="markets" />

          {/* The City's shopping rules are the same at all thirteen sites, so
              they live here once instead of padding thirteen market pages. */}
          <section className="mt-8 md:mt-6">
            <SectionHeader title="How the City markets work" rule />
            <p className="mt-2 text-[13.5px] leading-[1.6] text-slate">
              The People&rsquo;s Open Markets have run since 1973 to move farmers&rsquo; surplus and
              off-grade produce cheaply. City staff price-check supermarkets weekly and set a
              recommended price, usually around 35% under retail; vendors may sell below it but not
              above. Every site accepts EBT, and a few also hand out tokens.
            </p>
            <p className="mt-3 text-[13.5px] leading-[1.6] text-slate">
              Each stop opens on an air horn and lasts 45 to 60 minutes, so arriving late means
              arriving after. Bring small bills, bring your own bags, park in marked stalls, and
              leave pets at home. All markets close on City holidays.
            </p>
            <a
              className="mt-3 inline-block text-[13.5px] font-medium text-coral"
              href="https://www.honolulu.gov/dpr/peoples-open-markets/"
              target="_blank"
              rel="noreferrer"
            >
              City schedule page
            </a>
          </section>

          <section className="mt-8 md:mt-6">
            <SectionHeader title="Who runs them" rule />
            <ul className="mt-1">
              {[...operators.entries()]
                .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
                .map(([name, count]) => (
                  <li
                    key={name}
                    className="flex items-baseline justify-between gap-3 border-b border-hairline-soft py-2.5 text-[13.5px] text-kai-800"
                  >
                    <span>{name}</span>
                    <span className="font-mono text-[12px] text-slate">{count}</span>
                  </li>
                ))}
            </ul>
          </section>
        </aside>
      </div>

      <SiteFooter />
    </>
  );
}

function Day({ group }: { group: MarketDayGroup }) {
  if (group.occurrences.length === 0 && !group.isToday) return null;

  return (
    <section>
      <SectionHeader
        title={group.label}
        count={group.occurrences.length > 0 ? group.occurrences.length : undefined}
        action={<span className="mono-label text-slate-light">{group.dateLabel}</span>}
        rule
      />

      {group.occurrences.length === 0 ? null : (
        <div className="flex flex-col gap-2.5 md:mt-4 md:gap-3">
          {group.occurrences.map((occurrence) => (
            <MarketCard
              key={`${occurrence.market.slug}-${occurrence.starts}`}
              occurrence={occurrence}
              isToday={group.isToday}
            />
          ))}
        </div>
      )}
    </section>
  );
}
