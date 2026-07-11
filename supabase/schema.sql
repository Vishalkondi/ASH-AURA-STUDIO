-- ASH AURA STUDIO — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------- Contact enquiries (AI-enriched) ----------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text,
  project_type text,
  message text,
  -- AI lead analysis (filled server-side by Claude on submit)
  ai_reply text,        -- the warm reply shown to the visitor
  ai_summary text,      -- one-line internal summary of the lead
  ai_scope text,        -- estimated project scope / scale
  ai_priority text,     -- High | Medium | Low
  ai_next_step text     -- suggested next action for the studio
);

-- ---------- AI-generated design concepts ----------
create table if not exists public.concepts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  room text not null,
  style text not null,
  brief text,
  title text,
  concept text,
  palette jsonb,
  materials jsonb,
  signature_pieces jsonb,
  designer_note text
);

-- ---------- Newsletter subscribers ----------
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text unique not null
);

-- ---------- Visitor analytics ----------
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text,
  referrer text,
  source text,          -- derived: instagram / google / direct / utm
  device text,          -- mobile / tablet / desktop
  utm_source text,
  utm_medium text,
  utm_campaign text,
  country text,
  visitor_id text,      -- anonymous client id for unique counts
  user_agent text
);
create index if not exists visits_created_at_idx on public.visits (created_at);

-- ---------- Row Level Security ----------
alter table public.enquiries   enable row level security;
alter table public.concepts    enable row level security;
alter table public.subscribers enable row level security;
alter table public.visits      enable row level security;

-- Anonymous visitors may INSERT their own submissions, never read others'.
-- All reads happen server-side with the service-role key (which bypasses RLS).
create policy "anon insert enquiries"   on public.enquiries   for insert to anon with check (true);
create policy "anon insert concepts"    on public.concepts    for insert to anon with check (true);
create policy "anon insert subscribers" on public.subscribers for insert to anon with check (true);
create policy "anon insert visits"      on public.visits      for insert to anon with check (true);
