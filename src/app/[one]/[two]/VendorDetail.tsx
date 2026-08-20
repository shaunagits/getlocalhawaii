import Link from "next/link";
import { notFound } from "next/navigation";

import { ActionButtons } from "@/components/ActionButtons";
import { HoursTable } from "@/components/HoursTable";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StatusChip } from "@/components/StatusChip";
import { NearbyList } from "@/components/NearbyList";
import { VerificationChip } from "@/components/VerificationChip";
import { VerificationPanel } from "@/components/VerificationLog";
import { loadVendor } from "@/lib/queries";
import { breadcrumbSchema, floristSchema } from "@/lib/schema";
import { clockLabel, hawaiiClock } from "@/lib/time";

export async function VendorDetail({
  categorySlug,
  slug,
}: {
  categorySlug: string;
  slug: string;
}) {
  const { now, vendor } = await loadVendor(categorySlug, slug);
  if (!vendor) notFound();

  const listingHref = `/${vendor.islandSlug}/${categorySlug}`;
  const path = `/${categorySlug}/${slug}`;

  const meta = [
    vendor.categoryName,
    vendor.area,
    vendor.distanceMi === null ? null : `${vendor.distanceMi} mi`,
  ]
    .filter(Boolean)
    .join(" · ");

  const story = vendor.reportNote ?? vendor.story;

  return (
    <>
      <JsonLd data={floristSchema(vendor, path)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: `${vendor.categoryName} on Oʻahu`, path: listingHref },
          { name: vendor.name, path },
        ])}
      />

      {/* Answer first: the hero lives inside the dark header on both frames. */}
      <SiteHeader
        clock={clockLabel(now)}
        back={{ href: listingHref, label: vendor.categoryName }}
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
              <StatusChip
                status={vendor.status}
                label={
                  vendor.status.kind === "open" ? `OPEN NOW · ${vendor.status.detail}` : undefined
                }
                onDark
              />
              {vendor.status.note && vendor.freshness.isFresh ? (
                <span className="mono-chip font-medium text-[11.5px] text-coral-light">
                  {vendor.status.note}
                </span>
              ) : (
                <VerificationChip freshness={vendor.freshness} onDark />
              )}
            </div>

            <h1 className="mt-3 font-display text-[30px] leading-[1.1] tracking-[-0.7px] text-cream md:text-[44px] md:leading-[1.05] md:tracking-[-1.3px]">
              {vendor.name}
            </h1>

            <p className="mt-1.5 text-[13.5px] leading-[1.5] text-cream-dim md:mt-2 md:max-w-[56ch] md:text-[15px] md:leading-[1.55]">
              {meta}
              {story ? <br className="md:hidden" /> : null}
              {story ? <span className="hidden md:inline">. </span> : null}
              {story}
            </p>
          </div>

          {/* Desktop keeps the actions in the hero; the phone puts them on the
              cream below, where a thumb can reach them. */}
          <ActionButtons vendor={vendor} showSave onDark stacked className="hidden md:flex" />
        </div>
      </SiteHeader>

      <ActionButtons
        vendor={vendor}
        showSave
        prominentDirections
        className="mx-auto max-w-(--container-column) px-4 pt-3.5 md:hidden"
      />

      <div className="mx-auto max-w-(--container-column) px-4 md:grid md:max-w-(--container-shell) md:grid-cols-[minmax(0,1fr)_320px] md:gap-[30px] md:px-8 md:pt-7 md:pb-9">
        <main>
          <section className="mt-6 md:mt-0">
            <SectionHeader title="This week" rule />
            <HoursTable hours={vendor.hours} today={hawaiiClock(now).dayOfWeek} />
          </section>

          {vendor.products.length > 0 ? (
            <section className="mt-6 md:mt-[26px]">
              <SectionHeader title="What they have" rule />
              <ul className="mt-3 flex flex-wrap gap-2 md:gap-2.5">
                {vendor.products.map((product) => (
                  <li
                    key={product.label}
                    className={`rounded-full border px-3 py-1.5 text-[13px] font-medium md:px-3.5 md:py-2.5 md:text-[13.5px] ${
                      product.note
                        ? "border-gold-dark/20 bg-gold-tint text-gold-dark"
                        : "border-hairline bg-white text-kai-800"
                    }`}
                  >
                    {product.label}
                    {product.note ? `, ${product.note}` : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {vendor.goodToKnow ? (
            <section className="mt-6 md:mt-[26px]">
              <SectionHeader title="Good to know" rule />
              <p className="mt-3 text-[14px] leading-[1.55] text-kai-800 md:max-w-[62ch] md:text-[14.5px] md:leading-[1.7]">
                {vendor.goodToKnow}
              </p>
            </section>
          ) : null}
        </main>

        <aside className="md:border-l md:border-hairline md:pl-[26px]">
          <div className="mt-6 md:mt-0">
            <VerificationPanel
              entries={vendor.log}
              subject={vendor.name}
              sourceUrl={vendor.sourceUrl}
              website={vendor.website}
            />
          </div>

          {vendor.nearby.length > 0 ? (
            <section className="mt-6 md:mt-6">
              <SectionHeader title="Also nearby" rule />
              <NearbyList vendors={vendor.nearby} />
              <Link href={listingHref} className="mt-3 inline-block text-[13.5px] font-medium">
                See all {vendor.categoryName.toLowerCase()} on {vendor.islandName} →
              </Link>
            </section>
          ) : null}
        </aside>
      </div>

      <SiteFooter />
    </>
  );
}
