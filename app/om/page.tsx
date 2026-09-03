import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Om utleiekalkulatoren",
  description:
    "Hvem står bak utleie-kalkulator.no, hvordan beregningene gjøres, og hvilke forutsetninger kalkulatoren bygger på. Åpen metode, ingen skjulte antakelser.",
  alternates: { canonical: "/om" },
};

export default function OmPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-12 sm:px-6">
      <article className="article">
        <h1 className="display text-[clamp(2rem,5vw,2.75rem)]">
          Om utleie-kalkulator.no
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          En gratis, norsk utleiekalkulator med åpen metode – laget fordi
          beslutningen om å kjøpe utleiebolig fortjener et ordentlig
          regnestykke, ikke synsing.
        </p>

        <h2>Hva kalkulatoren gjør</h2>
        <p>
          Kalkulatoren beregner lønnsomheten til en utleiebolig ut fra tallene
          du legger inn: kjøpesum, finansiering, leieinntekter og kostnader.
          Du får etter skatt, brutto og netto{" "}
          <Link href="/guide/yield-utleiebolig">yield</Link>,
          cash-on-cash-avkastning, break-even-leie, break-even-rente,
          nedbetalingsplan og en flerårig prognose. Alt oppdateres umiddelbart
          når du endrer en forutsetning.
        </p>

        <h2>Forutsetningene er åpne</h2>
        <ul>
          <li>
            Skatt beregnes som kapitalinntekt med{" "}
            <Link href="/guide/skatt-pa-utleie-2026">
              22 % av netto leieinntekt
            </Link>
            , med fradrag for gjeldsrenter. Skattefri utleie? Sett satsen til
            0.
          </li>
          <li>
            <Link href="/guide/dokumentavgift-og-omkostninger">
              Dokumentavgift på 2,5 %
            </Link>{" "}
            legges automatisk til for selveierboliger; andelsboliger får
            fellesgjelden regnet inn i totalprisen.
          </li>
          <li>
            Lån beregnes som annuitets- eller serielån med valgfri
            avdragsfrihet, nominell rente og løpetid.
          </li>
          <li>
            Ledighet, vedlikehold, leievekst og verdistigning er eksplisitte
            felt du selv styrer – kalkulatoren gjetter ikke i det skjulte.
          </li>
        </ul>

        <h2>Hvem står bak</h2>
        <p>
          Merkevaren og nettstedet utleie-kalkulator.no eies og drives av{" "}
          <strong>{COMPANY.legalName}</strong>, et{" "}
          {COMPANY.legalForm.toLowerCase()} registrert i Enhetsregisteret.
        </p>
        <ul>
          <li>
            Organisasjonsnummer:{" "}
            <strong>{COMPANY.organizationNumberFormatted}</strong>
          </li>
          <li>
            Forretningsadresse: {COMPANY.street}, {COMPANY.postalCode}{" "}
            {COMPANY.city}, {COMPANY.country}
          </li>
          <li>
            Telefon:{" "}
            <a href={`tel:${COMPANY.phone}`}>{COMPANY.phoneFormatted}</a>{" "}
            (hverdager kl. 09–16)
          </li>
          <li>
            E-post: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </li>
        </ul>
        <p>
          Spørsmål, feil eller forslag? Alle henvendelser leses – se{" "}
          <Link href="/kontakt">kontaktsiden</Link> for hvordan du når oss.
        </p>

        <h2>Oppdateringer og kvalitet</h2>
        <p>
          Satser og regler (skattesats, dokumentavgift, utlånsforskriftens
          krav) gjennomgås når reglene endres, senest juli 2026. Guidene
          lenker til primærkilder som Skatteetaten, Lovdata og SSB, slik at du
          kan ettergå alt selv.
        </p>

        <h2>Ikke finansiell rådgivning</h2>
        <p>
          Kalkulatoren er et hjelpemiddel. Tallene er estimater basert på
          forutsetningene du selv legger inn, og erstatter ikke rådgivning
          tilpasset din situasjon. Se også{" "}
          <Link href="/vilkar">salgsvilkårene</Link> og{" "}
          <Link href="/personvern">personvernerklæringen</Link>.
        </p>
      </article>
    </div>
  );
}
