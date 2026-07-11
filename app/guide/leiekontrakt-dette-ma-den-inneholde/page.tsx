import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("leiekontrakt-dette-ma-den-inneholde");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Må leiekontrakten være skriftlig?</h2>
      <p>
        En muntlig leieavtale er gyldig etter husleieloven, men nesten
        verdiløs den dagen dere blir uenige: uten skriftlig kontrakt har du
        ikke bevis for hva som ble avtalt om leie, depositum og oppsigelse.
        Begge parter kan kreve at avtalen settes opp skriftlig, og som
        utleier bør du aldri levere ut nøkler før kontrakten er signert. Det
        beste utgangspunktet er{" "}
        <a
          href="https://www.forbrukerradet.no/kontrakter/hus/husleiekontrakt-bokmal/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Forbrukerrådets kontraktsmal
        </a>{" "}
        – gratis, balansert og oppdatert på lovens krav – som du tilpasser
        din bolig.
      </p>

      <h2>Dette bør kontrakten regulere</h2>
      <ul>
        <li>
          <strong>Partene og husrommet:</strong> fullt navn på utleier og
          alle leietakere, adressen, hvilke rom som leies og hva som følger
          med – møbler, hvitevarer, bod, parkering.
        </li>
        <li>
          <strong>Leiesum og betalingsdato:</strong> beløp, forfallsdato og
          kontonummer. Forskuddsleie kan maksimalt avtales for én måned.
        </li>
        <li>
          <strong>Depositum:</strong> beløpet, og at pengene settes på egen
          depositumskonto i leietakers navn – se{" "}
          <Link href="/guide/depositum-regler-og-depositumskonto">
            reglene for depositum og depositumskonto
          </Link>
          .
        </li>
        <li>
          <strong>Varighet og kontraktstype:</strong> en tidsbestemt
          kontrakt må som hovedregel vare i minst tre år; ett år er nok for
          sokkel- eller loftsbolig i enebolig, eller del av tomannsbolig,
          der du selv bor i huset. En tidsubestemt kontrakt løper til den
          sies opp – se{" "}
          <Link href="/guide/oppsigelse-av-leieforhold">
            frister og formkrav ved oppsigelse
          </Link>
          .
        </li>
        <li>
          <strong>Utkastelsesklausul:</strong> setningen der leietaker
          vedtar at utkastelse kan kreves uten søksmål hvis leien ikke blir
          betalt. Klausulen gir rask fravikelse via namsmannen ved
          betalingsmislighold og er standard i seriøse maler.
        </li>
        <li>
          <strong>Vedlikeholdsfordeling:</strong> hvem som tar hva. Er
          kontrakten taus, gjelder lovens standard: leietaker vedlikeholder
          dørlåser, kraner, vannklosett, elektriske kontakter og brytere og
          inventar som ikke er en del av den faste eiendommen – resten er
          ditt ansvar.
        </li>
        <li>
          <strong>Husordensregler:</strong> ro, røyking, bruk av
          fellesarealer og søppelhåndtering – legg reglene ved som bilag.
        </li>
        <li>
          <strong>Dyrehold:</strong> skriv hva som gjelder, men vit at et
          generelt forbud ikke står seg hvis leietaker har gode grunner for
          dyrehold og dyret ikke er til ulempe for eiendommen eller de andre
          beboerne.
        </li>
        <li>
          <strong>Antall beboere:</strong> hvem og hvor mange som skal bo i
          boligen.
        </li>
        <li>
          <strong>Strøm og internett:</strong> hvem som tegner abonnement og
          betaler. Leie med strøm inkludert er en risiko du i så fall bør
          prise inn.
        </li>
      </ul>
      <p>
        To bilag hører med: husordensreglene og en{" "}
        <Link href="/guide/overtakelsesprotokoll">
          overtakelsesprotokoll
        </Link>{" "}
        som dokumenterer boligens stand med bilder ved innflytting.
      </p>

      <h2>Tabbene som koster utleiere dyrt</h2>
      <table>
        <thead>
          <tr>
            <th>Tabbe</th>
            <th>Hvorfor det koster</th>
            <th>Gjør heller</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ta «litt av leien utenom» kontrakten</td>
            <td>
              Ved skattepliktig utleie er udeklarert leie skatteunndragelse,
              og beløpet kan verken dokumenteres eller kreves inn ved
              konflikt
            </td>
            <td>Hele leien i kontrakten, betalt til konto</td>
          </tr>
          <tr>
            <td>Ingen klausul om leieregulering</td>
            <td>
              KPI-justeringen blir glemt i årevis, og leie du ikke har
              varslet, kan ikke kreves i etterkant
            </td>
            <td>
              Tidfest årlig KPI-justering – se{" "}
              <Link href="/guide/husleieokning-slik-gjor-du-det">
                fremgangsmåten for husleieøkning
              </Link>
            </td>
          </tr>
          <tr>
            <td>Glemt utkastelsesklausul</td>
            <td>
              Ved ubetalt leie må du gå veien om søksmål før namsmannen kan
              kaste ut – fort flere måneder ekstra uten leieinntekt
            </td>
            <td>Bruk standardklausulen i Forbrukerrådets mal</td>
          </tr>
        </tbody>
      </table>
      <p>
        Et eksempel på hva den siste tabben kan koste: må kravet innom
        søksmål og prosessen tar tre måneder lenger, er 45 000 kr tapt med
        en leie på 15 000 kr i måneden – i tillegg kommer gebyrer og eget
        tidsbruk. Dette er generell informasjon, ikke juridisk rådgivning –
        hele husleieloven ligger på{" "}
        <a
          href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
          rel="noopener noreferrer"
          target="_blank"
        >
          Lovdata
        </a>
        .
      </p>

      <h2>Kontrakten setter tallene i regnestykket</h2>
      <p>
        Leie, depositum, regulering og vedlikeholdsfordeling er ikke bare
        jus – det er postene som avgjør kontantstrømmen din. Legg tallene
        fra kontraktsutkastet inn i utleiekalkulatoren og se hva de betyr i
        praksis: hva én måned uten leie gjør med årsresultatet, og hvor mye
        en leiejustering du faktisk gjennomfører hvert år, løfter inntekten
        over en femårsperiode.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://www.forbrukerradet.no/kontrakter/hus/husleiekontrakt-bokmal/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Forbrukerrådet: gratis husleiekontrakt
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
        <li>
          <a
            href="https://www.htu.no/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Husleietvistutvalget: tvisteløsning for leieforhold
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
