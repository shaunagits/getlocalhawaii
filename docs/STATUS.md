# Status

## What works
- Live at https://getlocalhawaii.com, building from GitHub on every push to `main`. Typecheck and lint clean.
- 14 real Oʻahu lei vendors and, new today, 23 real Oʻahu fish vendors from public sources (data/fish-vendors-oahu.csv, migration 20260826090000). Each carries source_url and a dated source_check; TBC fields import as NULL.
- Fish covers Pier 38, Kalihi, Chinatown, town, windward, north shore and Waiʻanae, poke counters included. Tamashiro Market excluded: closed permanently 2026-04-30.
- Hero search, nine lei capture pages, JSON-LD, sitemap (26 urls), robots.txt all unchanged and working.

## In progress
- Fish vendors are in the database but /oahu/fish has no prose yet and fish pages are not in the sitemap; capture pages and SEO wiring are the next build step.

## Next 3 steps
1. Write /oahu/fish category prose plus Kalihi and Chinatown fish area coverage ("kalihi fish market" and "chinatown honolulu fish market" are the keyword targets).
2. Phone-check the four fish vendors imported without hours (Blue Seafood, Kahuku Superette, Ono Seafood, K.Bay Bros) and Alicia's magazine-sourced hours.
3. Still outstanding: Supabase env vars in Vercel Preview, Search Console property + sitemap submission, lei data gaps (6 of 14 without hours).

## Known issues
- "near" is area equality, not proximity: no vendor has lat or lng. Fish makes this bite harder since fish buyers search by proximity.
- The Kaimukī market placeholders remain seeded but suppressed; the Windward Fish Guy placeholder still sits in the fish category without a source_url, so it stays out of search and sitemap.
- Preview deployments have no Supabase env vars, so branch builds fail.
