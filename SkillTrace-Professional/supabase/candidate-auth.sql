-- Candidate login/signup accounts.
-- Run this once in Supabase SQL Editor.
create table if not exists public.candidate_accounts (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  password_hash text not null,
  password_salt text not null,
  created_at timestamptz not null default now()
);
create index if not exists candidate_accounts_email_idx on public.candidate_accounts(email);
alter table public.candidate_accounts enable row level security;
grant select, insert on table public.candidate_accounts to service_role;
