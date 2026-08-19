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
