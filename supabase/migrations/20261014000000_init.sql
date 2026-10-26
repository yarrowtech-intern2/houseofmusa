-- Haus of Musa — initial Supabase schema (replaces the Mongo/Mongoose models in the old apps/api).
-- Public visitors use the anon key; admins sign in through Supabase Auth and are recognised by a row in
-- public.admin_profiles. Every table has RLS enabled; there is no service-role access from the browser.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------------------------
-- Admin profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------------------------

create table public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  role text not null default 'editor' check (role in ('super-admin', 'editor', 'recruiter')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger admin_profiles_updated_at before update on public.admin_profiles
  for each row execute function public.set_updated_at();

-- security definer so policies on other tables can call it without recursing into admin_profiles' own RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_profiles where id = auth.uid());
$$;

alter table public.admin_profiles enable row level security;

create policy "admins read own profile" on public.admin_profiles
  for select to authenticated using (id = auth.uid());

-- ---------------------------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------------------------

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9-]+$'),
  name text not null,
  tagline text not null,
  description text not null,
  category text not null check (category in (
    'erp', 'saas', 'enterprise-software', 'custom-software', 'ai-infrastructure',
    'digital-transformation', 'cloud-solutions', 'web-mobile'
  )),
  tech_stack text[] not null default '{}',
  cover_image text not null default '',
  gallery text[] not null default '{}',
  case_study_url text,
  live_demo_url text,
  github_url text,
  featured boolean not null default false,
  "order" integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_published_order_idx on public.products (published, "order", created_at desc);

create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

alter table public.products enable row level security;

create policy "public reads published products" on public.products
  for select to anon, authenticated using (published);
create policy "admins read all products" on public.products
  for select to authenticated using (public.is_admin());
create policy "admins insert products" on public.products
  for insert to authenticated with check (public.is_admin());
create policy "admins update products" on public.products
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete products" on public.products
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------------------------
-- Career roles
-- ---------------------------------------------------------------------------------------------

create table public.career_roles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9-]+$'),
  title text not null,
  department text not null,
  location text not null,
  employment_type text not null check (employment_type in ('full-time', 'part-time', 'contract', 'internship', 'remote')),
  description text not null,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger career_roles_updated_at before update on public.career_roles
  for each row execute function public.set_updated_at();

alter table public.career_roles enable row level security;

create policy "public reads published roles" on public.career_roles
  for select to anon, authenticated using (published);
create policy "admins read all roles" on public.career_roles
  for select to authenticated using (public.is_admin());
create policy "admins insert roles" on public.career_roles
  for insert to authenticated with check (public.is_admin());
create policy "admins update roles" on public.career_roles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete roles" on public.career_roles
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------------------------
-- Applications
-- ---------------------------------------------------------------------------------------------

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.career_roles (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null check (char_length(phone) between 5 and 30),
  -- Paths inside the private "applications" storage bucket (not public URLs).
  resume_url text not null,
  cover_letter_url text,
  linkedin_url text check (char_length(linkedin_url) <= 300),
  github_url text check (char_length(github_url) <= 300),
  portfolio_url text check (char_length(portfolio_url) <= 300),
  expected_salary text check (char_length(expected_salary) <= 60),
  experience_years numeric not null check (experience_years between 0 and 60),
  skills text[] not null default '{}' check (cardinality(skills) <= 50),
  availability text not null check (char_length(availability) between 2 and 120),
  status text not null default 'new' check (status in ('new', 'reviewing', 'interviewing', 'offered', 'rejected', 'hired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index applications_created_idx on public.applications (created_at desc);

create trigger applications_updated_at before update on public.applications
  for each row execute function public.set_updated_at();

alter table public.applications enable row level security;

-- Visitors can submit, never read. They cannot pick their own status.
create policy "anyone submits an application" on public.applications
  for insert to anon, authenticated with check (status = 'new');
create policy "admins read applications" on public.applications
  for select to authenticated using (public.is_admin());
create policy "admins update applications" on public.applications
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete applications" on public.applications
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------------------------
-- Contacts
-- ---------------------------------------------------------------------------------------------

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (char_length(phone) <= 30),
  company text check (char_length(company) <= 120),
  budget text not null check (budget in ('under-10k', '10k-50k', '50k-150k', '150k-plus', 'not-sure')),
  project_type text not null check (project_type in (
    'erp', 'saas', 'enterprise-software', 'custom-software', 'ai-infrastructure',
    'digital-transformation', 'cloud-solutions', 'web-mobile', 'other'
  )),
  message text not null check (char_length(message) between 10 and 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contacts_created_idx on public.contacts (created_at desc);

create trigger contacts_updated_at before update on public.contacts
  for each row execute function public.set_updated_at();

alter table public.contacts enable row level security;

create policy "anyone submits a contact" on public.contacts
  for insert to anon, authenticated with check (status = 'new');
create policy "admins read contacts" on public.contacts
  for select to authenticated using (public.is_admin());
create policy "admins update contacts" on public.contacts
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete contacts" on public.contacts
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------------------------
-- Analytics events
-- ---------------------------------------------------------------------------------------------

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('page-view', 'contact-submit', 'application-submit', 'product-view', 'gallery-visit')),
  path text not null check (char_length(path) between 1 and 300),
  meta jsonb check (pg_column_size(meta) <= 4096),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index analytics_events_type_created_idx on public.analytics_events (type, created_at desc);
create index analytics_events_created_idx on public.analytics_events (created_at desc);

alter table public.analytics_events enable row level security;

-- Browsers may only report page-level events; contact-submit / application-submit are written by the
-- triggers below so they cannot be forged from the client.
create policy "anyone reports page events" on public.analytics_events
  for insert to anon, authenticated with check (type in ('page-view', 'product-view', 'gallery-visit'));
create policy "admins read analytics" on public.analytics_events
  for select to authenticated using (public.is_admin());

create or replace function public.log_contact_submit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.analytics_events (type, path, meta)
  values ('contact-submit', '/contact',
          jsonb_build_object('contactId', new.id, 'budget', new.budget, 'projectType', new.project_type));
  return new;
end;
$$;

create trigger contacts_log_submit after insert on public.contacts
  for each row execute function public.log_contact_submit();

create or replace function public.log_application_submit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  role_row public.career_roles;
begin
  select * into role_row from public.career_roles where id = new.role_id;
  insert into public.analytics_events (type, path, meta)
  values ('application-submit', '/careers/' || coalesce(role_row.slug, ''),
          jsonb_build_object('applicationId', new.id, 'roleId', new.role_id, 'department', role_row.department));
  return new;
end;
$$;

create trigger applications_log_submit after insert on public.applications
  for each row execute function public.log_application_submit();

-- ---------------------------------------------------------------------------------------------
-- Media registry
-- ---------------------------------------------------------------------------------------------

create table public.media (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  -- Full public URL for files in the "media" bucket (or any external URL).
  url text not null,
  -- Object path inside the "media" bucket, null for externally hosted assets.
  storage_path text,
  mime_type text not null,
  size bigint not null check (size >= 0),
  category text not null default 'misc' check (category in ('product', 'gallery-frame', 'homepage', 'misc')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger media_updated_at before update on public.media
  for each row execute function public.set_updated_at();

alter table public.media enable row level security;

create policy "admins manage media" on public.media
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------------------------
-- Settings (key/value JSON)
-- ---------------------------------------------------------------------------------------------

create table public.settings (
  key text primary key check (key in ('homepage-content', 'contact-details', 'gallery-frames', 'seo')),
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger settings_updated_at before update on public.settings
  for each row execute function public.set_updated_at();

alter table public.settings enable row level security;

create policy "public reads settings" on public.settings
  for select to anon, authenticated using (true);
create policy "admins insert settings" on public.settings
  for insert to authenticated with check (public.is_admin());
create policy "admins update settings" on public.settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------------------------
-- Dashboard / analytics summaries (admin only)
-- ---------------------------------------------------------------------------------------------

create or replace function public.dashboard_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  week_start timestamptz := date_trunc('day', now()) - interval '6 days';
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'totals', jsonb_build_object(
      'products', (select count(*) from products),
      'publishedProducts', (select count(*) from products where published),
      'careerRoles', (select count(*) from career_roles),
      'publishedCareerRoles', (select count(*) from career_roles where published),
      'contacts', (select count(*) from contacts),
      'newContacts', (select count(*) from contacts where status = 'new'),
      'applications', (select count(*) from applications),
      'activeApplications', (select count(*) from applications where status in ('new', 'reviewing', 'interviewing', 'offered')),
      'analyticsEvents', (select count(*) from analytics_events)
    ),
    'contactsByStatus', coalesce((
      select jsonb_agg(jsonb_build_object('status', status, 'count', n))
      from (select status, count(*) as n from contacts group by status) s
    ), '[]'::jsonb),
    'applicationsByStatus', coalesce((
      select jsonb_agg(jsonb_build_object('status', status, 'count', n))
      from (select status, count(*) as n from applications group by status) s
    ), '[]'::jsonb),
    'eventsByDay', coalesce((
      select jsonb_agg(jsonb_build_object('date', d, 'count', n) order by d)
      from (
        select to_char(created_at at time zone 'UTC', 'YYYY-MM-DD') as d, count(*) as n
        from analytics_events where created_at >= week_start group by 1
      ) s
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.analytics_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  since timestamptz := date_trunc('day', now()) - interval '13 days';
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'totalEvents', (select count(*) from analytics_events),
    'byType', coalesce((
      select jsonb_agg(jsonb_build_object('type', type, 'count', n) order by n desc)
      from (select type, count(*) as n from analytics_events group by type) s
    ), '[]'::jsonb),
    'topPaths', coalesce((
      select jsonb_agg(jsonb_build_object('path', path, 'count', n) order by n desc)
      from (
        select path, count(*) as n from analytics_events
        where type = 'page-view' group by path order by n desc limit 8
      ) s
    ), '[]'::jsonb),
    'daily', coalesce((
      select jsonb_agg(jsonb_build_object('date', d, 'count', n) order by d)
      from (
        select to_char(created_at at time zone 'UTC', 'YYYY-MM-DD') as d, count(*) as n
        from analytics_events where created_at >= since group by 1
      ) s
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.dashboard_summary() from public, anon;
revoke all on function public.analytics_summary() from public, anon;
grant execute on function public.dashboard_summary() to authenticated;
grant execute on function public.analytics_summary() to authenticated;

-- ---------------------------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 26214400, array[
    'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif',
    'model/gltf-binary', 'model/gltf+json', 'application/octet-stream', 'application/json'
  ]),
  ('applications', 'applications', false, 5242880, array[
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ])
on conflict (id) do nothing;

-- media bucket: public read comes from bucket.public; only admins write.
create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- applications bucket: visitors may drop files in, only admins can read them back.
create policy "anyone uploads application files" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'applications');
create policy "admins read application files" on storage.objects
  for select to authenticated using (bucket_id = 'applications' and public.is_admin());
create policy "admins delete application files" on storage.objects
  for delete to authenticated using (bucket_id = 'applications' and public.is_admin());
