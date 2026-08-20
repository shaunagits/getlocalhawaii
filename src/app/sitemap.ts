import type { MetadataRoute } from "next";

import { CAPTURE_SLUGS, GRADUATION } from "@/content/pages";
import { getVendorSlugs } from "@/lib/queries";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Only pages we would want someone to land on.
 *
 * The seeded Kaimukī market and the placeholder vendors that belong to it are
 * left out: they carry no source and no real data, and are noindexed for the
 * same reason. A vendor earns a sitemap entry by having a source_url.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/oahu/lei"), lastModified, changeFrequency: "daily", priority: 0.9 },
    {
      url: absoluteUrl(`/guides/${GRADUATION.slug}`),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const capturePages: MetadataRoute.Sitemap = CAPTURE_SLUGS.map((slug) => ({
    url: absoluteUrl(`/oahu/lei/${slug}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const vendors = await getVendorSlugs({ sourcedOnly: true });
  const vendorPages: MetadataRoute.Sitemap = vendors.map((vendor) => ({
    url: absoluteUrl(`/${vendor.category}/${vendor.slug}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...capturePages, ...vendorPages];
}
