import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "@/components/calculator/calculator";
import { FinnImportDialog } from "@/components/calculator/finn-import-dialog";
import { Button } from "@/components/ui/button";
import { FAQ_ITEMS } from "@/lib/faq";
import { getCategory, GUIDES } from "@/lib/guides";
import {
  faqJsonLd,
  jsonLdString,
  webApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/jsonld";
import { PRICE_NOK } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const FEATURED_GUIDES = GUIDES.slice(0, 3);

/**
 * Dekor bak heroen: en stigende avkastningskurve med endepunkt – samme
 * motiv som logoens trendpil og prognosegrafen i resultatpanelet.
 */
function HeroDecor() {
  return (
    <svg
      viewBox="0 0 560 340"
      aria-hidden
      className="pointer-events-none absolute -right-10 top-4 -z-10 hidden w-[520px] text-secondary lg:block xl:-right-4"
    >
      <line
        x1="0"
        y1="248"
        x2="560"
        y2="248"
        className="stroke-border"
        strokeDasharray="2 7"
      />
      <line
        x1="0"
        y1="176"
        x2="560"
        y2="176"
        className="stroke-border"
        strokeDasharray="2 7"
      />
      <line
        x1="0"
        y1="104"
        x2="560"
        y2="104"
        className="stroke-border"
        strokeDasharray="2 7"
      />
      <defs>
        <linearGradient id="hero-kurve-fyll" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 268 C120 258 210 240 300 196 S460 104 540 64 L540 300 L0 300 Z"
        fill="url(#hero-kurve-fyll)"
      />
      <path
        d="M0 268 C120 258 210 240 300 196 S460 104 540 64"
        className="fill-none stroke-primary/35"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="540" cy="64" r="7" className="fill-cta" />
    </svg>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
}: {
  id: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2
        id={id}
        className="font-display mt-3 text-3xl font-semibold sm:text-4xl"
      >
        {title}
      </h2>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Legg inn tallene",
      text: "Fyll inn selv – eller lim inn en FINN-annonse og få alt utfylt automatisk.",
    },
    {
      title: "Se svaret umiddelbart",
      text: "Kontantstrøm, yield og break-even oppdateres live mens du justerer.",
    },
    {
      title: "Del med lenke",
      text: "Alle tallene ligger i lenken – del med medinvestor eller banken.",
    },
  ];
  return (
    <section aria-labelledby="slik-fungerer-det" className="py-16 sm:py-20">
      <SectionHeading
        id="slik-fungerer-det"
        eyebrow="Slik fungerer det"
        title="Fra tall til beslutning på under et minutt"
      />
      <ol className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
        {steps.map((step, index) => (
          <li key={step.title} className="border-t border-foreground/20 pt-5">
            <span className="font-mono text-sm text-muted-foreground">
              0{index + 1}
            </span>
            <h3 className="mt-2.5 font-semibold">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function FinnSection() {
  const points = [
    "Kjøpesum, felleskostnader, fellesgjeld og omkostninger fylles ut automatisk",
    "Objektiv KI-vurdering med sannsynlighet 0–100 % for lønnsomhet",
    "Automatisk refusjon hvis annonsen ikke kan hentes",
  ];
  return (
    <section aria-labelledby="finn-import" className="py-6 sm:py-10">
      <div className="surface-panel dark relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-12 sm:py-14">
        <svg
          viewBox="0 0 340 220"
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-3 hidden w-72 sm:block"
        >
          <path
            d="M0 190 C80 180 140 158 200 118 S300 46 320 32"
            fill="none"
            stroke="#f7f2e6"
            strokeOpacity="0.18"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="320" cy="32" r="6" fill="#e2582a" fillOpacity="0.85" />
        </svg>
        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">
          <div className="flex-1">
            <p className="eyebrow">Vurderer du en konkret bolig?</p>
            <h2
              id="finn-import"
              className="font-display mt-3 max-w-lg text-3xl font-semibold sm:text-4xl"
            >
              Lim inn FINN-annonsen – vi gjør resten
            </h2>
            <ul className="mt-6 space-y-3">
              {points.map((point) => (
                <li key={point} className="flex gap-3 text-[15px] leading-relaxed">
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-positive"
                    aria-hidden
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start gap-4 lg:w-72 lg:items-center">
            <p className="lg:text-center">
              <span className="font-mono text-5xl font-bold tabular-nums tracking-tight">
                {PRICE_NOK} kr
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                per beregning · ingen konto
              </span>
            </p>
            <FinnImportDialog
              trigger={
                <Button
                  size="lg"
                  className="h-11 w-full rounded-full bg-cta px-6 text-[15px] font-semibold text-cta-foreground hover:bg-cta/90 sm:w-auto lg:w-full"
                >
                  <Sparkles data-slot="icon" />
                  Hent fra FINN-annonse
                </Button>
              }
            />
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" aria-hidden />
              Sikker betaling med Stripe
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function KeyFiguresExplained() {
  const figures = [
    {
      term: "Kontantstrøm",
      text: "Det som står igjen hver måned etter at leieinntektene har dekket lån, felleskostnader, vedlikehold og skatt. Positiv kontantstrøm betyr at boligen betaler for seg selv.",
    },
    {
      term: "Brutto og netto yield",
      text: "Yield måler leieinntektene mot prisen på boligen. Brutto yield ser kun på leien; netto yield trekker fra alle driftskostnadene og er det ærligste målet på løpende avkastning.",
    },
    {
      term: "Cash-on-cash",
      text: "Årlig kontantstrøm etter skatt målt mot egenkapitalen du faktisk har skutt inn. Viser hva pengene dine jobber til sammenlignet med alternativ plassering.",
    },
    {
      term: "Break-even",
      text: "Kalkulatoren finner både leien som må til for å gå i null, og hvor høy rente økonomien tåler. Nyttig for å stressteste investeringen før du legger inn bud.",
    },
  ];
  return (
    <section aria-labelledby="nokkeltall" className="py-16 sm:py-20">
      <SectionHeading
        id="nokkeltall"
        eyebrow="Nøkkeltall"
        title="Tallene som avgjør om utleie lønner seg"
      />
      <dl className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
        {figures.map((figure) => (
          <div key={figure.term} className="border-t border-foreground/20 pt-5">
            <dt className="font-semibold">{figure.term}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {figure.text}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function AboutCalculator() {
  return (
    <section aria-labelledby="om-utleiekalkulator" className="py-16 sm:py-20">
      <SectionHeading
        id="om-utleiekalkulator"
        eyebrow="Om verktøyet"
        title="Hva er en utleiekalkulator?"
      />
      <div className="mt-8 max-w-3xl space-y-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        <p>
          En utleiekalkulator er en kalkulator for utleie av bolig: den samler
          alle tallene som avgjør om en utleiebolig lønner seg – kjøpesum,
          lån, rente, leieinntekter, felleskostnader, vedlikehold, ledighet og
          skatt – og regner ut hva som faktisk blir igjen til deg. I stedet
          for å synse om «god investering» får du kontantstrøm per måned etter
          skatt,{" "}
          <Link
            href="/guide/yield-utleiebolig"
            className="font-medium text-primary underline decoration-primary/35 underline-offset-3 hover:decoration-primary"
          >
            brutto og netto yield
          </Link>
          , cash-on-cash-avkastning og break-even, oppdatert live mens du
          justerer forutsetningene.
        </p>
        <h3 className="pt-3 text-lg font-semibold text-foreground">
          Hvem er kalkulatoren for?
        </h3>
        <p>
          For deg som vurderer å{" "}
          <Link
            href="/guide/lonner-det-seg-a-kjope-utleiebolig"
            className="font-medium text-primary underline decoration-primary/35 underline-offset-3 hover:decoration-primary"
          >
            kjøpe bolig for utleie
          </Link>{" "}
          og vil regne på et konkret objekt før budrunden. For deg som skal{" "}
          <Link
            href="/guide/leie-ut-del-av-egen-bolig"
            className="font-medium text-primary underline decoration-primary/35 underline-offset-3 hover:decoration-primary"
          >
            leie ut hybel eller sokkelleilighet i egen bolig
          </Link>{" "}
          og lurer på hva det betyr for økonomien. Og for deg som allerede
          eier en sekundærbolig og vil stressteste hva en renteøkning eller{" "}
          <Link
            href="/guide/hva-kan-jeg-leie-ut-for"
            className="font-medium text-primary underline decoration-primary/35 underline-offset-3 hover:decoration-primary"
          >
            en annen leiepris
          </Link>{" "}
          gjør med regnestykket.
        </p>
        <h3 className="pt-3 text-lg font-semibold text-foreground">
          Forutsetningene styrer du selv
        </h3>
        <p>
          Kalkulatoren starter med fornuftige standardverdier for det norske
          markedet –{" "}
          <Link
            href="/guide/skatt-pa-utleie-2026"
            className="font-medium text-primary underline decoration-primary/35 underline-offset-3 hover:decoration-primary"
          >
            22 % skatt på netto leieinntekt
          </Link>
          , rentefradrag,{" "}
          <Link
            href="/guide/dokumentavgift-og-omkostninger"
            className="font-medium text-primary underline decoration-primary/35 underline-offset-3 hover:decoration-primary"
          >
            dokumentavgift på 2,5 % for selveier
          </Link>{" "}
          og normal ledighet – men alt kan justeres. Leier du ut skattefritt i
          egen bolig, setter du skattesatsen til null. Velger du andelsbolig,
          fjernes dokumentavgiften og fellesgjelden regnes inn i totalprisen.
        </p>
        <h3 className="pt-3 text-lg font-semibold text-foreground">
          Gratis, uten konto – og tallene dine forblir dine
        </h3>
        <p>
          Utleiekalkulatoren er gratis å bruke, krever ingen registrering og
          lagrer ingenting: beregningen ligger i lenken, som du kan dele med
          medinvestor, partner eller banken. Vil du slippe å taste inn tallene
          selv, henter vi dem automatisk fra en FINN-annonse og gir deg en
          objektiv KI-vurdering av lønnsomheten for {PRICE_NOK} kr.
        </p>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section aria-labelledby="faq" className="py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 id="faq" className="font-display mt-3 text-3xl font-semibold sm:text-4xl">
            Ofte stilte spørsmål
          </h2>
        </div>
        <div className="divide-y divide-border border-t border-border">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden
                  className="font-mono text-lg text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pt-3 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuideTeasers() {
  return (
    <section aria-labelledby="guider" className="pb-4 pt-16 sm:pt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          id="guider"
          eyebrow="Lær mer"
          title="Guider om utleie og avkastning"
        />
        <Link
          href="/guide"
          className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Alle guider →
        </Link>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {FEATURED_GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guide/${guide.slug}`}
            className="group flex flex-col rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-[0_12px_32px_-16px_rgb(23_48_41/0.25)]"
          >
            <p className="eyebrow">{getCategory(guide.category).label}</p>
            <h3 className="mt-3 font-semibold leading-snug">{guide.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {guide.description}
            </p>
            <span className="mt-auto pt-5 text-sm font-medium text-primary">
              Les guiden{" "}
              <span className="inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(websiteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(webApplicationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd(FAQ_ITEMS)) }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <section className="relative pb-10 pt-12 sm:pb-12 sm:pt-16">
          <HeroDecor />
          <p className="eyebrow">Gratis · uten konto · norske skatteregler</p>
          <h1 className="font-display mt-4 text-[clamp(2.5rem,8.5vw,4.75rem)] font-semibold leading-[1.02]">
            Utleiekalkulator
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Se på sekunder om en utleiebolig lønner seg: kontantstrøm, yield
            og avkastning.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <FinnImportDialog
              trigger={
                <Button
                  size="lg"
                  className="h-11 rounded-full bg-cta px-6 text-[15px] font-semibold text-cta-foreground hover:bg-cta/90"
                >
                  <Sparkles data-slot="icon" />
                  Hent fra FINN-annonse – {PRICE_NOK} kr
                </Button>
              }
            />
            <a
              href="#kalkulator"
              className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              eller bruk kalkulatoren gratis ↓
            </a>
          </div>
        </section>

        <section id="kalkulator" aria-label="Kalkulator" className="scroll-mt-24">
          <Calculator urlSync shareActions examplePresets />
        </section>

        <HowItWorks />
        <FinnSection />
        <KeyFiguresExplained />
        <AboutCalculator />
        <Faq />
        <GuideTeasers />
      </div>
    </>
  );
}
