# Utleie-kalkulator.no

Lønnsomhetskalkulator for utleiebolig: kontantstrøm, yield, break-even og
prognose. Gratis med manuelle tall; et klippekort med 20 FINN-importer koster
49 kr og er gyldig i 12 måneder.

## Stack

- **Next.js 16** (App Router) + React 19 + Tailwind 4 + shadcn/ui + recharts
- **Vipps MobilePay** — ePayment for betaling, Login for innlogging. Ingen
  andre betalingsmåter.
- **Postgres (Supabase)** — klippekortene: hvilken Vipps-bruker som eier
  hvilket produkt, og hvor mange klipp som er igjen.

## Kom i gang

```bash
pnpm install
pnpm dev        # kjører uten nøkler — betaling og innlogging er gated
pnpm test       # vitest: kalkulatormotor + FINN-parser (fixtures)
pnpm build
```

Appen **booter uten nøkler**. Mangler Vipps- eller databasenøklene, viser
FINN-dialogen at betaling er utilgjengelig, og resten av kalkulatoren
fungerer som før. Env-verdier som starter med `PLACEHOLDER` behandles som
fraværende. Kopier `.env.example` til `.env.local`.

Klippekort-logikken har egne tester i SQL: kjør `supabase/tests.sql` mot
databasen. Fila rydder opp etter seg, og kaster en exception med `FEIL:` hvis
en invariant brytes.

## Arkitektur

### Betaling: Vipps ePayment, uten webhook

1. **Kjøp:** `/api/checkout` krever innlogging, reserverer en referanse
   (`uk-<32 hex>`) i `purchases` og oppretter betalingen med
   `userFlow: WEB_REDIRECT`. Brukeren godkjenner i Vipps-appen.
2. **Retur:** Vipps sender brukeren til `/api/vipps/retur?ref=…`. Retur-kallet
   *beviser ingenting* — statusen leses alltid fra Vipps. Er den `AUTHORIZED`,
   trekkes beløpet (capture) **før** klippene krediteres, så vi aldri leverer
   et klippekort vi ikke får betalt for. Feiler trekket, blir kjøpet stående
   som `pending`, og et nytt treff prøver igjen.
3. **Ingen webhook, ingen cron.** Alt avgjøres når brukeren kommer tilbake.

### Klippekortet: tre invarianter, håndhevet i SQL

Invariantene ligger i databasefunksjoner, ikke i appen, fordi de må holde
også når to forespørsler kommer samtidig. Appen kaller bare
`/rest/v1/rpc/...` — aldri tabellene direkte.

1. **Ett klipp per FINN-kode.** Primærnøkkelen på `unlocks` gjør innløsning
   idempotent, så samme annonse kan åpnes igjen gratis.
2. **Ett kjøp krediteres én gang.** `complete_purchase` er idempotent på
   Vipps-referansen og avviser at beløpet avviker fra det vi lagret.
3. **To samtidige innløsninger kan ikke bruke samme klipp.**
   `consume_clip` låser klippotten med `for update` før den trekker.

`/api/unlock` henter annonsen **først** og trekker klippet etterpå: en solgt
eller fjernet annonse koster aldri brukeren et klipp. Innløsning skjer bare i
POST — `/beregning` er ren lesing, fordi Next forhåndshenter lenker og en side
som trakk klipp ved lasting ville brent dem.

### Innlogging: Vipps Login (OIDC)

Klippekortet eies av en Vipps-bruker, så innlogging kommer før kjøp. Vi ber
kun om `openid name` og lagrer en pseudonym `vipps_sub` — ikke fødselsnummer,
adresse eller e-post. Sesjonen er en HMAC-signert `httpOnly`-cookie som varer
i ~13 måneder, så brukeren slipper å logge inn hver gang.

Cookien bærer bare *hvem* brukeren er; antall klipp leses alltid fra
databasen. `/api/vipps/retur` skriver aldri sesjonen — en URL som kunne gi
innlogging ville vært en innloggingsomvei.

### Sikkerhet i databasen

Alle tabeller har RLS på **uten policyer**, og `EXECUTE` på funksjonene er
trukket fra `anon`/`authenticated` og gitt bare til `service_role`. Den
publiserbare nøkkelen kommer altså ikke til noe: den får `[]` på lesing,
`42501` på skriving og `permission denied` på funksjonskall. Den hemmelige
nøkkelen skal bare stå server-side.

Øvrige notater:

- Kalkulatormotoren (`lib/calc/engine.ts`) er ren, isomorf TS — samme kode
  live i nettleseren og server-side.
- FINN-parsing (`lib/finn/`) er label-basert (dt/dd-tekst, aldri CSS-klasser)
  med feiltaksonomi `NOT_FOUND | BLOCKED | TIMEOUT | PARSE_FAIL` og fixtures
  fra ekte annonser i `lib/finn/__fixtures__/`.
- Rate limiting er best-effort i minnet per serverless-instans — de dyre
  operasjonene ligger bak betaling.
- `supabase/schema.sql` er den autoritative, kjørbare beskrivelsen av
  databasen. Legges en ny funksjon til, må rettighetsblokken nederst kjøres
  på nytt (en ny funksjon arver `EXECUTE` til `PUBLIC`).

## Aktivering (ingen kodeendringer)

Alt er gated på env-variabler. Sett disse i Vercel og lokalt i `.env.local`:

| Variabel | Hvor den hentes |
| --- | --- |
| `VIPPS_CLIENT_ID`, `VIPPS_CLIENT_SECRET` | portal.vippsmobilepay.com → Utvikler → API-nøkler |
| `VIPPS_SUBSCRIPTION_KEY` | samme sted (primær eller sekundær — likeverdige) |
| `VIPPS_MSN` | salgsenhetens 6-sifrede Merchant Serial Number, samme sted |
| `VIPPS_ENVIRONMENT` | `test` eller `production` |
| `SUPABASE_URL`, `SUPABASE_SECRET_KEY` | Supabase → Project Settings → API keys |
| `SESSION_SECRET` | `openssl rand -hex 32` |

I tillegg, i Vipps-portalen:

1. **Aktiver Login** for salgsenheten. Er den ikke aktivert, svarer
   autorisasjonsendepunktet `Client not found`.
2. **Registrer redirect-URI:** `<NEXT_PUBLIC_SITE_URL>/api/auth/vipps/callback`
   (og `http://localhost:3000/api/auth/vipps/callback` for lokal testing).

## Dev-verktøy

- `FINN_FORCE_ERROR=BLOCKED pnpm dev` — test at feil ikke bruker klipp.
- `DEV_FAKE_PAYMENTS=1` — krediter klippekortet uten å snakke med Vipps.
  Virker bare når `NODE_ENV !== production`, og er av med mindre den settes
  eksplisitt. (Den gamle koden slo på bypass automatisk utenfor produksjon;
  det gjorde at lokal utvikling så ut som at betalingen virket mens
  produksjon manglet nøkler.)
- Testbrukere og MT-appen: portal.vippsmobilepay.com → For utviklere →
  Testbrukere. Testmiljøet har egen app (`vippsMT://`).
