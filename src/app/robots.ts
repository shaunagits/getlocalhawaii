import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

/**
 * No blanket disallow any more. The old one covered /markets/, which held a
 * single placeholder; markets now live under /farmers-markets/ alongside
 * seventeen real ones, so blocking the prefix would block the real pages too.
 * Placeholders are kept out the same way unsourced vendors are: their own
 * metadata sets noindex when the listing carries no source.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
