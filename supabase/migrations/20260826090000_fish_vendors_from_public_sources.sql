-- Import the real Oʻahu fish vendors compiled in data/fish-vendors-oahu.csv
-- from vendors' own sites, news outlets and independent directories. Public
-- sources only, no vendor calls, nothing from Google Maps or Yelp.
--
-- Anything the sources left as TBC imports as NULL. A blank column renders as
-- a blank column; it is never filled with a plausible guess.
--
-- Tamashiro Market is deliberately absent: it closed permanently on
-- 2026-04-30 per Hawaii News Now. The seeded placeholder Windward Fish Guy
-- stays; it has no source_url, so it remains out of search, sitemap and
-- indexing, and its removal is a separate decision.

insert into vendors (slug, name, category_id, island_id, area, description, story,
                     address, website, phone, contact_method, good_to_know,
                     ships_mainland, source_url)
select v.slug, v.name, c.id, i.id, v.area, v.description, v.story,
       v.address, v.website, v.phone, v.contact_method, v.good_to_know,
       v.ships_mainland, v.source_url
from (values

  ('nicos-pier-38-fish-market',
   $t$Nico's Pier 38 Fish Market$t$, 'Pier 38',
   $t$Auction-fresh fillets, poke and smoked seafood$t$,
   $t$Founded by chef Nico Chaize next door to the Honolulu Fish Auction, which is where the fish counter buys each morning.$t$,
   $t$1129 N Nimitz Hwy, Honolulu, HI 96817$t$,
   'https://nicospier38.com/fish-market/', '(808) 983-1263', 'call',
   $t$The sit-down restaurant at the same address is a separate operation with its own phone and later hours; this listing is the retail fish market. Prepared-food counters inside the market keep shorter hours than the market itself.$t$,
   null, 'https://nicospier38.com/fish-market/'),

  ('pier-38-fish-market',
   $t$Pier 38 Fish Market$t$, 'Pier 38',
   $t$Fresh fillets, sashimi platters and poke kits$t$,
   $t$The retail arm of Fresh Island Fish Co., a wholesale distributor since 1977 sourcing from the Hawaii Longline Association. It says it is Hawaiʻi's first and only MSC-certified fish market, and sold wholesale only until the pandemic.$t$,
   $t$1135 N Nimitz Hwy, Honolulu, HI 96817$t$,
   'https://pier38fishmarket.com', '(808) 784-4988', 'call',
   $t$Two fish markets sit side by side at Pier 38; Nico's next door at 1129 is a different business. Online orders for local pickup at shop.pier38fishmarket.com.$t$,
   null, 'https://pier38fishmarket.com'),

  ('alicias-market',
   $t$Alicia's Market$t$, 'Kalihi',
   $t$Kalihi corner market with a poke case about 18 varieties deep$t$,
   $t$Founded in 1949 by Alicia and Raymond Kam and now run by their grandsons Chris and Brad. A 2018 fire destroyed the kitchen; the store reopened in the rebuilt original location in late 2022.$t$,
   $t$267 Mokauea St, Honolulu, HI 96819$t$,
   'https://aliciasmarket.com', '(808) 841-1921', 'call',
   $t$Hours are as reported by Honolulu Magazine; the store's own site does not post them.$t$,
   null, 'https://www.honolulumagazine.com/alicias-market-just-moved-back-into-its-original-kalihi-location/'),

  ('poke-by-the-pound',
   $t$Poke by the Pound$t$, 'Kalihi',
   $t$Poke and sashimi by the pound$t$, null,
   $t$322 Kalihi St, Honolulu, HI 96819$t$,
   'https://www.pokebythepound.com', '(808) 744-1222', 'call',
   $t$The shop says all its fish is sourced locally and never frozen.$t$,
   null, 'https://www.pokebythepound.com'),

  ('honolulu-fish-company',
   $t$Honolulu Fish Company$t$, 'Kalihi',
   $t$Sashimi-grade fish shipped overnight anywhere in the US$t$,
   $t$Founded in 1995 by marine biologist Wayne Samiere, buying hand-selected fish at the Honolulu Fish Auction each morning. No net-caught fish and no immature fish.$t$,
   $t$824 Gulick Ave, Honolulu, HI 96819$t$,
   'https://honolulufish.com', null, 'call',
   $t$Primarily an online and wholesale business; whether walk-in retail exists at Gulick Avenue is not stated anywhere, so call before visiting. Consumer orders at honolulufishmarket.com ship overnight in a cold-chain box.$t$,
   true, 'https://honolulufish.com/pages/contact-us'),

  ('maguro-brothers-chinatown',
   $t$Maguro Brothers Hawaii$t$, 'Chinatown',
   $t$Sashimi and poke bowls from the morning fish auction$t$,
   $t$Run by brothers Junichiro and Ryojiro Tsuchiya, who opened in Kekaulike Market in 2014 and later moved to Maunakea Marketplace. The fish is bought directly from the Honolulu fish auction.$t$,
   $t$1120 Maunakea St, Honolulu, HI 96817$t$,
   'https://magurobrothershawaii.com', null, 'call',
   $t$Inside Maunakea Marketplace. Sells bowls, cups and platters rather than fillets by the pound; custom sashimi platters can be preordered online.$t$,
   false, 'https://magurobrothershawaii.com'),

  ('maguro-brothers-waikiki',
   $t$Maguro Brothers Hawaii Waikīkī$t$, $t$Waikīkī$t$,
   $t$Evening sashimi and poke bowls$t$,
   $t$The evening location of the Chinatown stand, opened in 2016 and later moved to Kalākaua Avenue.$t$,
   $t$2250 Kalākaua Ave, Honolulu, HI 96815$t$,
   'https://magurobrothershawaii.com', null, 'call',
   $t$Open evenings only. Same auction-sourced fish as the Chinatown location.$t$,
   false, 'https://magurobrothershawaii.com'),

  ('morning-catch',
   $t$Morning Catch$t$, 'Chinatown',
   $t$Poke by the pound inside Oʻahu Market$t$,
   $t$Opened in March 2021 inside Oʻahu Market, with fish from the 88 Fresh Fish stall next door, sauced to order.$t$,
   $t$145 N King St #12, Honolulu, HI 96817$t$,
   null, '(808) 840-7155', 'call',
   $t$Hours are as reported by Honolulu Magazine in 2024. A second counter in Kekaulike Market facing Hotel Street opened in 2023.$t$,
   null, 'https://www.honolulumagazine.com/morning-catch/'),

  ('88-fresh-fish',
   $t$88 Fresh Fish$t$, 'Chinatown',
   $t$Fresh whole fish daily inside Oʻahu Market$t$, null,
   $t$145 N King St #23, Honolulu, HI 96817$t$,
   null, '(808) 524-6988', 'call',
   $t$Hours are as listed in the Slow Food Oʻahu guide. Cleaning and filleting are free. Supplies the Morning Catch poke counter next door.$t$,
   null, 'https://slowfoodoahu.com/articles/buy-local-fish-on-oahu.html'),

  ('blue-seafood-company',
   $t$Blue Seafood Company$t$, 'Chinatown',
   $t$Daily-changing fresh fish and poke in Maunakea Marketplace$t$,
   $t$Opened in February 2025 with a fresh fish counter and a food-court stall that will cook your purchase.$t$,
   $t$1120 Maunakea St Ste 168, Honolulu, HI 96817$t$,
   null, null, 'call',
   $t$Published sources conflict on both the phone number and the exact hours, so neither is listed here; the market side has been reported open roughly 7a to 3:30p daily.$t$,
   null, 'https://alohastatedaily.com/2025/02/28/new-seafood-market-swims-into-honolulus-chinatown/'),

  ('yamas-fish-market',
   $t$Yama's Fish Market$t$, $t$Mōʻiliʻili$t$,
   $t$Poke and Hawaiian food, takeout only$t$,
   $t$Family-run since 1980, growing from a neighborhood fish market into a Hawaiian food institution. The ʻahi comes from the daily Honolulu fish auction and the limu poke is the signature.$t$,
   $t$2332 Young St, Honolulu, HI 96826$t$,
   'https://yamasfishmarket.com', '(808) 941-9994', 'call',
   $t$Takeout only, no seating, with seven parking stalls on site. The site posts a full holiday-hours schedule each year.$t$,
   null, 'https://yamasfishmarket.com/contact'),

  ('ono-seafood',
   $t$Ono Seafood$t$, 'Kapahulu',
   $t$Made-to-order poke by the pound$t$,
   $t$The Kapahulu original opened in 2006; a second location followed in Kalama Valley in 2019.$t$,
   $t$747 Kapahulu Ave, Honolulu, HI 96816$t$,
   null, '(808) 732-4806', 'call',
   $t$No working website; the old domain is parked and several lookalike sites are unofficial. Posted hours could not be confirmed from a current source, so call ahead.$t$,
   null, 'https://onolicioushawaii.com/ono-seafood/'),

  ('fresh-catch-kapahulu',
   $t$Fresh Catch$t$, 'Kapahulu',
   $t$Poke, sashimi platters and plate lunches$t$,
   $t$Chef and owner Reno Henriques buys off the Honolulu auction block. First place in Hawaiʻi's Best 2023.$t$,
   $t$1113 Kapahulu Ave, Honolulu, HI 96816$t$,
   'https://www.freshcatch808.com', '(808) 735-7653', 'call',
   $t$Takeout deli format, not a sit-down restaurant. A Sand Island food truck also runs Fridays 10a to 1p.$t$,
   null, 'https://www.freshcatch808.com'),

  ('fresh-catch-kaneohe',
   $t$Fresh Catch Kāneʻohe$t$, $t$Kāneʻohe$t$,
   $t$Poke, sashimi platters and plate lunches, windward side$t$,
   $t$The windward location of Fresh Catch, Chef Reno Henriques' takeout seafood deli.$t$,
   $t$45-1002 Kamehameha Hwy, Kāneʻohe, HI 96744$t$,
   'https://www.freshcatch808.com', '(808) 235-7653', 'call',
   $t$Closes an hour later than the Kapahulu shop on Tuesday through Saturday.$t$,
   null, 'https://www.freshcatch808.com'),

  ('off-the-hook-poke-market',
   $t$Off the Hook Poke Market$t$, $t$Mānoa$t$,
   $t$ʻAhi poke by the pound from the daily auction$t$,
   $t$Opened in 2018; its Cold Ginger ʻAhi with ginger scallion sauce is the signature. All ʻahi comes fresh from the Honolulu Fish Auction daily.$t$,
   $t$2908 E Mānoa Rd, Honolulu, HI 96822$t$,
   'https://www.offthehookpokemarket.com', '(808) 800-6865', 'call',
   null,
   null, 'https://www.offthehookpokemarket.com'),

  ('tamuras-waialae',
   $t$Tamura's Fine Wine & Liquors Waiʻalae$t$, $t$Kaimukī$t$,
   $t$Poke bar inside the wine shop$t$,
   $t$Four generations of the Tamura family; the wine shops date to 1995 and every location runs a poke bar made fresh daily.$t$,
   $t$3496 Waiʻalae Ave, Honolulu, HI 96816$t$,
   'https://www.tamurasfinewine.com', '(808) 735-7100', 'call',
   $t$Takeout only; the poke can sell out by afternoon.$t$,
   null, 'https://www.tamurasfinewine.com/poke'),

  ('tamuras-pearlridge',
   $t$Tamura's Fine Wine & Liquors Pearlridge$t$, 'Aiea',
   $t$Poke bar inside the wine shop$t$, null,
   $t$98-129 Kaonohi St Ste 6003, Aiea, HI 96701$t$,
   'https://www.tamurasfinewine.com', '(808) 488-7444', 'call',
   $t$Takeout only; the poke can sell out by afternoon.$t$,
   null, 'https://www.tamurasfinewine.com/poke'),

  ('tamuras-aikahi',
   $t$Tamura's Fine Wine & Liquors Aikahi$t$, 'Kailua',
   $t$Poke bar inside the wine shop$t$, null,
   $t$25 Kaneohe Bay Dr #106, Kailua, HI 96734$t$,
   'https://www.tamurasfinewine.com', '(808) 254-2000', 'call',
   $t$Takeout only; the poke can sell out by afternoon.$t$,
   null, 'https://www.tamurasfinewine.com/poke'),

  ('kbay-bros-fish-and-ice',
   $t$K.Bay Bros Fish & Ice$t$, $t$Kāneʻohe$t$,
   $t$20-plus poke varieties daily, plus bagged ice$t$,
   $t$Opened in September 2021 across from Windward Mall by the four Koki brothers, who grew up fishing off Heʻeia. The name honors Kāneʻohe Bay.$t$,
   $t$46-028 Kawa St, Kāneʻohe, HI 96744$t$,
   null, null, 'call',
   $t$The fish is a mix of fresh and frozen from local fishermen and suppliers. Posted hours could not be confirmed from a current source, so check before driving over.$t$,
   null, 'https://www.honolulumagazine.com/kaneohes-new-poke-shop-has-more-than-20-varieties-daily/'),

  ('kahuku-superette',
   $t$Kahuku Superette$t$, 'Kahuku',
   $t$Famous poke counter at the back of a country store$t$,
   $t$A plain convenience store with a poke counter that made it a required stop on round-island drives. The shoyu poke is the signature.$t$,
   $t$56-505 Kamehameha Hwy, Kahuku, HI 96731$t$,
   null, '(808) 293-9878', 'call',
   $t$Published sources conflict on the hours and the store posts none online, so call ahead.$t$,
   null, 'https://migrationology.com/hawaiian-poke-bowl-kahuku-superette/'),

  ('taniokas',
   $t$Tanioka's Seafoods & Catering$t$, 'Waipahu',
   $t$Poke, sashimi and okazuya since 1978$t$,
   $t$Founded in 1978 by Mel and Lynn Tanioka, growing from one rented retail stall into its own building. Their children Jasmine and Justin run it today.$t$,
   $t$94-903 Farrington Hwy, Waipahu, HI 96797$t$,
   'https://taniokas.com', '(808) 671-3779', 'call',
   $t$Online ordering for pickup. Merchandise ships to the mainland but the food does not.$t$,
   false, 'https://taniokas.getbento.com/location/taniokas-seafoods-catering/'),

  ('waianae-store',
   $t$Waiʻanae Store$t$, $t$Waiʻanae$t$,
   $t$Supermarket with fresh poke on the Waiʻanae coast$t$,
   $t$A family-owned supermarket since 1949, operated by Okimoto Corp, and the largest food store on the coast between Kapolei and Mākaha.$t$,
   $t$85-863 Farrington Hwy, Waiʻanae, HI 96792$t$,
   'https://www.waianaestore.com', '(808) 696-3131', 'call',
   $t$The store advertises fresh poke and a meat and fish counter but does not list fish types.$t$,
   null, 'https://www.waianaestore.com'),

  ('local-ia',
   $t$Local Iʻa$t$, $t$Kaimukī$t$,
   $t$Community supported fishery with weekly island fish shares$t$,
   $t$Hawaiʻi's first community supported fishery, built around loko iʻa and supporting lawaiʻa who fish with pono practices. Fish is island-local, line- or spear-caught and sashimi-grade.$t$,
   $t$3458 Waiʻalae Ave, Honolulu, HI 96816$t$,
   'https://www.localiahawaii.com', '(808) 492-8331', 'call',
   $t$Retail hours are as listed in the Slow Food Oʻahu guide; the Kaimukī outlet opens Friday and Saturday only, and a Sunday morning stand runs at the Mililani Farmers Market. Weekly CSF shares pick up at locations across the island.$t$,
   null, 'https://slowfoodoahu.com/articles/buy-local-fish-on-oahu.html')

) as v(slug, name, area, description, story, address, website, phone,
       contact_method, good_to_know, ships_mainland, source_url)
join categories c on c.slug = 'fish'
join islands    i on i.slug = 'oahu';

-- Hours, only where a source actually posts them. Own-site hours import as
-- posted; third-party hours import only when a single current source states
-- them, with the sourcing named in good_to_know. Conflicting or stale hours
-- (Blue Seafood, Kahuku Superette, Ono Seafood, K.Bay Bros) stay blank, and
-- Honolulu Fish Company's posted range reads as operating hours rather than
-- walk-in retail hours, so it stays blank too.

insert into vendor_hours (vendor_id, day_of_week, opens, closes)
select v.id, h.day_of_week, h.opens, h.closes
from (values
  -- Nico's Pier 38 Fish Market, per its own site.
  ('nicos-pier-38-fish-market', 0, time '10:00', time '16:00'),
  ('nicos-pier-38-fish-market', 1, time '06:30', time '17:00'),
  ('nicos-pier-38-fish-market', 2, time '06:30', time '17:00'),
  ('nicos-pier-38-fish-market', 3, time '06:30', time '17:00'),
  ('nicos-pier-38-fish-market', 4, time '06:30', time '17:00'),
  ('nicos-pier-38-fish-market', 5, time '06:30', time '17:00'),
  ('nicos-pier-38-fish-market', 6, time '06:30', time '17:00'),

  -- Pier 38 Fish Market, per its own site.
  ('pier-38-fish-market', 2, time '09:00', time '16:30'),
  ('pier-38-fish-market', 3, time '09:00', time '16:30'),
  ('pier-38-fish-market', 4, time '09:00', time '16:30'),
  ('pier-38-fish-market', 5, time '09:00', time '16:30'),
  ('pier-38-fish-market', 6, time '09:00', time '16:30'),

  -- Alicia's Market, per Honolulu Magazine.
  ('alicias-market', 1, time '10:00', time '14:00'),
  ('alicias-market', 2, time '10:00', time '14:00'),
  ('alicias-market', 3, time '10:00', time '14:00'),
  ('alicias-market', 4, time '10:00', time '14:00'),
  ('alicias-market', 5, time '10:00', time '14:00'),
  ('alicias-market', 6, time '10:00', time '14:00'),

  -- Poke by the Pound, per its own site.
  ('poke-by-the-pound', 0, time '09:00', time '17:00'),
  ('poke-by-the-pound', 1, time '09:00', time '18:00'),
  ('poke-by-the-pound', 2, time '09:00', time '18:00'),
  ('poke-by-the-pound', 3, time '09:00', time '18:00'),
  ('poke-by-the-pound', 4, time '09:00', time '18:00'),
  ('poke-by-the-pound', 5, time '09:00', time '18:00'),
  ('poke-by-the-pound', 6, time '09:00', time '18:00'),

  -- Maguro Brothers, per its own site.
  ('maguro-brothers-chinatown', 1, time '09:00', time '14:00'),
  ('maguro-brothers-chinatown', 2, time '09:00', time '14:00'),
  ('maguro-brothers-chinatown', 3, time '09:00', time '14:00'),
  ('maguro-brothers-chinatown', 4, time '09:00', time '14:00'),
  ('maguro-brothers-chinatown', 5, time '09:00', time '14:00'),
  ('maguro-brothers-chinatown', 6, time '09:00', time '14:00'),
  ('maguro-brothers-waikiki', 1, time '17:00', time '20:00'),
  ('maguro-brothers-waikiki', 2, time '17:00', time '20:00'),
  ('maguro-brothers-waikiki', 3, time '17:00', time '20:00'),
  ('maguro-brothers-waikiki', 4, time '17:00', time '20:00'),
  ('maguro-brothers-waikiki', 5, time '17:00', time '20:00'),
  ('maguro-brothers-waikiki', 6, time '17:00', time '20:00'),

  -- Morning Catch, per Honolulu Magazine.
  ('morning-catch', 0, time '09:00', time '14:00'),
  ('morning-catch', 1, time '09:00', time '14:00'),
  ('morning-catch', 2, time '09:00', time '14:00'),
  ('morning-catch', 3, time '09:00', time '14:00'),
  ('morning-catch', 4, time '09:00', time '14:00'),
  ('morning-catch', 5, time '09:00', time '14:00'),
  ('morning-catch', 6, time '09:00', time '14:00'),

  -- 88 Fresh Fish, per the Slow Food Oʻahu guide.
  ('88-fresh-fish', 0, time '08:00', time '14:00'),
  ('88-fresh-fish', 1, time '08:00', time '14:00'),
  ('88-fresh-fish', 2, time '08:00', time '14:00'),
  ('88-fresh-fish', 3, time '08:00', time '14:00'),
  ('88-fresh-fish', 4, time '08:00', time '14:00'),
  ('88-fresh-fish', 5, time '08:00', time '14:00'),
  ('88-fresh-fish', 6, time '08:00', time '14:00'),

  -- Yama's Fish Market, per its own site.
  ('yamas-fish-market', 0, time '09:00', time '17:00'),
  ('yamas-fish-market', 2, time '09:00', time '17:00'),
  ('yamas-fish-market', 3, time '09:00', time '17:00'),
  ('yamas-fish-market', 4, time '09:00', time '17:00'),
  ('yamas-fish-market', 5, time '09:00', time '19:00'),
  ('yamas-fish-market', 6, time '09:00', time '19:00'),

  -- Fresh Catch, per its own site.
  ('fresh-catch-kapahulu', 0, time '10:00', time '17:00'),
  ('fresh-catch-kapahulu', 2, time '10:00', time '18:00'),
  ('fresh-catch-kapahulu', 3, time '10:00', time '18:00'),
  ('fresh-catch-kapahulu', 4, time '10:00', time '18:00'),
  ('fresh-catch-kapahulu', 5, time '10:00', time '18:00'),
  ('fresh-catch-kapahulu', 6, time '10:00', time '18:00'),
  ('fresh-catch-kaneohe', 0, time '10:00', time '17:00'),
  ('fresh-catch-kaneohe', 2, time '10:00', time '19:00'),
  ('fresh-catch-kaneohe', 3, time '10:00', time '19:00'),
  ('fresh-catch-kaneohe', 4, time '10:00', time '19:00'),
  ('fresh-catch-kaneohe', 5, time '10:00', time '19:00'),
  ('fresh-catch-kaneohe', 6, time '10:00', time '19:00'),

  -- Off the Hook Poke Market, per its own site.
  ('off-the-hook-poke-market', 1, time '10:00', time '18:00'),
  ('off-the-hook-poke-market', 2, time '10:00', time '18:00'),
  ('off-the-hook-poke-market', 3, time '10:00', time '18:00'),
  ('off-the-hook-poke-market', 4, time '10:00', time '18:00'),
  ('off-the-hook-poke-market', 5, time '10:00', time '18:00'),
  ('off-the-hook-poke-market', 6, time '10:00', time '18:00'),

  -- Tamura's Fine Wine & Liquors, per its own site.
  ('tamuras-waialae', 0, time '09:30', time '20:00'),
  ('tamuras-waialae', 1, time '09:30', time '20:00'),
  ('tamuras-waialae', 2, time '09:30', time '20:00'),
  ('tamuras-waialae', 3, time '09:30', time '20:00'),
  ('tamuras-waialae', 4, time '09:30', time '20:00'),
  ('tamuras-waialae', 5, time '09:30', time '20:00'),
  ('tamuras-waialae', 6, time '09:30', time '20:00'),
  ('tamuras-pearlridge', 0, time '09:30', time '19:00'),
  ('tamuras-pearlridge', 1, time '09:30', time '20:00'),
  ('tamuras-pearlridge', 2, time '09:30', time '20:00'),
  ('tamuras-pearlridge', 3, time '09:30', time '20:00'),
  ('tamuras-pearlridge', 4, time '09:30', time '20:00'),
  ('tamuras-pearlridge', 5, time '09:30', time '20:00'),
  ('tamuras-pearlridge', 6, time '09:30', time '20:00'),
  ('tamuras-aikahi', 0, time '09:30', time '19:00'),
  ('tamuras-aikahi', 1, time '09:30', time '20:00'),
  ('tamuras-aikahi', 2, time '09:30', time '20:00'),
  ('tamuras-aikahi', 3, time '09:30', time '20:00'),
  ('tamuras-aikahi', 4, time '09:30', time '20:00'),
  ('tamuras-aikahi', 5, time '09:30', time '20:00'),
  ('tamuras-aikahi', 6, time '09:30', time '20:00'),

  -- Tanioka's, per its own site.
  ('taniokas', 0, time '09:00', time '14:00'),
  ('taniokas', 3, time '09:00', time '14:00'),
  ('taniokas', 4, time '09:00', time '14:00'),
  ('taniokas', 5, time '09:00', time '14:00'),
  ('taniokas', 6, time '09:00', time '14:00'),

  -- Waiʻanae Store, per its own site.
  ('waianae-store', 0, time '07:00', time '21:00'),
  ('waianae-store', 1, time '07:00', time '21:00'),
  ('waianae-store', 2, time '07:00', time '21:00'),
  ('waianae-store', 3, time '07:00', time '21:00'),
  ('waianae-store', 4, time '07:00', time '21:00'),
  ('waianae-store', 5, time '07:00', time '21:00'),
  ('waianae-store', 6, time '07:00', time '21:00'),

  -- Local Iʻa Kaimukī outlet, per the Slow Food Oʻahu guide.
  ('local-ia', 5, time '10:00', time '18:00'),
  ('local-ia', 6, time '10:00', time '15:00')
) as h(vendor_slug, day_of_week, opens, closes)
join vendors v on v.slug = h.vendor_slug;

-- Products, only what the sources list.

insert into vendor_products (vendor_id, label, note, sort_order)
select v.id, p.label, p.note, p.sort_order
from (values
  ('nicos-pier-38-fish-market', 'Fresh fillets', $t$auction-fresh, bought next door$t$, 1),
  ('nicos-pier-38-fish-market', 'Poke', null, 2),
  ('nicos-pier-38-fish-market', 'Smoked seafood', null, 3),
  ('nicos-pier-38-fish-market', 'Sashimi platters', null, 4),

  ('pier-38-fish-market', 'Fresh fillets', $t$ʻahi, swordfish, mahi mahi, marlin, ono, opah$t$, 1),
  ('pier-38-fish-market', 'Sashimi platters', null, 2),
  ('pier-38-fish-market', 'Poke and poke kits', null, 3),
  ('pier-38-fish-market', 'Uni and roe', $t$uni, ikura, tobiko$t$, 4),

  ('alicias-market', 'Poke', $t$about 18 varieties in the case$t$, 1),
  ('alicias-market', 'Chinese roast meats', null, 2),
  ('alicias-market', 'Hawaiian plates', null, 3),
  ('alicias-market', 'Dried aku', null, 4),

  ('poke-by-the-pound', 'Poke by the pound', $t$shoyu onion, limu kukui nut, spicy tuna, tako, marlin$t$, 1),
  ('poke-by-the-pound', 'Sashimi by the pound', null, 2),
  ('poke-by-the-pound', $t$ʻAhi plates$t$, null, 3),

  ('honolulu-fish-company', 'Sashimi-grade fillets', $t$30+ Pacific species, shipped overnight$t$, 1),

  ('maguro-brothers-chinatown', 'Sashimi bowls', $t$ʻahi, chūtoro, king salmon, hamachi, tako$t$, 1),
  ('maguro-brothers-chinatown', 'Poke bowls and cups', null, 2),
  ('maguro-brothers-chinatown', 'Custom sashimi platters', $t$preorder online$t$, 3),
  ('maguro-brothers-chinatown', 'Grilled fish plates', null, 4),

  ('maguro-brothers-waikiki', 'Sashimi bowls', null, 1),
  ('maguro-brothers-waikiki', 'Poke bowls and cups', null, 2),

  ('morning-catch', 'Poke by the pound', $t$ʻahi, king salmon, hamachi, tako$t$, 1),
  ('morning-catch', 'Poke bowls', null, 2),

  ('88-fresh-fish', 'Fresh whole fish', $t$free cleaning and filleting$t$, 1),

  ('blue-seafood-company', 'Fresh fish', $t$daily-changing selection$t$, 1),
  ('blue-seafood-company', 'Poke by the half pound', null, 2),

  ('yamas-fish-market', 'Poke', $t$ʻahi limu is the signature$t$, 1),
  ('yamas-fish-market', 'Lau lau', null, 2),
  ('yamas-fish-market', 'Kalua pig', null, 3),
  ('yamas-fish-market', 'Plate lunches', null, 4),
  ('yamas-fish-market', 'Haupia', null, 5),

  ('ono-seafood', 'Poke by the pound', $t$ʻahi, tako and salmon, made to order$t$, 1),
  ('ono-seafood', 'Sashimi trays', null, 2),

  ('fresh-catch-kapahulu', 'Poke', null, 1),
  ('fresh-catch-kapahulu', 'Sashimi and poke platters', null, 2),
  ('fresh-catch-kapahulu', 'Plate lunches', null, 3),

  ('fresh-catch-kaneohe', 'Poke', null, 1),
  ('fresh-catch-kaneohe', 'Sashimi and poke platters', null, 2),
  ('fresh-catch-kaneohe', 'Plate lunches', null, 3),

  ('off-the-hook-poke-market', $t$ʻAhi poke by the pound$t$, $t$Cold Ginger ʻAhi is the signature$t$, 1),
  ('off-the-hook-poke-market', 'Poke bowls', null, 2),

  ('tamuras-waialae', 'Poke bar', $t$made fresh daily$t$, 1),
  ('tamuras-pearlridge', 'Poke bar', $t$made fresh daily$t$, 1),
  ('tamuras-aikahi', 'Poke bar', $t$made fresh daily$t$, 1),

  ('kbay-bros-fish-and-ice', 'Poke', $t$20+ varieties daily$t$, 1),
  ('kbay-bros-fish-and-ice', 'Poke bowls', null, 2),
  ('kbay-bros-fish-and-ice', 'Bagged ice', null, 3),

  ('kahuku-superette', 'Shoyu poke', $t$the signature$t$, 1),
  ('kahuku-superette', 'Poke bowls', null, 2),

  ('taniokas', 'Poke', $t$limu poke, spicy ʻahi, ʻalae salt ʻahi$t$, 1),
  ('taniokas', 'Sashimi', null, 2),
  ('taniokas', 'Maki and inari sushi', null, 3),
  ('taniokas', 'Bentos', null, 4),
  ('taniokas', 'Plate lunches', null, 5),

  ('waianae-store', 'Fresh poke', null, 1),

  ('local-ia', 'CSF fish shares', $t$weekly pickups across the island$t$, 1),
  ('local-ia', 'Sashimi-grade local fish', $t$line- or spear-caught$t$, 2)
) as p(vendor_slug, label, note, sort_order)
join vendors v on v.slug = p.vendor_slug;

-- Provenance: one source_check per imported vendor, dated today in Hawaii,
-- scoped to this import so the lei vendors keep their original dates.

insert into verification_events (subject_type, subject_id, verified_at, method, note)
select 'vendor', v.id,
       ((timezone('Pacific/Honolulu', now())::date) + time '09:00')
         at time zone 'Pacific/Honolulu',
       'source_check',
       $t$checked the vendor's posted information$t$
from vendors v
join categories c on c.id = v.category_id and c.slug = 'fish'
where v.source_url is not null;
