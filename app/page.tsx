import {
  BarChart3,
  Calculator as CalculatorIcon,
  CheckCircle2,
  Link2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "@/components/calculator/calculator";
import { FinnImportDialog } from "@/components/calculator/finn-import-dialog";
import { Button } from "@/components/ui/button";
import { FAQ_ITEMS } from "@/lib/faq";
import { GUIDES } from "@/lib/guides";
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

function HowItWorks() {
  const steps = [
    {
      icon: CalculatorIcon,
      title: "Legg inn tallene",
      text: "Fyll inn selv – eller lim inn en FINN-annonse og få alt utfylt automatisk.",
    },
    {
      icon: BarChart3,
      title: "Se svaret umiddelbart",
      text: "Kontantstrøm, yield og break-even oppdateres live mens du justerer.",
    },
    {
      icon: Link2,
      title: "Del med lenke",
      text: "Alle tallene ligger i lenken – del med medinvestor eller banken.",
    },
  ];
  return (
    <section aria-labelledby="slik-fungerer-det" className="py-14">
      <h2 id="slik-fungerer-det" className="text-2xl font-bold tracking-tight">
        Slik fungerer det
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-xl border bg-card p-5">
            <step.icon className="size-6 text-primary" aria-hidden />
            <h3 className="mt-3 font-semibold">{step.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{step.text}</p>
          </div>
        ))}
      </div>
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
    <section aria-labelledby="finn-import" className="py-14">
      <div className="rounded-2xl border bg-card p-6 sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex-1">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
              <Sparkles className="size-4" aria-hidden />
              Vurderer du en konkret bolig?
            </p>
            <h2 id="finn-import" className="mt-2 text-2xl font-bold tracking-tight">
              Lim inn FINN-annonsen – vi gjør resten
            </h2>
            <ul className="mt-5 space-y-2.5">
              {points.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-positive"
                    aria-hidden
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center gap-3 lg:w-64">
            <p className="text-center">
              <span className="font-mono text-4xl font-bold tabular-nums">
                {PRICE_NOK} kr
              </span>
              <span className="block text-sm text-muted-foreground">
                per beregning · ingen konto
              </span>
            </p>
            <FinnImportDialog />
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
    <section aria-labelledby="nokkeltall" className="py-14">
      <h2 id="nokkeltall" className="text-2xl font-bold tracking-tight">
        Nøkkeltallene som avgjør om utleie lønner seg
      </h2>
      <dl className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {figures.map((figure) => (
          <div key={figure.term}>
            <dt className="font-semibold">{figure.term}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
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
    <section aria-labelledby="om-utleiekalkulator" className="py-14">
      <h2
        id="om-utleiekalkulator"
        className="text-2xl font-bold tracking-tight"
      >
        Hva er en utleiekalkulator?
      </h2>
      <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <p>
          En utleiekalkulator er en kalkulator for utleie av bolig: den samler
          alle tallene som avgjør om en utleiebolig lønner seg – kjøpesum,
          lån, rente, leieinntekter, felleskostnader, vedlikehold, ledighet og
          skatt – og regner ut hva som faktisk blir igjen til deg. I stedet
          for å synse om «god investering» får du kontantstrøm per måned etter
          skatt,{" "}
          <Link
            href="/guide/yield-utleiebolig"
            className="text-primary hover:underline"
          >
            brutto og netto yield
          </Link>
          , cash-on-cash-avkastning og break-even, oppdatert live mens du
          justerer forutsetningene.
        </p>
        <h3 className="pt-2 text-lg font-semibold text-foreground">
          Hvem er kalkulatoren for?
        </h3>
        <p>
          For deg som vurderer å{" "}
          <Link
            href="/guide/lonner-det-seg-a-kjope-utleiebolig"
            className="text-primary hover:underline"
          >
            kjøpe bolig for utleie
          </Link>{" "}
          og vil regne på et konkret objekt før budrunden. For deg som skal{" "}
          <Link
            href="/guide/leie-ut-del-av-egen-bolig"
            className="text-primary hover:underline"
          >
            leie ut hybel eller sokkelleilighet i egen bolig
          </Link>{" "}
          og lurer på hva det betyr for økonomien. Og for deg som allerede
          eier en sekundærbolig og vil stressteste hva en renteøkning eller{" "}
          <Link
            href="/guide/hva-kan-jeg-leie-ut-for"
            className="text-primary hover:underline"
          >
            en annen leiepris
          </Link>{" "}
          gjør med regnestykket.
        </p>
        <h3 className="pt-2 text-lg font-semibold text-foreground">
          Forutsetningene styrer du selv
        </h3>
        <p>
          Kalkulatoren starter med fornuftige standardverdier for det norske
          markedet –{" "}
          <Link
            href="/guide/skatt-pa-utleie-2026"
            className="text-primary hover:underline"
          >
            22 % skatt på netto leieinntekt
          </Link>
          , rentefradrag,{" "}
          <Link
            href="/guide/dokumentavgift-og-omkostninger"
            className="text-primary hover:underline"
          >
            dokumentavgift på 2,5 % for selveier
          </Link>{" "}
          og normal ledighet – men alt kan justeres. Leier du ut skattefritt i
          egen bolig, setter du skattesatsen til null. Velger du andelsbolig,
          fjernes dokumentavgiften og fellesgjelden regnes inn i totalprisen.
        </p>
        <h3 className="pt-2 text-lg font-semibold text-foreground">
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
    <section aria-labelledby="faq" className="py-14">
      <h2 id="faq" className="text-2xl font-bold tracking-tight">
        Ofte stilte spørsmål
      </h2>
      <div className="mt-6 divide-y rounded-xl border bg-card">
        {FAQ_ITEMS.map((item) => (
          <details key={item.question} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                aria-hidden
                className="text-muted-foreground transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="pt-2.5 text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function GuideTeasers() {
  return (
    <section aria-labelledby="guider" className="py-14">
      <div className="flex items-baseline justify-between">
        <h2 id="guider" className="text-2xl font-bold tracking-tight">
          Guider om utleie og avkastning
        </h2>
        <Link href="/guide" className="text-sm text-primary hover:underline">
          Alle guider
        </Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {FEATURED_GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guide/${guide.slug}`}
            className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/50"
          >
            <h3 className="font-semibold group-hover:text-primary">
              {guide.title}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {guide.description}
            </p>
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

      <div className="mx-auto w-full max-w-6xl px-4">
        <section className="pb-6 pt-8 sm:pt-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Utleiekalkulator
          </h1>
          <p className="mt-2 max-w-xl text-base text-muted-foreground sm:text-lg">
            Se på sekunder om en utleiebolig lønner seg: kontantstrøm, yield og
            avkastning – gratis og uten konto.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
            <FinnImportDialog
              trigger={
                <Button size="lg">
                  <Sparkles data-slot="icon" />
                  Hent fra FINN-annonse – {PRICE_NOK} kr
                </Button>
              }
            />
            <a
              href="#kalkulator"
              className="text-sm font-medium text-primary hover:underline"
            >
              eller bruk kalkulatoren gratis ↓
            </a>
          </div>
        </section>

        <section id="kalkulator" aria-label="Kalkulator" className="scroll-mt-20">
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
