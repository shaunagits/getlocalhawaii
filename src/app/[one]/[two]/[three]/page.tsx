import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ListingPage } from "@/components/ListingPage";
import { CHINATOWN, DELIVERY, type PageCopy } from "@/content/pages";
import { findLeiType } from "@/content/lei-types";
import { getCategoryListing, getSlugSets } from "@/lib/queries";
import { asciiSlug } from "@/lib/slug";
import type { VendorSummary } from "@/lib/types";

/**
 * The capture pages, all under /[island]/[category]/[slug].
 *
 * One route serves three kinds of page because they share a shape: prose plus
 * a filtered list of the same vendors. The third segment resolves to a lei
 * type, to the delivery page, or to an area page, in that order.
 */

export const dynamic = "force-dynamic";

type Resolved = {
  copy: PageCopy;
  filter: (vendor: VendorSummary) => boolean;
  emptyMessage: string;
};

function resolve(three: string): Resolved | null {
  const type = findLeiType(three);
  if (type) {
    return {
      copy: {
        slug: type.slug,
        heading: `${type.name} lei on Oʻahu`,
        title: type.title,
        description: type.description,
        intro: type.intro,
        body: type.body,
      },
      // A shop qualifies when its own posted product list names the flower.
      filter: (vendor) =>
        vendor.productLabels.some((label) => asciiSlug(label) === type.slug),
      emptyMessage: `No listing on this site names ${type.name.toLowerCase()} in its posted products yet. That does not mean nobody strings it, only that no source we have read says so. If you know a shop that does, tell us.`,
    };
  }

  if (three === DELIVERY.slug) {
    return {
      copy: DELIVERY,
      filter: (vendor) => vendor.shipsMainland === true,
      emptyMessage:
        "No listing on this site currently says it ships to the mainland. Local delivery is common and often unadvertised, so it is worth asking any shop directly.",
    };
  }

  if (three === CHINATOWN.slug) {
    return {
      copy: CHINATOWN,
      filter: (vendor) => asciiSlug(vendor.area) === CHINATOWN.slug,
      emptyMessage: "No Chinatown shops are listed yet.",
    };
  }

  return null;
}

async function load(one: string, two: string, three: string) {
  const resolved = resolve(three);
  if (!resolved) return null;

  const { islands, categories } = await getSlugSets();
  // This depth only means anything under an island and a category.
  if (!islands.has(one) || !categories.has(two)) return null;

  const listing = await getCategoryListing(one, two, new Date());
  if (!listing) return null;

  return { ...resolved, vendors: listing.vendors.filter(resolved.filter) };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ one: string; two: string; three: string }>;
}): Promise<Metadata> {
  const { one, two, three } = await params;
  const resolved = resolve(three);
  if (!resolved) return {};

  const path = `/${one}/${two}/${three}`;
  return {
    title: resolved.copy.title,
    description: resolved.copy.description,
    alternates: { canonical: path },
    openGraph: {
      title: resolved.copy.title,
      description: resolved.copy.description,
      url: path,
    },
  };
}

export default async function CapturePage({
  params,
}: {
  params: Promise<{ one: string; two: string; three: string }>;
}) {
  const { one, two, three } = await params;
  const page = await load(one, two, three);
  if (!page) notFound();

  return (
    <ListingPage
      heading={page.copy.heading}
      intro={page.copy.intro}
      body={page.copy.body}
      vendors={page.vendors}
      now={new Date()}
      path={`/${one}/${two}/${three}`}
      back={{ href: `/${one}/${two}`, label: "All lei" }}
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Lei on Oʻahu", path: `/${one}/${two}` },
        { name: page.copy.heading, path: `/${one}/${two}/${three}` },
      ]}
      emptyMessage={page.emptyMessage}
    />
  );
}
