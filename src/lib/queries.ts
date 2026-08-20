/**
 * Data access. Every function takes the `now` the page is rendering against
 * and returns objects with status already computed, so pages never do clock
 * math themselves and every chip on a page agrees on the time.
 */

import { cache } from "react";

import {
  type Freshness,
  type MarketSession,
  type MarketStatus,
  type OpeningHours,
  type Report,
  type VendorStatus,
  type VerificationEvent,
  type VerificationMethod,
  byStatusThenDistance,
  getFreshness,
  getMarketStatus,
  getStatus,
} from "./status";
import { supabase } from "./supabase";
import { hawaiiDaysBetween, isSameHawaiiDay, toDate } from "./time";
import type { ContactMethod, VendorSummary } from "./types";

const VENDOR_FIELDS = `
  id, slug, name, area, description, story, distance_mi, phone,
  contact_method, payment_notes, good_to_know,
  address, website, ships_mainland, source_url,
  categories ( slug, name ),
  islands ( slug, name ),
  vendor_hours ( day_of_week, opens, closes ),
  vendor_products ( label, note, in_season_until, sort_order )
`;

interface VendorRow {
  id: string;
  slug: string;
  name: string;
  area: string;
  description: string | null;
  story: string | null;
  distance_mi: number | string | null;
  phone: string | null;
  contact_method: string;
  payment_notes: string | null;
  good_to_know: string | null;
  address: string | null;
  website: string | null;
  ships_mainland: boolean | null;
  source_url: string | null;
  categories: { slug: string; name: string } | null;
  islands: { slug: string; name: string } | null;
  vendor_hours: { day_of_week: number; opens: string; closes: string }[];
  vendor_products: {
    label: string;
    note: string | null;
    in_season_until: string | null;
    sort_order: number;
  }[];
}

export interface Product {
  label: string;
  note: string | null;
  inSeasonUntil: string | null;
}

/**
 * Product labels are stored capitalised because they head their own chips on
 * the vendor page. Run together into a sentence they need to read as one:
 * "Poi, kalo, lūʻau leaf", not "Poi, Kalo, Lūʻau leaf".
 */
export function productSentence(products: Product[]): string {
  return products
    .map((product, index) => (index === 0 ? product.label : product.label.toLowerCase()))
    .join(", ");
}

export interface LogEntry {
  verifiedAt: Date;
  method: VerificationMethod;
  note: string | null;
}

/** numeric columns come back as strings over PostgREST often enough to coerce. */
function toNumber(value: number | string | null): number | null {
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function hoursOf(row: VendorRow): OpeningHours[] {
  return row.vendor_hours.map((entry) => ({
    dayOfWeek: entry.day_of_week,
    opens: entry.opens,
    closes: entry.closes,
  }));
}

function productsOf(row: VendorRow): Product[] {
  return [...row.vendor_products]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((product) => ({
      label: product.label,
      note: product.note,
      inSeasonUntil: product.in_season_until,
    }));
}

/**
 * Verification events and reports are keyed by a polymorphic subject, so they
 * cannot be embedded in the vendor query. They are fetched in one batched call
 * per page and grouped here rather than one round trip per card.
 */
async function verificationsFor(
  subjectType: "vendor" | "market" | "popup",
  ids: string[],
): Promise<Map<string, VerificationEvent[]>> {
  const grouped = new Map<string, VerificationEvent[]>();
  if (ids.length === 0) return grouped;

  const { data, error } = await supabase
    .from("verification_events")
    .select("subject_id, verified_at, method, note")
    .eq("subject_type", subjectType)
    .in("subject_id", ids)
    .order("verified_at", { ascending: false });

  if (error) throw error;

  for (const row of data ?? []) {
    const events = grouped.get(row.subject_id) ?? [];
    events.push({
      verifiedAt: row.verified_at,
      method: row.method as VerificationMethod,
      note: row.note,
    });
    grouped.set(row.subject_id, events);
  }
  return grouped;
}

async function reportsFor(
  subjectType: "vendor" | "market",
  ids: string[],
): Promise<Map<string, Report[]>> {
  const grouped = new Map<string, Report[]>();
  if (ids.length === 0) return grouped;

  const { data, error } = await supabase
    .from("reports")
    .select("subject_id, kind, note, reported_at")
    .eq("subject_type", subjectType)
    .in("subject_id", ids)
    .order("reported_at", { ascending: false });

  if (error) throw error;

  for (const row of data ?? []) {
    const reports = grouped.get(row.subject_id) ?? [];
    reports.push({
      kind: row.kind as Report["kind"],
      note: row.note,
      reportedAt: row.reported_at,
    });
    grouped.set(row.subject_id, reports);
  }
  return grouped;
}

function toSummary(
  row: VendorRow,
  events: VerificationEvent[],
  reports: Report[],
  now: Date,
): VendorSummary {
  const status = getStatus({ hours: hoursOf(row), verifications: events, reports }, now);

  // Surface the note from the report that actually changed today's status.
  const todaysReport = reports.find(
    (report) => report.kind !== "changed" && isSameHawaiiDay(toDate(report.reportedAt), now),
  );

  return {
    slug: row.slug,
    name: row.name,
    categorySlug: row.categories?.slug ?? "lei",
    description: row.description,
    area: row.area,
    distanceMi: toNumber(row.distance_mi),
    paymentNotes: row.payment_notes,
    phone: row.phone,
    contactMethod: row.contact_method as ContactMethod,
    shipsMainland: row.ships_mainland,
    productLabels: row.vendor_products.map((product) => product.label),
    status,
    freshness: getFreshness(events, now),
    reportNote:
      status.kind === "sold_out" || status.kind === "closed" ? (todaysReport?.note ?? null) : null,
  };
}

/** Attach status to a page of vendor rows in one pass, sorted for display. */
async function summarize(rows: VendorRow[], now: Date): Promise<VendorSummary[]> {
  const ids = rows.map((row) => row.id);
  const [events, reports] = await Promise.all([
    verificationsFor("vendor", ids),
    reportsFor("vendor", ids),
  ]);

  return rows
    .map((row) => toSummary(row, events.get(row.id) ?? [], reports.get(row.id) ?? [], now))
    .sort(byStatusThenDistance);
}

// Listings --------------------------------------------------------------------

export interface ListingStats {
  total: number;
  openNow: number;
  verifiedThisWeek: number;
}

export interface CategoryListing {
  categoryName: string;
  islandName: string;
  vendors: VendorSummary[];
  stats: ListingStats;
  /** Neighbourhood counts for the BY AREA block. */
  areas: { area: string; count: number }[];
  /** The most common product labels, offered as filter chips. */
  products: string[];
}

function statsFor(vendors: VendorSummary[]): ListingStats {
  return {
    total: vendors.length,
    openNow: vendors.filter((vendor) => vendor.status.isOpenNow).length,
    verifiedThisWeek: vendors.filter(
      (vendor) => vendor.freshness.daysAgo !== null && vendor.freshness.daysAgo <= 7,
    ).length,
  };
}

async function fetchVendors(filter: {
  categorySlug?: string;
  islandSlug?: string;
}): Promise<VendorRow[]> {
  let query = supabase.from("vendors").select(VENDOR_FIELDS).eq("is_active", true);

  if (filter.categorySlug) query = query.eq("categories.slug", filter.categorySlug);
  if (filter.islandSlug) query = query.eq("islands.slug", filter.islandSlug);

  const { data, error } = await query;
  if (error) throw error;

  // An inner filter on an embedded table nulls the embed rather than dropping
  // the row, so the non-matching rows are removed here.
  return (data as unknown as VendorRow[]).filter(
    (row) =>
      (!filter.categorySlug || row.categories?.slug === filter.categorySlug) &&
      (!filter.islandSlug || row.islands?.slug === filter.islandSlug),
  );
}

/** Category results page: every vendor in one category on one island. */
export async function getCategoryListing(
  islandSlug: string,
  categorySlug: string,
  now: Date,
): Promise<CategoryListing | null> {
  const rows = await fetchVendors({ categorySlug, islandSlug });
  if (rows.length === 0) return null;

  const vendors = await summarize(rows, now);

  const counts = new Map<string, number>();
  for (const vendor of vendors) {
    counts.set(vendor.area, (counts.get(vendor.area) ?? 0) + 1);
  }

  return {
    categoryName: rows[0].categories?.name ?? categorySlug,
    islandName: rows[0].islands?.name ?? islandSlug,
    vendors,
    stats: statsFor(vendors),
    areas: [...counts.entries()]
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count || a.area.localeCompare(b.area)),
    products: topProducts(vendors),
  };
}

/** Product labels shared by more than one vendor, so a chip narrows something. */
function topProducts(vendors: VendorSummary[], limit = 3): string[] {
  const counts = new Map<string, number>();
  for (const vendor of vendors) {
    for (const label of vendor.productLabels) {
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label]) => label);
}

export interface AnswerList {
  vendors: VendorSummary[];
  stats: ListingStats;
}

/**
 * Home page answers. Real natural language parsing is out of scope, so the
 * query is matched against category slugs and names and falls back to
 * everything when nothing matches.
 */
export async function getAnswers(query: string | undefined, now: Date): Promise<AnswerList> {
  const categorySlug = await resolveCategory(query);
  const rows = await fetchVendors(categorySlug ? { categorySlug } : {});
  const vendors = await summarize(rows, now);
  return { vendors, stats: statsFor(vendors) };
}

async function resolveCategory(query: string | undefined): Promise<string | null> {
  if (!query) return null;
  const needle = query.toLowerCase();

  const { data, error } = await supabase.from("categories").select("slug, name");
  if (error) throw error;

  const match = (data ?? []).find(
    (category) =>
      needle.includes(category.slug) || needle.includes(category.name.toLowerCase()),
  );
  return match?.slug ?? null;
}

// Vendor detail ---------------------------------------------------------------

export interface VendorDetail extends VendorSummary {
  story: string | null;
  goodToKnow: string | null;
  address: string | null;
  website: string | null;
  sourceUrl: string | null;
  islandSlug: string;
  islandName: string;
  categoryName: string;
  hours: OpeningHours[];
  products: Product[];
  log: LogEntry[];
  nearby: VendorSummary[];
}

export async function getVendorDetail(
  categorySlug: string,
  slug: string,
  now: Date,
): Promise<VendorDetail | null> {
  const { data, error } = await supabase
    .from("vendors")
    .select(VENDOR_FIELDS)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const row = data as unknown as VendorRow;
  if (row.categories?.slug !== categorySlug) return null;

  const [events, reports] = await Promise.all([
    verificationsFor("vendor", [row.id]),
    reportsFor("vendor", [row.id]),
  ]);
  const vendorEvents = events.get(row.id) ?? [];

  const summary = toSummary(row, vendorEvents, reports.get(row.id) ?? [], now);

  // Also nearby: same island and category, closest first, excluding this one.
  const siblings = await fetchVendors({
    categorySlug,
    islandSlug: row.islands?.slug,
  });
  const nearby = (await summarize(siblings.filter((sibling) => sibling.id !== row.id), now))
    .sort((a, b) => (a.distanceMi ?? Infinity) - (b.distanceMi ?? Infinity))
    .slice(0, 2);

  return {
    ...summary,
    story: row.story,
    goodToKnow: row.good_to_know,
    address: row.address,
    website: row.website,
    sourceUrl: row.source_url,
    islandSlug: row.islands?.slug ?? "",
    islandName: row.islands?.name ?? "",
    categoryName: row.categories?.name ?? "",
    hours: hoursOf(row),
    products: productsOf(row),
    log: vendorEvents.map((event) => ({
      verifiedAt: toDate(event.verifiedAt),
      method: event.method,
      note: event.note ?? null,
    })),
    nearby,
  };
}

export async function getVendorSlugs(
  options: { sourcedOnly?: boolean } = {},
): Promise<{ category: string; slug: string }[]> {
  let query = supabase.from("vendors").select("slug, categories ( slug )").eq("is_active", true);

  // A listing without a source is a placeholder, and placeholders stay out of
  // the sitemap for the same reason they are noindexed.
  if (options.sourcedOnly) query = query.not("source_url", "is", null);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? [])
    .map((row) => ({
      category: (row.categories as unknown as { slug: string } | null)?.slug ?? "",
      slug: row.slug,
    }))
    .filter((entry) => entry.category !== "");
}

// Market detail ---------------------------------------------------------------

export interface MarketVendor {
  slug: string;
  name: string;
  categorySlug: string;
  stall: string | null;
  usualDays: string | null;
  /** Confirmed on site today, with the time: "CONFIRMED 7:02A". */
  confirmedAt: Date | null;
  isHereToday: boolean;
  products: Product[];
  paymentNotes: string | null;
}

export interface Popup {
  name: string;
  locationNote: string | null;
  startsAt: Date;
  endsAt: Date | null;
  status: "verified" | "unconfirmed";
  freshness: Freshness;
}

export interface MarketDetail {
  slug: string;
  name: string;
  area: string;
  islandName: string;
  description: string | null;
  locationNotes: string | null;
  instagram: string | null;
  gettingThere: string | null;
  distanceMi: number | null;
  status: MarketStatus;
  freshness: Freshness;
  sessions: MarketSession[];
  vendors: MarketVendor[];
  popups: Popup[];
  log: LogEntry[];
}

export async function getMarketDetail(slug: string, now: Date): Promise<MarketDetail | null> {
  const { data, error } = await supabase
    .from("markets")
    .select(
      `id, slug, name, area, description, location_notes, instagram, getting_there, distance_mi,
       islands ( name ),
       market_sessions ( day_of_week, starts, ends ),
       market_vendors (
         stall, usual_days, confirmed_at, sort_order,
         vendors ( slug, name, payment_notes, categories ( slug ), vendor_products ( label, note, in_season_until, sort_order ) )
       )`,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const row = data as unknown as {
    id: string;
    slug: string;
    name: string;
    area: string;
    description: string | null;
    location_notes: string | null;
    instagram: string | null;
    getting_there: string | null;
    distance_mi: number | string | null;
    islands: { name: string } | null;
    market_sessions: { day_of_week: number; starts: string; ends: string }[];
    market_vendors: {
      stall: string | null;
      usual_days: string | null;
      confirmed_at: string | null;
      sort_order: number;
      vendors: {
        slug: string;
        name: string;
        payment_notes: string | null;
        categories: { slug: string } | null;
        vendor_products: {
          label: string;
          note: string | null;
          in_season_until: string | null;
          sort_order: number;
        }[];
      } | null;
    }[];
  };

  const sessions: MarketSession[] = row.market_sessions.map((session) => ({
    dayOfWeek: session.day_of_week,
    starts: session.starts,
    ends: session.ends,
  }));

  const events = (await verificationsFor("market", [row.id])).get(row.id) ?? [];

  const vendors: MarketVendor[] = row.market_vendors
    .filter((entry) => entry.vendors !== null)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((entry) => {
      const vendor = entry.vendors!;
      const confirmedAt = entry.confirmed_at ? toDate(entry.confirmed_at) : null;
      return {
        slug: vendor.slug,
        name: vendor.name,
        categorySlug: vendor.categories?.slug ?? "",
        stall: entry.stall,
        usualDays: entry.usual_days,
        confirmedAt,
        // Only a confirmation from today means someone saw them at the stall.
        isHereToday: confirmedAt !== null && isSameHawaiiDay(confirmedAt, now),
        paymentNotes: vendor.payment_notes,
        products: [...vendor.vendor_products]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((product) => ({
            label: product.label,
            note: product.note,
            inSeasonUntil: product.in_season_until,
          })),
      };
    });

  return {
    slug: row.slug,
    name: row.name,
    area: row.area,
    islandName: row.islands?.name ?? "",
    description: row.description,
    locationNotes: row.location_notes,
    instagram: row.instagram,
    gettingThere: row.getting_there,
    distanceMi: toNumber(row.distance_mi),
    status: getMarketStatus({ sessions, verifications: events }, now),
    freshness: getFreshness(events, now),
    sessions,
    vendors,
    popups: await getPopups(now),
    log: events.map((event) => ({
      verifiedAt: toDate(event.verifiedAt),
      method: event.method,
      note: event.note ?? null,
    })),
  };
}

/** Pop-ups starting in the next week, verified or not. */
async function getPopups(now: Date): Promise<Popup[]> {
  const weekOut = new Date(now.getTime() + 7 * 86_400_000);

  const { data, error } = await supabase
    .from("popups")
    .select("id, name, location_note, starts_at, ends_at, status")
    .gte("starts_at", now.toISOString())
    .lte("starts_at", weekOut.toISOString())
    .order("starts_at");

  if (error) throw error;

  const rows = data ?? [];
  const events = await verificationsFor(
    "popup",
    rows.map((popup) => popup.id),
  );

  return rows.map((popup) => ({
    name: popup.name,
    locationNote: popup.location_note,
    startsAt: toDate(popup.starts_at),
    endsAt: popup.ends_at ? toDate(popup.ends_at) : null,
    status: popup.status === "verified" ? "verified" : "unconfirmed",
    freshness: getFreshness(events.get(popup.id) ?? [], now),
  }));
}

export async function getMarketSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("markets").select("slug").eq("is_active", true);
  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}

/** Days since a verification, for the freshness explainer copy. */
export function daysSince(event: LogEntry, now: Date): number {
  return hawaiiDaysBetween(event.verifiedAt, now);
}

export type { VendorStatus, Freshness };

/**
 * Island and category slugs share the first URL segment: /oahu/lei is a
 * category listing, /lei/napua-lei-stand is a vendor. The route needs to know
 * which one it is looking at.
 */
export async function getSlugSets(): Promise<{ islands: Set<string>; categories: Set<string> }> {
  const [islands, categories] = await Promise.all([
    supabase.from("islands").select("slug"),
    supabase.from("categories").select("slug"),
  ]);

  if (islands.error) throw islands.error;
  if (categories.error) throw categories.error;

  return {
    islands: new Set((islands.data ?? []).map((row) => row.slug)),
    categories: new Set((categories.data ?? []).map((row) => row.slug)),
  };
}

/**
 * Request-scoped loaders.
 *
 * generateMetadata and the page body both need the same row, and a Supabase
 * call is not deduplicated the way fetch() is. These memoise per request, and
 * they own the `now` they render against so both callers agree on the instant
 * rather than each taking its own clock reading.
 */
export const loadVendor = cache(async (categorySlug: string, slug: string) => {
  const now = new Date();
  return { now, vendor: await getVendorDetail(categorySlug, slug, now) };
});

export const loadCategory = cache(async (islandSlug: string, categorySlug: string) => {
  const now = new Date();
  return { now, listing: await getCategoryListing(islandSlug, categorySlug, now) };
});
