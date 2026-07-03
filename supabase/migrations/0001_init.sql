-- Utleie-kalkulator: grunnskjema.
-- All tilgang skjer server-side med service role. RLS er PÅ med null
-- policies (deny-all) på alle tabeller — anon/authenticated har ingen tilgang.

create extension if not exists pgcrypto;

create table public.calculations (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('manual', 'finn')),
  status text not null default 'draft' check (status in
    ('draft', 'pending_payment', 'processing', 'paid', 'failed', 'refunded')),
  finnkode text,
  finn_raw jsonb,            -- { fetchedAt, url, labels, parsed, warnings }
  inputs jsonb not null default '{}'::jsonb,
  inputs_hash text,          -- sha256 av inputs ved siste KI-kjøring
  ai_assessment jsonb,       -- { schemaVersion, model, inputsHash, createdAt, result }
  ai_runs smallint not null default 0,
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index calculations_status_created_idx
  on public.calculations (status, created_at);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  calculation_id uuid not null references public.calculations (id) on delete cascade,
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  amount_ore integer not null default 990,
  currency text not null default 'nok',
  status text not null default 'created' check (status in
    ('created', 'completed', 'refunded', 'refund_failed')),
  stripe_refund_id text,
  angrerett_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_calculation_idx on public.payments (calculation_id);

-- Webhook-idempotens: hvert Stripe-event behandles nøyaktig én gang.
create table public.stripe_events (
  id text primary key,       -- evt_...
  type text not null,
  received_at timestamptz not null default now()
);

-- Gjenbruk av preview-henting ved fulfillment (15 min TTL håndheves i app).
create table public.finn_cache (
  finnkode text primary key,
  data jsonb not null,
  fetched_at timestamptz not null default now()
);

-- Fixed-window rate limiting per hashet IP + rute.
create table public.rate_limits (
  key text not null,
  window_start timestamptz not null,
  count integer not null default 1,
  primary key (key, window_start)
);

alter table public.calculations enable row level security;
alter table public.payments enable row level security;
alter table public.stripe_events enable row level security;
alter table public.finn_cache enable row level security;
alter table public.rate_limits enable row level security;

-- Atomisk teller for rate limiting (security invoker: krever tabellrettigheter,
-- som kun service role har).
create or replace function public.bump_rate_limit(
  p_key text,
  p_window_start timestamptz
) returns integer
language sql
as $$
  insert into public.rate_limits (key, window_start, count)
  values (p_key, p_window_start, 1)
  on conflict (key, window_start)
  do update set count = public.rate_limits.count + 1
  returning count;
$$;

-- Atomisk claim: nøyaktig én fulfillment-kjøring per betalt beregning.
create or replace function public.claim_calculation(p_id uuid)
returns boolean
language plpgsql
as $$
begin
  update public.calculations
  set status = 'processing', updated_at = now()
  where id = p_id and status = 'pending_payment';
  return found;
end;
$$;

revoke execute on function public.bump_rate_limit(text, timestamptz)
  from anon, authenticated;
revoke execute on function public.claim_calculation(uuid)
  from anon, authenticated;
