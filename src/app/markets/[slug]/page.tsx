import { notFound } from "next/navigation";

import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StatusChip } from "@/components/StatusChip";
import { VerificationChip } from "@/components/VerificationChip";
import { VerificationLog } from "@/components/VerificationLog";
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

  return (
    <>
      <SiteHeader clock={clockLabel(now)} back={{ href: "/", label: "Markets" }} />

      <main className="mx-auto max-w-(--container-column) px-4">
        <section className="pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <StatusChip status={market.status} />
            <VerificationChip freshness={market.freshness} />
          </div>

          <h1 className="mt-3 font-display text-[32px] leading-[1.08] tracking-[-0.8px] text-kai-800">
            {market.name}
          </h1>
          <p className="mt-1.5 text-[13.5px] text-slate">{meta}</p>

          {market.description ? (
            <p className="mt-3 text-[15px] leading-[1.5] text-kai-800">{market.description}</p>
          ) : null}

          <div className="mt-4 flex gap-2">
            <a
              className="flex-1 rounded-[11px] bg-kai-800 px-3 py-[13px] text-center text-[14.5px] font-semibold text-cream"
              href={directionsUrl(market.name, market.area)}
              target="_blank"
              rel="noreferrer"
            >
              Directions
            </a>
            {market.instagram ? (
              <a
                className="flex-1 rounded-[11px] bg-kai-tint px-3 py-[13px] text-center text-[14.5px] font-semibold text-kai-800"
                href={`https://instagram.com/${market.instagram}`}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            ) : null}
            {next ? (
              <a
                className="flex-1 rounded-[11px] bg-kai-tint px-3 py-[13px] text-center text-[14.5px] font-semibold text-kai-800"
                href={calendarUrl(market.name, market.area, next.date, next.starts, next.ends)}
                target="_blank"
                rel="noreferrer"
              >
                Add to calendar
              </a>
            ) : null}
          </div>
        </section>

        <section className="mt-7">
          <SectionHeader
            title="Here today"
            count={`${here.length} of ${market.vendors.length} vendors`}
            rule
          />
          <div className="mt-3 flex flex-col gap-3">
            {market.vendors.map((vendor) => (
              <MarketVendorRow key={vendor.slug} vendor={vendor} />
            ))}
          </div>
        </section>

        {market.popups.length > 0 ? (
          <section className="mt-7">
            <SectionHeader title="Pop-ups this week" rule />
            <div className="mt-3 flex flex-col gap-3">
              {market.popups.map((popup) => (
                <PopupRow key={`${popup.name}-${popup.startsAt.toISOString()}`} popup={popup} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-7">
          <SectionHeader title="Next dates" rule />
          <ul>
            {dates.map((date) => (
              <li
                key={`${date.date}-${date.starts}`}
                className={`flex items-baseline justify-between gap-4 border-b border-hairline-soft py-2.5 text-[13.5px] ${
                  date.isToday ? "font-semibold text-kai-800" : "text-slate"
                }`}
              >
                <span>{date.label}</span>
                <span>
                  {longTime(date.starts)} to {longTime(date.ends)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-7">
          <SectionHeader title="Verification log" rule />
          <div className="mt-3">
            <VerificationLog entries={market.log} />
          </div>
          <a
            className="mt-3 inline-block text-[13.5px] font-medium"
            href={`mailto:aloha@getlocalhawaii.org?subject=${encodeURIComponent(
              `Something changed: ${market.name}`,
            )}`}
          >
            Something changed? Tell us →
          </a>
        </section>

        {market.gettingThere ? (
          <section className="mt-7">
            <SectionHeader title="Getting there" rule />
            <p className="mt-3 text-[14px] leading-[1.55] text-kai-800">{market.gettingThere}</p>
            {market.locationNotes ? (
              <p className="mt-2 text-[13.5px] text-slate">{market.locationNotes}</p>
            ) : null}
          </section>
        ) : null}
      </main>

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
    <article className="rounded-2xl border border-hairline bg-white p-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-[16px] leading-tight font-semibold text-kai-800">{vendor.name}</h3>
        {vendor.isHereToday && vendor.confirmedAt ? (
          <span className="mono-label font-medium text-green-700">
            CONFIRMED {shortTime(hawaiiClock(vendor.confirmedAt).minutes)}
          </span>
        ) : (
          <span className="mono-label font-medium text-slate-light">NOT HERE TODAY</span>
        )}
      </div>

      <p className="mt-1 text-[13px] leading-[1.45] text-slate">
        {vendor.isHereToday ? details : `Usually ${vendor.usualDays ?? "not scheduled"} · ${details}`}
      </p>

      {inSeason && vendor.isHereToday ? (
        <span className="mono-label mt-2 inline-flex items-center gap-1.5 rounded-md bg-gold-tint px-2 py-1 text-gold-dark">
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
    <article className="rounded-2xl border border-hairline bg-white p-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="mono-label text-kai-800">{when}</span>
        {popup.status === "verified" ? (
          <VerificationChip freshness={popup.freshness} />
        ) : (
          <span className="mono-label font-medium text-slate-light">UNCONFIRMED</span>
        )}
      </div>
      <h3 className="mt-1.5 text-[16px] leading-tight font-semibold text-kai-800">{popup.name}</h3>
      {popup.locationNote ? (
        <p className="mt-0.5 text-[13px] leading-[1.45] text-slate">{popup.locationNote}</p>
      ) : null}
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
