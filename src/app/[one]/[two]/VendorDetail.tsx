import Link from "next/link";
import { notFound } from "next/navigation";

import { ActionButtons } from "@/components/ActionButtons";
import { HoursTable } from "@/components/HoursTable";
import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StatusChip } from "@/components/StatusChip";
import { VendorCard } from "@/components/VendorCard";
import { VerificationChip } from "@/components/VerificationChip";
import { VerificationLog } from "@/components/VerificationLog";
import { getVendorDetail } from "@/lib/queries";
import { clockLabel, hawaiiClock } from "@/lib/time";

export async function VendorDetail({
  categorySlug,
  slug,
}: {
  categorySlug: string;
  slug: string;
}) {
  const now = new Date();
  const vendor = await getVendorDetail(categorySlug, slug, now);
  if (!vendor) notFound();

  const listingHref = `/${vendor.islandSlug}/${categorySlug}`;

  const meta = [
    vendor.categoryName,
    vendor.area,
    vendor.distanceMi === null ? null : `${vendor.distanceMi} mi`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <SiteHeader
        clock={clockLabel(now)}
        back={{ href: listingHref, label: vendor.categoryName }}
      />

      <main className="mx-auto max-w-(--container-column) px-4">
        {/* Answer first: status, then who they are, then how to reach them. */}
        <section className="pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <StatusChip
              status={vendor.status}
              label={vendor.status.kind === "open" ? `OPEN NOW · ${vendor.status.detail}` : undefined}
            />
            {vendor.status.note ? (
              <span className="mono-label font-medium text-coral-dark">{vendor.status.note}</span>
            ) : (
              <VerificationChip freshness={vendor.freshness} />
            )}
          </div>

          <h1 className="mt-3 font-display text-[32px] leading-[1.08] tracking-[-0.8px] text-kai-800">
            {vendor.name}
          </h1>
          <p className="mt-1.5 text-[13.5px] text-slate">{meta}</p>

          {vendor.story ? (
            <p className="mt-3 text-[15px] leading-[1.5] text-kai-800">{vendor.story}</p>
          ) : null}
          {vendor.reportNote ? (
            <p className="mt-3 text-[15px] leading-[1.5] text-coral-dark">{vendor.reportNote}</p>
          ) : null}

          <ActionButtons vendor={vendor} showSave className="mt-4" />
        </section>

        <section className="mt-6">
          <SectionHeader title="This week" rule />
          <HoursTable hours={vendor.hours} today={hawaiiClock(now).dayOfWeek} />
        </section>

        {vendor.products.length > 0 ? (
          <section className="mt-6">
            <SectionHeader title="What they have" rule />
            <ul className="mt-3 flex flex-wrap gap-2">
              {vendor.products.map((product) => (
                <li
                  key={product.label}
                  className="rounded-full border border-hairline bg-white px-3 py-1.5 text-[13px] text-kai-800"
                >
                  {product.label}
                  {product.note ? <span className="text-slate">, {product.note}</span> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {vendor.goodToKnow ? (
          <section className="mt-6">
            <SectionHeader title="Good to know" rule />
            <p className="mt-3 text-[14px] leading-[1.55] text-kai-800">{vendor.goodToKnow}</p>
          </section>
        ) : null}

        <section className="mt-6">
          <SectionHeader title="Verification log" rule />
          <div className="mt-3">
            <VerificationLog entries={vendor.log} />
          </div>
          <a
            className="mt-3 inline-block text-[13.5px] font-medium"
            href={`mailto:aloha@getlocalhawaii.org?subject=${encodeURIComponent(
              `Something changed: ${vendor.name}`,
            )}`}
          >
            Something changed? Tell us →
          </a>
        </section>

        {vendor.nearby.length > 0 ? (
          <section className="mt-6">
            <SectionHeader title="Also nearby" rule />
            <div className="mt-3 flex flex-col gap-2.5">
              {vendor.nearby.map((neighbour) => (
                <VendorCard key={neighbour.slug} vendor={neighbour} compact />
              ))}
            </div>
            <Link
              href={listingHref}
              className="mt-3 inline-block text-[13.5px] font-medium"
            >
              See all {vendor.categoryName.toLowerCase()} on {vendor.islandName} →
            </Link>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </>
  );
}
