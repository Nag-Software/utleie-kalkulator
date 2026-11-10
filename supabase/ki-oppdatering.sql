-- Kjør én gang i SQL Editor. Alt her står også i schema.sql.
-- Nytt siden forrige kjøring: rydding av gamle opplastinger og «Mine analyser».

update storage.buckets set file_size_limit = 52428800 where id = 'salgsoppgaver';

-- Rydding: salgsoppgaver som aldri ble analysert, blir ellers liggende i
-- lagringen for alltid (gratisplanen har 1 GB). Den daglige jobben henter
-- stiene her, sletter filene og markerer dem som slettet.
alter table public.analyses add column if not exists file_deleted_at timestamptz;

create or replace function public.stale_analysis_files(p_min_age_hours integer)
returns table (id uuid, storage_path text)
language sql
stable
set search_path = public, pg_temp
as $$
  select a.id, a.storage_path
  from public.analyses a
  where a.file_deleted_at is null
    and a.status <> 'running'
    and a.created_at < now() - make_interval(hours => p_min_age_hours)
  order by a.created_at
  limit 200;
$$;

create or replace function public.mark_analysis_file_deleted(p_id uuid)
returns void
language sql
set search_path = public, pg_temp
as $$
  update public.analyses a set file_deleted_at = now() where a.id = p_id;
$$;

-- Alt «Mine analyser» trenger i ett kall: hvor mange analyser som er igjen,
-- og rapportene brukeren eier.
create or replace function public.ki_status(p_user_id uuid)
returns json
language sql
stable
set search_path = public, pg_temp
as $$
  select json_build_object(
    'remaining', public.ki_credits_remaining(p_user_id),
    'expiresAt', (
      select min(p.expires_at) from public.purchases p
      where p.user_id = p_user_id and p.product_id like 'ki-analyse-%'
        and p.status = 'paid' and p.remaining > 0 and p.expires_at > now()
    ),
    'analyses', coalesce((
      select json_agg(json_build_object(
        'id', a.id,
        'status', a.status,
        'filename', a.filename,
        'address', a.result #>> '{property,address}',
        'createdAt', a.created_at
      ) order by a.created_at desc)
      from public.analyses a
      where a.user_id = p_user_id and a.status <> 'created'
    ), '[]'::json)
  );
$$;

-- Bare serveren (service_role) skal kunne kalle funksjonene.
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
