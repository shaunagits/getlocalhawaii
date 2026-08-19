# Status

Current state. Overwritten each session, never appended to.

## What works
- All four pages live against Supabase: home `/`, category `/oahu/lei`, vendor `/lei/napua-lei-stand`, market `/markets/kaimuki-neighborhood`.
- Schema and seed applied to the `getlocalhawaii` Supabase project. Security advisors report no issues.
- Status, freshness and countdown logic in Pacific/Honolulu. 34 unit tests pass. Production build is clean.
- Category filters (Open now, product chips) work through the query string.

## In progress
- Nothing mid-edit. Phases 1 through 5 of the build order are complete.

## Next 3 steps
1. Phase 6: push to GitHub, import the repo in Vercel, add the two env vars there.
2. Verify the build on getlocalhawaii.vercel.app.
3. Check the market page during market hours to see the ON NOW countdown render live.

## Known issues
- Nothing pushed yet; the origin remote is set but has no commits.
- Browse all, Markets calendar and In season nav links point at the nearest existing page, since those pages are out of scope for the first deploy.
- Distances are seeded placeholders, so "also nearby" shows distance from the user, not from the vendor being viewed.
- The Airport-close filter chip from the mockup is not built; it needs geolocation.
