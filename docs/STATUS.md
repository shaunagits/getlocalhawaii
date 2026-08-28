# Status

## What works
- Live at https://getlocalhawaii.com, building from GitHub on every push to `main`. Typecheck and lint clean, 61 unit tests passing.
- Three real categories: 14 lei vendors, 23 fish vendors, and new today 17 farmers markets (13 City People's Open Market sites, 4 Hawaii Farm Bureau), migration 20260827090000.
- `/oahu/farmers-markets` is the listing and the calendar in one page, grouped Today then the rest of the week, with a next-opening state when today is finished. Each market has a page at `/farmers-markets/[slug]` with Event schema, next dates and a countdown. Old `/markets/*` URLs redirect.
- Markets are the first records with real coordinates, from the City's own map pins, so Directions opens a pin rather than a name search.
- Cards lead with the status chip; detail pages and category headers lead with the name, per the updated canvas.

## Next 3 steps
1. Run `npm run dev` and eyeball `/oahu/farmers-markets`, a market page and `/oahu/lei`. None of this has been seen rendered: the sandbox cannot run `next build` or the dev server against macOS `node_modules`.
2. Decide what `/oahu/produce` should be. The canvas added a "produce" home chip but the category holds 2 unsourced vendors, so it answers "nothing listed".
3. Fish still has no category prose and is not in the sitemap; `/oahu/fish` renders but is not in the nav.

## Known issues
- "near" is still area equality, not proximity. Markets have coordinates now, vendors do not.
- Farm Bureau markets have no coordinates, addresses or vendor rosters, so their pages are the thinnest on the site.
- Every market goes UNCONFIRMED 30 days after import unless the source check is repeated. Worth a scheduled weekly fetch-and-diff of the City page, which was last modified Aug 2025 and links a 2025 holiday PDF.
- Preview deployments have no Supabase env vars, so branch builds fail.
