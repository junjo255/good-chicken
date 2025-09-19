-- enable uuid generator used below
create extension if not exists pgcrypto;

-- add Clover customer id to your user profile
alter table public.profiles
    add column if not exists clover_customer_id text;

-- vaulted card/token storage (Clover)
create table if not exists public.payment_methods (
                                                      id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete cascade,
    brand text,                -- 'visa', 'amex', etc.
    last4 text,
    exp_month int,
    exp_year int,
    clover_token text unique,
    is_default boolean default false,
    created_at timestamptz default now()
    );

-- lock it down with RLS
alter table public.profiles enable row level security;
alter table public.payment_methods enable row level security;

-- policies
drop policy if exists "profile read/write own" on public.profiles;
create policy "profile read/write own"
on public.profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "pm read own" on public.payment_methods;
create policy "pm read own"
on public.payment_methods
for select
                                using (auth.uid() = user_id);

drop policy if exists "pm write own" on public.payment_methods;
create policy "pm write own"
on public.payment_methods
for insert
with check (auth.uid() = user_id);

drop policy if exists "pm update own" on public.payment_methods;
create policy "pm update own"
on public.payment_methods
for update
                                using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
