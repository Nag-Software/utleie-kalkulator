import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("brannsikkerhet-og-radon");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Dette er minimumspliktene dine</h2>
      <p>
        Som utleier har du to sett plikter folk oftest overser:{" "}
        <strong>brannsikkerhet</strong> og <strong>radon</strong>. Kort
        oppsummert skal boligen ha røykvarslere som høres på soverommet og
        manuelt slokkeutstyr som virker, rømningsveiene skal være frie – og
        radonnivået i utleiebolig skal være under <strong>200 Bq/m³</strong>,
        med krav om tiltak allerede over <strong>100 Bq/m³</strong>. Begge
        deler er billige å oppfylle målt mot det de beskytter: liv,
        forsikringsdekning og et lovlig leieforhold.
      </p>

      <h2>Brann: røykvarslere, slokkeutstyr og rømningsvei</h2>
      <p>
        Etter forskrift om brannforebygging skal eier sørge for minst én{" "}
        <strong>røykvarsler per etasje</strong>, plassert slik at den høres
        tydelig på soverom selv med lukket dør. Seriekoblede varslere – går
        én, går alle – er ikke påbudt, men anbefales og koster lite ekstra. I
        tillegg skal boligen ha <strong>manuelt slokkeutstyr</strong>:
        husbrannslange eller godkjent slokkeapparat. Har boligen ildsted,
        kommer feiing og tilsyn med fyringsanlegget i tillegg – det følger
        eierrollen, og kommunen varsler når det skal gjennomføres.
        Rømningsveiene må holdes frie for lagring og møbler; kravene til
        rømningsvindu i kjeller og på loft er beskrevet i guiden om{" "}
        <Link href="/guide/krav-til-godkjent-utleiedel">
          krav til godkjent utleiedel
        </Link>
        .
      </p>

      <h2>Hvem har ansvaret – du eller leietaker?</h2>
      <p>Ansvaret er delt, og delingen er verdt å kjenne:</p>
      <table>
        <thead>
          <tr>
            <th>Oppgave</th>
            <th>Ansvar</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Røykvarslere og slokkeutstyr finnes og virker ved innflytting</td>
            <td>Eier</td>
          </tr>
          <tr>
            <td>Teste varslerne jevnlig og bytte batteri</td>
            <td>Leietaker</td>
          </tr>
          <tr>
            <td>Melde fra om feil og mangler på utstyret</td>
            <td>Leietaker</td>
          </tr>
          <tr>
            <td>Utbedre meldte feil og skifte ut utstyr</td>
            <td>Eier</td>
          </tr>
        </tbody>
      </table>
      <p>
        Skriv ansvarsfordelingen inn i{" "}
        <Link href="/guide/leiekontrakt-dette-ma-den-inneholde">
          leiekontrakten
        </Link>
        , og dokumentér ved innflytting at utstyret var på plass og testet –
        for eksempel som et punkt i{" "}
        <Link href="/guide/overtakelsesprotokoll">
          overtakelsesprotokollen
        </Link>
        . Det er ditt bevis hvis noe skulle skje. Gjør samme gjennomgang ved
        hvert leietakerbytte: test varslerne, sjekk trykket eller datostempelet
        på slokkeapparatet, og noter det.
      </p>

      <h2>Radon: grenseverdier og måling</h2>
      <p>
        Strålevernforskriften stiller egne krav til <strong>utleie</strong>:
        radonnivået skal være under maksgrensen på <strong>200 Bq/m³</strong>,
        og du plikter å gjøre tiltak når nivået overstiger tiltaksgrensen på{" "}
        <strong>100 Bq/m³</strong>. Radon er en usynlig og luktfri gass fra
        grunnen, og kjellerleiligheter er mest utsatt. Du måler med{" "}
        <strong>sporfilm</strong> i minst to måneder i vinterhalvåret – det
        koster noen hundrelapper per etasje. Mål i rommene leietaker faktisk
        oppholder seg i, typisk stue og soverom i laveste etasje. Naboens
        måling hjelper deg ikke: radonnivået varierer fra hus til hus, selv i
        samme gate. Ligger nivået for høyt, spenner tiltakene fra tetting av
        sprekker mot grunnen og bedre ventilasjon til{" "}
        <strong>radonbrønn</strong> under huset – og etterpå måler du på nytt
        for å dokumentere at tiltaket virket. Dette er generell
        informasjon, ikke juridisk rådgivning; Direktoratet for strålevern og
        atomsikkerhet har de fullstendige kravene til radon i utleieboliger.
      </p>

      <h2>Hva koster det å oppfylle pliktene?</h2>
      <table>
        <thead>
          <tr>
            <th>Tiltak</th>
            <th>Typisk kostnad</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sporfilm for radonmåling</td>
            <td>Noen hundrelapper per etasje</td>
          </tr>
          <tr>
            <td>Røykvarslere</td>
            <td>Et par hundrelapper per stykk, noe mer for seriekoblede</td>
          </tr>
          <tr>
            <td>Slokkeapparat eller husbrannslange</td>
            <td>500–1 000 kr</td>
          </tr>
          <tr>
            <td>Radontiltak ved for høye nivåer</td>
            <td>
              Fra noen tusenlapper (tetting, ventilering) til flere titusener
              (radonbrønn)
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Ved skattepliktig utleie er dette driftskostnader du kan trekke fra i
        leieinntekten – se hele listen i guiden om{" "}
        <Link href="/guide/fradrag-ved-utleie">fradrag ved utleie</Link>.
      </p>

      <h2>Små beløp i det store regnestykket</h2>
      <p>
        Noen hundrelapper i sporfilm og et par tusen i brannutstyr velter
        ingen investering – men et radontiltak til flere titusener kan flytte
        regnestykket. Legg kostnadene inn under drift og vedlikehold i
        utleiekalkulatoren, så ser du hva de betyr for kontantstrømmen etter
        skatt. Kalkulatoren er gratis og krever ingen konto.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://www.dsb.no"
            rel="noopener noreferrer"
            target="_blank"
          >
            Direktoratet for samfunnssikkerhet og beredskap (DSB)
          </a>
        </li>
        <li>
          <a href="https://dsa.no" rel="noopener noreferrer" target="_blank">
            Direktoratet for strålevern og atomsikkerhet (DSA)
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
