-- ============================================================
-- Wijnkelder — Supabase database schema
-- Plak dit hele bestand in Supabase: SQL Editor > New query > Run
-- ============================================================

-- Tabel met wijnen. Elke rij hoort bij één gebruiker (user_id).
create table if not exists public.wines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  name text not null,
  producer text,
  vintage integer,
  grape_varieties text,
  region text,
  country text,
  color text check (color in ('rood', 'wit', 'rose', 'mousserend', 'versterkt')) default 'rood',
  quantity integer not null default 1,
  location text,
  purchase_price numeric,
  purchase_date date,
  drink_from integer,
  drink_until integer,
  rating integer check (rating between 0 and 5),
  tasting_notes text,
  label_photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Zorg dat "updated_at" automatisch bijgewerkt wordt.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_wines_updated_at on public.wines;
create trigger trg_wines_updated_at
  before update on public.wines
  for each row execute function public.set_updated_at();

-- Row Level Security: iedere gebruiker ziet en bewerkt alleen zijn eigen wijnen.
alter table public.wines enable row level security;

drop policy if exists "Select own wines" on public.wines;
create policy "Select own wines" on public.wines
  for select using (auth.uid() = user_id);

drop policy if exists "Insert own wines" on public.wines;
create policy "Insert own wines" on public.wines
  for insert with check (auth.uid() = user_id);

drop policy if exists "Update own wines" on public.wines;
create policy "Update own wines" on public.wines
  for update using (auth.uid() = user_id);

drop policy if exists "Delete own wines" on public.wines;
create policy "Delete own wines" on public.wines
  for delete using (auth.uid() = user_id);

-- ============================================================
-- Opslag voor foto's van etiketten
-- ============================================================

insert into storage.buckets (id, name, public)
values ('wine-labels', 'wine-labels', true)
on conflict (id) do nothing;

drop policy if exists "Upload own label photos" on storage.objects;
create policy "Upload own label photos" on storage.objects
  for insert with check (
    bucket_id = 'wine-labels'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "View label photos" on storage.objects;
create policy "View label photos" on storage.objects
  for select using (bucket_id = 'wine-labels');

drop policy if exists "Delete own label photos" on storage.objects;
create policy "Delete own label photos" on storage.objects
  for delete using (
    bucket_id = 'wine-labels'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
