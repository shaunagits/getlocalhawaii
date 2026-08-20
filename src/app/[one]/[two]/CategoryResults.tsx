import Link from "next/link";
import { notFound } from "next/navigation";

import { Explainer } from "@/components/Explainer";
import { AREA_PAGES } from "@/content/pages";
import { FilterChip } from "@/components/FilterChip";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TypeLinks } from "@/components/TypeLinks";
import { VendorCard } from "@/components/VendorCard";
import { JsonLd } from "@/components/JsonLd";
import { loadCategory } from "@/lib/queries";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { asciiSlug } from "@/lib/slug";
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
  const { now, listing } = await loadCategory(islandSlug, categorySlug);
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

  const stats = `${listing.stats.total} ${
    listing.stats.total === 1 ? "seller" : "sellers"
  } · ${listing.stats.openNow} open now · ${listing.stats.verifiedThisWeek} checked this week`;

  return (
    <>
      <JsonLd
        data={itemListSchema(listing.vendors, {
          name: `${listing.categoryName} on ${listing.islandName}`,
          path: base,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: `${listing.categoryName} on ${listing.islandName}`, path: base },
        ])}
      />

      <SiteHeader clock={clockLabel(now)} back={{ href: "/", label: "Back" }}>
        <div className="md:flex md:items-end md:justify-between md:gap-8">
          <div>
            <p className="mono-label hidden text-mint md:block">{clockLabel(now)}</p>
            <h1 className="font-display text-[28px] leading-[1.1] tracking-[-0.6px] text-cream md:mt-2 md:text-[42px] md:leading-[1.05] md:tracking-[-1.2px]">
              {listing.categoryName} on {listing.islandName}
            </h1>
            <p className="mt-1.5 text-[13px] leading-[1.45] text-cream-dim md:text-[14.5px]">
              {stats}
            </p>
          </div>

          <div className="mt-3.5 flex flex-wrap gap-2 md:mt-0 md:shrink-0">
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
        </div>
      </SiteHeader>

      <div className="mx-auto max-w-(--container-column) px-4 pb-4 md:grid md:max-w-(--container-shell) md:grid-cols-[minmax(0,1fr)_300px] md:gap-7 md:px-8 md:pt-6 md:pb-9">
        <main>
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
          <Group title="Listed" vendors={unconfirmed} />

          <TypeLinks base={base} className="mt-8 border-t border-hairline pt-6" />
        </main>

        <aside className="md:border-l md:border-hairline md:pl-6">
          <Explainer />

          <section className="mt-8 md:mt-6">
            <SectionHeader title="By area" rule />
            <ul className="mt-1">
              {listing.areas.map((entry) => {
                // Only areas that have their own written page are linked.
                const areaSlug = asciiSlug(entry.area);
                const hasPage = AREA_PAGES.some((page) => page.slug === areaSlug);

                return (
                  <li
                    key={entry.area}
                    className="flex items-baseline justify-between border-b border-hairline-soft py-2.5 text-[13.5px] text-kai-800"
                  >
                    {hasPage ? (
                      <Link href={`${base}/${areaSlug}`} className="text-kai-800 hover:text-coral">
                        {entry.area}
                      </Link>
                    ) : (
                      <span>{entry.area}</span>
                    )}
                    <span className="font-mono text-[12px] text-slate">{entry.count}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>
      </div>

      <SiteFooter />
    </>
  );
}

function Group({ title, vendors }: { title: string; vendors: VendorSummary[] }) {
  if (vendors.length === 0) return null;

  return (
    <section>
      <SectionHeader title={title} count={vendors.length} rule />
      <div className="flex flex-col gap-2.5 md:mt-4 md:gap-3">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.slug} vendor={vendor} />
        ))}
      </div>
    </section>
  );
}
