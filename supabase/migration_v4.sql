-- ============================================================
-- Wijnkast — migratie v4: eigen achtergrondfoto op het dashboard
-- Plak dit hele bestand in Supabase: SQL Editor > New query > Run
-- (aanvulling op schema.sql, migration_admin.sql, migration_v2.sql en
-- migration_v3.sql, die je al hebt gedraaid)
-- ============================================================

-- Eigen achtergrondfoto voor het "Mijn kelder"-dashboard. Leeg (null)
-- betekent: gebruik de meegeleverde standaardfoto.
alter table public.cellar_settings add column if not exists hero_image_url text;

-- Opslagplek voor de achtergrondfoto's, met dezelfde soort beveiliging als
-- de logo's: iedereen mag ze bekijken (ze staan in de app), maar alleen de
-- eigenaar zelf mag zijn/haar eigen foto uploaden of verwijderen.
insert into storage.buckets (id, name, public)
values ('cellar-hero', 'cellar-hero', true)
on conflict (id) do nothing;

drop policy if exists "Upload own hero image" on storage.objects;
create policy "Upload own hero image" on storage.objects
  for insert with check (bucket_id = 'cellar-hero' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "View hero images" on storage.objects;
create policy "View hero images" on storage.objects
  for select using (bucket_id = 'cellar-hero');

drop policy if exists "Delete own hero image" on storage.objects;
create policy "Delete own hero image" on storage.objects
  for delete using (bucket_id = 'cellar-hero' and auth.uid()::text = (storage.foldername(name))[1]);

-- De publieke view moet de nieuwe kolom ook doorgeven. Let op: nieuwe
-- kolommen komen achteraan, Postgres staat het niet toe om bestaande
-- kolommen van een view van plek te laten wisselen.
create or replace view public.cellar_settings_public as
  select user_id, cellar_name, logo_type, logo_url, accent_color, theme_preference, dining_view, updated_at,
         (reset_code_hash is not null) as has_reset_code,
         display_name, onboarding_completed, hero_image_url
  from public.cellar_settings;

alter view public.cellar_settings_public set (security_invoker = on);
