import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StatusChip } from "@/components/StatusChip";
import { VerificationChip } from "@/components/VerificationChip";
import { VerificationPanel } from "@/components/VerificationLog";
import { type MarketVendor, type Popup, getMarketDetail, productSentence } from "@/lib/queries";
import { nextMarketDates } from "@/lib/status";
import {
  clockLabel,
  dayName,
  hawaiiClock,
  hawaiiInstant,
  icsStamp,
  longTime,
  monthAbbr,
  shortTime,
} from "@/lib/time";
import { directionsUrl } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * The only market on the site is still the seeded placeholder from the design
 * mockups, so it stays out of the index until it carries real vendor data.
 * It is also excluded from the sitemap.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

const BUTTON = "rounded-[11px] px-3 py-[13px] text-center text-[14.5px] font-semibold md:py-[14px]";

export default async function MarketPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const now = new Date();

  const market = await getMarketDetail(slug, now);
  if (!market) notFound();

  const dates = nextMarketDates(market.sessions, now, 3);
  const next = dates[0];

  const here = market.vendors.filter((vendor) => vendor.isHereToday);
  const meta = [
    next ? `${dayName(next.dayOfWeek)} ${longTime(next.starts)} to ${longTime(next.ends)}` : null,
    market.area,
    market.distanceMi === null ? null : `${market.distanceMi} mi`,
  ]
    .filter(Boolean)
    .join(" · ");

  // Rendered twice: once in the dark hero on desktop, once on the cream shelf
  // under the header on a phone. The secondaries need opposite palettes.
  const actions = (onDark: boolean) => (
    <>
      <a
        className={`${BUTTON} block bg-coral-light text-coral-ink`}
        href={directionsUrl(market.name, market.area)}
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
      <SiteHeader
        clock={clockLabel(now)}
        back={{ href: "/", label: "Markets" }}
        actions={
          <div className="flex gap-3.5 text-[13px] font-medium text-cream-muted">
            <span>Share</span>
            <span>✦ Save</span>
          </div>
        }
      >
        <div className="md:grid md:grid-cols-[minmax(0,1fr)_330px] md:items-end md:gap-[34px]">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusChip status={market.status} onDark />
              <VerificationChip freshness={market.freshness} onDark />
            </div>

            <h1 className="mt-3 font-display text-[30px] leading-[1.1] tracking-[-0.7px] text-cream md:text-[42px] md:leading-[1.05] md:tracking-[-1.2px]">
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

          {market.gettingThere ? (
            <section className="mt-7 md:mt-6">
              <SectionHeader title="Getting there" rule />
              <p className="mt-3 text-[14px] leading-[1.55] text-kai-800 md:mt-2 md:text-[13.5px] md:leading-[1.65]">
                {market.gettingThere}
              </p>
              {market.locationNotes ? (
                <p className="mt-2 text-[13.5px] text-slate md:text-[13px]">
                  {market.locationNotes}
                </p>
              ) : null}
            </section>
          ) : null}
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
