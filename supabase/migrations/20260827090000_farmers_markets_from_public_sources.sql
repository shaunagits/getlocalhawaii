-- Import the Oʻahu farmers markets compiled in data/farmers-markets-oahu.csv:
-- the 13 City and County People's Open Market sites and the 4 Hawaii Farm
-- Bureau markets. Public sources only, both of them official operator pages.
--
-- The People's Open Market rows are the first records on the site to carry
-- real coordinates. They come from the Google Maps pins the City links from
-- its own schedule page, so they are the City's placement, not a geocode.
-- The Farm Bureau page names its venues but publishes no coordinates and no
-- street addresses, so those import as NULL and render blank.
--
-- Markets move to their own category slug here. "markets" was generic enough
-- to be worthless as a URL; people search for farmers markets, and the home
-- hero now offers that exact phrase as a suggestion chip.

update categories
   set slug = 'farmers-markets',
       name = 'Farmers markets'
 where slug = 'markets';

alter table markets
  -- The City pins each site on its own schedule page, so unlike the vendor
  -- listings these arrive with a real position rather than a name to search.
  add column lat        numeric(9, 6),
  add column lng        numeric(9, 6),
  -- Who runs it. Two operators here with very different session shapes: the
  -- City runs 45 to 60 minute stops, the Farm Bureau runs 3 hour markets.
  add column operator   text,
  -- Only some People's Open Market sites hand out EBT tokens, and the City
  -- calls it out per site because it decides where people can shop.
  add column ebt_tokens boolean,
  add column source_url text;

insert into markets (slug, name, island_id, area, description, location_notes,
                     getting_there, lat, lng, operator, ebt_tokens, source_url)
select p.slug, p.name, i.id, p.area, p.description, p.location_notes,
       p.getting_there, p.lat, p.lng,
       $t$City and County of Honolulu Department of Parks and Recreation$t$,
       p.ebt_tokens,
       'https://www.honolulu.gov/dpr/peoples-open-markets/'
from (values

  -- People's Open Markets. Founded 1973 to move farmers' surplus and off-grade
  -- produce cheaply; the City still sets a recommended price roughly 35% under
  -- retail from its own weekly supermarket price checks. Vendors caravan
  -- between the sites in order, which is why each row says where in the run it
  -- sits: that is the one thing genuinely different about each stop.

  ('waiau-peoples-open-market', $t$Waiau People's Open Market$t$, 'Pearl City',
   $t$First stop on the Tuesday Central Oʻahu route, open for one hour.$t$,
   $t$Waiau District Park$t$, null::text, 21.402201, -157.952694, false),

  ('waipahu-peoples-open-market', $t$Waipahū People's Open Market$t$, 'Waipahū',
   $t$Second stop on the Tuesday Central Oʻahu route, with EBT tokens on site.$t$,
   $t$Bill Balfour Jr. Waipahū District Park$t$, null, 21.387640, -157.999258, true),

  ('wahiawa-peoples-open-market', $t$Wahiawā People's Open Market$t$, 'Wahiawā',
   $t$Third stop on the Tuesday Central Oʻahu route, with EBT tokens on site.$t$,
   $t$George F. Wright Wahiawā District Park$t$, null, 21.498905, -158.023407, true),

  ('mililani-peoples-open-market', $t$Mililani People's Open Market$t$, 'Mililani',
   $t$Last stop on the Tuesday Central Oʻahu route, 45 minutes at midday.$t$,
   $t$Mililani District Park$t$, null, 21.440703, -158.018210, false),

  ('kapiolani-peoples-open-market', $t$Kapiʻolani Park People's Open Market$t$, 'Waikīkī',
   $t$The only Wednesday market on the City route, one hour in the park.$t$,
   $t$Kapiʻolani Park$t$, null, 21.268828, -157.816739, false),

  ('kailua-peoples-open-market', $t$Kailua People's Open Market$t$, 'Kailua',
   $t$First of the two Thursday windward stops, open for one hour.$t$,
   $t$Kailua District Park$t$, null, 21.395730, -157.737737, false),

  ('kaneohe-peoples-open-market', $t$Kāneʻohe People's Open Market$t$, 'Kāneʻohe',
   $t$Second Thursday windward stop, one hour late morning.$t$,
   $t$Kāneʻohe District Park$t$, null, 21.409845, -157.810072, false),

  ('halawa-peoples-open-market', $t$Hālawa People's Open Market$t$, 'Hālawa',
   $t$First Friday stop, an hour early in the morning.$t$,
   $t$Hālawa District Park$t$, null, 21.373482, -157.914791, false),

  ('ewa-beach-peoples-open-market', $t$ʻEwa Beach People's Open Market$t$, $t$ʻEwa Beach$t$,
   $t$Second Friday stop, open for one hour.$t$,
   $t$ʻEwa Beach Community Park$t$, null, 21.313868, -158.008425, false),

  ('kalakaua-peoples-open-market', $t$Kalākaua People's Open Market$t$, 'Kalihi',
   $t$The Saturday Kalihi market, and at three hours the longest City session of the week. EBT tokens on site.$t$,
   $t$Kalākaua District Park$t$, null, 21.327712, -157.878309, true),

  ('kapolei-peoples-open-market', $t$Kapolei People's Open Market$t$, 'Kapolei',
   $t$First stop on the Sunday leeward route, 90 minutes.$t$,
   $t$Kapolei Community Park$t$, null, 21.333772, -158.067025, false),

  ('royal-kunia-peoples-open-market', $t$Royal Kunia People's Open Market$t$, 'Royal Kunia',
   $t$Second stop on the Sunday leeward route, at the park-n-ride.$t$,
   $t$Royal Kunia Park-n-Ride$t$, null, 21.389536, -158.031678, false),

  ('waikele-peoples-open-market', $t$Waikele People's Open Market$t$, 'Waikele',
   $t$Last stop on the Sunday leeward route, an hour at midday.$t$,
   $t$Waikele Community Park$t$, null, 21.401601, -158.003062, false)

) as p (slug, name, area, description, location_notes, getting_there, lat, lng, ebt_tokens)
join islands i on i.slug = 'oahu';

-- Hawaii Farm Bureau markets. Their page names the venue and the parking but
-- publishes neither a street address nor coordinates, so both stay NULL.
insert into markets (slug, name, island_id, area, description, location_notes,
                     getting_there, operator, source_url)
select m.slug, m.name, i.id, m.area, m.description, m.location_notes,
       m.getting_there,
       'Hawaii Farm Bureau',
       'https://hfbf.org/farmers-markets/oahu/'
from (values

  ('kcc-farmers-market', $t$KCC Farmers Market$t$, 'Diamond Head',
   $t$Saturday mornings at Kapiʻolani Community College.$t$,
   $t$Kapiʻolani Community College$t$,
   $t$Ample free parking in Parking Lot C.$t$),

  ('mililani-farmers-market', $t$Mililani Farmers Market$t$, 'Mililani',
   $t$Sunday mornings at Mililani High School.$t$,
   $t$Mililani High School$t$,
   $t$Free ample parking.$t$),

  ('honolulu-farmers-market', $t$Honolulu Farmers Market$t$, $t$Kakaʻako$t$,
   $t$Wednesday evenings at the Neal S. Blaisdell Center.$t$,
   $t$Neal S. Blaisdell Center$t$,
   $t$Ample free parking.$t$),

  ('kailua-town-farmers-market', $t$Kailua Town Farmers Market$t$, 'Kailua',
   $t$Thursday evenings at Kailua Town Center.$t$,
   $t$Kailua Town Center$t$,
   $t$Ample free parking.$t$)

) as m (slug, name, area, description, location_notes, getting_there)
join islands i on i.slug = 'oahu';

-- Sessions. day_of_week is 0=Sunday..6=Saturday, matching getDay().
insert into market_sessions (market_id, day_of_week, starts, ends)
select mk.id, s.day_of_week, s.starts, s.ends
from (values
  ('waiau-peoples-open-market',        2, time '06:30', time '07:30'),
  ('waipahu-peoples-open-market',      2, time '08:15', time '09:15'),
  ('wahiawa-peoples-open-market',      2, time '10:00', time '11:00'),
  ('mililani-peoples-open-market',     2, time '11:45', time '12:30'),
  ('kapiolani-peoples-open-market',    3, time '10:00', time '11:00'),
  ('kailua-peoples-open-market',       4, time '09:00', time '10:00'),
  ('kaneohe-peoples-open-market',      4, time '10:45', time '11:45'),
  ('halawa-peoples-open-market',       5, time '07:00', time '08:00'),
  ('ewa-beach-peoples-open-market',    5, time '09:00', time '10:00'),
  ('kalakaua-peoples-open-market',     6, time '06:30', time '09:30'),
  ('kapolei-peoples-open-market',      0, time '07:00', time '08:30'),
  ('royal-kunia-peoples-open-market',  0, time '09:30', time '11:00'),
  ('waikele-peoples-open-market',      0, time '11:30', time '12:30'),
  ('kcc-farmers-market',               6, time '07:30', time '11:00'),
  ('mililani-farmers-market',          0, time '08:00', time '11:00'),
  ('honolulu-farmers-market',          3, time '16:00', time '19:00'),
  ('kailua-town-farmers-market',       4, time '16:00', time '19:00')
) as s (slug, day_of_week, starts, ends)
join markets mk on mk.slug = s.slug;

-- These were read off the operators' own schedule pages, never called or
-- visited, so they log as source_check and render as CHECKED, not VERIFIED.
insert into verification_events (subject_type, subject_id, verified_at, method, note)
select 'market', mk.id,
       ((timezone('Pacific/Honolulu', now())::date) + time '09:00')
         at time zone 'Pacific/Honolulu',
       'source_check',
       $t$checked the operator's posted schedule$t$
from markets mk
where mk.source_url is not null;
