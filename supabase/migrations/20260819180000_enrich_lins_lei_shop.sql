-- Lin's Lei Shop, the highest-value vendor term in the keyword data, had one
-- product line and no hours. Filled in from two public sources:
--
--   hichinatown.com  (live)  address, phone, hours, family ownership, awards
--   linsleishop.com  (dead)  services, read from an archived copy of their own
--                            site taken 2021-01-25
--
-- Their own site returns HTTP 500 on both linsleishop.com and
-- linsleishophawaii.com as of today, so the website column is cleared rather
-- than linking visitors to a broken page.

update vendors set
  description   = $t$Fresh flower lei made to order, plus arrangements and wedding bouquets$t$,
  story         = $t$A family owned and operated shop on Maunakea Street, voted best lei stand in the 2017 and 2018 Best of hiChinatown awards.$t$,
  address       = $t$1017 Maunakea St, Honolulu, HI 96817$t$,
  website       = null,
  good_to_know  = $t$Their own website is offline, so the list of what they make comes from an archived copy of it from January 2021 and may have changed. The hours come from their hiChinatown listing.$t$,
  source_url    = 'http://hichinatown.com/shopping/linsleishop'
where slug = 'lins-lei-shop';

-- Sunday and Monday 7a-6p, Tuesday to Saturday 7a-7p, per hiChinatown.
delete from vendor_hours
 where vendor_id = (select id from vendors where slug = 'lins-lei-shop');

insert into vendor_hours (vendor_id, day_of_week, opens, closes)
select v.id, h.day_of_week, h.opens, h.closes
from (values
  (0, time '07:00', time '18:00'),
  (1, time '07:00', time '18:00'),
  (2, time '07:00', time '19:00'),
  (3, time '07:00', time '19:00'),
  (4, time '07:00', time '19:00'),
  (5, time '07:00', time '19:00'),
  (6, time '07:00', time '19:00')
) as h(day_of_week, opens, closes)
join vendors v on v.slug = 'lins-lei-shop';

-- Categories their own site listed. Not a flower list: the site never
-- published one, so none is invented here.
delete from vendor_products
 where vendor_id = (select id from vendors where slug = 'lins-lei-shop');

insert into vendor_products (vendor_id, label, note, sort_order)
select v.id, p.label, p.note, p.sort_order
from (values
  ('Fresh flower lei',   null, 1),
  ('Custom lei to order', $t$one of a kind, for any occasion$t$, 2),
  ('Flower arrangements', null, 3),
  ('Wedding bouquets',    null, 4)
) as p(label, note, sort_order)
join vendors v on v.slug = 'lins-lei-shop';

-- Provenance: one entry per source, each dated when that source was read.
delete from verification_events
 where subject_type = 'vendor'
   and subject_id = (select id from vendors where slug = 'lins-lei-shop');

insert into verification_events (subject_type, subject_id, verified_at, method, note)
select 'vendor', v.id, e.verified_at, 'source_check', e.note
from (values
  (((timezone('Pacific/Honolulu', now())::date) + time '17:00') at time zone 'Pacific/Honolulu',
   $t$checked their hiChinatown listing for hours and address$t$),
  (timestamptz '2021-01-25 00:00:00-10',
   $t$read an archived copy of their own site, which is now offline$t$)
) as e(verified_at, note)
join vendors v on v.slug = 'lins-lei-shop';
