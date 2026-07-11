import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("overtakelsesprotokoll");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Derfor avgjør protokollen depositumstvister</h2>
      <p>
        En signert <strong>overtakelsesprotokoll</strong> med daterte bilder
        er i praksis beviset som avgjør en depositumstvist. Uten den står
        påstand mot påstand om hvordan boligen så ut ved innflytting – og
        tvilen går gjerne ut over utleieren, som er den som burde ha sikret
        bevis. Med et depositum på tre måneders leie kan det stå
        40 000–50 000 kr på spill.
      </p>
      <p>
        Skal du kreve trekk, må du kunne dokumentere at skaden oppsto i
        leietiden og at den er mer enn{" "}
        <Link href="/guide/slitasje-eller-skade">normal slitasje</Link>.
        Ender saken i Husleietvistutvalget, er det dokumentasjonen som
        vinner – ikke den beste historien.
      </p>

      <h2>Dette dokumenterer du ved innflytting</h2>
      <ul>
        <li>
          Standen <strong>rom for rom</strong>: gulv, vegger og tak, med
          merknader for hvert rom.
        </li>
        <li>
          Hvitevarer og inventar, med en rask <strong>funksjonstest</strong>{" "}
          av komfyr, kjøleskap, vaskemaskin og ventilator.
        </li>
        <li>
          <strong>Målerstand</strong> for strøm, så strømoppgjøret blir
          riktig.
        </li>
        <li>
          Antall <strong>nøkler</strong> som overleveres.
        </li>
        <li>
          Eksisterende skader og mangler, presist beskrevet – «to riper på
          ca. 10 cm i parketten foran sofaen», ikke «noe slitasje».
        </li>
        <li>
          <strong>Daterte bilder eller video</strong> av alle rom:
          oversiktsbilder pluss nærbilder av hver skade. Det er slik
          dokumentasjon som holder i en tvist.
        </li>
      </ul>

      <h2>Ved utflytting: samme runde mot samme protokoll</h2>
      <p>
        Utflyttingen er en gjentakelse av innflyttingen: gå gjennom boligen
        punkt for punkt mot innflyttingsprotokollen, og dokumenter det som
        har endret seg. Avtal gjennomgangen når boligen er tømt og vasket –
        og la strømmen stå på, så hvitevarene kan funksjonstestes.
      </p>
      <table>
        <thead>
          <tr>
            <th>Ved innflytting</th>
            <th>Ved utflytting</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Stand rom for rom, med bilder</td>
            <td>Samme runde – noter og fotografer endringer</td>
          </tr>
          <tr>
            <td>Målerstand strøm</td>
            <td>Ny målerstand for sluttoppgjøret</td>
          </tr>
          <tr>
            <td>Antall nøkler overlevert</td>
            <td>Alle nøkler levert tilbake</td>
          </tr>
          <tr>
            <td>Eksisterende skader beskrevet</td>
            <td>Nye skader og mangler beskrevet</td>
          </tr>
          <tr>
            <td>Begge signerer</td>
            <td>Begge signerer – eventuelle trekk avtales skriftlig</td>
          </tr>
        </tbody>
      </table>
      <p>
        Blir dere enige om et trekk, skriv det inn i protokollen med beløp
        og hva det gjelder. Da unngår dere tvist om{" "}
        <Link href="/guide/depositum-regler-og-depositumskonto">
          utbetalingen av depositumet
        </Link>{" "}
        etterpå.
      </p>

      <h2>Ferdig sjekkliste</h2>
      <p>
        Bruk listen ved både innflytting og utflytting – den dekker
        punktene som oftest avgjør en tvist:
      </p>
      <ul>
        <li>Dato, adresse og begge parters navn og kontaktinformasjon</li>
        <li>Stand rom for rom: gulv, vegger, tak</li>
        <li>Hvitevarer og inventar med funksjonstest</li>
        <li>Målerstand strøm (og vann der det måles)</li>
        <li>Antall nøkler</li>
        <li>Eksisterende skader og mangler, presist beskrevet</li>
        <li>Daterte bilder eller video av alle rom og alle skader</li>
        <li>
          Ved utflytting: ny målerstand, nøkler tilbake, nye skader og
          eventuelt avtalt trekk
        </li>
        <li>Begge parters signatur – hver sin kopi</li>
      </ul>

      <h2>Praktisk: signer ved nøkkeloverleveringen</h2>
      <p>
        Gjør runden sammen med leietaker ved selve{" "}
        <strong>nøkkeloverleveringen</strong> – ikke dagen etter. Da er
        standen fersk og etterprøvbar, og begge kan påpeke ting der og da.
        Begge signerer, på papir eller digitalt, og hver beholder sin kopi.
        Et enkelt grep som styrker bevisverdien: send protokollen og alle
        bildene til leietaker på e-post samme dag. Da er dokumentasjonen
        delt og datert, og ingen kan senere hevde at bildene ble tatt på et
        annet tidspunkt. Protokollen bør ligge som vedlegg til{" "}
        <Link href="/guide/leiekontrakt-dette-ma-den-inneholde">
          leiekontrakten
        </Link>
        . Dette er generell informasjon, ikke juridisk rådgivning – se{" "}
        <a
          href="https://www.htu.no/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Husleietvistutvalget
        </a>{" "}
        for hvordan tvister faktisk vurderes.
      </p>

      <h2>Tjue minutter som beskytter regnestykket</h2>
      <p>
        En tapt depositumstvist er fort en månedsleie eller mer rett ut av
        årsresultatet. I utleiekalkulatoren ser du hvor mye én månedsleie
        utgjør av kontantstrømmen din – for mange utleieboliger er det
        forskjellen på et godt og et middels år. Protokollen koster tjue
        minutter og en runde med mobilkameraet, og er den billigste
        forsikringen i hele leieforholdet. Kalkulatoren er gratis og uten
        konto.
      </p>
    </ArticleLayout>
  );
}
