# Status

Current state. Overwritten each session, never appended to.

## What works
- Live at https://getlocalhawaii.vercel.app, building from GitHub on every push to `main`.
- All four pages render real Supabase data and now match both the 390px and 940px frames.
- Desktop: inline header nav, centered underlined hero with cream results panel and 3-up grid on home, two-column heroes and side rails on the detail pages, two-column body on category.
- Status, freshness and countdown logic in Pacific/Honolulu. 34 unit tests pass. Production build clean, no horizontal overflow at 375px.

## In progress
- Nothing. Phases 1 through 6 complete, plus the desktop layouts from the corrected spec.

## Next 3 steps
1. Point getlocalhawaii.com at Vercel: both apex and www are on the project, but the Cloudflare DNS records are not created yet.
2. Add the two Supabase env vars to the Preview environment in the Vercel dashboard.
3. Reconcile the recorded report-vs-unconfirmed decision with `getStatus`, which still checks freshness first.

## Known issues
- getlocalhawaii.com and www are attached to the Vercel project but unverified: Cloudflare still has no A or CNAME record for them.
- DECISIONS.md records that a same-day report should drive the status chip, but `src/lib/status.ts` still returns unconfirmed first. The code and the log disagree.
- Preview deployments have no Supabase env vars, so any branch build will fail. Vercel CLI 50.40.0 rejects its own documented all-branches command, so this needs the dashboard.
- Distances are seeded placeholders, so "also nearby" shows distance from the user, not from the vendor being viewed.
