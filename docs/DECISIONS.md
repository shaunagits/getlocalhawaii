# Decisions

Append-only. One line per entry: date, decision, one-phrase reason.

2026-08-19: Docs limited to CLAUDE.md, DECISIONS.md, STATUS.md, and a short README - commit messages carry the detail.
2026-08-19: Seed data ships as a numbered migration, not a separate seed script - one ordered history, rollback is just a down migration.
2026-08-19: Reports are the override; no separate overrides table - a same-day report is what makes a vendor read as sold out.
2026-08-19: subject_type on verification_events and reports includes 'popup' as well as vendor and market - keeps all freshness in one table.
2026-08-19: Status columns use text plus check constraints, not Postgres enums - new values need no type migration.
2026-08-19: vendors.distance_mi and markets.distance_mi are seeded placeholders - real distances wait for geolocation, but cards need to sort now.
2026-08-19: day_of_week is 0=Sunday..6=Saturday to match JavaScript getDay() - avoids an off-by-one at every read.
2026-08-19: An unverified listing reads as unconfirmed even when a same-day report exists - we will not claim sold out for a stand we have not checked in 30 days.
2026-08-19: Hours whose closing time is not after the opening time are read as running past midnight - lets late sessions stay open without a spans_midnight column.
2026-08-19: StatusChip derives colour and marker from the status kind, never from a caller prop - the same state cannot look different on two pages.
2026-08-19: Supabase project aqizthcpjohxsepbemjm in us-west-1, $10/mo - closest region to Hawaii, both migrations applied clean.
2026-08-19: Reversed the unconfirmed-vs-report call: a same-day report drives the status chip, verification chip shows unconfirmed - Shauna's pick, freshest data wins while staleness stays visible.
2026-08-19: Spec correction: the design canvas includes 940px desktop layouts for all four screens, not mobile-only - the centered-column desktop convention was a spec extraction error, desktop rules now in BUILD_SPEC section 4.
2026-08-19: /oahu/lei and /lei/napua-lei-stand share one [one]/[two] route that dispatches on whether the first segment is an island or a category - Next allows only one dynamic segment name per level and both URL shapes are in the spec.
2026-08-19: Pages are force-dynamic - "open now" and the market countdown are wrong the moment they are cached.
2026-08-19: Env var stays NEXT_PUBLIC_SUPABASE_ANON_KEY holding the legacy anon key, per the spec and the Vercel step; the modern sb_publishable_ key is the upgrade path.
2026-08-19: Detail heroes live inside the dark header at both widths, with the action row rendered twice for the dark hero and the cream mobile shelf - both frames put the hero on teal, and one render cannot carry both palettes.
2026-08-19: Home answers use AnswerCard, category uses VendorCard - the home chip states only the status and folds the timing into the meta line, which is a different card, not a variant.
2026-08-19: getlocalhawaii.com keeps its DNS at Cloudflare with an A record to Vercel, rather than moving nameservers to vercel-dns - nameserver migration would take every other record on the domain with it.
