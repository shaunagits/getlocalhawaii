import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The placeholder market is noindexed in its own metadata too; this
      // keeps crawlers off it in the first place.
      disallow: ["/markets/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
