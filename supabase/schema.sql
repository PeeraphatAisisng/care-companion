-- Care Companion schema, RLS, storage, and auth trigger
-- วางทั้งไฟล์นี้ใน Supabase SQL Editor แล้วกด Run

create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('customer', 'companion', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.verification_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.errand_type as enum ('hospital', 'clinic', 'bank', 'government', 'shopping', 'other');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.request_status as enum ('open', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.application_status as enum ('pending', 'accepted', 'rejected');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role,
  full_name text not null default '',
  phone text,
  avatar_url text,
  date_of_birth date,
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  bio text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.companion_profiles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  experience_years integer default 0,
  skills text[] not null default '{}',
  service_areas text[] not null default '{}',
  available_days text[] not null default '{}',
  available_from time,
  available_to time,
  hourly_rate numeric(10, 2),
  verification_status public.verification_status not null default 'pending',
  id_document_url text,
  intro text,
  languages text[] not null default '{ไทย}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  companion_id uuid references public.profiles (id) on delete set null,
  errand_type public.errand_type not null,
  title text not null,
  description text,
  origin text not null,
  destination text not null,
  scheduled_date date not null,
  scheduled_time time not null,
  duration_hours numeric(4, 1) not null default 2,
  status public.request_status not null default 'open',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests (id) on delete cascade,
  companion_id uuid not null references public.profiles (id) on delete cascade,
  message text,
  status public.application_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (request_id, companion_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests (id) on delete cascade,
  reviewer_id uuid not null references public.profiles (id) on delete cascade,
  reviewee_id uuid not null references public.profiles (id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (request_id, reviewer_id)
);

create index if not exists service_requests_customer_idx on public.service_requests (customer_id);
create index if not exists service_requests_companion_idx on public.service_requests (companion_id);
create index if not exists service_requests_status_idx on public.service_requests (status);
create index if not exists applications_request_idx on public.applications (request_id);
create index if not exists reviews_reviewee_idx on public.reviews (reviewee_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists companion_profiles_updated_at on public.companion_profiles;
create trigger companion_profiles_updated_at
  before update on public.companion_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists service_requests_updated_at on public.service_requests;
create trigger service_requests_updated_at
  before update on public.service_requests
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and is_active = true
  );
$$;

create or replace function public.is_approved_companion(target uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join public.companion_profiles c on c.user_id = p.id
    where p.id = target
      and p.role = 'companion'
      and p.is_active = true
      and c.verification_status = 'approved'
  );
$$;

alter table public.profiles enable row level security;
alter table public.companion_profiles enable row level security;
alter table public.service_requests enable row level security;
alter table public.applications enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (
    is_active = true
    or id = auth.uid()
    or public.is_admin()
  );

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid() or public.is_admin());

drop policy if exists "companion_select" on public.companion_profiles;
create policy "companion_select" on public.companion_profiles
  for select using (
    verification_status = 'approved'
    or user_id = auth.uid()
    or public.is_admin()
  );

drop policy if exists "companion_insert_own" on public.companion_profiles;
create policy "companion_insert_own" on public.companion_profiles
  for insert with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "companion_update_own" on public.companion_profiles;
create policy "companion_update_own" on public.companion_profiles
  for update using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "requests_select" on public.service_requests;
create policy "requests_select" on public.service_requests
  for select using (
    customer_id = auth.uid()
    or companion_id = auth.uid()
    or public.is_admin()
    or (
      status = 'open'
      and exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'companion' and is_active = true
      )
    )
  );

drop policy if exists "requests_insert" on public.service_requests;
create policy "requests_insert" on public.service_requests
  for insert with check (
    customer_id = auth.uid()
    or public.is_admin()
  );

drop policy if exists "requests_update" on public.service_requests;
create policy "requests_update" on public.service_requests
  for update using (
    customer_id = auth.uid()
    or companion_id = auth.uid()
    or public.is_admin()
  )
  with check (
    customer_id = auth.uid()
    or companion_id = auth.uid()
    or public.is_admin()
  );

drop policy if exists "applications_select" on public.applications;
create policy "applications_select" on public.applications
  for select using (
    companion_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.service_requests r
      where r.id = request_id and r.customer_id = auth.uid()
    )
  );

drop policy if exists "applications_insert" on public.applications;
create policy "applications_insert" on public.applications
  for insert with check (
    companion_id = auth.uid()
    and public.is_approved_companion(auth.uid())
  );

drop policy if exists "applications_update" on public.applications;
create policy "applications_update" on public.applications
  for update using (
    companion_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.service_requests r
      where r.id = request_id and r.customer_id = auth.uid()
    )
  );

drop policy if exists "reviews_select" on public.reviews;
create policy "reviews_select" on public.reviews
  for select using (true);

drop policy if exists "reviews_insert" on public.reviews;
create policy "reviews_insert" on public.reviews
  for insert with check (
    reviewer_id = auth.uid()
    and exists (
      select 1 from public.service_requests r
      where r.id = request_id
        and r.status = 'completed'
        and (r.customer_id = auth.uid() or r.companion_id = auth.uid())
    )
  );

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do update set public = false;

drop policy if exists "avatar_read" on storage.objects;
create policy "avatar_read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatar_write" on storage.objects;
create policy "avatar_write" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatar_update" on storage.objects;
create policy "avatar_update" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "documents_read" on storage.objects;
create policy "documents_read" on storage.objects
  for select using (
    bucket_id = 'documents'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or public.is_admin()
    )
  );

drop policy if exists "documents_write" on storage.objects;
create policy "documents_write" on storage.objects
  for insert with check (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ตั้ง Admin คนแรกหลังล็อกอินด้วย Google แล้ว
-- update public.profiles
-- set role = 'admin'
-- where id = (select id from auth.users where email = 'your-email@gmail.com');
