-- Klippekort for utleie-kalkulator.no, knyttet til Vipps-brukere.
--
-- Dette er den autoritative, kjørbare beskrivelsen av databasen. Den
-- reproduserer sluttilstanden av migrasjonene som er kjørt i Supabase-
-- prosjektet «Utleiekalkulator» (zzvwsxpoftklugebvwju):
--
--   20260903155211  klippekort_vipps_schema
--   20260903155301  klippekort_functions
--   20260903155314  fix_upsert_vipps_user_comment
--   20260903155620  klippekort_status_function
--   20260903155843  purchase_pending_finnkode
--   20260903155908  drop_legacy_start_purchase_overload
--
-- All tilgang skjer server-side med den hemmelige nøkkelen. RLS er på uten
-- policyer, så den publiserbare nøkkelen kommer ikke til noe av dette.
--
-- Tre invarianter ligger i SQL, ikke i appen, fordi de må holde selv når to
-- forespørsler kommer samtidig:
--   1. Ett klipp per FINN-kode  — primærnøkkelen på `unlocks`
--   2. Ett kjøp krediteres én gang — `complete_purchase` er idempotent
--   3. To samtidige innløsninger kan ikke bruke samme klipp — radlås

-- ── Tabeller ──────────────────────────────────────────────────────────────

-- Katalog over klippekort som kan kjøpes.
create table if not exists public.products (
  id              text primary key,
  name            text        not null,
  clips           integer     not null check (clips > 0),
  price_ore       integer     not null check (price_ore > 0),
  validity_months integer     not null check (validity_months > 0),
  active          boolean     not null default true,
  created_at      timestamptz not null default now()
);

-- Én rad per Vipps-bruker. `vipps_sub` er Vipps' pseudonyme bruker-ID.
create table if not exists public.users (
  id           uuid primary key default gen_random_uuid(),
  vipps_sub    text        not null unique,
  name         text,
  phone_number text,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

-- Ett kjøp = én pott med klipp som brukes opp. `reference` er vår egen
-- ePayment-referanse og gjør kreditering idempotent. `pending_finnkode` er
-- annonsen kjøpet gjaldt, så retur-handleren ikke må stole på URL-en.
create table if not exists public.purchases (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid        not null references public.users (id) on delete cascade,
  product_id       text        not null references public.products (id),
  reference        text        not null unique,
  amount_ore       integer     not null check (amount_ore >= 0),
  clips            integer     not null check (clips > 0),
  remaining        integer     not null check (remaining >= 0),
  status           text        not null default 'pending'
                     check (status in ('pending', 'paid', 'aborted', 'expired', 'failed')),
  created_at       timestamptz not null default now(),
  paid_at          timestamptz,
  expires_at       timestamptz,
  pending_finnkode text,
  constraint remaining_within_clips check (remaining <= clips),
  constraint purchases_pending_finnkode_check
    check (pending_finnkode is null or pending_finnkode ~ '^[0-9]{8,10}$')
);

-- Klipp brukes med det som utløper først.
create index if not exists purchases_spend_order
  on public.purchases (user_id, expires_at)
  where status = 'paid' and remaining > 0;

create index if not exists purchases_pending
  on public.purchases (status, created_at)
  where status = 'pending';

-- Én FINN-annonse per klipp. Primærnøkkelen gjør innløsning idempotent:
-- samme annonse kan åpnes igjen gratis.
create table if not exists public.unlocks (
  user_id     uuid        not null references public.users (id) on delete cascade,
  finnkode    text        not null check (finnkode ~ '^[0-9]{8,10}$'),
  purchase_id uuid        references public.purchases (id) on delete set null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, finnkode)
);

alter table public.products  enable row level security;
alter table public.users     enable row level security;
alter table public.purchases enable row level security;
alter table public.unlocks   enable row level security;

-- Må stemme med KLIPP_*-konstantene i lib/site.ts.
insert into public.products (id, name, clips, price_ore, validity_months)
values ('klippekort-20', 'Klippekort – 20 FINN-importer', 20, 4900, 12)
on conflict (id) do nothing;

-- ── Funksjoner ────────────────────────────────────────────────────────────

-- Antall gyldige klipp brukeren har igjen.
create or replace function public.clips_remaining(p_user_id uuid)
returns integer
language sql
stable
set search_path = public, pg_temp
as $$
  select coalesce(sum(p.remaining), 0)::integer
  from public.purchases p
  where p.user_id = p_user_id
    and p.status = 'paid'
    and p.remaining > 0
    and p.expires_at > now();
$$;

-- Oppretter eller oppdaterer Vipps-brukeren. Navn/telefon overskrives bare
-- når Vipps faktisk sendte en verdi.
create or replace function public.upsert_vipps_user(
  p_vipps_sub text,
  p_name      text default null,
  p_phone     text default null
)
returns uuid
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  insert into public.users (vipps_sub, name, phone_number)
  values (p_vipps_sub, p_name, p_phone)
  on conflict (vipps_sub) do update
    set name         = coalesce(excluded.name, public.users.name),
        phone_number = coalesce(excluded.phone_number, public.users.phone_number),
        last_seen_at = now()
  returning id into v_id;

  return v_id;
end;
$$;

-- Reserverer en kjøpsreferanse før brukeren sendes til Vipps.
-- NB: bare denne varianten skal finnes. En 3-argumentsvariant i tillegg
-- gjør kallet tvetydig («function is not unique») fordi p_finnkode har
-- default-verdi.
drop function if exists public.start_purchase(uuid, text, text);

create or replace function public.start_purchase(
  p_user_id    uuid,
  p_product_id text,
  p_reference  text,
  p_finnkode   text default null
)
returns uuid
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  insert into public.purchases
    (user_id, product_id, reference, amount_ore, clips, remaining, status, pending_finnkode)
  select p_user_id, pr.id, p_reference, pr.price_ore, pr.clips, 0, 'pending', p_finnkode
  from public.products pr
  where pr.id = p_product_id and pr.active
  returning id into v_id;

  if v_id is null then
    raise exception 'Ukjent eller inaktivt produkt: %', p_product_id;
  end if;

  return v_id;
end;
$$;

-- Krediterer klippene etter bekreftet betaling. Idempotent på referansen,
-- og avviser at beløpet Vipps rapporterer avviker fra det vi lagret.
create or replace function public.complete_purchase(
  p_reference  text,
  p_amount_ore integer
)
returns table (
  user_id          uuid,
  status           text,
  clips            integer,
  remaining_clips  integer,
  expires_at       timestamptz,
  pending_finnkode text
)
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_purchase public.purchases;
  v_months   integer;
begin
  select * into v_purchase
  from public.purchases p
  where p.reference = p_reference
  for update;

  if not found then
    raise exception 'Ukjent kjøpsreferanse: %', p_reference;
  end if;

  -- Allerede kreditert: returner tilstanden som den er.
  if v_purchase.status = 'paid' then
    return query
      select v_purchase.user_id, v_purchase.status, v_purchase.clips,
             public.clips_remaining(v_purchase.user_id), v_purchase.expires_at,
             v_purchase.pending_finnkode;
    return;
  end if;

  if v_purchase.amount_ore <> p_amount_ore then
    raise exception 'Beløpet stemmer ikke for %: forventet %, fikk %',
      p_reference, v_purchase.amount_ore, p_amount_ore;
  end if;

  select pr.validity_months into v_months
  from public.products pr where pr.id = v_purchase.product_id;

  update public.purchases p
  set status     = 'paid',
      remaining  = p.clips,
      paid_at    = now(),
      expires_at = now() + make_interval(months => v_months)
  where p.id = v_purchase.id
  returning p.status, p.clips, p.expires_at
  into v_purchase.status, v_purchase.clips, v_purchase.expires_at;

  return query
    select v_purchase.user_id, v_purchase.status, v_purchase.clips,
           public.clips_remaining(v_purchase.user_id), v_purchase.expires_at,
           v_purchase.pending_finnkode;
end;
$$;

-- Markerer et kjøp som ikke gjennomført. Rører aldri et betalt kjøp.
create or replace function public.abort_purchase(p_reference text, p_status text)
returns void
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if p_status not in ('aborted', 'expired', 'failed') then
    raise exception 'Ugyldig sluttstatus: %', p_status;
  end if;

  update public.purchases p
  set status = p_status
  where p.reference = p_reference and p.status = 'pending';
end;
$$;

-- Trekker ett klipp for én FINN-annonse, atomisk.
--   already_unlocked = annonsen er åpnet før og koster ingenting
--   ok               = ett klipp trukket
--   expired / empty  = ingen gyldige klipp
create or replace function public.consume_clip(p_user_id uuid, p_finnkode text)
returns table (outcome text, remaining_clips integer)
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_purchase_id uuid;
  v_has_expired boolean;
  v_inserted    boolean;
begin
  if exists (
    select 1 from public.unlocks u
    where u.user_id = p_user_id and u.finnkode = p_finnkode
  ) then
    return query select 'already_unlocked'::text, public.clips_remaining(p_user_id);
    return;
  end if;

  -- Låser klippotten som utløper først. FOR UPDATE re-evaluerer raden etter
  -- låsing, så to samtidige innløsninger kan ikke trekke samme klipp.
  select p.id into v_purchase_id
  from public.purchases p
  where p.user_id = p_user_id
    and p.status = 'paid'
    and p.remaining > 0
    and p.expires_at > now()
  order by p.expires_at asc, p.created_at asc
  limit 1
  for update;

  if v_purchase_id is null then
    select exists (
      select 1 from public.purchases p
      where p.user_id = p_user_id
        and p.status = 'paid'
        and p.remaining > 0
        and p.expires_at <= now()
    ) into v_has_expired;

    return query
      select case when v_has_expired then 'expired' else 'empty' end::text, 0;
    return;
  end if;

  insert into public.unlocks (user_id, finnkode, purchase_id)
  values (p_user_id, p_finnkode, v_purchase_id)
  on conflict (user_id, finnkode) do nothing;

  v_inserted := found;

  -- Tapte kappløpet mot en parallell innløsning av samme annonse:
  -- den andre trakk klippet, denne skal ikke trekke ett til.
  if not v_inserted then
    return query select 'already_unlocked'::text, public.clips_remaining(p_user_id);
    return;
  end if;

  update public.purchases p
  set remaining = p.remaining - 1
  where p.id = v_purchase_id;

  return query select 'ok'::text, public.clips_remaining(p_user_id);
end;
$$;

-- Hele klippekort-tilstanden i ett kall, klar for UI-et.
create or replace function public.klippekort_status(p_user_id uuid)
returns json
language sql
stable
set search_path = public, pg_temp
as $$
  with paid as (
    select * from public.purchases p
    where p.user_id = p_user_id and p.status = 'paid'
  )
  select json_build_object(
    'remaining', coalesce((
      select sum(remaining) from paid
      where remaining > 0 and expires_at > now()
    ), 0),
    'total', coalesce((select sum(clips) from paid), 0),
    'used', (select count(*) from public.unlocks u where u.user_id = p_user_id),
    'expiredClips', coalesce((
      select sum(remaining) from paid
      where remaining > 0 and expires_at <= now()
    ), 0),
    'expiresAt', (
      select min(expires_at) from paid
      where remaining > 0 and expires_at > now()
    ),
    'unlocked', coalesce((
      select json_agg(u.finnkode order by u.unlocked_at desc)
      from public.unlocks u where u.user_id = p_user_id
    ), '[]'::json)
  );
$$;

-- ── Rettigheter ───────────────────────────────────────────────────────────
-- Forsvar i dybden. RLS stopper all lesing og skriving fra den publiserbare
-- nøkkelen, men funksjonene var i tillegg kallbare som `anon` (de svarte 200
-- med tomt resultat). Bare vår egen server, som bruker den hemmelige
-- nøkkelen (service_role), skal kunne kalle dem.
--
-- Kjør denne blokken på nytt hver gang en funksjon legges til eller endres:
-- CREATE OR REPLACE nullstiller ikke rettigheter, men en helt ny funksjon
-- arver standarden (EXECUTE til PUBLIC).
do $$
declare
  v_fn record;
begin
  for v_fn in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
  loop
    execute format('revoke all on function %s from public, anon, authenticated', v_fn.sig);
    execute format('grant execute on function %s to service_role', v_fn.sig);
  end loop;
end $$;
