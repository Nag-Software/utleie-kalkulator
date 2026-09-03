-- Testsuite for klippekort-invariantene.
--
-- Kjør hele fila mot databasen (Supabase SQL Editor, psql, eller MCP-en).
-- Den rydder opp etter seg og lar databasen stå som før. Feiler noe, kaster
-- den en exception med «FEIL:» og navnet på det som brøt sammen — kommer
-- ingen feil, gikk alt gjennom.
do $$
declare
  v_user  uuid;
  v_user2 uuid;
  v_out   record;
  v_st    json;
begin
  -- ── Brukere ─────────────────────────────────────────────────────────────
  v_user := public.upsert_vipps_user('selftest-sub-1', 'Test Testesen', '4712345678');

  if public.upsert_vipps_user('selftest-sub-1', null, null) <> v_user then
    raise exception 'FEIL: upsert laget en ny bruker for samme vipps_sub';
  end if;
  if (select name from public.users where id = v_user) is distinct from 'Test Testesen' then
    raise exception 'FEIL: navnet ble nullet ut av en upsert uten navn';
  end if;

  -- ── Ingen klipp før betalt kjøp ─────────────────────────────────────────
  if public.clips_remaining(v_user) <> 0 then
    raise exception 'FEIL: ny bruker hadde klipp';
  end if;

  select * into v_out from public.consume_clip(v_user, '100000001');
  if v_out.outcome <> 'empty' then
    raise exception 'FEIL: forventet empty, fikk %', v_out.outcome;
  end if;

  perform public.start_purchase(v_user, 'klippekort-20', 'selftest-ref-1', '100000001');
  if public.clips_remaining(v_user) <> 0 then
    raise exception 'FEIL: et pending kjøp ga klipp';
  end if;

  -- ── Beløpet må stemme ───────────────────────────────────────────────────
  begin
    perform public.complete_purchase('selftest-ref-1', 100);
    raise exception 'FEIL: feil beløp ble godtatt';
  exception when others then
    if sqlerrm like 'FEIL:%' then raise; end if;
  end;

  -- ── Kreditering ─────────────────────────────────────────────────────────
  select * into v_out from public.complete_purchase('selftest-ref-1', 4900);
  if v_out.remaining_clips <> 20 then
    raise exception 'FEIL: forventet 20 klipp, fikk %', v_out.remaining_clips;
  end if;
  if v_out.pending_finnkode <> '100000001' then
    raise exception 'FEIL: pending_finnkode = %', v_out.pending_finnkode;
  end if;
  if v_out.user_id <> v_user then
    raise exception 'FEIL: complete_purchase returnerte feil bruker';
  end if;
  if v_out.expires_at is null then
    raise exception 'FEIL: expires_at ble ikke satt';
  end if;

  -- Invariant 2: idempotent på referansen
  select * into v_out from public.complete_purchase('selftest-ref-1', 4900);
  if v_out.remaining_clips <> 20 then
    raise exception 'FEIL: kjøpet ble kreditert to ganger (%)', v_out.remaining_clips;
  end if;

  -- Duplikat referanse skal avvises
  begin
    perform public.start_purchase(v_user, 'klippekort-20', 'selftest-ref-1', null);
    raise exception 'FEIL: duplikat referanse ble godtatt';
  exception when unique_violation then null;
  end;

  -- Ugyldig finnkode skal avvises av CHECK
  begin
    perform public.start_purchase(v_user, 'klippekort-20', 'selftest-ref-x', 'abc');
    raise exception 'FEIL: ugyldig finnkode ble godtatt';
  exception when check_violation then null;
  end;

  -- Ukjent produkt skal avvises
  begin
    perform public.start_purchase(v_user, 'finnes-ikke', 'selftest-ref-y', null);
    raise exception 'FEIL: ukjent produkt ble godtatt';
  exception when others then
    if sqlerrm like 'FEIL:%' then raise; end if;
  end;

  -- ── Innløsning ──────────────────────────────────────────────────────────
  select * into v_out from public.consume_clip(v_user, '100000001');
  if v_out.outcome <> 'ok' or v_out.remaining_clips <> 19 then
    raise exception 'FEIL: consume ga %/%', v_out.outcome, v_out.remaining_clips;
  end if;

  -- Invariant 1: samme annonse er gratis andre gang
  select * into v_out from public.consume_clip(v_user, '100000001');
  if v_out.outcome <> 'already_unlocked' or v_out.remaining_clips <> 19 then
    raise exception 'FEIL: gjenåpning ga %/%', v_out.outcome, v_out.remaining_clips;
  end if;

  -- En annen annonse koster et nytt klipp
  select * into v_out from public.consume_clip(v_user, '100000002');
  if v_out.remaining_clips <> 18 then
    raise exception 'FEIL: andre annonse ga % klipp', v_out.remaining_clips;
  end if;

  -- ── Status ──────────────────────────────────────────────────────────────
  v_st := public.klippekort_status(v_user);
  if (v_st->>'remaining')::int <> 18 then raise exception 'FEIL: status.remaining = %', v_st->>'remaining'; end if;
  if (v_st->>'total')::int     <> 20 then raise exception 'FEIL: status.total = %', v_st->>'total'; end if;
  if (v_st->>'used')::int      <> 2  then raise exception 'FEIL: status.used = %', v_st->>'used'; end if;
  if not ((v_st->'unlocked')::jsonb ? '100000001') then
    raise exception 'FEIL: status.unlocked mangler koden: %', v_st->'unlocked';
  end if;

  -- ── Klipp brukes fra potten som utløper først ───────────────────────────
  perform public.start_purchase(v_user, 'klippekort-20', 'selftest-ref-2', null);
  perform public.complete_purchase('selftest-ref-2', 4900);
  -- Gjør pott 2 til den som utløper først
  update public.purchases set expires_at = now() + interval '1 day'
   where reference = 'selftest-ref-2';
  perform public.consume_clip(v_user, '100000003');
  if (select remaining from public.purchases where reference = 'selftest-ref-2') <> 19 then
    raise exception 'FEIL: klippet ble tatt fra feil pott';
  end if;

  -- ── Utløpte klipp ───────────────────────────────────────────────────────
  update public.purchases set expires_at = now() - interval '1 day'
   where user_id = v_user;
  select * into v_out from public.consume_clip(v_user, '100000009');
  if v_out.outcome <> 'expired' then
    raise exception 'FEIL: forventet expired, fikk %', v_out.outcome;
  end if;
  if public.clips_remaining(v_user) <> 0 then
    raise exception 'FEIL: utløpte klipp teller fortsatt';
  end if;
  if not (public.klippekort_status(v_user)->>'expiredClips')::int > 0 then
    raise exception 'FEIL: expiredClips ble ikke rapportert';
  end if;

  -- abort_purchase skal aldri røre et betalt kjøp
  perform public.abort_purchase('selftest-ref-1', 'aborted');
  if (select status from public.purchases where reference = 'selftest-ref-1') <> 'paid' then
    raise exception 'FEIL: abort_purchase overskrev et betalt kjøp';
  end if;

  -- ...men skal avbryte et pending
  perform public.start_purchase(v_user, 'klippekort-20', 'selftest-ref-3', null);
  perform public.abort_purchase('selftest-ref-3', 'aborted');
  if (select status from public.purchases where reference = 'selftest-ref-3') <> 'aborted' then
    raise exception 'FEIL: pending kjøp ble ikke avbrutt';
  end if;

  -- ── Klipp lekker ikke mellom brukere ────────────────────────────────────
  v_user2 := public.upsert_vipps_user('selftest-sub-2', 'Andre Bruker', null);
  perform public.start_purchase(v_user2, 'klippekort-20', 'selftest-ref-4', null);
  perform public.complete_purchase('selftest-ref-4', 4900);
  -- Bruker 2 har egne klipp; annonsen bruker 1 låste opp er ikke gratis her
  select * into v_out from public.consume_clip(v_user2, '100000001');
  if v_out.outcome <> 'ok' then
    raise exception 'FEIL: bruker 2 fikk bruker 1 sin opplåsing (%)', v_out.outcome;
  end if;
  if public.clips_remaining(v_user) <> 0 then
    raise exception 'FEIL: bruker 2 sitt kjøp ga bruker 1 klipp';
  end if;

  raise notice 'ALLE TESTER OK';

  -- ── Opprydding ──────────────────────────────────────────────────────────
  delete from public.users where id in (v_user, v_user2);
end $$;

-- Anonymt kjøp (profildeling i ePayment): kjøpet starter uten eier, og
-- identiteten kommer først når betalingen er godkjent. Dekker også at én
-- bruker kan ha flere Vipps-«sub»-er.
do $$
declare
  v_user uuid; v_user2 uuid; v_out record;
begin
  -- Kjøpet starter uten eier
  perform public.start_purchase(null, 'klippekort-20', 'selftest-anon-1', '100000001');
  if (select user_id from public.purchases where reference='selftest-anon-1') is not null then
    raise exception 'FEIL: anonymt kjøp fikk eier for tidlig';
  end if;

  -- Betalingen gir sub-en; brukeren opprettes og festes på kjøpet
  v_user := public.upsert_vipps_user('selftest-pay-A', 'Betaler', '4712345678', 'payment', null);
  select * into v_out from public.complete_purchase('selftest-anon-1', 4900, v_user);
  if v_out.user_id <> v_user then raise exception 'FEIL: feil eier'; end if;
  if v_out.remaining_clips <> 20 then raise exception 'FEIL: klipp=%', v_out.remaining_clips; end if;
  if v_out.pending_finnkode <> '100000001' then raise exception 'FEIL: finnkode gikk tapt'; end if;
  if (select user_id from public.purchases where reference='selftest-anon-1') <> v_user then
    raise exception 'FEIL: eier ble ikke festet på raden';
  end if;

  -- Idempotens holder fortsatt
  select * into v_out from public.complete_purchase('selftest-anon-1', 4900, v_user);
  if v_out.remaining_clips <> 20 then raise exception 'FEIL: dobbeltkreditert'; end if;

  -- Kjent sub gir samme bruker
  if public.upsert_vipps_user('selftest-pay-A', null, null, 'payment', null) <> v_user then
    raise exception 'FEIL: kjent sub ga ny bruker';
  end if;

  -- En login-sub som er ULIK betalings-sub kan lenkes til samme bruker,
  -- og klippene følger personen — ikke identifikatoren.
  if public.upsert_vipps_user('selftest-login-A', null, null, 'login', v_user) <> v_user then
    raise exception 'FEIL: lenking av ny sub feilet';
  end if;
  if public.upsert_vipps_user('selftest-login-A', null, null, 'login', null) <> v_user then
    raise exception 'FEIL: lenket sub ga ny bruker ved oppslag';
  end if;
  if public.clips_remaining(v_user) <> 20 then
    raise exception 'FEIL: klipp forsvant ved lenking';
  end if;
  if (select count(*) from public.user_identities where user_id = v_user) <> 2 then
    raise exception 'FEIL: forventet 2 identiteter';
  end if;

  -- En ulenket, ukjent sub blir en EGEN bruker uten klipp
  v_user2 := public.upsert_vipps_user('selftest-sub-B', null, null, 'login', null);
  if v_user2 = v_user then raise exception 'FEIL: ulike subs kollapset'; end if;
  if public.clips_remaining(v_user2) <> 0 then raise exception 'FEIL: klipp lekket'; end if;

  -- Et kjøp som fortsatt mangler eier skal ikke kunne krediteres
  perform public.start_purchase(null, 'klippekort-20', 'selftest-anon-2', null);
  begin
    perform public.complete_purchase('selftest-anon-2', 4900, null);
    raise exception 'FEIL: eierløst kjøp ble kreditert';
  exception when others then
    if sqlerrm like 'FEIL:%' then raise; end if;
  end;

  -- Innlogget kjøp (eier kjent fra start) virker fortsatt
  perform public.start_purchase(v_user2, 'klippekort-20', 'selftest-kjent-1', null);
  select * into v_out from public.complete_purchase('selftest-kjent-1', 4900, null);
  if v_out.user_id <> v_user2 or v_out.remaining_clips <> 20 then
    raise exception 'FEIL: innlogget kjøp: %/%', v_out.user_id, v_out.remaining_clips;
  end if;

  raise notice 'ANONYME KJØP OK';
  delete from public.users where id in (v_user, v_user2);
end $$;
