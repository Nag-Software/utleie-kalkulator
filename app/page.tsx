import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { UploadProspectus } from "@/components/analyse/upload-prospectus";
import { Calculator } from "@/components/calculator/calculator";
import { EXAMPLE_PRESETS } from "@/components/calculator/presets";
import { Section, SectionHeading } from "@/components/site/primitives";
import { calculate } from "@/lib/calc/engine";
import { FAQ_ITEMS } from "@/lib/faq";
import { formatNumber, formatPct } from "@/lib/format";
import { getCategory, GUIDES } from "@/lib/guides";
import {
  faqJsonLd,
  jsonLdString,
  webApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const FEATURED_GUIDES = GUIDES.slice(0, 3);

/**
 * Midlertidig hotlenket fra Unsplash for lokal gjennomgang. Før lansering
 * skal bildet ligge i public/ og gå gjennom next/image.
 */
const HERO_PHOTO =
  "https://images.unsplash.com/photo-1783378357622-dbd9ad3b9c0f?auto=format&fit=crop&w=2400&q=80";

/** SSB tabell 09895, gjennomsnittlig månedlig leie 2025. */
const SSB_RENT_2ROOM = [
  { market: "Oslo og Bærum", rent: 15_260 },
  { market: "Bergen", rent: 11_870 },
  { market: "Trondheim", rent: 11_850 },
  { market: "Stavanger", rent: 11_400 },
  { market: "Hele landet", rent: 11_790 },
];
const kr = (value: number) => `${formatNumber(Math.round(value))} kr`;
const signedKr = (value: number) =>
  `${value < 0 ? "−" : "+"}${formatNumber(Math.abs(Math.round(value)))} kr`;

/**
 * Eksempelet i heroen og KI-seksjonen er ikke pyntetall: det er
 * forhåndsvalget «3-roms, 40 % egenkapital» kjørt gjennom den samme motoren
 * som kalkulatoren bruker, så tallene kan etterprøves med ett klikk.
 */
function buildExample() {
  const input = EXAMPLE_PRESETS[0].input;
  const result = calculate(input);
  const horizon = result.years[input.horizonYears - 1];
  return {
    input,
    result,
    equityPct: Math.round((input.equity / input.purchasePrice) * 100),
    totalReturn: horizon?.totalReturn ?? 0,
  };
}

const mill = (value: number) =>
  `${(value / 1_000_000).toLocaleString("nb-NO", { maximumFractionDigits: 2 })} mill`;

function Hero({ example }: { example: ReturnType<typeof buildExample> }) {
  const { input, result, equityPct, totalReturn } = example;
  const rows = [
    { label: "Månedsleie", value: kr(input.monthlyRent) },
    { label: "Egenkapital", value: `${equityPct} %` },
    {
      label: "Tåler rente opp til",
      value: result.breakEvenRatePct ? formatPct(result.breakEvenRatePct) : "–",
    },
    {
      label: `Avkastning på ${input.horizonYears} år`,
      value: `+${mill(totalReturn)}`,
    },
  ];
  return (
    <section className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative isolate mx-auto max-w-[1400px] overflow-hidden rounded-[28px] text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_PHOTO}
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover object-bottom"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(14,32,42,0.62)_0%,rgba(14,32,42,0.2)_48%,rgba(8,12,16,0.6)_100%)]"
        />

        <div className="mx-auto grid max-w-6xl grid-cols-1 lg:min-h-[720px] lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex min-w-0 flex-col px-6 pb-10 pt-12 sm:px-10 sm:pt-16 lg:pb-14 lg:pr-12">
            {/* H1 bærer hovedsøkeordet først, deretter spørsmålet som selger. */}
            <h1>
              <span className="block text-sm font-medium text-white/75">
                Utleiekalkulator
              </span>
              <span className="display mt-4 block max-w-[11ch] text-[clamp(2.75rem,8vw,6.25rem)] !leading-[0.94] !tracking-[-0.05em]">
                Lønner boligen seg som utleie?
              </span>
            </h1>

            <div className="mt-auto pt-12">
              <UploadProspectus variant="hero" />
              <div className="mt-3 flex flex-wrap gap-2 text-[13px]">
                {["Tilstandsrapport", "Vedtekter", "Årsregnskap"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-md"
                  >
                    {tag}
                  </span>
                ))}
                <a
                  href="#kalkulator"
                  className="rounded-full px-3 py-1 font-medium underline decoration-white/50 underline-offset-4"
                >
                  eller regn selv, gratis
                </a>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col border-t border-white/20 px-6 pb-8 pt-8 sm:px-10 lg:border-l lg:border-t-0 lg:px-8 lg:pb-10 lg:pt-16">
            <div className="mt-auto rounded-3xl bg-[rgba(12,16,20,0.62)] p-5 backdrop-blur-xl">
              <p className="text-xs text-white/60">
                Regneeksempel · 3-roms til {mill(input.purchasePrice)}
              </p>
              <p
                className={`display mt-3 text-[2.5rem] tabular-nums ${
                  result.monthlyCashflowAfterTax < 0
                    ? "text-[#ff8a66]"
                    : "text-[#7ee2a8]"
                }`}
              >
                {signedKr(result.monthlyCashflowAfterTax)}
              </p>
              <p className="text-xs text-white/60">
                per måned etter skatt
              </p>
              <dl className="mt-4 divide-y divide-white/10 border-t border-white/10 text-[13px]">
                {rows.map((row) => (
                  <div key={row.label} className="flex justify-between py-2.5">
                    <dt className="text-white/60">{row.label}</dt>
                    <dd className="font-medium tabular-nums">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[11px] leading-snug text-white/45">
                {formatPct(input.interestRate)} rente, avdragsfritt i{" "}
                {input.interestOnlyYears} år, {formatPct(input.valueGrowth)}{" "}
                årlig verdistigning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Ekte markedstall rett under heroen, i stedet for logoer eller slagord. */
function RentStrip() {
  return (
    <section
      aria-label="Snittleie for 2-roms, SSB 2025"
      className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6"
    >
      <dl className="grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <dt className="text-[13px] font-medium">Snittleie 2-roms</dt>
          <dd className="text-[13px] text-muted-foreground">SSB, 2025</dd>
        </div>
        {SSB_RENT_2ROOM.map((item) => (
          <div key={item.market} className="lg:border-l lg:border-border lg:pl-5">
            <dd className="display-sm text-xl tabular-nums">{kr(item.rent)}</dd>
            <dt className="mt-0.5 text-[13px] text-muted-foreground">
              {item.market}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

const AI_POINTS = [
  "Tallene fylles ut fra salgsoppgaven",
  "Fellene finner vi, med sidetall",
  "Du får svaret: kjøp, forhandle eller la være",
];

const AI_SAMPLE_FINDINGS = [
  { tone: "bg-warning", text: "Bad fra 2004, TG2", page: 34 },
  { tone: "bg-positive", text: "Ingen varslede økninger i felleskostnader", page: 51 },
  { tone: "bg-positive", text: "Utleie tillatt uten styrevedtak", page: 63 },
];

function AiSection({ example }: { example: ReturnType<typeof buildExample> }) {
  const { input, result, totalReturn } = example;
  return (
    <Section aria-labelledby="ki-analyse" className="py-16 sm:py-24">
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="surface-dark flex flex-col rounded-3xl p-6 sm:p-10">
          <p className="text-[13px] text-muted-foreground">KI-analyse</p>
          <h2
            id="ki-analyse"
            className="display mt-2 max-w-md text-[clamp(1.75rem,4vw,3rem)]"
          >
            Se hva boligen tjener deg, før du byr
          </h2>
          <ul className="mt-8 space-y-3 text-[15px]">
            {AI_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/12">
                  <Check className="size-3" aria-hidden />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-5 pt-12">
            <p>
              <span className="display text-5xl tabular-nums">49 kr</span>
              <span className="ml-2 text-sm text-muted-foreground">
                per bolig
              </span>
            </p>
            <div className="text-right">
              <UploadProspectus variant="button" />
              <p className="mt-2 text-xs text-muted-foreground">
                Betal med Vipps ·{" "}
                <Link href="/analyse/eksempel" className="underline underline-offset-2">
                  se eksempelrapport
                </Link>
              </p>
            </div>
          </div>
        </div>

        <figure className="flex flex-col rounded-3xl border border-border bg-card p-6 sm:p-8">
          <figcaption className="flex items-center justify-between text-[13px]">
            <span className="font-medium">3-roms til {mill(input.purchasePrice)}</span>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
              Eksempel
            </span>
          </figcaption>
          <p className="display mt-6 text-5xl tabular-nums text-positive">
            {signedKr(result.monthlyCashflowAfterTax)}
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            per måned etter skatt
          </p>
          <ul className="mt-6 divide-y divide-border border-y border-border text-sm">
            {AI_SAMPLE_FINDINGS.map((finding) => (
              <li key={finding.text} className="flex items-center gap-2.5 py-3">
                <span
                  aria-hidden
                  className={`size-1.5 shrink-0 rounded-full ${finding.tone}`}
                />
                <span className="min-w-0 flex-1">{finding.text}</span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  s. {finding.page}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-auto flex items-baseline justify-between pt-6">
            <dt className="text-sm text-muted-foreground">
              Avkastning på {input.horizonYears} år
            </dt>
            <dd className="display-sm text-2xl tabular-nums">
              +{mill(totalReturn)}
            </dd>
          </dl>
        </figure>
      </div>
    </Section>
  );
}

function Pricing() {
  const options = [
    { name: "Én analyse", price: "49 kr", note: "per bolig" },
    { name: "Fem analyser", price: "149 kr", note: "29,80 kr per bolig, gyldig i 12 måneder" },
  ];
  return (
    <Section aria-labelledby="pris" className="py-16 sm:py-24">
      <div className="surface-dark grid gap-10 rounded-3xl p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
        <div>
          <p className="text-[13px] text-muted-foreground">Pris</p>
          <h2 id="pris" className="display mt-2 text-[clamp(1.75rem,4vw,3rem)]">
            Betal per bolig, ikke per måned
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            Kalkulatoren er gratis og uten konto. KI-analysen betaler du for
            når du har en konkret bolig å vurdere, med Vipps.
          </p>
        </div>
        <ul className="divide-y divide-border border-y border-border self-center">
          <li className="flex items-baseline justify-between gap-4 py-5">
            <div>
              <p className="text-[15px] font-medium">Kalkulator</p>
              <p className="text-[13px] text-muted-foreground">
                Kontantstrøm, yield og break-even
              </p>
            </div>
            <p className="display text-3xl tabular-nums">0 kr</p>
          </li>
          {options.map((option) => (
            <li
              key={option.name}
              className="flex items-baseline justify-between gap-4 py-5"
            >
              <div>
                <p className="text-[15px] font-medium">{option.name}</p>
                <p className="text-[13px] text-muted-foreground">
                  {option.note}
                </p>
              </div>
              <p className="display text-3xl tabular-nums">{option.price}</p>
            </li>
          ))}
        </ul>
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
    <Section aria-labelledby="nokkeltall" className="py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
        <SectionHeading
          id="nokkeltall"
          eyebrow="Nøkkeltall"
          title="Tallene som avgjør om utleie lønner seg"
        />
        <dl className="grid gap-x-10 sm:grid-cols-2">
          {figures.map((figure) => (
            <div key={figure.term} className="border-t border-border py-5">
              <dt className="text-[15px] font-medium tracking-[-0.01em]">
                {figure.term}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {figure.text}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

function AboutCalculator() {
  return (
    <Section aria-labelledby="om-utleiekalkulator" className="py-14 sm:py-20">
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
            og normal ledighet – men hver eneste forutsetning ligger åpen og
            kan justeres. Leier du ut skattefritt i egen bolig, setter du
            skattesatsen til null.
            Velger du andelsbolig, fjernes dokumentavgiften og fellesgjelden
            regnes inn i totalprisen.
          </p>
          <h3 className="display-sm pt-3 text-lg text-foreground">
            Gratis, uten konto – og tallene dine forblir dine
          </h3>
          <p>
            Utleiekalkulatoren er gratis å bruke, krever ingen registrering og
            lagrer ingenting: beregningen ligger i lenken, som du kan dele med
            medinvestor, partner eller banken.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Faq() {
  return (
    <Section aria-labelledby="faq" className="py-14 sm:py-20">
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
    <Section aria-labelledby="guider" className="py-14 sm:py-20">
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
  const example = buildExample();
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

      <Hero example={example} />
      <RentStrip />
      <AiSection example={example} />

      <Section
        id="kalkulator"
        aria-labelledby="kalkulator-tittel"
        className="scroll-mt-20 py-16 sm:py-24"
      >
        <h2
          id="kalkulator-tittel"
          className="display text-[clamp(1.625rem,3.6vw,2.5rem)]"
        >
          Regn ut selv, gratis
        </h2>
        <div className="mt-10">
          <Calculator
            startInput={example.input}
            urlSync
            shareActions
            examplePresets
          />
        </div>
      </Section>

      <Pricing />
      <KeyFiguresExplained />
      <AboutCalculator />
      <Faq />
      <GuideTeasers />
    </>
  );
}
