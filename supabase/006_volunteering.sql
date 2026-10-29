-- Run once in the Supabase SQL editor (after 005).
-- Volunteering: roles that admins publish, and applications that visitors send.

create table if not exists public.volunteer_roles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  team text not null default '',          -- e.g. Media, Research, Events
  description text not null default '',
  commitment text not null default '',    -- e.g. "3 hours per week"
  skills text not null default '',        -- e.g. "Arabic and English writing"
  status text not null default 'open' check (status in ('open','closed')),
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.volunteer_applications (
  id uuid primary key default gen_random_uuid(),
  role_id uuid references public.volunteer_roles(id) on delete set null,
  role_title text not null default '',    -- kept even if the role is later deleted; empty = open application
  full_name text not null check (length(full_name) between 2 and 120),
  email text not null check (length(email) between 5 and 200 and email like '%@%'),
  country text not null default '' check (length(country) <= 120),
  university text not null default '' check (length(university) <= 200),
  languages text not null default '' check (length(languages) <= 200),
  availability text not null default '' check (length(availability) <= 300),
  motivation text not null check (length(motivation) between 20 and 2000),
  consent boolean not null check (consent),   -- the applicant agreed to the privacy note
  status text not null default 'new' check (status in ('new','contacted','accepted','declined')),
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.volunteer_roles enable row level security;
alter table public.volunteer_applications enable row level security;

-- everyone can read the roles; only super admins edit them
drop policy if exists "vroles read" on public.volunteer_roles;
create policy "vroles read" on public.volunteer_roles for select to anon, authenticated using (true);
drop policy if exists "vroles admin write" on public.volunteer_roles;
create policy "vroles admin write" on public.volunteer_roles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- anyone can SEND an application (status forced to 'new'); only super admins can read or manage them
drop policy if exists "vapps insert" on public.volunteer_applications;
create policy "vapps insert" on public.volunteer_applications for insert to anon, authenticated
  with check (status = 'new' and notes = '' and consent);
drop policy if exists "vapps admin all" on public.volunteer_applications;
create policy "vapps admin all" on public.volunteer_applications for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
