import { notFound } from "next/navigation";

import { getSlugSets } from "@/lib/queries";

import { CategoryResults } from "./CategoryResults";
import { VendorDetail } from "./VendorDetail";

/**
 * Two URL shapes from the spec share this depth: /oahu/lei is a category
 * listing and /lei/napua-lei-stand is a vendor. Next allows only one dynamic
 * segment name per level, so the first segment is resolved against the island
 * and category slugs here and the page dispatches on the answer.
 */

export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ one: string; two: string }>;
  searchParams: Promise<{ filter?: string; product?: string }>;
}) {
  const { one, two } = await params;
  const { islands, categories } = await getSlugSets();

  if (islands.has(one)) {
    const { filter, product } = await searchParams;
    return (
      <CategoryResults islandSlug={one} categorySlug={two} filter={filter} product={product} />
    );
  }

  if (categories.has(one)) {
    return <VendorDetail categorySlug={one} slug={two} />;
  }

  notFound();
}
