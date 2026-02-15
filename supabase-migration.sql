-- Run this in Supabase SQL Editor (supabase.com → your project → SQL Editor)

create table if not exists reflections (
  id bigint generated always as identity primary key,
  date_key date not null,
  philosopher text not null,
  theme text not null,
  text text not null,
  created_at timestamptz default now(),

  -- One cached reflection per day per philosopher
  unique (date_key, philosopher)
);

-- Index for fast lookups
create index if not exists idx_reflections_date_philosopher
  on reflections (date_key, philosopher);
