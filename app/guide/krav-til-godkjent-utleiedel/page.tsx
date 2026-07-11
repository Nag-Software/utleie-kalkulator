import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("krav-til-godkjent-utleiedel");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Kravet: rommene må være godkjent for varig opphold</h2>
      <p>
        Rom som leies ut til beboelse, må være godkjent som{" "}
        <strong>rom for varig opphold</strong> – det byggereglene kaller{" "}
        <strong>hoveddel</strong> av boligen. Godkjenningen følger av
        byggesaken hos kommunen, ikke av hvordan rommet ser ut: en kjellerbod
        med laminat, seng og TV er fortsatt en bod i kommunens arkiv, og å
        leie den ut som hybel er ulovlig. Er du i tvil, sjekk de godkjente
        tegningene i kommunens byggesaksarkiv før du annonserer.
      </p>

      <h2>De tekniske kravene til utleierom</h2>
      <p>
        For boliger med byggesøknad før 1. juli 2011 gjelder{" "}
        <strong>forenklede krav</strong> (innført i 2016) når rom skal
        godkjennes som hoveddel. Hovedpunktene:
      </p>
      <table>
        <thead>
          <tr>
            <th>Krav</th>
            <th>Forenklet regel for eldre boliger</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Takhøyde</td>
            <td>Minst 2,0 m</td>
          </tr>
          <tr>
            <td>Rømningsvei</td>
            <td>
              Vindu med samlet bredde og høyde på minst 1,5 m – minst 0,5 m
              bredt og minst 0,6 m høyt
            </td>
          </tr>
          <tr>
            <td>Dagslys</td>
            <td>Tilstrekkelig dagslys i oppholdsrommene</td>
          </tr>
          <tr>
            <td>Ventilasjon</td>
            <td>Tilfredsstillende ventilasjon, for eksempel vindu og ventiler</td>
          </tr>
          <tr>
            <td>Radon</td>
            <td>Tiltaksgrense på 100 Bq/m³ – mål før du leier ut</td>
          </tr>
        </tbody>
      </table>
      <p>
        Radonmåling og brannkravene ved utleie er dekket i guiden om{" "}
        <Link href="/guide/brannsikkerhet-og-radon">
          brannsikkerhet og radon
        </Link>
        . For nyere boliger gjelder byggteknisk forskrift fullt ut, med
        strengere krav. Dette er generell informasjon, ikke juridisk
        rådgivning – Direktoratet for byggkvalitet (
        <a
          href="https://www.dibk.no/"
          rel="noopener noreferrer"
          target="_blank"
        >
          dibk.no
        </a>
        ) har de fullstendige kravene.
      </p>

      <h2>Hybel i egen boenhet – eller egen utleieenhet?</h2>
      <p>
        Skillet avgjør hvor mye papirarbeid som kreves. Leier du ut{" "}
        <strong>rom i din egen boenhet</strong> – en hybel eller sokkel som
        hører til samme boenhet som resten av huset – trenger du ingen egen
        søknad, så lenge rommene er godkjent som hoveddel. Skal du derimot
        etablere en <strong>egen boenhet</strong> – sekundærleilighet med
        egen inngang og alle funksjoner som bad, kjøkken og oppholdsrom – er
        det søknadspliktig, med strengere krav til blant annet brannskille og
        lyd. Er rommene i dag godkjent som tilleggsdel – bod eller uinnredet
        kjeller – må du uansett søke kommunen om bruksendring før utleie; for
        eldre boliger kan du som boligeier søke selv, uten ansvarlige
        foretak. Prosessen, kostnadene og regnestykket er tema i guiden om{" "}
        <Link href="/guide/bruksendring-kjeller-til-utleiedel">
          bruksendring fra kjeller til utleiedel
        </Link>
        .
      </p>

      <h2>Dette risikerer du ved ulovlig utleie</h2>
      <p>
        Ulovlig utleie er ikke bare et formelt problem – det treffer
        økonomien, forsikringen og ansvaret ditt direkte:
      </p>
      <ul>
        <li>
          <strong>Pålegg fra kommunen:</strong> bruken må opphøre, og du kan
          bli pålagt å rette forholdet.
        </li>
        <li>
          <strong>Krav fra leietaker:</strong> et rom som ikke lovlig kan
          bebos, er en mangel – leietaker kan kreve leieavslag og i alvorlige
          tilfeller heve avtalen.
        </li>
        <li>
          <strong>Forsikring:</strong> ved brann i et ulovlig beboelsesrom
          risikerer du trøbbel med oppgjøret – og et tungt ansvar hvis noen
          bor bak et vindu det ikke går an å rømme ut av.
        </li>
        <li>
          <strong>Villedende markedsføring:</strong> å skrive «godkjent
          utleiedel» i annonsen uten å ha dekning for det, kan gi kjøper
          eller leietaker krav mot deg.
        </li>
      </ul>

      <h2>Koblingen til skattefri utleie</h2>
      <p>
        En lovlig hybel i egen bolig er også inngangen til Norges gunstigste
        utleieskatt: leier du ut mindre enn halvparten av boligen målt etter
        utleieverdi, er leieinntekten skattefri etter{" "}
        <Link href="/guide/leie-ut-del-av-egen-bolig">
          halvparten-regelen for utleie i egen bolig
        </Link>
        . Leier du ut mer enn halvparten, er inntekten normalt skattepliktig
        fra første krone hvis samlet leie overstiger 20 000 kr i året.
        Byggesak og skatt er to ulike regelsett – skattefritaket avhenger av
        utleieverdien, ikke av byggesaken – men begge må være på plass for at
        hybelen skal være en trygg og varig inntekt.
      </p>

      <h2>Regn på hva en godkjent utleiedel er verdt</h2>
      <p>
        En godkjent hybel gir leieinntekt du kan dokumentere overfor banken
        og fremtidige kjøpere. Legg månedsleien inn i utleiekalkulatoren –
        gratis og uten konto – og se effekten på kontantstrømmen; ved
        skattefri utleie setter du skattesatsen til null. Da ser du også hva
        en oppgradering som får rommene godkjent, faktisk er verdt per måned
        – ofte er det den mest lønnsomme oppussingen du kan gjøre.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://www.dibk.no/bygge-eller-endre/bruksendring-i-eldre-boliger"
            rel="noopener noreferrer"
            target="_blank"
          >
            Direktoratet for byggkvalitet: bruksendring i eldre boliger
          </a>
        </li>
        <li>
          <a
            href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lovdata: husleieloven
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
