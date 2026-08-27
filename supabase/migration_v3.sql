-- ============================================================
-- Wijnkast — migratie v3: onboarding en persoonlijke naam
-- Plak dit hele bestand in Supabase: SQL Editor > New query > Run
-- (aanvulling op schema.sql, migration_admin.sql en migration_v2.sql,
-- die je al hebt gedraaid)
-- ============================================================

-- Naam van de persoon (voor het welkomstscherm) en of de onboarding
-- al is doorlopen (bepaalt of een nieuwe/bestaande gebruiker de
-- introductievragen te zien krijgt).
alter table public.cellar_settings add column if not exists display_name text;
alter table public.cellar_settings add column if not exists onboarding_completed boolean not null default false;

-- Bestaande gebruikers (die de app al gebruikten vóór onboarding
-- bestond) hoeven de introductievragen niet alsnog te zien.
update public.cellar_settings set onboarding_completed = true where onboarding_completed = false;

-- De publieke view (zonder reset_code_hash) moet de nieuwe kolommen
-- ook doorgeven aan de app.
create or replace view public.cellar_settings_public as
  select user_id, cellar_name, display_name, onboarding_completed, logo_type, logo_url, accent_color,
         theme_preference, dining_view, updated_at,
         (reset_code_hash is not null) as has_reset_code
  from public.cellar_settings;

alter view public.cellar_settings_public set (security_invoker = on);
