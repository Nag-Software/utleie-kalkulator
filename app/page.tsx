import { ArrowRight, Check, Download, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "@/components/calculator/calculator";
import { FinnImportDialog } from "@/components/calculator/finn-import-dialog";
import { Pill, Section, SectionHeading } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { FAQ_ITEMS } from "@/lib/faq";
import { getCategory, GUIDES } from "@/lib/guides";
import {
  faqJsonLd,
  jsonLdString,
  webApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/jsonld";
import {
  KLIPP_GYLDIGHET_MANEDER,
  KLIPP_PER_KJOP,
  KLIPP_PRIS_NOK,
} from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const FEATURED_GUIDES = GUIDES.slice(0, 3);

/** Myk fargesky bak heroen – ren CSS, ingen bilder å laste. */
function HeroGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[420px] overflow-hidden"
    >
      <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,93,48,0.22),transparent)] blur-2xl" />
      <div className="absolute left-[28%] top-10 h-[300px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,195,0,0.18),transparent)] blur-2xl" />
      <div className="absolute left-[72%] top-6 h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(10,202,255,0.14),transparent)] blur-2xl" />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <HeroGlow />
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-14 text-center sm:px-6 sm:pb-14 sm:pt-20">
        <Pill>Gratis · uten konto · norske regler for 2026</Pill>
        <h1 className="display mx-auto mt-6 max-w-4xl text-[clamp(2.5rem,7.5vw,4.5rem)]">
          Lønner utleieboligen seg?
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Legg inn seks tall og få kontantstrøm, yield og break-even med en
          gang. Ingen konto, ingen e-post – og tallene dine ligger i lenken.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <a href="#kalkulator">
              Regn ut nå
              <ArrowRight data-slot="icon" />
            </a>
          </Button>
          <FinnImportDialog
            trigger={
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Download data-slot="icon" />
                Hent fra FINN-annonse
              </Button>
            }
          />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Legg inn tallene",
      text: "Seks felter er nok til å komme i gang – eller lim inn en FINN-annonse og få alt utfylt automatisk.",
    },
    {
      title: "Se svaret umiddelbart",
      text: "Kontantstrøm, yield og break-even oppdateres live mens du drar i sliderne.",
    },
    {
      title: "Del med lenke",
      text: "Alle forutsetningene ligger i lenken – del med medinvestor, partner eller banken.",
    },
  ];
  return (
    <Section aria-labelledby="slik-fungerer-det" className="py-16 sm:py-24">
      <SectionHeading
        id="slik-fungerer-det"
        eyebrow="Slik fungerer det"
        title="Fra tall til beslutning på under et minutt"
        align="center"
      />
      <ol className="mt-12 grid gap-4 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-secondary text-[13px] font-medium">
              {index + 1}
            </span>
            <h3 className="display-sm mt-4 text-lg">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function FinnSection() {
  const points = [
    "Kjøpesum, felleskostnader, fellesgjeld og omkostninger fylles ut automatisk",
    "Riktig eieform og dokumentavgift settes fra annonsen",
    "Ingen klipp trekkes hvis annonsen ikke kan hentes",
  ];
  return (
    <Section aria-labelledby="finn-import" className="py-6 sm:py-10">
      <div className="surface-dark relative overflow-hidden rounded-3xl px-6 py-12 sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-[radial-gradient(closest-side,rgba(255,93,48,0.35),transparent)]"
        />
        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/70">
              <span className="size-1.5 rounded-full bg-cta" />
              Vurderer du en konkret bolig?
            </span>
            <h2
              id="finn-import"
              className="display mt-5 max-w-lg text-[clamp(1.75rem,4.5vw,2.75rem)]"
            >
              Lim inn FINN-annonsen – vi gjør resten
            </h2>
            <ul className="mt-7 space-y-3.5">
              {points.map((point) => (
                <li key={point} className="flex gap-3 text-[15px] leading-relaxed">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-cta">
                    <Check className="size-3 text-white" aria-hidden />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start gap-4 lg:w-64">
            <p>
              <span className="display text-5xl">{KLIPP_PRIS_NOK} kr</span>
              <span className="mt-1.5 block text-sm text-white/60">
                {KLIPP_PER_KJOP} annonser · gyldig{" "}
                {KLIPP_GYLDIGHET_MANEDER} måneder
              </span>
            </p>
            <FinnImportDialog
              trigger={
                <Button variant="cta" size="lg" className="w-full">
                  <Download data-slot="icon" />
                  Hent fra FINN
                </Button>
              }
            />
            <p className="flex items-center gap-1.5 text-xs text-white/55">
              <ShieldCheck className="size-3.5" aria-hidden />
              Sikker betaling med Stripe
            </p>
          </div>
        </div>
      </div>
    </Section>
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
    <Section aria-labelledby="nokkeltall" className="py-16 sm:py-24">
      <SectionHeading
        id="nokkeltall"
        eyebrow="Nøkkeltall"
        title="Tallene som avgjør om utleie lønner seg"
        align="center"
      />
      <dl className="mt-12 grid gap-4 sm:grid-cols-2">
        {figures.map((figure) => (
          <div
            key={figure.term}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <dt className="display-sm text-lg">{figure.term}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {figure.text}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

function AboutCalculator() {
  return (
    <Section aria-labelledby="om-utleiekalkulator" className="py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
        <SectionHeading
          id="om-utleiekalkulator"
          eyebrow="Om verktøyet"
          title="Hva er en utleiekalkulator?"
        />
        <div className="max-w-3xl space-y-4 text-[15px] leading-[1.75] text-muted-foreground">
          <p>
            En utleiekalkulator er en kalkulator for utleie av bolig: den samler
            alle tallene som avgjør om en utleiebolig lønner seg – kjøpesum,
            lån, rente, leieinntekter, felleskostnader, vedlikehold, ledighet og
            skatt – og regner ut hva som faktisk blir igjen til deg. I stedet
            for å synse om «god investering» får du kontantstrøm per måned etter
            skatt,{" "}
            <Link
              href="/guide/yield-utleiebolig"
              className="font-medium text-foreground underline decoration-cta decoration-2 underline-offset-4 hover:text-cta"
            >
              brutto og netto yield
            </Link>
            , cash-on-cash-avkastning og break-even, oppdatert live mens du
            justerer forutsetningene.
          </p>
          <h3 className="display-sm pt-3 text-lg text-foreground">
            Hvem er kalkulatoren for?
          </h3>
          <p>
            For deg som vurderer å{" "}
            <Link
              href="/guide/lonner-det-seg-a-kjope-utleiebolig"
              className="font-medium text-foreground underline decoration-cta decoration-2 underline-offset-4 hover:text-cta"
            >
              kjøpe bolig for utleie
            </Link>{" "}
            og vil regne på et konkret objekt før budrunden. For deg som skal{" "}
            <Link
              href="/guide/leie-ut-del-av-egen-bolig"
              className="font-medium text-foreground underline decoration-cta decoration-2 underline-offset-4 hover:text-cta"
            >
              leie ut hybel eller sokkelleilighet i egen bolig
            </Link>{" "}
            og lurer på hva det betyr for økonomien. Og for deg som allerede
            eier en sekundærbolig og vil stressteste hva en renteøkning eller{" "}
            <Link
              href="/guide/hva-kan-jeg-leie-ut-for"
              className="font-medium text-foreground underline decoration-cta decoration-2 underline-offset-4 hover:text-cta"
            >
              en annen leiepris
            </Link>{" "}
            gjør med regnestykket.
          </p>
          <h3 className="display-sm pt-3 text-lg text-foreground">
            Forutsetningene styrer du selv
          </h3>
          <p>
            Kalkulatoren starter med fornuftige standardverdier for det norske
            markedet –{" "}
            <Link
              href="/guide/skatt-pa-utleie-2026"
              className="font-medium text-foreground underline decoration-cta decoration-2 underline-offset-4 hover:text-cta"
            >
              22 % skatt på netto leieinntekt
            </Link>
            , rentefradrag,{" "}
            <Link
              href="/guide/dokumentavgift-og-omkostninger"
              className="font-medium text-foreground underline decoration-cta decoration-2 underline-offset-4 hover:text-cta"
            >
              dokumentavgift på 2,5 % for selveier
            </Link>{" "}
            og normal ledighet – men alt kan justeres under «Detaljert». Leier
            du ut skattefritt i egen bolig, setter du skattesatsen til null.
            Velger du andelsbolig, fjernes dokumentavgiften og fellesgjelden
            regnes inn i totalprisen.
          </p>
          <h3 className="display-sm pt-3 text-lg text-foreground">
            Gratis, uten konto – og tallene dine forblir dine
          </h3>
          <p>
            Utleiekalkulatoren er gratis å bruke, krever ingen registrering og
            lagrer ingenting: beregningen ligger i lenken, som du kan dele med
            medinvestor, partner eller banken. Vil du slippe å taste inn tallene
            selv, koster et klippekort med {KLIPP_PER_KJOP} FINN-importer{" "}
            {KLIPP_PRIS_NOK} kr.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Faq() {
  return (
    <Section aria-labelledby="faq" className="py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
        <SectionHeading id="faq" eyebrow="FAQ" title="Ofte stilte spørsmål" />
        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:border-foreground/20"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden
                  className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-lg leading-none text-muted-foreground transition-transform duration-200 group-open:rotate-45"
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
    </Section>
  );
}

function GuideTeasers() {
  return (
    <Section aria-labelledby="guider" className="py-16 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          id="guider"
          eyebrow="Lær mer"
          title="Guider om utleie og avkastning"
        />
        <Link
          href="/guide"
          className="text-sm font-medium underline decoration-cta decoration-2 underline-offset-4 hover:text-cta"
        >
          Alle {GUIDES.length} guider →
        </Link>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {FEATURED_GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guide/${guide.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/25"
          >
            <span className="eyebrow">{getCategory(guide.category).label}</span>
            <h3 className="display-sm mt-4 text-base leading-snug">
              {guide.title}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {guide.description}
            </p>
            <span className="mt-auto pt-5 text-sm font-medium text-cta">
              Les guiden{" "}
              <span className="inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </Section>
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

      <Hero />

      <div
        id="kalkulator"
        className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pb-8 sm:px-6"
      >
        <section aria-label="Kalkulator">
          <Calculator urlSync shareActions examplePresets />
        </section>
      </div>

      <HowItWorks />
      <FinnSection />
      <KeyFiguresExplained />
      <AboutCalculator />
      <Faq />
      <GuideTeasers />
    </>
  );
}
