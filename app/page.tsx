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
import { FAQ_ITEMS } from "@/lib/faq";
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

const GUIDES = [
  {
    slug: "yield-utleiebolig",
    title: "Yield på utleiebolig: slik regner du ut avkastningen",
    description:
      "Brutto vs. netto yield, regneeksempler og hva som regnes som god avkastning i 2026.",
  },
  {
    slug: "skatt-pa-utleie-2026",
    title: "Skatt på utleie 2026: satser, fradrag og skattefri utleie",
    description:
      "22 %-regelen, alle fradragene du kan kreve, og når utleie er helt skattefritt.",
  },
  {
    slug: "dokumentavgift-og-omkostninger",
    title: "Dokumentavgift og omkostninger ved boligkjøp",
    description:
      "Hvorfor selveier koster 2,5 % ekstra, hva andelsboliger slipper unna med, og alle gebyrene.",
  },
];

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
        {GUIDES.map((guide) => (
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
        // eslint-disable-next-line react/no-danger
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
            Se på sekunder om en utleiebolig lønner seg – gratis og uten konto.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
            <FinnImportDialog />
            <a
              href="#kalkulator"
              className="text-sm font-medium text-primary hover:underline"
            >
              eller fyll inn tallene selv ↓
            </a>
          </div>
        </section>

        <section id="kalkulator" aria-label="Kalkulator" className="scroll-mt-20">
          <Calculator urlSync shareActions />
        </section>

        <HowItWorks />
        <FinnSection />
        <KeyFiguresExplained />
        <Faq />
        <GuideTeasers />
      </div>
    </>
  );
}
