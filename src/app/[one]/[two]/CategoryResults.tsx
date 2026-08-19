import { notFound } from "next/navigation";

import { Explainer } from "@/components/Explainer";
import { FilterChip } from "@/components/FilterChip";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VendorCard } from "@/components/VendorCard";
import { getCategoryListing } from "@/lib/queries";
import { clockLabel } from "@/lib/time";
import type { VendorSummary } from "@/lib/types";

export interface CategoryResultsProps {
  islandSlug: string;
  categorySlug: string;
  filter?: string;
  product?: string;
}

export async function CategoryResults({
  islandSlug,
  categorySlug,
  filter,
  product,
}: CategoryResultsProps) {
  const now = new Date();
  const listing = await getCategoryListing(islandSlug, categorySlug, now);
  if (!listing) notFound();

  const base = `/${islandSlug}/${categorySlug}`;
  const openOnly = filter === "open";

  const visible = listing.vendors.filter((vendor) => {
    if (openOnly && !vendor.status.isOpenNow) return false;
    if (product && !vendor.productLabels.includes(product)) return false;
    return true;
  });

  // Grouped the way the page reads: what you can get right now, then the rest
  // of today, then the listings we cannot currently vouch for.
  const openNow = visible.filter((vendor) => vendor.status.isOpenNow);
  const laterToday = visible.filter(
    (vendor) => !vendor.status.isOpenNow && vendor.status.kind !== "unconfirmed",
  );
  const unconfirmed = visible.filter((vendor) => vendor.status.kind === "unconfirmed");

  const chipHref = (next: { filter?: string; product?: string }) => {
    const params = new URLSearchParams();
    const nextFilter = "filter" in next ? next.filter : filter;
    const nextProduct = "product" in next ? next.product : product;
    if (nextFilter) params.set("filter", nextFilter);
    if (nextProduct) params.set("product", nextProduct);
    const query = params.toString();
    return query ? `${base}?${query}` : base;
  };

  return (
    <>
      <SiteHeader
        clock={clockLabel(now)}
        back={{ href: "/", label: "Back" }}
        title={`${listing.categoryName} on ${listing.islandName}`}
        subtitle={`${listing.stats.total} ${
          listing.stats.total === 1 ? "seller" : "sellers"
        } · ${listing.stats.openNow} open now · ${listing.stats.verifiedThisWeek} verified this week`}
      >
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="Open now"
            active={openOnly}
            href={chipHref({ filter: openOnly ? undefined : "open" })}
          />
          {listing.products.map((label) => (
            <FilterChip
              key={label}
              label={label}
              active={product === label}
              href={chipHref({ product: product === label ? undefined : label })}
            />
          ))}
        </div>
      </SiteHeader>

      <main className="mx-auto max-w-(--container-column) px-4 pb-4">
        {visible.length === 0 ? (
          <p className="py-8 text-[14px] text-slate">
            Nothing matches those filters right now.{" "}
            <a href={base} className="font-medium">
              Clear them
            </a>{" "}
            to see everything.
          </p>
        ) : null}

        <Group title="Open now" vendors={openNow} />
        <Group title="Later today" vendors={laterToday} />
        <Group title="Unconfirmed" vendors={unconfirmed} />

        <Explainer />

        <section className="mt-8">
          <SectionHeader title="By area" rule />
          <ul className="mt-1">
            {listing.areas.map((entry) => (
              <li
                key={entry.area}
                className="flex items-baseline justify-between border-b border-hairline-soft py-2.5 text-[13.5px] text-kai-800"
              >
                <span>{entry.area}</span>
                <span className="font-mono text-[12px] text-slate">{entry.count}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

function Group({ title, vendors }: { title: string; vendors: VendorSummary[] }) {
  if (vendors.length === 0) return null;

  return (
    <section>
      <SectionHeader title={title} count={vendors.length} />
      <div className="flex flex-col gap-2.5">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.slug} vendor={vendor} />
        ))}
      </div>
    </section>
  );
}
