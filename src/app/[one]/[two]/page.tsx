import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSlugSets, loadCategory, loadVendor } from "@/lib/queries";

import { CategoryResults } from "./CategoryResults";
import { VendorDetail } from "./VendorDetail";

/**
 * Two URL shapes from the spec share this depth: /oahu/lei is a category
 * listing and /lei/napua-lei-stand is a vendor. Next allows only one dynamic
 * segment name per level, so the first segment is resolved against the island
 * and category slugs here and the page dispatches on the answer.
 */

export const dynamic = "force-dynamic";

type Params = Promise<{ one: string; two: string }>;

/** Trim to a whole word so a description never ends mid-syllable. */
function clamp(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

async function kindOf(one: string): Promise<"island" | "category" | null> {
  const { islands, categories } = await getSlugSets();
  if (islands.has(one)) return "island";
  if (categories.has(one)) return "category";
  return null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { one, two } = await params;
  const kind = await kindOf(one);
  const path = `/${one}/${two}`;

  if (kind === "island") {
    const { listing } = await loadCategory(one, two);
    if (!listing) return {};

    // ASCII in the title, diacriticals in the page copy.
    const title = `${listing.categoryName} on Oahu: shops and stands`;
    const description = `${listing.stats.total} ${listing.categoryName.toLowerCase()} sellers on Oʻahu, listed by area with hours where shops post them. Built from public listings.`;
    return {
      title,
      description,
      alternates: { canonical: path },
      openGraph: { title, description, url: path },
    };
  }

  if (kind === "category") {
    const { vendor } = await loadVendor(one, two);
    if (!vendor) return {};

    const where = vendor.area === "Airport" ? "Honolulu airport" : `${vendor.area}, Honolulu`;
    const noun = vendor.categoryName.toLowerCase();
    const title = `${vendor.name}: ${noun} shop in ${where}`;

    // Several listings carry only a one-line description, which is too thin to
    // stand as a meta description on its own, so it is framed rather than used raw.
    const detail = vendor.description ?? vendor.story;
    const description = clamp(
      [
        `${vendor.name} is a ${noun} seller in ${where}.`,
        detail ? `${detail.replace(/\.$/, "")}.` : null,
        vendor.hours.length > 0
          ? "Hours, address and phone as posted."
          : "Address and phone as posted; this shop does not post hours.",
      ]
        .filter(Boolean)
        .join(" "),
      158,
    );

    return {
      title,
      description,
      alternates: { canonical: path },
      openGraph: { title, description, url: path },
      // The placeholder market vendors carry no source and are not real
      // listings, so they stay out of the index.
      robots: vendor.sourceUrl ? undefined : { index: false, follow: true },
    };
  }

  return {};
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ filter?: string; product?: string }>;
}) {
  const { one, two } = await params;
  const kind = await kindOf(one);

  if (kind === "island") {
    const { filter, product } = await searchParams;
    return (
      <CategoryResults islandSlug={one} categorySlug={two} filter={filter} product={product} />
    );
  }

  if (kind === "category") {
    return <VendorDetail categorySlug={one} slug={two} />;
  }

  notFound();
}
