-- Replace the fictional lei placeholders with the real Oʻahu lei vendors
-- compiled in data/lei-vendors-oahu.csv from vendors' own sites and official
-- pages. See docs/DECISIONS.md: public sources only, no vendor calls in this
-- phase, and nothing sourced from Google Maps or Yelp.
--
-- Anything the sources left as TBC imports as NULL. A blank column renders as
-- a blank column; it is never filled with a plausible guess.

-- Schema ---------------------------------------------------------------------

alter table vendors
  -- Street address as published, for the LocalBusiness schema on vendor pages.
  add column address        text,
  add column website        text,
  -- Ships lei to the mainland. NULL means the sources did not say.
  add column ships_mainland boolean,
  -- The page this listing was read from, shown to the reader as provenance.
  add column source_url     text;

-- "Read the vendor's own posted information on this date." Distinct from
-- called and visited, which mean a person made contact.
alter table verification_events
  drop constraint verification_events_method_check;

alter table verification_events
  add constraint verification_events_method_check
  check (method in ('called', 'visited', 'organizer_confirmed', 'no_answer', 'source_check'));

-- Clear out the placeholders --------------------------------------------------

-- verification_events and reports key off a polymorphic subject, so they have
-- no foreign key to cascade through and must be cleared by hand.
delete from verification_events
 where subject_type = 'vendor'
   and subject_id in (select id from vendors where slug in (
     'napua-lei-stand', 'leilanis-flower-shop', 'waimanalo-maile-ti',
     'aunty-ds-lei-table', 'kalihi-lei-flowers'));

delete from reports
 where subject_type = 'vendor'
   and subject_id in (select id from vendors where slug in (
     'napua-lei-stand', 'leilanis-flower-shop', 'waimanalo-maile-ti',
     'aunty-ds-lei-table', 'kalihi-lei-flowers'));

-- The invented pop-up hangs off an invented vendor, so it goes too. Its
-- verification event is polymorphic and has to be removed first.
delete from verification_events
 where subject_type = 'popup'
   and subject_id in (select id from popups where name = $t$Lei table, swap meet gate$t$);

delete from popups where name = $t$Lei table, swap meet gate$t$;

-- vendor_hours and vendor_products cascade from vendors.
delete from vendors where slug in (
  'napua-lei-stand', 'leilanis-flower-shop', 'waimanalo-maile-ti',
  'aunty-ds-lei-table', 'kalihi-lei-flowers');

-- Import ---------------------------------------------------------------------

insert into vendors (slug, name, category_id, island_id, area, description, story,
                     address, website, phone, contact_method, good_to_know,
                     ships_mainland, source_url)
select v.slug, v.name, c.id, i.id, v.area, v.description, v.story,
       v.address, v.website, v.phone, v.contact_method, v.good_to_know,
       v.ships_mainland, v.source_url
from (values
  ('cindys-lei-shoppe',
   $t$Cindy's Lei Shoppe$t$, 'Chinatown',
   $t$Pīkake, maile, plumeria and haku lei, made to order$t$,
   $t$A family business on Maunakea Street since 1959, and the Star-Advertiser readers' pick for best lei stand in twelve of the last thirteen years.$t$,
   $t$1034 Maunakea St, Honolulu, HI 96817$t$,
   'https://www.cindysleishoppe.com', '(808) 536-6538', 'call',
   $t$Curbside pickup: call when you reach Maunakea and Beretania and they bring the order out to the car. Ships fresh lei to all fifty states.$t$,
   true, 'https://www.cindysleishoppe.com'),

  ('lins-lei-shop',
   $t$Lin's Lei Shop$t$, 'Chinatown',
   $t$Lei made to order$t$, null,
   $t$1017-A Maunakea St, Honolulu, HI 96817$t$,
   'https://www.linsleishop.com', '(808) 537-4112', 'call',
   null, null,
   'https://www.linsleishop.com'),

  ('shirleys-flowers',
   $t$Shirley's Flowers$t$, 'Chinatown', null, null,
   $t$1176-C Maunakea St, Honolulu, HI 96817$t$,
   null, '(808) 536-2218', 'call', null, null,
   'https://www.hawaii-guide.com/blog/where-to-buy-fresh-flower-lei-oahu-visitor-guide'),

  ('nitas-leis',
   $t$Nita's Leis & Flower Shoppe$t$, 'Chinatown', null, null,
   $t$59 N Beretania St, Honolulu, HI 96817$t$,
   null, '(808) 521-9065', 'call', null, null,
   'https://www.hawaii-guide.com/blog/where-to-buy-fresh-flower-lei-oahu-visitor-guide'),

  ('island-gifts-flowers',
   $t$Island Gifts & Flowers$t$, 'Chinatown', null, null,
   $t$69 N Beretania St, Honolulu, HI 96817$t$,
   null, '(808) 537-5347', 'call', null, null,
   'https://www.hawaii-guide.com/blog/where-to-buy-fresh-flower-lei-oahu-visitor-guide'),

  ('mp-lei-shop',
   $t$M P Lei Shop$t$, 'Chinatown', null, null,
   $t$1145 Maunakea St #2, Honolulu, HI 96817$t$,
   null, '(808) 531-3206', 'call', null, null,
   'http://hichinatown.com/shopping/mpleishop'),

  ('pauahi-leis',
   $t$Pauahi Leis$t$, 'Chinatown', null,
   $t$A small shop run by Lilia and her daughter Lenny.$t$,
   null, null, null, 'call',
   $t$On Pauahi Street. The exact address and phone number are not confirmed.$t$,
   false, 'https://alohawithlove.com/shopping/best-fresh-lei-shops-in-oahu/'),

  ('maunakea-florist',
   $t$Maunakea Florist$t$, 'Chinatown', null, null,
   null, null, null, 'call',
   $t$On Maunakea Street. The exact address and phone number are not confirmed.$t$,
   null, 'http://www.hawaiiforvisitors.com/islands/oahu-island/towns/chinatown/attractions/lei-shops.htm'),

  ('harriets-lei-stand',
   $t$Harriet's Lei Stand$t$, 'Airport',
   $t$Fresh flower lei at the airport lei stands$t$, null,
   $t$300 Rodgers Blvd Stall 1, Honolulu, HI 96819$t$,
   null, null, 'call',
   $t$Stall 1 on the airport lei road, before Terminal 1. The state airports page lists the lei stands as generally open 6a to 10p; this stand does not post its own hours.$t$,
   null, 'https://airports.hawaii.gov/hnl/services-amenities/lei-greeting/'),

  ('rachels-lei-stand',
   $t$Rachel's Lei Stand$t$, 'Airport',
   $t$Fresh flower lei and arrangements$t$,
   $t$Family owned and run for more than ninety years, per the Native Hawaiian Business Directory.$t$,
   $t$300 Rodgers Blvd, Honolulu, HI 96819$t$,
   null, null, 'call',
   $t$On the airport lei road; the stall number is not confirmed. The state airports page lists the lei stands as generally open 6a to 10p.$t$,
   null, 'https://kanakaeconomy.com/listing/rachels-lei-stand/'),

  ('dorothys-lei-stand',
   $t$Dorothy's Lei Stand$t$, 'Airport', null, null,
   $t$300 Rodgers Blvd, Honolulu, HI 96819$t$,
   null, null, 'call',
   $t$On the airport lei road; the stall number is not confirmed. The state airports page lists the lei stands as generally open 6a to 10p.$t$,
   null, 'https://thehawaiivacationguide.com/best-lei-greeting-honolulu-airport/'),

  ('gladys-lei-stand',
   $t$Gladys' Lei Stand$t$, 'Airport', null,
   $t$Opened by Moana Umi, whose mother Rachel Aanana sold lei on the waterfront and on Maunakea Street. The family stand has been on Lagoon Drive since 1948.$t$,
   $t$300 Rodgers Blvd, Honolulu, HI 96819$t$,
   null, null, 'call',
   $t$On the airport lei road; the stall number is not confirmed. The state airports page lists the lei stands as generally open 6a to 10p.$t$,
   null, 'https://www.hawaiipublicradio.org/local-news/2023-04-28/women-behind-honolulu-airports-lei-stands-adorning-hawaii'),

  ('mailes-lei-stand',
   $t$Maile's Lei Stand$t$, 'Airport', null,
   $t$A family lei stand since 1945, when it worked out of a truck on Lagoon Drive. It took the name Maile's in 1962, when Maile Lee inherited it.$t$,
   $t$300 Rodgers Blvd, Honolulu, HI 96819$t$,
   null, null, 'call',
   $t$On the airport lei road; the stall number is not confirmed. The state airports page lists the lei stands as generally open 6a to 10p.$t$,
   null, 'https://www.hawaiipublicradio.org/local-news/2023-04-28/women-behind-honolulu-airports-lei-stands-adorning-hawaii'),

  ('watanabe-floral',
   $t$Watanabe Floral$t$, 'Kalihi',
   $t$Florist with a lei department, island-wide delivery$t$,
   $t$A full-service florist with its own lei department, taking orders online and delivering island-wide.$t$,
   $t$1618 N Nimitz Hwy, Honolulu, HI 96817$t$,
   'https://watanabefloral.com', null, 'call',
   $t$On Nimitz between Kalihi Street and Waikamilo Road.$t$,
   true, 'https://watanabefloral.com/lei-from-hawaii/')
) as v(slug, name, area, description, story, address, website, phone,
       contact_method, good_to_know, ships_mainland, source_url)
join categories c on c.slug = 'lei'
join islands    i on i.slug = 'oahu';

-- Hours, only where the vendor or an official page actually posts them. Every
-- other shop here publishes none, and stays blank.

insert into vendor_hours (vendor_id, day_of_week, opens, closes)
select v.id, h.day_of_week, h.opens, h.closes
from (values
  -- M P Lei Shop, per its hichinatown listing.
  ('mp-lei-shop', 1, time '07:00', time '18:00'),
  ('mp-lei-shop', 2, time '07:00', time '18:00'),
  ('mp-lei-shop', 3, time '07:00', time '18:00'),
  ('mp-lei-shop', 4, time '07:00', time '18:00'),
  ('mp-lei-shop', 5, time '07:00', time '18:00'),

  -- Watanabe Floral, per its own site.
  ('watanabe-floral', 1, time '09:00', time '16:00'),
  ('watanabe-floral', 2, time '09:00', time '16:00'),
  ('watanabe-floral', 3, time '09:00', time '16:00'),
  ('watanabe-floral', 4, time '09:00', time '16:00'),
  ('watanabe-floral', 5, time '09:00', time '16:00'),
  ('watanabe-floral', 6, time '09:00', time '16:00')
) as h(vendor_slug, day_of_week, opens, closes)
join vendors v on v.slug = h.vendor_slug;

-- The airport stands do not post individual hours. The state airports page
-- gives 6a to 10p for the lei stands as a group, which is what these carry;
-- each listing says so in good_to_know rather than implying the stand posted it.
insert into vendor_hours (vendor_id, day_of_week, opens, closes)
select v.id, d.day_of_week, time '06:00', time '22:00'
from vendors v
cross join generate_series(0, 6) as d(day_of_week)
where v.slug in ('harriets-lei-stand', 'rachels-lei-stand', 'dorothys-lei-stand',
                 'gladys-lei-stand', 'mailes-lei-stand');

-- Products, only what the sources list. TBC catalogues import as nothing.

insert into vendor_products (vendor_id, label, note, sort_order)
select v.id, p.label, p.note, p.sort_order
from (values
  ('cindys-lei-shoppe', $t$Pīkake$t$,       null, 1),
  ('cindys-lei-shoppe', $t$Pakalana$t$,     null, 2),
  ('cindys-lei-shoppe', 'Maile',            null, 3),
  ('cindys-lei-shoppe', 'Tuberose',         null, 4),
  ('cindys-lei-shoppe', 'Orchid',           null, 5),
  ('cindys-lei-shoppe', 'Plumeria',         null, 6),
  ('cindys-lei-shoppe', 'Carnation',        null, 7),
  ('cindys-lei-shoppe', 'Ginger',           null, 8),
  ('cindys-lei-shoppe', 'Hala',             null, 9),
  ('cindys-lei-shoppe', $t$Lokelani rose$t$, null, 10),
  ('cindys-lei-shoppe', 'Ti leaf',          null, 11),
  ('cindys-lei-shoppe', 'Haku lei',         null, 12),
  ('cindys-lei-shoppe', 'Money lei',        null, 13),

  ('lins-lei-shop',     'Lei by order',     null, 1),

  ('harriets-lei-stand', 'Fresh flower lei', $t$selection varies daily$t$, 1),

  ('rachels-lei-stand',  'Fresh flower lei', null, 1),
  ('rachels-lei-stand',  'Flower arrangements', null, 2),

  ('watanabe-floral',    'Fresh flower lei', null, 1),
  ('watanabe-floral',    'Flower arrangements', null, 2)
) as p(vendor_slug, label, note, sort_order)
join vendors v on v.slug = p.vendor_slug;

-- Provenance: one source_check per imported vendor, dated today in Hawaii.

insert into verification_events (subject_type, subject_id, verified_at, method, note)
select 'vendor', v.id,
       ((timezone('Pacific/Honolulu', now())::date) + time '09:00')
         at time zone 'Pacific/Honolulu',
       'source_check',
       $t$checked the vendor's posted information$t$
from vendors v
where v.source_url is not null;
