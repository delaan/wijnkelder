-- ============================================================
-- Wijnkast — migratie v5: profielfoto
-- Plak dit hele bestand in Supabase: SQL Editor > New query > Run
-- (aanvulling op schema.sql, migration_admin.sql, migration_v2.sql,
-- migration_v3.sql en migration_v4.sql, die je al hebt gedraaid)
-- ============================================================

-- Eigen profielfoto, te zien in het accountmenu en het welkomstscherm.
-- Leeg (null) betekent: geen foto, dan tonen we gewoon de eerste letter
-- van je e-mailadres zoals voorheen.
alter table public.cellar_settings add column if not exists avatar_url text;

-- Opslagplek voor profielfoto's, met dezelfde beveiliging als de logo's en
-- de achtergrondfoto: iedereen mag ze bekijken (ze staan in de app), maar
-- alleen de eigenaar zelf mag zijn/haar eigen foto uploaden of verwijderen.
insert into storage.buckets (id, name, public)
values ('cellar-avatars', 'cellar-avatars', true)
on conflict (id) do nothing;

drop policy if exists "Upload own avatar" on storage.objects;
create policy "Upload own avatar" on storage.objects
  for insert with check (bucket_id = 'cellar-avatars' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "View avatars" on storage.objects;
create policy "View avatars" on storage.objects
  for select using (bucket_id = 'cellar-avatars');

drop policy if exists "Delete own avatar" on storage.objects;
create policy "Delete own avatar" on storage.objects
  for delete using (bucket_id = 'cellar-avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- De publieke view moet de nieuwe kolom ook doorgeven. Let op: nieuwe
-- kolommen komen achteraan, Postgres staat het niet toe om bestaande
-- kolommen van een view van plek te laten wisselen.
create or replace view public.cellar_settings_public as
  select user_id, cellar_name, logo_type, logo_url, accent_color, theme_preference, dining_view, updated_at,
         (reset_code_hash is not null) as has_reset_code,
         display_name, onboarding_completed, hero_image_url, avatar_url
  from public.cellar_settings;

alter view public.cellar_settings_public set (security_invoker = on);
