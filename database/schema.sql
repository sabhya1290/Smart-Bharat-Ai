-- Smart Bharat AI — Database Schema (PostgreSQL / Supabase)
-- Run this once in the Supabase SQL editor before running the seed files.

create extension if not exists "pgcrypto";

-- ============================================================
-- users
-- ============================================================
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  full_name text not null,
  phone text,
  state text,
  age_group text check (age_group in ('under_18','18_25','26_35','36_45','46_60','60_plus')),
  occupation text,
  income_range text check (income_range in ('below_2_5l','2_5l_5l','5l_10l','above_10l','not_specified')),
  category text check (category in ('student','farmer','worker','senior_citizen','entrepreneur','other')) default 'other',
  preferred_language text check (preferred_language in ('en','hi','hinglish')) default 'en',
  accessibility_prefs jsonb default '{"fontScale": 1, "highContrast": false}'::jsonb,
  created_at timestamptz default now()
);

-- ============================================================
-- services
-- ============================================================
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null,
  eligibility text not null,
  required_documents text[] not null default '{}',
  processing_time text not null,
  official_url text not null,
  states text[] default '{}',
  nationwide boolean default true,
  created_at timestamptz default now()
);

create index if not exists idx_services_category on services(category);

-- ============================================================
-- user_saved_services
-- ============================================================
create table if not exists user_saved_services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  service_id uuid not null references services(id) on delete cascade,
  saved_at timestamptz default now(),
  unique (user_id, service_id)
);

-- ============================================================
-- scheme_rules
-- ============================================================
create table if not exists scheme_rules (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  condition jsonb not null default '{}'::jsonb,
  reason_template text not null,
  priority int default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- civic_issues
-- ============================================================
create table if not exists civic_issues (
  id uuid primary key default gen_random_uuid(),
  complaint_id text unique not null,
  user_id uuid references users(id) on delete set null,
  category text not null check (category in (
    'garbage_collection','road_damage','streetlight_issue','water_leakage',
    'drainage_problem','broken_footpath','public_safety','other'
  )),
  description text not null,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  priority text check (priority in ('low','medium','high','urgent')) default 'medium',
  landmark text,
  image_url text,
  department text not null,
  status text check (status in (
    'Submitted','Under Review','Assigned','In Progress','Resolved','Closed'
  )) default 'Submitted',
  estimated_resolution_date date,
  created_at timestamptz default now()
);

create index if not exists idx_civic_issues_complaint_id on civic_issues(complaint_id);
create index if not exists idx_civic_issues_user_id on civic_issues(user_id);
create index if not exists idx_civic_issues_status on civic_issues(status);

-- ============================================================
-- complaint_updates
-- ============================================================
create table if not exists complaint_updates (
  id uuid primary key default gen_random_uuid(),
  civic_issue_id uuid not null references civic_issues(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz default now()
);

create index if not exists idx_complaint_updates_issue_id on complaint_updates(civic_issue_id);

-- ============================================================
-- chat_messages
-- ============================================================
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  language text check (language in ('en','hi','hinglish')) default 'en',
  structured jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_chat_messages_user_id on chat_messages(user_id);

-- ============================================================
-- complaint id sequence (used by server/src/services/complaintIdGenerator.js)
-- ============================================================
create sequence if not exists complaint_id_seq start 1000;

create or replace function nextval_complaint_id_seq()
returns bigint
language sql
as $$
  select nextval('complaint_id_seq');
$$;
