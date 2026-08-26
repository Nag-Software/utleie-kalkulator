# Utleie-kalkulator.no

Lønnsomhetskalkulator for utleiebolig: kontantstrøm, yield, break-even og
prognose. Gratis med manuelle tall; import fra FINN-annonse koster 9,90 kr
per beregning (Stripe, uten konto).

## Stack

- **Next.js 16** (App Router) + React 19 + Tailwind 4 + shadcn/ui + recharts
- **Stripe Checkout** — også eneste datalager: ingen database

## Kom i gang

```bash
pnpm install
pnpm dev        # kjører uten nøkler — betaling er gated
pnpm test       # vitest: kalkulatormotor, FINN-parser (fixtures), metadata-lager
pnpm build
```

Appen **booter uten nøkler**: uten `STRIPE_SECRET_KEY` viser FINN-dialogen
«betaling kommer snart». Env-verdier som starter med `PLACEHOLDER` behandles
som fraværende. Kopier `.env.example` til `.env.local`.

## Arkitektur: ingen database

Stripe er eneste sannhetskilde for betalte beregninger:

1. **Kjøp:** `/api/checkout` oppretter en Checkout Session med `finnkode` i
   metadata. Kvitteringslenken er `/beregning?session_id=cs_…` — selve
   session-id-en er tilgangsnøkkelen.
2. **Første visning:** serveren verifiserer betalingen mot Stripe, henter
   FINN-annonsen og skriver parsede tall inn i PaymentIntent-metadata
   (chunket JSON, `lib/payments/metadata.ts`). Refresh og senere besøk leser
   derfra — fungerer selv om annonsen senere slettes fra FINN.
3. **Feil → refusjon:** hard FINN-feil ved første henting refunderer beløpet
   automatisk og merker betalingen `refunded:<KODE>`.
4. **Justeringer og deling:** alle kalkulatorverdier ligger i URL-en (gratis
   og betalt). Ingen webhook, ingen cron, ingen server-lagring av persondata.

Øvrige notater:

- Kalkulatormotoren (`lib/calc/engine.ts`) er ren, isomorf TS — samme kode
  live i nettleseren og server-side.
- FINN-parsing (`lib/finn/`) er label-basert (dt/dd-tekst, aldri CSS-klasser)
  med feiltaksonomi `NOT_FOUND | BLOCKED | TIMEOUT | PARSE_FAIL` og fixtures
  fra ekte annonser i `lib/finn/__fixtures__/`.
- Rate limiting er best-effort i minnet per serverless-instans — de dyre
  operasjonene ligger bak betaling.

## Aktivering av nøkler (ingen kodeendringer)

1. **Stripe:** Sett `STRIPE_SECRET_KEY` i Vercel (erstatt PLACEHOLDER).
   Ingen webhook å registrere.

## Dev-verktøy

- `FINN_FORCE_ERROR=BLOCKED pnpm dev` — test refusjonsstien.
- Stripe test-modus + testkort `4242 4242 4242 4242` for hele kjøpsflyten.
