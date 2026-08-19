# Status

Current state. Overwritten each session, never appended to.

## What works
- Next.js scaffold builds clean: TypeScript, Tailwind v4, App Router, design tokens and fonts wired.
- Status and freshness logic in `src/lib/status.ts` and `src/lib/time.ts`, all in Pacific/Honolulu. 30 unit tests pass.
- Shared components built and checked in the browser: StatusChip, VerificationChip, VendorCard, ActionButtons, SectionHeader, FilterChip, SiteHeader, SiteFooter.
- Schema and seed migrations written in `supabase/migrations/`.
- Home page renders a preview of the components against fixtures, replaced in phase 5.

## In progress
- Nothing mid-edit. Phases 1 through 4 of the build order are complete.

## Next 3 steps
1. Create the Supabase project, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, apply both migrations.
2. Phase 5: build the four pages against Supabase, replacing the fixture home page.
3. Phase 6: push to GitHub, import the repo in Vercel, verify getlocalhawaii.vercel.app.

## Known issues
- The migrations have never been run. No Postgres was available locally, so the SQL is unvalidated until phase 5.
- Distances are seeded placeholders, so "also nearby" shows distance from the user, not from the vendor being viewed.
- Nothing is pushed yet; the origin remote is set but has no commits.
