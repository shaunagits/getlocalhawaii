# Status

Current state. Overwritten each session, never appended to.

## What works
- Live at https://getlocalhawaii.vercel.app, building from GitHub on every push to `main`.
- All four pages render real Supabase data: home `/`, category `/oahu/lei`, vendor `/lei/napua-lei-stand`, market `/markets/kaimuki-neighborhood`.
- Schema and seed applied to the `getlocalhawaii` Supabase project. Security advisors report no issues.
- Status, freshness and countdown logic in Pacific/Honolulu. 34 unit tests pass.
- Supabase env vars set in Vercel for Production and Development.

## In progress
- Nothing. Phases 1 through 6 of the build order are complete.

## Next 3 steps
1. Add the two Supabase env vars to the Preview environment in the Vercel dashboard.
2. Check the market page during market hours to confirm the ON NOW countdown renders live.
3. Decide what comes after the first deploy: real search, geolocation, or the report flow.

## Known issues
- Preview deployments have no Supabase env vars, so any branch build will fail. Vercel CLI 50.40.0 rejects its own documented all-branches command, so this needs the dashboard.
- Browse all, Markets calendar and In season nav links point at the nearest existing page, since those pages are out of scope for the first deploy.
- Distances are seeded placeholders, so "also nearby" shows distance from the user, not from the vendor being viewed.
- The Airport-close filter chip from the mockup is not built; it needs geolocation.
