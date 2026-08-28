import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StatusChip } from "@/components/StatusChip";
import { VerificationChip } from "@/components/VerificationChip";
import { VerificationPanel } from "@/components/VerificationLog";
import { type MarketVendor, type Popup, loadMarket, productSentence } from "@/lib/queries";
import { breadcrumbSchema, marketEventSchema } from "@/lib/schema";
import { nextMarketDates } from "@/lib/status";
import {
  clockLabel,
  dayName,
  hawaiiClock,
  hawaiiInstant,
  icsStamp,
  longDayName,
  longTime,
  monthAbbr,
  shortTime,
} from "@/lib/time";
import { mapUrl } from "@/lib/types";

const BUTTON = "rounded-[11px] px-3 py-[13px] text-center text-[14.5px] font-semibold md:py-[14px]";

const LISTING = "/oahu/farmers-markets";

export async function MarketDetail({ slug }: { slug: string }) {
  const { now, market } = await loadMarket(slug);
  if (!market) notFound();

  const dates = nextMarketDates(market.sessions, now, 4);
  const next = dates[0];
  const path = `/farmers-markets/${slug}`;

  const here = market.vendors.filter((vendor) => vendor.isHereToday);
  const meta = [
    next ? `${dayName(next.dayOfWeek)} ${longTime(next.starts)} to ${longTime(next.ends)}` : null,
    market.area,
    market.distanceMi === null ? null : `${market.distanceMi} mi`,
  ]
    .filter(Boolean)
    .join(" · ");

  // The weekly shape, spelled out. For a one-hour market this is the whole
  // point of the page, so it says the day in full rather than in a chip.
  const schedule = [...market.sessions]
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
    .map(
      (session) =>
        `${longDayName(session.dayOfWeek)} ${longTime(session.starts)} to ${longTime(session.ends)}`,
    )
    .join(", ");

  // Rendered twice: once in the dark hero on desktop, once on the cream shelf
  // under the header on a phone. The secondaries need opposite palettes.
  const actions = (onDark: boolean) => (
    <>
      <a
        className={`${BUTTON} block bg-coral-light text-coral-ink`}
        href={mapUrl(market)}
        target="_blank"
        rel="noreferrer"
      >
        Directions
      </a>
      <div className="flex gap-2.5">
        {market.instagram ? (
          <a
            className={`${BUTTON} flex-1 ${onDark ? "bg-cream-panel text-cream" : "bg-kai-tint text-kai-800"}`}
            href={`https://instagram.com/${market.instagram}`}
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        ) : null}
        {next ? (
          <a
            className={`${BUTTON} flex-1 ${onDark ? "bg-cream-panel text-cream" : "bg-kai-tint text-kai-800"}`}
            href={calendarUrl(market.name, market.area, next.date, next.starts, next.ends)}
            target="_blank"
            rel="noreferrer"
          >
            Add to calendar
          </a>
        ) : null}
      </div>
    </>
  );

  return (
    <>
      <JsonLd data={marketEventSchema(market, path)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Farmers markets", path: LISTING },
          { name: market.name, path },
        ])}
      />

      <SiteHeader
        clock={clockLabel(now)}
        back={{ href: LISTING, label: "Farmers markets" }}
        actions={
          <div className="flex gap-3.5 text-[13px] font-medium text-cream-muted">
            <span>Share</span>
            <span>✦ Save</span>
          </div>
        }
      >
        <div className="md:grid md:grid-cols-[minmax(0,1fr)_330px] md:items-end md:gap-[34px]">
          <div>
            {/* Name leads on detail pages; the countdown chip follows it. See
                the note in VendorDetail for why cards do the opposite. */}
            <h1 className="font-display text-[30px] leading-[1.1] tracking-[-0.7px] text-cream md:text-[42px] md:leading-[1.05] md:tracking-[-1.2px]">
              {market.name}
            </h1>

            <p className="mt-1.5 text-[13.5px] leading-[1.5] text-cream-dim md:text-[15px]">
              {meta}
            </p>

            {market.description ? (
              <p className="mt-2 text-[13.5px] leading-[1.5] text-cream-dim md:max-w-[58ch] md:text-[15px] md:leading-[1.55]">
                {market.description}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <StatusChip status={market.status} onDark />
              <VerificationChip freshness={market.freshness} onDark />
            </div>
          </div>

          <div className="mt-4 hidden flex-col gap-2.5 md:flex">{actions(true)}</div>
        </div>
      </SiteHeader>

      <div className="mx-auto flex max-w-(--container-column) flex-col gap-2.5 px-4 pt-3.5 md:hidden">
        {actions(false)}
      </div>

      <div className="mx-auto max-w-(--container-column) px-4 md:grid md:max-w-(--container-shell) md:grid-cols-[minmax(0,1fr)_320px] md:gap-[30px] md:px-8 md:pt-7 md:pb-9">
        <main>
          <section className="mt-7 md:mt-0">
            <SectionHeader title="This week" rule />
            <p className="mt-3 text-[14.5px] leading-[1.55] text-kai-800 md:mt-2.5">{schedule}</p>
            <p className="mt-2 text-[13.5px] leading-[1.6] text-slate">
              {market.operator ? `Run by ${market.operator}. ` : null}
              {market.ebtTokens === true
                ? "EBT tokens are handed out at this site."
                : market.ebtTokens === false
                  ? "EBT is accepted; this site does not hand out tokens."
                  : null}
            </p>
          </section>

          {/* Nobody has published a stall list for the City markets, so this
              section only appears where a roster actually exists. An empty
              "0 of 0 vendors" would imply we looked and found nobody there. */}
          {market.vendors.length > 0 ? (
            <section className="mt-7">
              <SectionHeader
                title="Here today"
                count={`${here.length} of ${market.vendors.length} vendors`}
                rule
              />
              <div className="mt-3 flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-3">
                {market.vendors.map((vendor) => (
                  <MarketVendorRow key={vendor.slug} vendor={vendor} />
                ))}
              </div>
            </section>
          ) : null}

          {market.popups.length > 0 ? (
            <section className="mt-7">
              <SectionHeader title="Pop-ups this week" rule />
              <div className="mt-3 flex flex-col gap-3 md:mt-1 md:gap-0">
                {market.popups.map((popup) => (
                  <PopupRow key={`${popup.name}-${popup.startsAt.toISOString()}`} popup={popup} />
                ))}
              </div>
            </section>
          ) : null}
        </main>

        <aside className="md:border-l md:border-hairline md:pl-[26px]">
          <section className="mt-7 md:mt-0">
            <SectionHeader title="Next dates" rule />
            <ul className="md:mt-2.5 md:overflow-hidden md:rounded-[14px] md:border md:border-hairline md:bg-white">
              {dates.map((date) => (
                <li
                  key={`${date.date}-${date.starts}`}
                  className={`flex items-baseline justify-between gap-4 border-b border-hairline-soft py-2.5 text-[13.5px] md:border-b-0 md:border-t md:px-4 md:py-3 md:first:border-t-0 ${
                    date.isToday
                      ? "font-semibold text-kai-800 md:bg-gold-tint md:text-gold-ink"
                      : "text-slate"
                  }`}
                >
                  <span>{date.label}</span>
                  <span className="md:font-mono md:text-[13px]">
                    {longTime(date.starts)} to {longTime(date.ends)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-7 md:mt-5">
            <VerificationPanel entries={market.log} subject={market.name} />
          </div>

          {market.gettingThere || market.locationNotes ? (
            <section className="mt-7 md:mt-6">
              <SectionHeader title="Getting there" rule />
              {market.locationNotes ? (
                <p className="mt-3 text-[14px] leading-[1.55] text-kai-800 md:mt-2 md:text-[13.5px] md:leading-[1.65]">
                  {market.locationNotes}
                </p>
              ) : null}
              {market.gettingThere ? (
                <p className="mt-2 text-[13.5px] leading-[1.6] text-slate md:text-[13px]">
                  {market.gettingThere}
                </p>
              ) : null}
            </section>
          ) : null}

          {market.lat !== null && market.lng !== null ? (
            <p className="mt-3 text-[13px] leading-[1.6] text-slate-light">
              The Directions button opens the operator&rsquo;s own map pin rather than a search for
              the name, so it lands in the right corner of the park.
            </p>
          ) : null}

          <section className="mt-7 md:mt-6">
            <SectionHeader title="Where this comes from" rule />
            {/* Only claim a source where there is one. The seeded placeholder
                has a log with visits in it, so asserting "we have not called
                or visited" on every market page would contradict the panel
                directly above this one. */}
            {market.sourceUrl ? (
              <>
                <p className="mt-3 text-[13.5px] leading-[1.6] text-slate md:mt-2">
                  Read from {market.operator ?? "the operator"}&rsquo;s published schedule. The
                  times are theirs, not ours.
                </p>
                <a
                  className="mt-2 inline-block text-[13.5px] font-medium text-coral"
                  href={market.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Operator schedule
                </a>
              </>
            ) : (
              <p className="mt-3 text-[13.5px] leading-[1.6] text-slate md:mt-2">
                This listing carries no source yet, so it is kept out of search and the sitemap.
              </p>
            )}
            <p className="mt-4 text-[13px] leading-[1.6] text-slate-light">
              <Link href={LISTING} className="font-medium text-kai-800 hover:text-coral">
                All {market.islandName} farmers markets
              </Link>
            </p>
          </section>
        </aside>
      </div>

      <SiteFooter />
    </>
  );
}

function MarketVendorRow({ vendor }: { vendor: MarketVendor }) {
  const details = [productSentence(vendor.products), vendor.stall, vendor.paymentNotes]
    .filter(Boolean)
    .join(" · ");

  // A product with a season end date earns its own chip.
  const inSeason = vendor.products.find((product) => product.inSeasonUntil !== null);

  return (
    <article
      className={`rounded-2xl border border-hairline bg-white p-3.5 md:rounded-[14px] md:p-4 ${
        // Not here today, so it should not compete with the stalls that are.
        vendor.isHereToday ? "" : "md:opacity-70"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="min-w-0 text-[16px] leading-tight font-semibold text-kai-800 md:text-[17px]">
          {vendor.name}
        </h3>
        {vendor.isHereToday && vendor.confirmedAt ? (
          <span className="mono-chip font-medium text-green-700">
            CONFIRMED {shortTime(hawaiiClock(vendor.confirmedAt).minutes)}
          </span>
        ) : (
          <span className="mono-chip font-medium text-slate-light">NOT HERE TODAY</span>
        )}
      </div>

      <p className="mt-1 text-[13px] leading-[1.45] text-slate md:text-[13.5px] md:leading-[1.5]">
        {vendor.isHereToday ? details : `Usually ${vendor.usualDays ?? "not scheduled"} · ${details}`}
      </p>

      {inSeason && vendor.isHereToday ? (
        <span className="mono-chip mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-gold-tint px-2 py-1 text-gold-dark">
          <span aria-hidden="true">◆</span>
          {inSeason.label.toUpperCase()} IN SEASON · THRU{" "}
          {monthAbbr(Number(inSeason.inSeasonUntil!.slice(5, 7)))}
        </span>
      ) : null}
    </article>
  );
}

function PopupRow({ popup }: { popup: Popup }) {
  const start = hawaiiClock(popup.startsAt);
  // A pop-up seeded at midnight has no confirmed time yet.
  const isTimeKnown = !(popup.status === "unconfirmed" && start.minutes === 0);
  const end = popup.endsAt ? hawaiiClock(popup.endsAt) : null;

  const when = isTimeKnown
    ? `${dayName(start.dayOfWeek).toUpperCase()} ${shortTime(start.minutes)}${
        end ? ` TO ${shortTime(end.minutes)}` : ""
      }`
    : `${dayName(start.dayOfWeek).toUpperCase()} TBC`;

  return (
    <article className="rounded-2xl border border-hairline bg-white p-3.5 md:grid md:grid-cols-[110px_minmax(0,1fr)_150px] md:items-center md:gap-4 md:rounded-none md:border-0 md:border-b md:border-hairline-soft md:bg-transparent md:px-0 md:py-3.5">
      <div className="flex items-baseline justify-between gap-2 md:contents">
        <span
          className={`mono-chip md:text-[14px] ${
            isTimeKnown ? "text-kai-800" : "text-gold-dark"
          }`}
        >
          {when}
        </span>
        <span className="md:order-last">
          {popup.status === "verified" ? (
            <VerificationChip freshness={popup.freshness} className="md:text-[11.5px]" />
          ) : (
            <span className="mono-chip font-medium text-gold-dark md:text-[11.5px]">
              UNCONFIRMED
            </span>
          )}
        </span>
      </div>

      <div className="mt-1.5 md:mt-0">
        <h3 className="text-[16px] leading-tight font-semibold text-kai-800">{popup.name}</h3>
        {popup.locationNote ? (
          <p className="mt-0.5 text-[13px] leading-[1.45] text-slate">{popup.locationNote}</p>
        ) : null}
      </div>
    </article>
  );
}

function calendarUrl(
  name: string,
  area: string,
  date: string,
  starts: string,
  ends: string,
): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: name,
    location: `${name}, ${area}, Hawaii`,
    dates: `${icsStamp(hawaiiInstant(date, starts))}/${icsStamp(hawaiiInstant(date, ends))}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
