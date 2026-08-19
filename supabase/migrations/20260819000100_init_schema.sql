-- Get Local Hawaii core schema.
-- Data model per docs/BUILD_SPEC.md section 6.
--
-- Conventions:
--   day_of_week   0 = Sunday .. 6 = Saturday, matching JavaScript getDay().
--   opens/closes  local wall-clock time in Pacific/Honolulu. Hawaii has no DST,
--                 but every read still converts through the IANA zone.
--   *_at columns  timestamptz, always stored in UTC.
--   text + check  used instead of Postgres enums so new values can be added
--                 without a type migration.

create extension if not exists pgcrypto;

create table islands (
  id   uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table categories (
  id   uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table vendors (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  category_id    uuid not null references categories (id) on delete restrict,
  island_id      uuid not null references islands (id) on delete restrict,
  area           text not null,
  description    text,
  story          text,
  lat            numeric(9, 6),
  lng            numeric(9, 6),
  -- Placeholder until geolocation lands. Distance is seeded from the mockups
  -- so cards can sort and render before real coordinates exist.
  distance_mi    numeric(4, 1),
  phone          text,
  contact_method text not null default 'call' check (contact_method in ('call', 'text')),
  payment_notes  text,
  good_to_know   text,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

create index vendors_category_island_idx on vendors (category_id, island_id);

create table vendor_hours (
  id          uuid primary key default gen_random_uuid(),
  vendor_id   uuid not null references vendors (id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  opens       time not null,
  closes      time not null,
  unique (vendor_id, day_of_week, opens)
);

create index vendor_hours_vendor_idx on vendor_hours (vendor_id);

create table vendor_products (
  id             uuid primary key default gen_random_uuid(),
  vendor_id      uuid not null references vendors (id) on delete cascade,
  label          text not null,
  note           text,
  in_season_until date,
  sort_order     smallint not null default 0
);

create index vendor_products_vendor_idx on vendor_products (vendor_id);

create table markets (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  island_id      uuid not null references islands (id) on delete restrict,
  area           text not null,
  description    text,
  location_notes text,
  instagram      text,
  getting_there  text,
  distance_mi    numeric(4, 1),
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

create table market_sessions (
  id          uuid primary key default gen_random_uuid(),
  market_id   uuid not null references markets (id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  starts      time not null,
  ends        time not null,
  unique (market_id, day_of_week, starts)
);

create index market_sessions_market_idx on market_sessions (market_id);

create table market_vendors (
  market_id    uuid not null references markets (id) on delete cascade,
  vendor_id    uuid not null references vendors (id) on delete cascade,
  stall        text,
  usual_days   text,
  -- Null, or older than today in Hawaii, renders as "NOT HERE TODAY".
  confirmed_at timestamptz,
  sort_order   smallint not null default 0,
  primary key (market_id, vendor_id)
);

create table popups (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  vendor_id     uuid references vendors (id) on delete set null,
  market_id     uuid references markets (id) on delete set null,
  starts_at     timestamptz not null,
  ends_at       timestamptz,
  location_note text,
  status        text not null default 'unconfirmed' check (status in ('verified', 'unconfirmed'))
);

create index popups_starts_idx on popups (starts_at);

create table verification_events (
  id           uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('vendor', 'market', 'popup')),
  subject_id   uuid not null,
  verified_at  timestamptz not null default now(),
  method       text not null check (method in ('called', 'visited', 'organizer_confirmed', 'no_answer')),
  note         text
);

create index verification_events_subject_idx
  on verification_events (subject_type, subject_id, verified_at desc);

create table reports (
  id           uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('vendor', 'market', 'popup')),
  subject_id   uuid not null,
  kind         text not null check (kind in ('sold_out', 'closed', 'changed')),
  note         text,
  reported_at  timestamptz not null default now()
);

create index reports_subject_idx on reports (subject_type, subject_id, reported_at desc);

-- Row level security: everything is a public directory, so anon can read.
-- No write policies, so inserts and updates are service-role only. Reports
-- become an anon-insert table once the report flow ships.
alter table islands             enable row level security;
alter table categories          enable row level security;
alter table vendors             enable row level security;
alter table vendor_hours        enable row level security;
alter table vendor_products     enable row level security;
alter table markets             enable row level security;
alter table market_sessions     enable row level security;
alter table market_vendors      enable row level security;
alter table popups              enable row level security;
alter table verification_events enable row level security;
alter table reports             enable row level security;

create policy "public read" on islands             for select using (true);
create policy "public read" on categories          for select using (true);
create policy "public read" on vendors             for select using (true);
create policy "public read" on vendor_hours        for select using (true);
create policy "public read" on vendor_products     for select using (true);
create policy "public read" on markets             for select using (true);
create policy "public read" on market_sessions     for select using (true);
create policy "public read" on market_vendors      for select using (true);
create policy "public read" on popups              for select using (true);
create policy "public read" on verification_events for select using (true);
create policy "public read" on reports             for select using (true);
