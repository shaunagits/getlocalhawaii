# SEO Targets - Lei on Oʻahu

Distilled 2026-08-19 from the Google Keyword Planner exports in Shauna's
google-search folder (13 CSVs, 20,453 unique keywords, 348 lei-related).
Volumes are Keyword Planner buckets (50 / 500 / 5,000 avg monthly searches).
Monthly seasonality columns were blank in the exports.

## Strategy

Public-data directory first, no vendor calls in this phase. Every listing
imports as unconfirmed and carries its source. Type pages and vendor pages are
the organic capture surfaces; live inventory is a later phase, if ever.

## Tier 1: lei type pages (5,000 bucket each)

Build /oahu/lei/[type] pages listing every vendor whose usual products include
the type, with open-now computed and ItemList + LocalBusiness structured data.

- pikake lei (5,000)
- puakenikeni lei (5,000) - NOT in seed data yet, add as a product label
- maile lei (5,000) - also "maile lei near me" (500), "ti leaf maile lei" (500)
- plumeria lei (5,000)
- orchid lei (500) - many 50-tier variants (double orchid, white orchid)
- carnation lei (500)

Slugs and meta titles use ASCII spellings (pikake, puakenikeni) because that is
how people search. Page copy keeps Hawaiian diacriticals per the convention.

## Tier 2: vendor name pages (5,000 bucket)

- "lin's lei shop honolulu" + variants (5,000)
- "cindy lei shop honolulu hawaii" + roughly a dozen 50-tier variants (5,000)

Vendor detail pages must carry LocalBusiness schema with address, phone,
openingHours. Lin's and Cindy's are the two highest-value pages on the site.

## Tier 3: intent clusters (many terms, one page each)

- Where to buy: "fresh leis near me", "where to buy a lei near me", "lei shop
  honolulu" (500 tier, ~10 variants). Served by home page + /oahu/lei.
- Graduation: 15+ terms at 50 each ("fresh graduation leis near me", "money
  leis for graduation"). One guide page; heavily seasonal around May.
- Delivery and shipping: "lei delivery oahu", "fresh leis shipped to
  mainland", "order maile lei" (50 tier, ~17 terms). Needs a ships_mainland
  flag on vendors; Cindy's ships to all 50 states.
- Area: "lei shop chinatown honolulu", "lei shops downtown honolulu". A
  Chinatown/Maunakea Street area page; BY AREA block already points this way.

## Noted for later categories

- "kalihi fish market" / "chinatown honolulu fish market" (50 tier) exist in
  the exports; supports the fish category later.
- Generic farmers-market terms in the exports are dominated by mainland noise
  (Sprouts chain); local market pages should target market names, not generics.

## Source files

Keyword Planner exports live outside the repo in Shauna's google-search
folder: "Keyword Stats 2026-08-16 at *.csv". Date range Aug 2025 - Jul 2026.
