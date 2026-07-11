import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("nar-leietaker-ikke-betaler");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Fire steg i riktig rekkefølge</h2>
      <p>
        Når leien uteblir, går løypa slik: purring og dialog med én gang,
        deretter skriftlig varsel etter{" "}
        <strong>tvangsfullbyrdelsesloven § 4-18</strong> med 14 dagers
        betalingsfrist, så begjæring om <strong>fravikelse</strong>{" "}
        (utkastelse) til namsmannen, og til slutt gjennomføring. Rekkefølgen
        er ikke valgfri – hopper du over et steg, må du starte på nytt og
        taper både tid og leie.
      </p>
      <ol>
        <li>
          <strong>Purring og dialog – samme uke.</strong> Betalingsproblemer
          er ofte midlertidige, og en skriftlig nedbetalingsavtale kan være
          langt billigere enn måneder med utkastelsesprosess og tomgang. Vær
          samtidig tydelig på at leien skal betales, og la ikke restansen
          vokse i stillhet.
        </li>
        <li>
          <strong>Skriftlig varsel etter § 4-18.</strong> Varselet kan sendes
          så snart leien er misligholdt. Det skal gi en betalingsfrist på 14
          dager og opplyse om at fravikelse vil bli begjært hvis det ikke
          betales innen fristen. Gjør leietaker opp, stopper saken der.
        </li>
        <li>
          <strong>Begjæring om fravikelse til namsmannen.</strong> Etter
          fristen kan du sende begjæring. Det forutsetter at kontrakten har
          en <strong>utkastelsesklausul</strong> – en standardklausul der
          leietaker vedtar tvangsfravikelse ved betalingsmislighold. Mangler
          klausulen, må du først via domstolene, og prosessen blir vesentlig
          lengre. Klausulen er ett av punktene i guiden om{" "}
          <Link href="/guide/leiekontrakt-dette-ma-den-inneholde">
            hva leiekontrakten må inneholde
          </Link>
          .
        </li>
        <li>
          <strong>Gjennomføring.</strong> Namsmannen varsler leietaker og
          fastsetter tidspunkt for utkastelsen. Betaler leietaker alt skyldig
          underveis, stanses saken som hovedregel – målet er oppgjør, ikke
          utkastelse.
        </li>
      </ol>

      <h2>Hvor lang tid tar det – og hva koster det?</h2>
      <p>
        Regn med <strong>flere måneder</strong> fra første misligholdte leie
        til boligen eventuelt er tilbake. En typisk tidslinje:
      </p>
      <table>
        <thead>
          <tr>
            <th>Fase</th>
            <th>Typisk tid</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Purring og dialog</td>
            <td>1–4 uker</td>
          </tr>
          <tr>
            <td>§ 4-18-varsel med betalingsfrist</td>
            <td>14 dager</td>
          </tr>
          <tr>
            <td>Namsmannens behandling av begjæringen</td>
            <td>1–3 måneder</td>
          </tr>
          <tr>
            <td>Berammelse og gjennomføring</td>
            <td>2–6 uker</td>
          </tr>
          <tr>
            <td>Totalt</td>
            <td>Ofte 3–6 måneder</td>
          </tr>
        </tbody>
      </table>
      <p>
        De direkte kostnadene er rettsgebyrer på noen tusenlapper for
        begjæringen. Det store tapet er leien: med 15 000 kr i månedsleie og
        fire måneder fra mislighold til ny leietaker er på plass, taper du{" "}
        <strong>60 000 kr</strong> i leie – pluss gebyrer og klargjøring av
        boligen. Rask reaksjon i steg 1 og 2 er derfor det viktigste
        kostnadstiltaket du har.
      </p>

      <h2>Depositumet og forsikringen tar støyten</h2>
      <p>
        Depositumet er førstelinjeforsvaret: skyldig leie kan kreves dekket
        fra depositumskontoen, og med et vanlig depositum på tre måneders
        leie er en stor del av tapet i eksempelet over dekket. Reglene for
        konto og utbetaling står i guiden om{" "}
        <Link href="/guide/depositum-regler-og-depositumskonto">
          depositum og depositumskonto
        </Link>
        .
      </p>
      <p>
        En <strong>utleieforsikring</strong> dekker typisk husleietap i
        flere måneder, skadeverk og kostnadene ved prosessen – og mange
        selskaper overtar selve håndteringen av utkastelsessaken. Om premien
        er verdt det for deg, går vi gjennom i guiden om{" "}
        <Link href="/guide/utleieforsikring-verdt-det">utleieforsikring</Link>
        .
      </p>

      <h2>Aldri selvtekt – uansett hvor opplagt saken er</h2>
      <p>
        Å bytte lås, bære ut eiendeler eller stenge strøm og varme på egen
        hånd er <strong>ulovlig selvtekt</strong>. Det er straffbart og kan
        gi leietaker krav på erstatning – selv om leien aldri ble betalt.
        Bare namsmannen kan gjennomføre en utkastelse.
      </p>
      <p>
        Den beste håndteringen av betalingsmislighold er å unngå det:
        grundig referanse- og kredittsjekk før kontrakt, som beskrevet i
        guiden om å{" "}
        <Link href="/guide/finne-og-velge-leietaker">
          finne og velge leietaker
        </Link>
        , og depositum på plass før nøkkelen overleveres. Dette er generell
        informasjon, ikke juridisk rådgivning – husleieloven og tilhørende
        regelverk finner du hos{" "}
        <a
          href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
          rel="noopener noreferrer"
          target="_blank"
        >
          Lovdata
        </a>
        .
      </p>

      <h2>Tåler regnestykket ditt noen måneder uten leie?</h2>
      <p>
        Mislighold er sjeldent, men dyrt når det først skjer. Bruk
        utleiekalkulatoren til å se hva noen måneder uten leieinntekt gjør
        med kontantstrømmen, og hvor break-even-leien din ligger – da vet du
        hvor stor buffer du trenger før økonomien er avhengig av at alt går
        knirkefritt. Kalkulatoren er gratis og krever ingen konto.
      </p>
    </ArticleLayout>
  );
}
