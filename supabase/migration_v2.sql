-- ============================================================
-- Wijnkast — migratie v2: uitgebreide velden, favorieten,
-- voorraadgeschiedenis (ontkurken/undo), en kelderinstellingen
-- Plak dit hele bestand in Supabase: SQL Editor > New query > Run
-- (aanvulling op schema.sql en migration_admin.sql, die je al hebt gedraaid)
-- ============================================================

-- Sta "dessert" toe als extra wijntype, naast de bestaande opties.
alter table public.wines drop constraint if exists wines_color_check;
alter table public.wines add constraint wines_color_check
  check (color in ('rood', 'wit', 'rose', 'mousserend', 'versterkt', 'dessert'));

-- Nieuwe velden op een wijn.
alter table public.wines add column if not exists appellation text;
alter table public.wines add column if not exists classification text;
alter table public.wines add column if not exists tasting_profile text
  check (tasting_profile is null or tasting_profile in ('fris_mineraal', 'vol_romig', 'licht_fruitig', 'krachtig_complex'));
alter table public.wines add column if not exists food_pairing text[] default '{}';
alter table public.wines add column if not exists serve_temperature text;
alter table public.wines add column if not exists decant_time text;
alter table public.wines add column if not exists purchase_location text;
alter table public.wines add column if not exists estimated_value numeric;
alter table public.wines add column if not exists is_favorite boolean not null default false;

-- ============================================================
-- Voorraadgeschiedenis: elke toevoeging/correctie/ontkurking/undo
-- wordt hier gelogd, zodat er een echte geschiedenis bestaat i.p.v.
-- alleen het huidige aantal.
-- ============================================================
create table if not exists public.wine_events (
  id uuid primary key default gen_random_uuid(),
  wine_id uuid references public.wines(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  type text not null check (type in ('add', 'correct', 'uncork', 'undo')),
  quantity_delta integer not null,
  created_at timestamptz not null default now()
);

alter table public.wine_events enable row level security;

drop policy if exists "select own wine events" on public.wine_events;
create policy "select own wine events" on public.wine_events
  for select using (auth.uid() = user_id);

drop policy if exists "insert own wine events" on public.wine_events;
create policy "insert own wine events" on public.wine_events
  for insert with check (auth.uid() = user_id);

-- ============================================================
-- Kelderinstellingen: één rij per gebruiker — naam, logo,
-- accentkleur, thema-voorkeur en de gehashte resetcode.
-- De resetcode zelf wordt NOOIT leesbaar opgeslagen, alleen een hash
-- die een serverfunctie met een geheime sleutel controleert.
-- ============================================================
create table if not exists public.cellar_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  cellar_name text not null default 'Mijn wijnkelder',
  logo_type text not null default 'default' check (logo_type in ('default', 'upload')),
  logo_url text,
  accent_color text not null default '#641027',
  theme_preference text not null default 'auto' check (theme_preference in ('auto', 'light', 'dark')),
  dining_view boolean not null default false,
  reset_code_hash text,
  updated_at timestamptz not null default now()
);

alter table public.cellar_settings enable row level security;

drop policy if exists "select own cellar settings" on public.cellar_settings;
create policy "select own cellar settings" on public.cellar_settings
  for select using (auth.uid() = user_id);

drop policy if exists "upsert own cellar settings" on public.cellar_settings;
create policy "upsert own cellar settings" on public.cellar_settings
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own cellar settings" on public.cellar_settings;
create policy "update own cellar settings" on public.cellar_settings
  for update using (auth.uid() = user_id);

-- Let op: reset_code_hash mag NIET leesbaar zijn voor de browser, ook niet
-- voor de eigenaar zelf (anders zou een dief met toegang tot het account
-- de hash kunnen uitlezen). We schermen die kolom af met een view die 'm
-- weglaat, en gebruiken die view in de app in plaats van de tabel direct.
create or replace view public.cellar_settings_public as
  select user_id, cellar_name, logo_type, logo_url, accent_color, theme_preference, dining_view, updated_at,
         (reset_code_hash is not null) as has_reset_code
  from public.cellar_settings;

alter view public.cellar_settings_public set (security_invoker = on);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_cellar_settings_updated_at on public.cellar_settings;
create trigger trg_cellar_settings_updated_at
  before update on public.cellar_settings
  for each row execute function public.touch_updated_at();

-- ============================================================
-- Opslag voor zelf-geüploade kelderlogo's.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('cellar-logos', 'cellar-logos', true)
on conflict (id) do nothing;

drop policy if exists "Upload own cellar logo" on storage.objects;
create policy "Upload own cellar logo" on storage.objects
  for insert with check (bucket_id = 'cellar-logos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "View cellar logos" on storage.objects;
create policy "View cellar logos" on storage.objects
  for select using (bucket_id = 'cellar-logos');

drop policy if exists "Delete own cellar logo" on storage.objects;
create policy "Delete own cellar logo" on storage.objects
  for delete using (bucket_id = 'cellar-logos' and auth.uid()::text = (storage.foldername(name))[1]);

-- Vul kelderinstellingen aan voor accounts die al bestonden.
insert into public.cellar_settings (user_id)
select id from auth.users
on conflict (user_id) do nothing;

-- Breid de bestaande "nieuwe gebruiker"-trigger uit zodat die ook meteen
-- kelderinstellingen aanmaakt (naast het profiel uit migration_admin.sql).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user')
  on conflict (id) do nothing;

  insert into public.cellar_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer set search_path = public;
