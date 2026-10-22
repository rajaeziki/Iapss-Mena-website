-- Run this ONCE in the Supabase SQL editor, after schema.sql.
-- Adds: admin approval of new members + admin-editable public content (team, partners, projects).

-- 1) approval status. Existing users are approved; NEW sign-ups default to 'pending'.
do $$
begin
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'profiles' and column_name = 'status') then
    alter table public.profiles
      add column status text not null default 'approved' check (status in ('pending','approved','rejected'));
    alter table public.profiles alter column status set default 'pending';
  end if;
end $$;

create or replace function public.is_approved() returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from profiles where id = auth.uid() and status = 'approved');
$$;

-- first user = approved super admin, everyone else = pending member
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare first_user boolean;
begin
  select count(*) = 0 into first_user from profiles;
  insert into profiles (id, full_name, email, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.email,
    case when first_user then 'super_admin' else 'member' end,
    case when first_user then 'approved' else 'pending' end
  );
  return new;
end $$;

-- 2) pending / rejected people can only see their own profile and nothing else
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_approved());

drop policy if exists "messages read" on public.messages;
create policy "messages read" on public.messages for select to authenticated
  using (public.is_approved() and (group_id is null or public.is_admin() or public.is_group_member(group_id)));

drop policy if exists "messages insert" on public.messages;
create policy "messages insert" on public.messages for insert to authenticated
  with check (sender_id = auth.uid() and public.is_approved()
              and (group_id is null or public.is_admin() or public.is_group_member(group_id)));

drop policy if exists "todos own" on public.todos;
create policy "todos own" on public.todos for all to authenticated
  using (user_id = auth.uid() and public.is_approved())
  with check (user_id = auth.uid() and public.is_approved());

-- 3) public website content, edited by admins in the dashboard
create table if not exists public.site_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('team','partner','project')),
  title text not null,
  subtitle text not null default '',     -- team: role | partner: type | project: year
  description text not null default '',
  link text not null default '',
  sort int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.site_items enable row level security;

drop policy if exists "site read" on public.site_items;
create policy "site read" on public.site_items for select to anon, authenticated using (true);

drop policy if exists "site admin write" on public.site_items;
create policy "site admin write" on public.site_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
