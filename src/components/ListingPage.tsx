import { Explainer } from "@/components/Explainer";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VendorCard } from "@/components/VendorCard";
import { breadcrumbSchema, itemListSchema } from "@/lib/schema";
import { clockLabel } from "@/lib/time";
import type { VendorSummary } from "@/lib/types";

/**
 * Shared shell for every capture page: the type pages, the area page and the
 * delivery page. They differ only in their prose and in which vendors they
 * carry, so the grouping, the structured data and the chrome live here once.
 */
export interface ListingPageProps {
  heading: string;
  intro: string;
  body: string[];
  vendors: VendorSummary[];
  now: Date;
  path: string;
  back: { href: string; label: string };
  breadcrumbs: { name: string; path: string }[];
  /** Shown when the page has prose but nothing to list yet. */
  emptyMessage: string;
}

export function ListingPage({
  heading,
  intro,
  body,
  vendors,
  now,
  path,
  back,
  breadcrumbs,
  emptyMessage,
}: ListingPageProps) {
  const openNow = vendors.filter((vendor) => vendor.status.isOpenNow);
  const listed = vendors.filter((vendor) => !vendor.status.isOpenNow);

  const stats = [
    `${vendors.length} ${vendors.length === 1 ? "shop" : "shops"}`,
    openNow.length > 0 ? `${openNow.length} open now` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      {vendors.length > 0 ? (
        <JsonLd data={itemListSchema(vendors, { name: heading, path })} />
      ) : null}

      <SiteHeader clock={clockLabel(now)} back={back}>
        <div>
          <p className="mono-label hidden text-mint md:block">{clockLabel(now)}</p>
          <h1 className="font-display text-[28px] leading-[1.1] tracking-[-0.6px] text-cream md:mt-2 md:text-[42px] md:leading-[1.05] md:tracking-[-1.2px]">
            {heading}
          </h1>
          <p className="mt-1.5 text-[13.5px] leading-[1.5] text-cream-dim md:max-w-[58ch] md:text-[15px] md:leading-[1.55]">
            {intro}
          </p>
          <p className="mono-label mt-2.5 text-mint">{stats}</p>
        </div>
      </SiteHeader>

      <div className="mx-auto max-w-(--container-column) px-4 pb-4 md:grid md:max-w-(--container-shell) md:grid-cols-[minmax(0,1fr)_300px] md:gap-7 md:px-8 md:pt-6 md:pb-9">
        <main>
          {vendors.length === 0 ? (
            <p className="rounded-2xl border border-hairline bg-white p-4 text-[14px] leading-[1.55] text-slate md:mt-1">
              {emptyMessage}
            </p>
          ) : (
            <>
              <Group title="Open now" vendors={openNow} />
              <Group title={openNow.length > 0 ? "Also listed" : "Listed"} vendors={listed} />
            </>
          )}

          <section className="mt-8 md:mt-9">
            <SectionHeader title={`About ${heading.toLowerCase()}`} rule />
            <div className="mt-3 flex flex-col gap-3">
              {body.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[14px] leading-[1.6] text-kai-800 md:max-w-[68ch] md:text-[14.5px] md:leading-[1.7]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        </main>

        <aside className="md:border-l md:border-hairline md:pl-6">
          <Explainer />
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
