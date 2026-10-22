-- IAPSS platform schema. Run this once in the Supabase SQL editor (or `supabase db push`).
-- The FIRST user who signs up automatically becomes super_admin.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  role text not null default 'member' check (role in ('super_admin','member')),
  created_at timestamptz not null default now()
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  leader_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  primary key (group_id, user_id)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  title text not null,
  description text not null default '',
  assignee_id uuid references public.profiles(id) on delete set null,
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  status text not null default 'todo' check (status in ('todo','in_progress','review','done')),
  due_date date,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- group_id NULL = the general channel for everyone
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.groups(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (length(content) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index if not exists messages_group_idx on public.messages (group_id, created_at);

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  text text not null,
  done boolean not null default false,
  due_date date,
  created_at timestamptz not null default now()
);

-- ---------- helpers ----------
create or replace function public.is_admin() returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'super_admin');
$$;

create or replace function public.is_group_member(gid uuid) returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from group_members where group_id = gid and user_id = auth.uid())
      or exists (select 1 from groups where id = gid and leader_id = auth.uid());
$$;

create or replace function public.is_group_leader(gid uuid) returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from groups where id = gid and leader_id = auth.uid());
$$;

-- profile on signup; first user = super_admin
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.email,
    case when (select count(*) from profiles) = 0 then 'super_admin' else 'member' end
  );
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- a leader is always a member of the group
create or replace function public.leader_is_member() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.leader_id is not null then
    insert into group_members (group_id, user_id) values (new.id, new.leader_id)
    on conflict do nothing;
  end if;
  return new;
end $$;
drop trigger if exists groups_leader_member on public.groups;
create trigger groups_leader_member after insert or update of leader_id on public.groups
  for each row execute function public.leader_is_member();

create or replace function public.touch_task() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists tasks_touch on public.tasks;
create trigger tasks_touch before update on public.tasks
  for each row execute function public.touch_task();

-- ---------- row level security ----------
alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.tasks enable row level security;
alter table public.messages enable row level security;
alter table public.todos enable row level security;

create policy "profiles read" on public.profiles for select to authenticated using (true);
create policy "profiles admin update" on public.profiles for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "groups read" on public.groups for select to authenticated
  using (public.is_admin() or public.is_group_member(id));
create policy "groups admin write" on public.groups for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "members read" on public.group_members for select to authenticated
  using (public.is_admin() or public.is_group_member(group_id));
create policy "members write" on public.group_members for all to authenticated
  using (public.is_admin() or public.is_group_leader(group_id))
  with check (public.is_admin() or public.is_group_leader(group_id));

create policy "tasks read" on public.tasks for select to authenticated
  using (public.is_admin() or public.is_group_member(group_id));
create policy "tasks insert" on public.tasks for insert to authenticated
  with check (public.is_admin() or public.is_group_leader(group_id));
create policy "tasks update" on public.tasks for update to authenticated
  using (public.is_admin() or public.is_group_leader(group_id) or assignee_id = auth.uid())
  with check (public.is_admin() or public.is_group_leader(group_id) or assignee_id = auth.uid());
create policy "tasks delete" on public.tasks for delete to authenticated
  using (public.is_admin() or public.is_group_leader(group_id));

create policy "messages read" on public.messages for select to authenticated
  using (group_id is null or public.is_admin() or public.is_group_member(group_id));
create policy "messages insert" on public.messages for insert to authenticated
  with check (sender_id = auth.uid() and (group_id is null or public.is_admin() or public.is_group_member(group_id)));

create policy "todos own" on public.todos for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- realtime ----------
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.tasks;
