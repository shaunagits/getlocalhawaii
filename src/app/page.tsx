import Link from "next/link";

import { AnswerCard } from "@/components/AnswerCard";
import { SearchPrompt } from "@/components/SearchPrompt";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TypeLinks } from "@/components/TypeLinks";
import { findLeiType } from "@/content/lei-types";
import { type QueryMatch, getAnswers } from "@/lib/queries";
import { mailto } from "@/lib/site";
import { clockLabel } from "@/lib/time";

// Status is computed against the current time, so nothing here can be cached.
export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; near?: string; when?: string }>;
}) {
  const { q, near, when } = await searchParams;

  const now = new Date();
  const { vendors, stats, match, areas, subjects } = await getAnswers({ q, near, when }, now);

  const areaName = areas.find((area) => area.slug === near)?.name;

  return (
    // The desktop frame is dark all the way down, with the results floating on
    // it as a cream panel. On a phone the panel becomes the page.
    <div className="md:min-h-dvh md:bg-kai-800">
      <SiteHeader clock={clockLabel(now)}>
        <div className="md:mt-[52px]">
          <SearchPrompt
            subject={q?.trim() ?? ""}
            near={near}
            when={when}
            areas={areas}
            subjects={subjects}
          />
        </div>
      </SiteHeader>

      <main className="mx-auto max-w-(--container-column) px-4 md:max-w-(--container-shell) md:px-8">
        <div className="md:mt-[46px] md:rounded-[18px] md:bg-cream md:px-7 md:py-6">
          <div className="flex items-baseline justify-between gap-4 pt-4 pb-2 md:border-b md:border-hairline md:pt-0 md:pb-3.5">
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

          <GuideLink match={match} />

          {vendors.length === 0 ? (
            <EmptyState match={match} areaName={areaName} openOnly={when === "open"} />
          ) : (
            <div className="flex flex-col gap-2.5 md:mt-[18px] md:grid md:grid-cols-3 md:gap-3.5">
              {vendors.map((vendor) => (
                <AnswerCard key={vendor.slug} vendor={vendor} />
              ))}
            </div>
          )}

          <TypeLinks className="mt-8 border-t border-hairline pt-6" />
        </div>
      </main>

      <div className="md:h-11" />
      <SiteFooter />
    </div>
  );
}

/**
 * When the search lands on something we have written about, say so. The
 * results still render here, per the rule that the home page answers in
 * place, but the reader should not have to discover the guide by accident.
 */
function GuideLink({ match }: { match: QueryMatch }) {
  if (match.kind !== "leiType") return null;
  const type = findLeiType(match.slug);
  if (!type) return null;

  return (
    <p className="mt-3 rounded-xl bg-sand px-3.5 py-3 text-[13.5px] leading-[1.5] text-kai-800 md:mt-[18px]">
      We have written about {type.name.toLowerCase()} lei: when it is in season, how long it
      lasts and how far ahead to order.{" "}
      <Link href={`/oahu/lei/${type.slug}`} className="font-semibold">
        Read the {type.name.toLowerCase()} guide →
      </Link>
    </p>
  );
}

function EmptyState({
  match,
  areaName,
  openOnly,
}: {
  match: QueryMatch;
  areaName?: string;
  openOnly: boolean;
}) {
  // An unrecognised subject is a different answer from a recognised one that
  // no listing happens to match, and conflating them is what made the old
  // search look like it was ignoring you.
  const reason =
    match.kind === "none"
      ? `We do not have anything listed for "${match.term}" yet.`
      : areaName
        ? `Nothing listed in ${areaName}${openOnly ? " is open right now" : ""}.`
        : openOnly
          ? "Nothing on that list is open right now."
          : "Nothing matches that yet.";

  return (
    <div className="mt-4 rounded-2xl border border-hairline bg-white p-4">
      <p className="text-[14px] leading-[1.55] text-kai-800">{reason}</p>
      <p className="mt-2 text-[13.5px] leading-[1.55] text-slate">
        This directory covers Oʻahu lei sellers so far. Try a flower below, widen the location,
        or{" "}
        <a href={mailto("Missing listing")} className="font-medium">
          tell us what we are missing
        </a>
        .
      </p>
    </div>
  );
}
