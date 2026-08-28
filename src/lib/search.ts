/**
 * Turning what someone typed into what they meant.
 *
 * Kept apart from queries.ts so it stays pure: no React cache, no Supabase
 * client, nothing that needs an environment to import. The ordering in here
 * is load-bearing and easy to break, so it is worth being able to test on its
 * own.
 */

import { LEI_TYPES } from "../content/lei-types";
import { asciiSlug } from "./slug";

/** Markets share the category URL space with lei and fish but not the table. */
export const MARKETS_CATEGORY = "farmers-markets";

/**
 * What a typed query resolved to.
 *
 * "none" matters: the old behaviour returned the entire directory when nothing
 * matched, which is invisible while nobody can type but reads as a broken
 * search the moment there is a box on the page.
 */
export type QueryMatch =
  | { kind: "all" }
  | { kind: "category"; slug: string; label: string }
  | { kind: "leiType"; slug: string; label: string }
  | { kind: "product"; label: string }
  /** Markets are not vendors, so this search hands off to their own page. */
  | { kind: "markets" }
  | { kind: "none"; term: string };

/** Matched most specific first, so a lei type beats the category it sits in. */
export function resolveQuery(
  query: string | undefined,
  categories: { slug: string; name: string }[],
  labels: string[],
): QueryMatch {
  const term = query?.trim();
  if (!term) return { kind: "all" };

  const needle = asciiSlug(term);
  if (!needle) return { kind: "all" };

  const words = needle.split("-");

  const leiType = LEI_TYPES.find((type) => needle === type.slug || words.includes(type.slug));
  if (leiType) return { kind: "leiType", slug: leiType.slug, label: leiType.name };

  /**
   * Markets live in their own tables, so a market query cannot be answered by
   * the vendor search underneath the home page; it hands off to the listing.
   *
   * The category match runs first on purpose. "fish market" is a fish query,
   * and "kalihi fish market" is one of the keyword targets, so testing for the
   * word "market" up front would send both to the wrong page. Markets are then
   * split back out of the category result, because the markets category has no
   * vendors in it and a category answer would render an empty page.
   */
  const category = categories.find((entry) => needle === entry.slug || words.includes(entry.slug));
  if (category?.slug === MARKETS_CATEGORY) return { kind: "markets" };
  if (category) return { kind: "category", slug: category.slug, label: category.name };

  // No category claimed it, so a loose market phrase is a markets query. This
  // is the path "farmers market" and "saturday market" take.
  if (words.includes("market") || words.includes("markets") || words.includes("farmers")) {
    return { kind: "markets" };
  }

  const label = labels.find((entry) => {
    const slug = asciiSlug(entry);
    return needle === slug || needle.includes(slug) || slug.includes(needle);
  });
  if (label) return { kind: "product", label };

  return { kind: "none", term };
}
