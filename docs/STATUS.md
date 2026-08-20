# Status

## What works
- Live at https://getlocalhawaii.com, building from GitHub on every push to `main`. 45 tests pass, build and lint clean.
- 14 real Oʻahu lei vendors from public sources, each with its source URL and a dated source_check. Default state LISTED; the chip says CHECKED (source) or VERIFIED (contact); fields the source left blank render blank, never guessed.
- The hero sentence is the search: subject (datalist of categories and product labels), area, and open-now, as a plain GET form with no client JavaScript. An unmatched subject returns nothing with a reason, and search answers only from sourced listings.
- Nine capture pages with original prose (six lei types, Chinatown, Airport, delivery, graduation guide), all linked from the home page and `/oahu/lei`. Florist, ItemList and BreadcrumbList JSON-LD, sitemap.xml (26 urls), robots.txt.

## In progress
- Nothing mid-edit. Working tree clean, everything pushed and deployed.

## Next 3 steps
1. Add the Supabase env vars to the Preview environment in the Vercel dashboard, still outstanding.
2. Set up the Search Console property for getlocalhawaii.com and submit the sitemap.
3. Close the data gaps: 6 of 14 vendors post no hours, and ships_mainland is known for only 3, which is what the delivery page filters on.

## Known issues
- "near" is area equality, not proximity: no vendor has lat or lng, so near Kalihi returns Kalihi only and hides Chinatown two miles away. Kept deliberately, see DECISIONS.
- No vendor lists puakenikeni; that type page ships with prose and an empty list by design.
- The Kaimukī market and its four placeholder vendors are still seeded, and `/oahu/produce` still renders two of them. All are noindexed or orphaned, out of the sitemap, and now out of search results too.
- Preview deployments have no Supabase env vars, so branch builds fail.
