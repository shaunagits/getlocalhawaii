# Status

## What works
- Live at https://getlocalhawaii.com and www, TLS issued, building from GitHub on every push to `main`.
- Four pages on real Supabase data, matching the 390px and 940px frames: home `/`, category `/oahu/lei`, vendor `/lei/napua-lei-stand`, market `/markets/kaimuki-neighborhood`.
- Status, freshness, countdown and sorting in Pacific/Honolulu, matching the DECISIONS entries. 35 unit tests pass, build and lint clean.

## In progress
- Nothing mid-edit. Working tree clean, everything pushed.

## Next 3 steps
1. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Preview environment in the Vercel dashboard.
2. Pick the next feature: real search parsing, geolocation and distances, or the report-a-change flow. All three are out of scope in BUILD_SPEC section 9.
3. Check the market page during market hours to see the ON NOW countdown render live.

## Known issues
- Preview deployments have no Supabase env vars, so branch builds fail. Vercel CLI 50.40.0 rejects its own documented all-branches command; use the dashboard.
- Distances are seeded placeholders, so "also nearby" shows distance from the user, not from the vendor being viewed.
- The stale-plus-reported chip row is unit tested but never seen in a browser: no seeded listing is both lapsed and reported.
- Browse all, Markets calendar and In season nav links point at the nearest existing page; those pages are not built.
