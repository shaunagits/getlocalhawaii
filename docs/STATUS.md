# Status

## What works
- Live at https://getlocalhawaii.com, building from GitHub on every push to `main`. Typecheck and lint clean, 59 unit tests passing.
- Three real categories now: 14 lei vendors, 23 fish vendors, and new today 17 farmers markets (13 City People's Open Market sites, 4 Hawaii Farm Bureau) in data/farmers-markets-oahu.csv, migration 20260827090000.
- /oahu/farmers-markets is the listing and the calendar in one page, grouped Today then the rest of the week, with a next-opening state when today is finished. Each market has a page at /farmers-markets/[slug] carrying Event schema, next four dates and a countdown.
- The People's Open Market rows are the first records with real coordinates, taken from the City's own map pins, so their Directions buttons point at a pin rather than a name search.
- Cards lead with the status chip; detail pages and category headers now lead with the name, per the updated canvas.

## In progress
- Nothing half-built. The markets work is complete and committed.

## Next 3 steps
1. Run `npm run dev` and eyeball /oahu/farmers-markets, a market page, and /oahu/lei. Nothing in this batch has been seen rendered: the sandbox cannot run next build or the dev server against macOS node_modules.
2. Decide what /oahu/produce should be. The design added a "produce" home chip but the category holds 2 unsourced vendors, so that chip currently answers "nothing listed".
3. Fish still has no category prose and is not in the sitemap; /oahu/fish renders but was left out of the nav.

## Known issues
- "near" is still area equality, not proximity. Markets have coordinates now, vendors do not.
- Hawaii Farm Bureau markets have no coordinates or addresses, and no vendor rosters yet; their per-market pages are the thinnest on the site.
- The City schedule page was last modified Aug 2025 and links a 2025 holiday PDF, so it may lag its own flyer. Worth a scheduled weekly fetch-and-diff.
- Preview deployments have no Supabase env vars, so branch builds fail.
