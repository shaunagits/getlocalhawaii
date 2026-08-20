# Status

## What works
- Live at https://getlocalhawaii.com, building from GitHub on every push to `main`.
- 14 real Oʻahu lei vendors imported from public sources, each carrying its source URL and a source_check dated on import. No fictional lei listings remain.
- Trust model: default state LISTED, chip says CHECKED (source) or VERIFIED (contact). TBC fields render blank, never guessed.
- Capture pages: six lei type pages, Chinatown, delivery, and a graduation guide, each with original prose. Florist and ItemList JSON-LD, sitemap.xml (25 urls), robots.txt. 44 tests pass.

## In progress
- Nothing mid-edit. Working tree clean, everything pushed and deployed.

## Next 3 steps
1. Add the Supabase env vars to the Preview environment in the Vercel dashboard, still outstanding.
2. Submit the sitemap in Google Search Console and set up the property for getlocalhawaii.com.
3. Fill the gaps in the CSV: confirmed hours for the Chinatown shops, and the Lin's product catalogue, which is the second-highest-value page on the site.

## Known issues
- No vendor lists puakenikeni; that type page ships with prose and an empty list by design.
- The Kaimukī market and its four placeholder vendors are still seeded, all noindexed and out of the sitemap via the source_url rule.
- Distances are null for every imported vendor, so nothing sorts by proximity and the cards show no mileage.
- Preview deployments have no Supabase env vars, so branch builds fail.
