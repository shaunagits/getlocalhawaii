# Get Local Hawaii

Directory site for finding local Hawaii vendors (lei stands, farmers markets, fish, produce) with a freshness/verification system as the core product idea: every listing shows when it was last verified, and "open now" status is computed, never hardcoded.

## Key files

- `docs/BUILD_SPEC.md` - full build spec: design tokens, page inventory, data model, business logic. Read this before building anything.
- `docs/Get Local Hawaii - Home.dc.html` - original design mockups: 4 screens, each with a 390px phone frame AND a 940px desktop frame. Reference for exact visual detail. Do not copy its markup; rebuild as components.
- `src/lib/status.ts` - all status, freshness and countdown logic. `src/lib/time.ts` - all Hawaii clock math. `src/lib/queries.ts` - data access, returns objects with status already attached.

## Stack

- Next.js 16 (App Router, TypeScript, Tailwind v4), Vitest for unit tests.
- Supabase (Postgres) project `getlocalhawaii`, ref `aqizthcpjohxsepbemjm`. Public read via RLS, anon key only, no writes from the app.
- Repo https://github.com/shaunagits/getlocalhawaii.git, deployed on Vercel from `main`.
- Live at https://getlocalhawaii.com (and www). Vercel temp domain: getlocalhawaii.vercel.app.
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`, see `.env.example`.

## Conventions

- Mobile-first, but every screen also has a designed 940px desktop layout in the canvas. Build both, breakpoint around 768px. See BUILD_SPEC section 4 desktop rules.
- Never use em dashes in any user-facing copy, commit messages, or docs.
- Do not credit Claude or AI in commits, code comments, or anywhere in the repo.
- Hawaiian diacriticals (ʻokina, kahakō) must be preserved exactly: Oʻahu, Kalihi, Waimānalo, Kaimukī, lūʻau, GET LOCAL HAWAIʻI.
- All status logic (open now, closes 2p, verified today) computed from data in Pacific/Honolulu timezone. Never store a computed status.
- Pages are `force-dynamic`: a cached "open now" is a wrong answer served fast.
- `day_of_week` is 0=Sunday..6=Saturday everywhere, matching JavaScript `getDay()`.

## Documentation rules

- This file is stable facts only: stack, conventions, key files, commands. Keep it under 60 lines. Edit only when something permanent changes.
- `docs/DECISIONS.md` is append-only. One line per entry: date, decision, one-phrase reason. Record only decisions a future session would otherwise re-litigate or reverse by accident. No narration of work done.
- `docs/STATUS.md` is always overwritten to reflect current state, max 20 lines: what works, what is in progress, next 3 steps, known issues. Rewrite it at the end of every working session. Never append history here; git log is the history.
- Do not create any other docs (no session summaries, changelogs, or READMEs beyond a 10-line README) unless asked.
- Commit messages carry the detail: what changed and why, so the docs can stay short.

## Commands

- `npm run dev` - local dev server
- `npm run build` - production build
- `npm test` - unit tests (Vitest)
- `npx tsc --noEmit && npx eslint src --max-warnings=0` - typecheck and lint
- Deploys happen on push to `main`; no manual deploy step.
