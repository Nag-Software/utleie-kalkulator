# Utleie-kalkulator.no

Lønnsomhetskalkulator for utleiebolig: kontantstrøm, yield, break-even og
prognose. Gratis med manuelle tall; et klippekort med 20 FINN-importer koster
49 kr og er gyldig i 12 måneder.

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

Appen **booter uten nøkler**: uten `STRIPE_SECRET_KEY` og `SESSION_SECRET`
viser FINN-dialogen at betaling er utilgjengelig. Env-verdier som starter med
`PLACEHOLDER` behandles som fraværende. Kopier `.env.example` til `.env.local`.

## Arkitektur: ingen database

Stripe er sannhetskilde for klippekort:

1. **Kjøp:** `/api/checkout` selger 20 klipp for 49 kr. Returruten verifiserer
   betalingen før klippene krediteres idempotent.
2. **Saldo:** Klipp, utløpsdatoer og opplåste FINN-koder lagres i Stripe
   Customer-metadata. En signert `httpOnly`-cookie inneholder kundereferansen.
3. **Bruk:** `/api/unlock` henter annonsen først og trekker deretter ett klipp.
   Feilet henting koster ingenting; samme FINN-kode kan åpnes igjen gratis.
4. **Beregning og deling:** Importerte kalkulatorverdier legges i URL-en, slik
   at resultatet kan deles uten å dele klippekortet.
5. **Innlogging:** Vipps Login er valgfritt og knytter kundereferansen til en
   pseudonym Vipps-ID, slik at kortet kan brukes på flere enheter.

Øvrige notater:

- Kalkulatormotoren (`lib/calc/engine.ts`) er ren, isomorf TS — samme kode
  live i nettleseren og server-side.
- FINN-parsing (`lib/finn/`) er label-basert (dt/dd-tekst, aldri CSS-klasser)
  med feiltaksonomi `NOT_FOUND | BLOCKED | TIMEOUT | PARSE_FAIL` og fixtures
  fra ekte annonser i `lib/finn/__fixtures__/`.
- Rate limiting er best-effort i minnet per serverless-instans — de dyre
  operasjonene ligger bak betaling.

## Aktivering av nøkler (ingen kodeendringer)

1. **Stripe:** Sett `STRIPE_SECRET_KEY` og `SESSION_SECRET` i Vercel.
2. **Vipps Login:** Sett klient-ID og klienthemmelighet, og registrer
   `/api/auth/vipps/callback` som redirect-URI.

## Dev-verktøy

- `FINN_FORCE_ERROR=BLOCKED pnpm dev` — test at feil ikke bruker klipp.
- Stripe test-modus + testkort `4242 4242 4242 4242` for hele kjøpsflyten.
