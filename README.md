# Utleie-kalkulator.no

Lønnsomhetskalkulator for utleiebolig: kontantstrøm, yield, break-even og
prognose. Gratis med manuelle tall; import fra FINN-annonse med KI-vurdering
koster 9,90 kr per beregning (Stripe, uten konto).

## Stack

- **Next.js 16** (App Router) + React 19 + Tailwind 4 + shadcn/ui + recharts
- **Supabase Postgres** (kun server-side, service role, RLS deny-all)
- **Stripe Checkout** (engangsbetaling, webhook + polling-fallback, automatisk refusjon)
- **OpenAI** structured output (objektiv vurdering, 0–100 % sannsynlighet)

## Kom i gang

```bash
pnpm install
pnpm dev        # kjører uten nøkler — betaling/lagring er gated
pnpm test       # vitest: kalkulatormotor + FINN-parser (fixtures)
pnpm build
```

Appen **booter uten nøkler**: uten `SUPABASE_*` er lagring skjult, uten
`STRIPE_*` viser FINN-dialogen «betaling kommer snart», uten `OPENAI_API_KEY`
viser betalte beregninger «vurdering genereres» til nøkkelen finnes.
Env-verdier som starter med `PLACEHOLDER` behandles som fraværende.

Kopier `.env.example` til `.env.local` og fyll inn etter hvert.

## Aktivering av tjenester

1. **Supabase:** Opprett prosjekt, kjør `supabase/migrations/0001_init.sql`
   (SQL editor eller MCP `apply_migration`), sett `SUPABASE_URL` +
   `SUPABASE_SERVICE_ROLE_KEY`.
2. **Stripe:** Sett `STRIPE_SECRET_KEY`. Registrer webhook-endepunkt
   `https://utleie-kalkulator.no/api/stripe/webhook` for eventet
   `checkout.session.completed`, og sett `STRIPE_WEBHOOK_SECRET`.
   Lokalt: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
3. **OpenAI:** Sett `OPENAI_API_KEY` (+ ev. `OPENAI_MODEL`, default `gpt-5-mini`).

## Arkitekturnotater

- Kalkulatormotoren (`lib/calc/engine.ts`) er ren, isomorf TS — kjører live i
  nettleseren og server-side som grunnlag for KI-vurderingen.
- FINN-parsing (`lib/finn/`) er label-basert (dt/dd-tekst, aldri CSS-klasser)
  med feiltaksonomi `NOT_FOUND | BLOCKED | TIMEOUT | PARSE_FAIL`. Hard feil
  etter betaling → automatisk Stripe-refusjon. Fixtures fra ekte annonser i
  `lib/finn/__fixtures__/`.
- Fulfillment (`lib/payments/fulfill.ts`) claimes atomisk i Postgres
  (`claim_calculation`) — webhook og polling-fallback kappes trygt.
- Rate limiting: fixed-window-teller i Postgres per saltet IP-hash + rute.
- Gratis deling uten DB: alle inputs kodes i URL-query (`url-state.ts`).
- Daglig cron (`vercel.json` → `/api/cron/cleanup`) rydder rate limits,
  FINN-cache og utløpte ubetalte beregninger.

## Dev-verktøy

- `FINN_FORCE_ERROR=BLOCKED pnpm dev` — test refusjonsstien uten å ødelegge noe.
- Stripe test-modus + testkort `4242 4242 4242 4242` for hele kjøpsflyten.
