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
2026-08-19: Real data comes from public sources, no vendor calls in this phase - Shauna's call; calls become a later enrichment layer.
2026-08-19: Trust copy must reframe before real vendors ship: default state unconfirmed, chips show source-based freshness, drop "every listing gets a call or a visit" - cannot claim verification that did not happen.
2026-08-19: Never import Google Maps or Yelp content; vendors' own sites, official pages, and directories only - platform ToS prohibit republication.
2026-08-19: Slugs and meta titles use ASCII (pikake, puakenikeni), page copy keeps diacriticals - matches how people search without breaking the diacriticals convention.
2026-08-19: /oahu/lei and /lei/napua-lei-stand share one [one]/[two] route that dispatches on whether the first segment is an island or a category - Next allows only one dynamic segment name per level and both URL shapes are in the spec.
2026-08-19: Pages are force-dynamic - "open now" and the market countdown are wrong the moment they are cached.
2026-08-19: Env var stays NEXT_PUBLIC_SUPABASE_ANON_KEY holding the legacy anon key, per the spec and the Vercel step; the modern sb_publishable_ key is the upgrade path.
2026-08-19: Detail heroes live inside the dark header at both widths, with the action row rendered twice for the dark hero and the cream mobile shelf - both frames put the hero on teal, and one render cannot carry both palettes.
2026-08-19: Home answers use AnswerCard, category uses VendorCard - the home chip states only the status and folds the timing into the meta line, which is a different card, not a variant.
2026-08-19: getlocalhawaii.com keeps its DNS at Cloudflare with an A record to Vercel, rather than moving nameservers to vercel-dns - nameserver migration would take every other record on the domain with it.
2026-08-19: On a lapsed listing with a same-day report the chip row shows the report as the status and UNCONFIRMED as the verification, not the report age - both facts have to stay on screen, and the report age is the one already implied by "today".
2026-08-19: Freshness chip verb follows the method: source_check renders CHECKED, contact methods render VERIFIED - reading a posted page is not the same as reaching a person.
2026-08-19: A vendor with no posted hours gets status LISTED, not CLOSED - absent hours are unknown hours, and the empty week must never be read as shut.
2026-08-19: Result sorting breaks distance ties on name - real listings have no distance yet, so without it the order follows whatever Postgres returned.
2026-08-19: vendors gains address and website columns - LocalBusiness schema needs a postal address and a URL, and neither was in the original data model.
2026-08-19: Airport stands carry the state airports page's general 6a-10p hours, with the caveat printed in good_to_know - it is sourced and official, but it describes the row of stands, not each stand's own posting.
2026-08-19: Harriet's Yelp-listed hours were not imported, only the airports.hawaii.gov range - the no-Yelp rule covers hours as much as reviews.
2026-08-19: Capture pages share one /[island]/[category]/[slug] route resolving to a lei type, the delivery page, or an area - they are the same shape, prose plus a filtered list, and three routes would be three copies of it.
2026-08-19: Only Chinatown gets an area page; Airport and Kalihi resolve to 404 until someone writes prose for them - a page with a list and no writing is the thin content this whole exercise is meant to avoid.
2026-08-19: A type page with no matching vendors still ships, saying no source names that flower yet - the puakenikeni term is worth capturing and the honest empty state is better than omitting the page.
2026-08-19: Vendor pages emit schema.org Florist rather than bare LocalBusiness - it is a valid subtype and says what kind of shop it is; fields are omitted entirely when the data is missing.
2026-08-19: loadVendor and loadCategory are React cache() wrappers that own their own `now` - generateMetadata and the page body would otherwise query twice and read two different clocks.
2026-08-19: A vendor earns a sitemap entry and an indexable page by having source_url - the placeholder market vendors have none, so the rule is data-driven rather than a hardcoded slug list.
2026-08-19: A vendor with no posted hours shows a sentence saying so instead of the week table - the table renders every empty day as "closed", which is a claim we have no basis for.
2026-08-19: The related-listings block is titled "More lei shops", not "Also nearby", and prefers the same area - imported vendors have no distance, so proximity cannot be claimed.
2026-08-19: Airport now has an area page, written; the rule from the earlier entry stands, an area becomes a page only once it has prose, and Kalihi still 404s on one vendor and nothing written.
2026-08-19: Lin's website column cleared, source_url points at hiChinatown - linsleishop.com and linsleishophawaii.com both return HTTP 500, and linking customers to a dead site helps nobody.
2026-08-19: Content read from a web archive is imported with the event dated to the snapshot, not to today - the log then shows how old that claim really is, and the freshness chip still follows the newest source.
2026-08-19: Lin's founding year is not recorded; "since 1987" appears only on scraped aggregator sites and their own archived site says "over 20 years" undated - no permitted source states a year.
2026-08-19: An unmatched search returns nothing with a named reason, not the whole directory - the old fallback was invisible until there was a box to type in, at which point it reads as a search that ignores you.
2026-08-19: Home search answers only from listings with a source_url - the placeholder vendors are noindexed, and they should not be the answer to something a person typed either.
2026-08-19: The hero's third term is now open-now rather than the mockup's "this afternoon" - a live control in a sentence of live controls, and open-now is the only time filter the data supports.
2026-08-19: "near" is area equality, not proximity, and is kept anyway on Shauna's call - no vendor has coordinates, so near Kalihi returns Kalihi only.
2026-08-19: Nav drops the markets calendar and the produce listing - they pointed at a noindexed placeholder and at four unsourced vendors, which is a third of the chrome spent on suppressed content.
