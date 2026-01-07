-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- 3.1 master tables

create table public.roles (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid references public.roles(id),
  name text not null,
  slug text not null unique,
  sort_order int default 0,
  is_active boolean default true
);
alter table public.roles enable row level security;

create table public.skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  synonyms text[] default '{}',
  sort_order int default 0,
  is_active boolean default true
);
alter table public.skills enable row level security;

create table public.locations (
  id uuid primary key default uuid_generate_v4(),
  region text not null,
  name text not null,
  slug text not null unique,
  is_active boolean default true
);
alter table public.locations enable row level security;

-- 3.2 jobs tables

create table public.jobs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  role_id uuid references public.roles(id),
  work_style text check (work_style in ('remote','hybrid','onsite')),
  price_min int,
  price_max int,
  location_id uuid references public.locations(id),
  duration_months int,
  start_date date,
  interview_steps int,
  description_md text,
  requirements_md text,
  nice_to_have_md text,
  is_active boolean default true,
  status text check (status in ('draft','published')) default 'draft',
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.jobs enable row level security;

create table public.job_skills (
  job_id uuid references public.jobs(id) on delete cascade,
  skill_id uuid references public.skills(id),
  primary key (job_id, skill_id)
);
alter table public.job_skills enable row level security;

create table public.job_badges (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid references public.jobs(id) on delete cascade,
  badge_type text, 
  label text,
  sort_order int default 0
);
alter table public.job_badges enable row level security;

-- 3.3 articles tables

create table public.articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content_md text,
  status text check (status in ('draft','published')) default 'draft',
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.articles enable row level security;

create table public.article_tags (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid references public.articles(id) on delete cascade,
  tag_type text check (tag_type in ('role','skill','work_style','price_band')),
  ref_id uuid, 
  value text
);
create unique index article_tags_unique_idx on public.article_tags (article_id, tag_type, coalesce(ref_id, '00000000-0000-0000-0000-000000000000'::uuid), coalesce(value, ''));
alter table public.article_tags enable row level security;

-- 3.4 leads table

create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text,
  role_text text,
  years_of_exp int,
  status text check (status in ('new','contacted','interview','introduced','closed')) default 'new',
  created_at timestamptz default now()
);
alter table public.leads enable row level security;

-- Full Text Search
alter table jobs add column fts tsvector generated always as (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description_md, '') || ' ' || coalesce(requirements_md, '') || ' ' || coalesce(nice_to_have_md, ''))
) stored;

create index jobs_fts_idx on jobs using gin(fts);

-- Profiles for Admin
create table public.profiles (
  id uuid references auth.users not null primary key,
  role text check (role in ('admin', 'user')) default 'user'
);
alter table public.profiles enable row level security;

-- RLS Policies

-- Master tables
create policy "Masters are viewable by everyone" on public.roles for select using (true);
create policy "Masters are viewable by everyone" on public.skills for select using (true);
create policy "Masters are viewable by everyone" on public.locations for select using (true);

-- Jobs
create policy "Published jobs are viewable by everyone" on public.jobs
  for select using (status = 'published' and is_active = true);
  
create policy "Published job_skills are viewable by everyone" on public.job_skills
  for select using (exists (select 1 from jobs where id = job_skills.job_id and status = 'published' and is_active = true));

create policy "Published job_badges are viewable by everyone" on public.job_badges
  for select using (exists (select 1 from jobs where id = job_badges.job_id and status = 'published' and is_active = true));

-- Articles
create policy "Published articles are viewable by everyone" on public.articles
  for select using (status = 'published');

create policy "Published article_tags are viewable by everyone" on public.article_tags
  for select using (exists (select 1 from articles where id = article_tags.article_id and status = 'published'));

-- Leads 
create policy "Anyone can insert leads" on public.leads for insert with check (true);

-- Admin Global Access
create policy "Admins can do everything on roles" on public.roles for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can do everything on skills" on public.skills for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can do everything on locations" on public.locations for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can do everything on jobs" on public.jobs for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can do everything on job_skills" on public.job_skills for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can do everything on job_badges" on public.job_badges for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can do everything on articles" on public.articles for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can do everything on article_tags" on public.article_tags for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can do everything on leads" on public.leads for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);

-- Seed Data
insert into roles (name, slug) values 
('Frontend Engineer', 'frontend'),
('Backend Engineer', 'backend'),
('Fullstack Engineer', 'fullstack'),
('SRE / Infrastructure', 'sre'),
('Project Manager', 'pm');

insert into skills (name, slug, synonyms) values 
('React', 'react', '{"react.js"}'),
('Next.js', 'nextjs', '{"next.js"}'),
('TypeScript', 'typescript', '{"ts"}'),
('Node.js', 'nodejs', '{"node"}'),
('Go', 'go', '{"golang"}'),
('Python', 'python', '{}'),
('AWS', 'aws', '{"amazon web services"}'),
('Supabase', 'supabase', '{}');

insert into locations (region, name, slug) values
('関東', '東京', 'tokyo'),
('関東', '神奈川', 'kanagawa'),
('関西', '大阪', 'osaka');
