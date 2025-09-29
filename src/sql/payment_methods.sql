-- Enable UUID gen if not already
create extension if not exists pgcrypto;

-- Create table
create table if not exists public.payment_methods (
                                                      id                           uuid primary key default gen_random_uuid(),
    profile_id                   uuid not null
    references public.profiles(id) on delete cascade,

    -- which PSP + opaque token you charge with (NO PAN/CVV ever)
    processor                    text not null default 'clover',
    processor_payment_method_id  text not null,

    -- non-sensitive card metadata (optional but handy for UI)
    brand                        text,
    last4                        char(4),
    exp_month                    smallint check (exp_month between 1 and 12),
    exp_year                     smallint check (exp_year between 2000 and 2100),

    is_default                   boolean not null default false,

    created_at                   timestamptz not null default now(),
    updated_at                   timestamptz not null default now(),

    -- don’t allow duplicates of the same PSP token
    unique (processor, processor_payment_method_id)
    );

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists payment_methods_set_updated_at on public.payment_methods;
create trigger payment_methods_set_updated_at
    before update on public.payment_methods
    for each row execute procedure public.set_updated_at();

-- Helpful index
create index if not exists payment_methods_profile_id_idx
    on public.payment_methods(profile_id);

-- Only one default card per user
create unique index if not exists payment_methods_one_default_per_user
    on public.payment_methods(profile_id)
    where is_default;

-- ---- RLS ----
alter table public.payment_methods enable row level security;

-- Read your own
drop policy if exists "read own payment_methods" on public.payment_methods;
create policy "read own payment_methods"
on public.payment_methods for select
                                              using (auth.uid() = profile_id);

-- Insert your own
drop policy if exists "insert own payment_methods" on public.payment_methods;
create policy "insert own payment_methods"
on public.payment_methods for insert
with check (auth.uid() = profile_id);

-- Update your own (e.g., toggle default)
drop policy if exists "update own payment_methods" on public.payment_methods;
create policy "update own payment_methods"
on public.payment_methods for update
                                                          using (auth.uid() = profile_id)
                              with check (auth.uid() = profile_id);

-- (Optional) allow delete
drop policy if exists "delete own payment_methods" on public.payment_methods;
create policy "delete own payment_methods"
on public.payment_methods for delete
using (auth.uid() = profile_id);
