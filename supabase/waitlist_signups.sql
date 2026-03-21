-- Waitlist signups table for swiftpartsolutions.com/waitlist
-- Option A: standalone table, easy to migrate into profiles later

create table if not exists public.waitlist_signups (
  id                      uuid primary key default gen_random_uuid(),
  first_name              text not null,
  last_name               text not null,
  email                   text not null,
  field_type              text not null,
  display_name            text,
  company_name            text,
  phone                   text,
  biggest_parts_headache  text,
  consent                 boolean not null default true,
  created_at              timestamptz not null default now(),

  constraint waitlist_signups_email_unique unique (email)
);

-- RLS: allow anon inserts only, no public reads
alter table public.waitlist_signups enable row level security;

create policy "anon_insert_waitlist"
  on public.waitlist_signups
  for insert
  to anon
  with check (true);

-- Prevent anon from reading, updating, or deleting rows.
-- Authenticated / service_role can still access via Supabase dashboard or server-side.
