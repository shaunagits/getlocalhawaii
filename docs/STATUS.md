# Status

Current state. Overwritten each session, never appended to.

## What works
- All four pages live against Supabase: home `/`, category `/oahu/lei`, vendor `/lei/napua-lei-stand`, market `/markets/kaimuki-neighborhood`.
- Schema and seed applied to the `getlocalhawaii` Supabase project. Security advisors report no issues.
- Status, freshness and countdown logic in Pacific/Honolulu. 34 unit tests pass. Production build is clean.
- Pushed to GitHub. Vercel project `getlocalhawaii` is linked to the repo, production branch `main`.
- Supabase env vars set in Vercel for Production and Development.

## In progress
- Phase 6: verifying the first production build on the Vercel temp domain.

## Next 3 steps
1. Confirm the production deployment succeeds and the four pages render on the vercel.app domain.
2. Add the two env vars to the Preview environment; the CLI would not accept the all-branches form.
3. Check the market page during market hours to see the ON NOW countdown render live.

## Known issues
- Preview deployments have no Supabase env vars yet, so branch builds will fail until they are added.
- Browse all, Markets calendar and In season nav links point at the nearest existing page, since those pages are out of scope for the first deploy.
- Distances are seeded placeholders, so "also nearby" shows distance from the user, not from the vendor being viewed.
- The Airport-close filter chip from the mockup is not built; it needs geolocation.
