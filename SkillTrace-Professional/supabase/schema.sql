-- SkillTrace Phase 1: persistent candidate registry
-- Run this in the Supabase SQL Editor.

create table if not exists public.candidates (
  id text primary key,
  name text not null,
  district text,
  training text not null,
  skills text[] not null default '{}',
  status text not null default 'Seeking',
  employer text,
  role text,
  salary integer not null default 0,
  joined date,
  verified boolean not null default false,
  retention text,
  education text,
  experience integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists candidates_district_idx on public.candidates(district);
create index if not exists candidates_status_idx on public.candidates(status);
create index if not exists candidates_training_idx on public.candidates(training);
create index if not exists candidates_created_at_idx on public.candidates(created_at desc);

alter table public.candidates enable row level security;

-- Vercel accesses this table only from the server using the Supabase service-role key.
-- Do not expose that key in React, GitHub, or browser code.
