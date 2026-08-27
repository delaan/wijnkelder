-- ============================================================
-- Wijnkelder — migratie: gebruikersrollen en beheerderspaneel
-- Plak dit hele bestand in Supabase: SQL Editor > New query > Run
-- (Dit is een AANVULLING op schema.sql, dat je al eerder hebt gedraaid.)
-- ============================================================

-- Eén rij per gebruiker: welke rol heeft iemand (admin of gewone gebruiker).
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helperfunctie: is de ingelogde gebruiker een admin? "security definer" zorgt
-- dat deze check zelf niet vastloopt in de RLS-regels van profiles.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "select own or admin sees all profiles" on public.profiles;
create policy "select own or admin sees all profiles" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "only admins update profiles" on public.profiles;
create policy "only admins update profiles" on public.profiles
  for update using (public.is_admin());

-- Nieuwe gebruikers krijgen automatisch een profielrij met rol "user".
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Vul profielen aan voor accounts die al bestonden vóór deze migratie.
insert into public.profiles (id, role)
select id, 'user' from auth.users
on conflict (id) do nothing;

-- ============================================================
-- Maak jezelf hoofdbeheerder
-- Vervang het e-mailadres hieronder door het adres waarmee jij bent
-- ingelogd in de app, en run dan dit hele bestand.
-- ============================================================
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'delanovandergeest@me.com');
