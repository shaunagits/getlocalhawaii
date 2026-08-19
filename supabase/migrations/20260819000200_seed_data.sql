-- Placeholder records from the design mockups (docs/BUILD_SPEC.md section 7).
-- Verification timestamps are relative to the moment this runs, so the
-- "verified today" and "open now" logic renders on a freshly seeded database
-- instead of showing a wall of stale dates.

create function gl_seed_ts(days_ago int, t time) returns timestamptz
language sql stable as $fn$
  select ((timezone('Pacific/Honolulu', now())::date - days_ago) + t)
           at time zone 'Pacific/Honolulu';
$fn$;

-- Next occurrence of a weekday (today counts if it matches), at a given time.
create function gl_seed_next_dow(dow int, t time) returns timestamptz
language sql stable as $fn$
  select ((timezone('Pacific/Honolulu', now())::date
            + ((dow - extract(dow from timezone('Pacific/Honolulu', now()))::int + 7) % 7))
          + t) at time zone 'Pacific/Honolulu';
$fn$;

insert into islands (name, slug) values
  ($t$Oʻahu$t$,          'oahu'),
  ($t$Maui$t$,           'maui'),
  ($t$Hawaiʻi Island$t$, 'hawaii'),
  ($t$Kauaʻi$t$,         'kauai'),
  ($t$Molokaʻi$t$,       'molokai'),
  ($t$Lānaʻi$t$,         'lanai');

insert into categories (name, slug) values
  ('Lei',     'lei'),
  ('Poi',     'poi'),
  ('Fish',    'fish'),
  ('Produce', 'produce'),
  ('Markets', 'markets');

-- Vendors -------------------------------------------------------------------

insert into vendors (slug, name, category_id, island_id, area, description, story,
                     distance_mi, phone, contact_method, payment_notes, good_to_know)
select v.slug, v.name, c.id, i.id, v.area, v.description, v.story,
       v.distance_mi, v.phone, v.contact_method, v.payment_notes, v.good_to_know
from (values
  ('napua-lei-stand',
   $t$Nāpua Lei Stand$t$, 'lei', 'oahu', 'Kalihi',
   $t$Pīkake, tuberose, crown lei to order$t$,
   $t$Auntie Nāpua and her daughter, same corner since 1998.$t$,
   1.2, '(808) 555-0148', 'call', $t$cash + Venmo$t$,
   $t$Cash and Venmo. Park in the lot behind the building, not on the street. Graduation and May Day weeks sell out by 9a, so call the day before. She'll hold an order till noon.$t$),

  ('leilanis-flower-shop',
   $t$Leilani's Flower Shop$t$, 'lei', 'oahu', 'Kalihi',
   $t$Graduation orders, ti leaf, ribbon lei$t$, null,
   2.8, '(808) 555-0172', 'call', null,
   $t$Walk-ins welcome, but graduation orders need two days. Street parking only.$t$),

  ('waimanalo-maile-ti',
   $t$Waimānalo Maile & Ti$t$, 'lei', 'oahu', $t$Waimānalo$t$,
   $t$Maile by order, 2 days notice$t$, null,
   12.0, '(808) 555-0193', 'text', null,
   $t$Text the order, they reply with a pickup time. No walk-in maile.$t$),

  ('aunty-ds-lei-table',
   $t$Aunty D's Lei Table$t$, 'lei', 'oahu', $t$ʻAiea$t$,
   $t$Outside the swap meet gate, cash only$t$, null,
   8.2, null, 'call', 'cash only',
   $t$Sets up outside the swap meet gate, not inside. Cash only, no card.$t$),

  ('kalihi-lei-flowers',
   $t$Kalihi Lei & Flowers$t$, 'lei', 'oahu', 'Kalihi',
   $t$Ti leaf and ribbon lei, plumeria in the morning$t$, null,
   3.4, '(808) 555-0110', 'text', null,
   $t$Preorder by text the night before. Sells out on graduation weekends.$t$),

  ('hookipa-kalo-farm',
   $t$Hoʻokipa Kalo Farm$t$, 'poi', 'oahu', $t$Kaimukī$t$,
   $t$Poi, kalo, lūʻau leaf$t$, null,
   5.4, null, 'call', 'cash only', null),

  ('kahuku-mango-bros',
   $t$Kahuku Mango Bros$t$, 'produce', 'oahu', 'Kahuku',
   $t$Mango, lychee, papaya$t$, null,
   5.4, null, 'call', null, null),

  ('nalo-greens',
   $t$Nalo Greens$t$, 'produce', 'oahu', $t$Waimānalo$t$,
   $t$Salad greens, herbs, tomatoes$t$, null,
   5.4, null, 'call', null, null),

  ('windward-fish-guy',
   $t$Windward Fish Guy$t$, 'fish', 'oahu', $t$Kāneʻohe$t$,
   $t$ʻAhi, aku$t$, null,
   5.4, null, 'text', null, null)
) as v(slug, name, category_slug, island_slug, area, description, story,
       distance_mi, phone, contact_method, payment_notes, good_to_know)
join categories c on c.slug = v.category_slug
join islands    i on i.slug = v.island_slug;

-- Hours. 0 = Sunday .. 6 = Saturday.

insert into vendor_hours (vendor_id, day_of_week, opens, closes)
select v.id, h.day_of_week, h.opens, h.closes
from (values
  -- Nāpua: Mon-Fri 7a-2p, Sat 6a-12p, closed Sun.
  ('napua-lei-stand',      1, time '07:00', time '14:00'),
  ('napua-lei-stand',      2, time '07:00', time '14:00'),
  ('napua-lei-stand',      3, time '07:00', time '14:00'),
  ('napua-lei-stand',      4, time '07:00', time '14:00'),
  ('napua-lei-stand',      5, time '07:00', time '14:00'),
  ('napua-lei-stand',      6, time '06:00', time '12:00'),

  ('leilanis-flower-shop', 1, time '09:00', time '18:00'),
  ('leilanis-flower-shop', 2, time '09:00', time '18:00'),
  ('leilanis-flower-shop', 3, time '09:00', time '18:00'),
  ('leilanis-flower-shop', 4, time '09:00', time '18:00'),
  ('leilanis-flower-shop', 5, time '09:00', time '18:00'),
  ('leilanis-flower-shop', 6, time '09:00', time '18:00'),

  ('waimanalo-maile-ti',   1, time '08:00', time '13:00'),
  ('waimanalo-maile-ti',   2, time '08:00', time '13:00'),
  ('waimanalo-maile-ti',   3, time '08:00', time '13:00'),
  ('waimanalo-maile-ti',   4, time '08:00', time '13:00'),
  ('waimanalo-maile-ti',   5, time '08:00', time '13:00'),
  ('waimanalo-maile-ti',   6, time '08:00', time '13:00'),

  -- Aunty D's follows the swap meet: Wed, Sat, Sun afternoons.
  ('aunty-ds-lei-table',   3, time '15:00', time '20:00'),
  ('aunty-ds-lei-table',   6, time '15:00', time '20:00'),
  ('aunty-ds-lei-table',   0, time '15:00', time '20:00'),

  ('kalihi-lei-flowers',   1, time '07:00', time '16:00'),
  ('kalihi-lei-flowers',   2, time '07:00', time '16:00'),
  ('kalihi-lei-flowers',   3, time '07:00', time '16:00'),
  ('kalihi-lei-flowers',   4, time '07:00', time '16:00'),
  ('kalihi-lei-flowers',   5, time '07:00', time '16:00'),
  ('kalihi-lei-flowers',   6, time '07:00', time '16:00'),

  -- Market vendors keep the market's own hours.
  ('hookipa-kalo-farm',    1, time '06:30', time '11:00'),
  ('hookipa-kalo-farm',    3, time '06:30', time '11:00'),
  ('hookipa-kalo-farm',    6, time '06:00', time '12:00'),
  ('kahuku-mango-bros',    1, time '06:30', time '11:00'),
  ('kahuku-mango-bros',    3, time '06:30', time '11:00'),
  ('kahuku-mango-bros',    6, time '06:00', time '12:00'),
  ('nalo-greens',          1, time '06:30', time '11:00'),
  ('nalo-greens',          3, time '06:30', time '11:00'),
  ('nalo-greens',          6, time '06:00', time '12:00'),
  ('windward-fish-guy',    3, time '06:30', time '11:00'),
  ('windward-fish-guy',    6, time '06:00', time '12:00')
) as h(vendor_slug, day_of_week, opens, closes)
join vendors v on v.slug = h.vendor_slug;

insert into vendor_products (vendor_id, label, note, in_season_until, sort_order)
select v.id, p.label, p.note, p.in_season_until, p.sort_order
from (values
  ('napua-lei-stand',     $t$Pīkake$t$,      null, null::date, 1),
  ('napua-lei-stand',     'Tuberose',        null, null, 2),
  ('napua-lei-stand',     'Crown lei',       null, null, 3),
  ('napua-lei-stand',     'Ti leaf',         null, null, 4),
  ('napua-lei-stand',     'Ribbon lei',      null, null, 5),
  ('napua-lei-stand',     'Maile',           'order 2 days ahead', null, 6),

  ('leilanis-flower-shop', 'Ti leaf',        null, null, 1),
  ('leilanis-flower-shop', 'Ribbon lei',     null, null, 2),
  ('leilanis-flower-shop', 'Orchid lei',     null, null, 3),

  ('waimanalo-maile-ti',   'Maile',          'order 2 days ahead', null, 1),
  ('waimanalo-maile-ti',   'Ti leaf',        null, null, 2),

  ('aunty-ds-lei-table',   'Plumeria',       null, null, 1),
  ('aunty-ds-lei-table',   'Ribbon lei',     null, null, 2),

  ('kalihi-lei-flowers',   'Ti leaf',        null, null, 1),
  ('kalihi-lei-flowers',   'Ribbon lei',     null, null, 2),
  ('kalihi-lei-flowers',   'Plumeria',       null, null, 3),

  ('hookipa-kalo-farm',    'Poi',            null, null, 1),
  ('hookipa-kalo-farm',    'Kalo',           null, null, 2),
  ('hookipa-kalo-farm',    $t$Lūʻau leaf$t$, null, null, 3),

  ('kahuku-mango-bros',    'Mango',          null,
     make_date(extract(year from timezone('Pacific/Honolulu', now()))::int, 9, 30), 1),
  ('kahuku-mango-bros',    'Lychee',         null, null, 2),
  ('kahuku-mango-bros',    'Papaya',         null, null, 3),

  ('nalo-greens',          'Salad greens',   null, null, 1),
  ('nalo-greens',          'Herbs',          null, null, 2),
  ('nalo-greens',          'Tomatoes',       null, null, 3),

  ('windward-fish-guy',    $t$ʻAhi$t$,       null, null, 1),
  ('windward-fish-guy',    'Aku',            null, null, 2)
) as p(vendor_slug, label, note, in_season_until, sort_order)
join vendors v on v.slug = p.vendor_slug;

-- Market --------------------------------------------------------------------

insert into markets (slug, name, island_id, area, description, location_notes,
                     instagram, getting_there, distance_mi)
select 'kaimuki-neighborhood',
       $t$Kaimukī Neighborhood Market$t$,
       i.id,
       $t$Kaimukī$t$,
       $t$Mon, Wed and Sat mornings behind the community center on Koko Head Ave. 14 vendors today, mostly produce and poi. Small lot, easier to park on the side street.$t$,
       $t$Koko Head Ave, behind the community center$t$,
       'kaimukimarket',
       $t$Lot fills by 7a. Route 9 stops one block makai. Bring your own bags and small bills.$t$,
       5.4
from islands i where i.slug = 'oahu';

insert into market_sessions (market_id, day_of_week, starts, ends)
select m.id, s.day_of_week, s.starts, s.ends
from (values
  (1, time '06:30', time '11:00'),
  (3, time '06:30', time '11:00'),
  (6, time '06:00', time '12:00')
) as s(day_of_week, starts, ends)
join markets m on m.slug = 'kaimuki-neighborhood';

insert into market_vendors (market_id, vendor_id, stall, usual_days, confirmed_at, sort_order)
select m.id, v.id, mv.stall, mv.usual_days, mv.confirmed_at, mv.sort_order
from (values
  ('hookipa-kalo-farm', 'stall 4',  $t$Mon, Wed and Sat$t$, gl_seed_ts(0, time '07:02'), 1),
  ('kahuku-mango-bros', 'stall 9',  $t$Mon, Wed and Sat$t$, gl_seed_ts(0, time '07:02'), 2),
  ('nalo-greens',       'stall 12', $t$Mon, Wed and Sat$t$, gl_seed_ts(0, time '07:02'), 3),
  -- Not confirmed for today, so the page shows "NOT HERE TODAY".
  ('windward-fish-guy', null,       $t$Wed and Sat$t$,      null,                        4)
) as mv(vendor_slug, stall, usual_days, confirmed_at, sort_order)
join vendors v on v.slug = mv.vendor_slug
join markets m on m.slug = 'kaimuki-neighborhood';

-- Pop-ups -------------------------------------------------------------------

insert into popups (name, vendor_id, market_id, starts_at, ends_at, location_note, status)
values
  ($t$Kalo & Poi pop-up$t$,
   (select id from vendors where slug = 'hookipa-kalo-farm'),
   (select id from markets where slug = 'kaimuki-neighborhood'),
   gl_seed_next_dow(2, time '16:00'), gl_seed_next_dow(2, time '19:00'),
   $t$Kaimukī parking lot$t$, 'verified'),

  ($t$Kakaʻako fish drop$t$,
   null, null,
   gl_seed_next_dow(6, time '06:00'), gl_seed_next_dow(6, time '08:00'),
   $t$Waiʻanae Fish Co-op, sells out by 8a$t$, 'verified'),

  ($t$Lei table, swap meet gate$t$,
   (select id from vendors where slug = 'aunty-ds-lei-table'),
   null,
   gl_seed_next_dow(0, time '00:00'), null,
   $t$Aunty D's, time not confirmed yet$t$, 'unconfirmed');

-- Verification log ----------------------------------------------------------

insert into verification_events (subject_type, subject_id, verified_at, method, note)
select 'vendor', v.id, e.verified_at, e.method, e.note
from (values
  ('napua-lei-stand',      gl_seed_ts(0,  time '08:10'), 'called',  'hours confirmed'),
  ('napua-lei-stand',      gl_seed_ts(7,  time '09:20'), 'visited', $t$pīkake in stock$t$),
  ('napua-lei-stand',      gl_seed_ts(16, time '10:05'), 'no_answer', 'called, no answer'),
  ('napua-lei-stand',      gl_seed_ts(23, time '08:45'), 'visited', 'hours confirmed'),
  ('leilanis-flower-shop', gl_seed_ts(0,  time '07:50'), 'called',  'hours confirmed'),
  ('waimanalo-maile-ti',   gl_seed_ts(1,  time '15:30'), 'called',  'maile orders confirmed'),
  ('aunty-ds-lei-table',   gl_seed_ts(6,  time '16:10'), 'visited', 'set up outside the gate'),
  ('kalihi-lei-flowers',   gl_seed_ts(3,  time '08:05'), 'called',  'hours confirmed'),
  ('hookipa-kalo-farm',    gl_seed_ts(0,  time '07:02'), 'visited', 'at the market'),
  ('kahuku-mango-bros',    gl_seed_ts(0,  time '07:02'), 'visited', 'at the market'),
  ('nalo-greens',          gl_seed_ts(0,  time '07:02'), 'visited', 'at the market'),
  ('windward-fish-guy',    gl_seed_ts(4,  time '07:10'), 'visited', 'at the market')
) as e(vendor_slug, verified_at, method, note)
join vendors v on v.slug = e.vendor_slug;

insert into verification_events (subject_type, subject_id, verified_at, method, note)
select 'market', m.id, e.verified_at, e.method, e.note
from (values
  (gl_seed_ts(0, time '07:02'), 'visited',             'vendor list walked on site'),
  (gl_seed_ts(2, time '14:20'), 'organizer_confirmed', 'organizer confirmed hours'),
  (gl_seed_ts(9, time '07:15'), 'visited',             'vendor list walked on site')
) as e(verified_at, method, note)
join markets m on m.slug = 'kaimuki-neighborhood';

insert into verification_events (subject_type, subject_id, verified_at, method, note)
select 'popup', p.id, e.verified_at, e.method, e.note
from (values
  ($t$Kalo & Poi pop-up$t$,  gl_seed_ts(1, time '11:00'), 'called', 'confirmed with the farm'),
  ($t$Kakaʻako fish drop$t$, gl_seed_ts(3, time '13:40'), 'called', 'co-op confirmed the drop')
) as e(popup_name, verified_at, method, note)
join popups p on p.name = e.popup_name;

-- Reports -------------------------------------------------------------------

insert into reports (subject_type, subject_id, kind, note, reported_at)
select 'vendor', v.id, 'sold_out', $t$Back tomorrow 7a, preorder by text$t$, now() - interval '1 hour'
from vendors v where v.slug = 'kalihi-lei-flowers';

drop function gl_seed_ts(int, time);
drop function gl_seed_next_dow(int, time);
