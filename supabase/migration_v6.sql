-- ============================================================
-- Wijnkast — migratie v6: notitie/beoordeling per ontkurking,
-- kelderkaart (zones/rekken) en verlanglijst
-- Plak dit hele bestand in Supabase: SQL Editor > New query > Run
-- (aanvulling op schema.sql, migration_admin.sql, migration_v2.sql,
-- migration_v3.sql, migration_v4.sql en migration_v5.sql, die je al
-- hebt gedraaid)
-- ============================================================

-- ============================================================
-- 1) Notitie + eigen beoordeling per ontkurk-moment. "wines.rating"
--    bestond al (de algehele beoordeling van een wijn) — dit is
--    een aparte, optionele beoordeling per keer dat je 'm opent.
-- ============================================================
alter table public.wine_events add column if not exists note text;
alter table public.wine_events add column if not exists occasion_rating smallint
  check (occasion_rating is null or occasion_rating between 1 and 5);

-- ============================================================
-- 2) Kelderkaart: eigen zones/rekken met een rooster (rijen x
--    kolommen), en optioneel de exacte plek van een wijn daarin.
-- ============================================================
create table if not exists public.cellar_zones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  name text not null,
  rows integer not null default 4 check (rows between 1 and 20),
  cols integer not null default 6 check (cols between 1 and 20),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.cellar_zones enable row level security;

drop policy if exists "select own cellar zones" on public.cellar_zones;
create policy "select own cellar zones" on public.cellar_zones
  for select using (auth.uid() = user_id);

drop policy if exists "insert own cellar zones" on public.cellar_zones;
create policy "insert own cellar zones" on public.cellar_zones
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own cellar zones" on public.cellar_zones;
create policy "update own cellar zones" on public.cellar_zones
  for update using (auth.uid() = user_id);

drop policy if exists "delete own cellar zones" on public.cellar_zones;
create policy "delete own cellar zones" on public.cellar_zones
  for delete using (auth.uid() = user_id);

-- Waar een wijn precies staat. "on delete set null" zodat het
-- verwijderen van een zone geen wijnen meeneemt — ze worden dan
-- gewoon weer "niet ingedeeld".
alter table public.wines add column if not exists zone_id uuid references public.cellar_zones(id) on delete set null;
alter table public.wines add column if not exists zone_row integer;
alter table public.wines add column if not exists zone_col integer;

-- ============================================================
-- 3) Verlanglijst: wijnen die je nog wil kopen, los van je
--    huidige voorraad.
-- ============================================================
create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  name text not null,
  producer text,
  vintage integer,
  region text,
  country text,
  grape_varieties text,
  color text check (color is null or color in ('rood', 'wit', 'rose', 'mousserend', 'versterkt', 'dessert')),
  notes text,
  target_price numeric,
  created_at timestamptz not null default now()
);

alter table public.wishlist_items enable row level security;

drop policy if exists "select own wishlist items" on public.wishlist_items;
create policy "select own wishlist items" on public.wishlist_items
  for select using (auth.uid() = user_id);

drop policy if exists "insert own wishlist items" on public.wishlist_items;
create policy "insert own wishlist items" on public.wishlist_items
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own wishlist items" on public.wishlist_items;
create policy "update own wishlist items" on public.wishlist_items
  for update using (auth.uid() = user_id);

drop policy if exists "delete own wishlist items" on public.wishlist_items;
create policy "delete own wishlist items" on public.wishlist_items
  for delete using (auth.uid() = user_id);
