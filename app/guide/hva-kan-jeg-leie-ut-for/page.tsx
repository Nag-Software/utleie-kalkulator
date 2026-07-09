import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("hva-kan-jeg-leie-ut-for");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Markedsleie er fasiten</h2>
      <p>
        Leien kan i utgangspunktet avtales fritt i Norge, men markedet setter
        grensen: prisen leietakere faktisk er villige til å betale for
        tilsvarende bolig i samme område. Setter du leien over markedsleie,
        straffes du ikke av loven, men av tomgang – og den er dyrere enn de
        fleste tror.
      </p>

      <h2>FINN-metoden: 20 minutter til et godt anslag</h2>
      <ol>
        <li>
          Søk på leieboliger på FINN i samme bydel eller tettsted, filtrert på
          samme antall soverom og omtrent samme størrelse.
        </li>
        <li>
          Se på prisnivået for boliger med sammenlignbar standard – nyoppusset
          sammenlignes med nyoppusset, ikke med oppussingsobjekt.
        </li>
        <li>
          Følg med noen dager: annonser som blir liggende uke etter uke er
          priset for høyt. Annonser som forsvinner på dagen var priset lavt
          (eller riktig).
        </li>
        <li>
          Legg deg midt i feltet med rom for forhandling – målet er en god
          leietaker raskt, ikke rekordleie med tre måneders leting.
        </li>
      </ol>

      <h2>Statistikk som kvalitetssikrer anslaget</h2>
      <ul>
        <li>
          <strong>SSBs leiemarkedsundersøkelse</strong> gir gjennomsnittlig
          månedsleie per antall rom for de store byene og landsdelene –
          nyttig referansepunkt, men husk at gjennomsnittet dekker både
          gammelt og nytt.
        </li>
        <li>
          <strong>Utleieplattformenes prisstatistikk</strong> (blant andre
          Husleie.no og Utleiemegleren publiserer jevnlig tall) viser
          utviklingen i annonserte leiepriser gjennom året.
        </li>
      </ul>

      <h2>Hva drar leien opp – og ned?</h2>
      <table>
        <thead>
          <tr>
            <th>Drar opp</th>
            <th>Drar ned</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kort vei til kollektiv, studiested eller sentrum</td>
            <td>Lang reisevei, støy eller trafikkert beliggenhet</td>
          </tr>
          <tr>
            <td>Nyoppusset bad og kjøkken</td>
            <td>Slitt standard, gammelt bad</td>
          </tr>
          <tr>
            <td>Balkong, uteplass, heis, parkering</td>
            <td>Første etasje mot gate, dårlig lysforhold</td>
          </tr>
          <tr>
            <td>Møblert og innflyttingsklart</td>
            <td>Delvis møblert med slitte møbler</td>
          </tr>
          <tr>
            <td>Strøm/internett inkludert (priset inn)</td>
            <td>Uforutsigbare tillegg på toppen av leien</td>
          </tr>
        </tbody>
      </table>
      <p>
        Møblert utleie gir gjerne 10–15 % høyere leie, men også mer slitasje
        og utskiftninger – regn på begge deler før du velger.
      </p>

      <h2>Ikke pris deg ut: tomgangsmatematikken</h2>
      <p>
        Én måned tomgang koster 8,3 % av årsleien. Eksempel: klarer du
        13 000 kr i måneden med utleie fra dag én, gir det 156 000 kr i året.
        Prøver du deg på 14 000 kr, men bruker to måneder på å finne leietaker,
        ender du på 140 000 kr – <strong>16 000 kr mindre</strong>, for en
        «høyere» leie. Legg inn forventet ledighet i utleiekalkulatoren, så
        ser du effekten på kontantstrøm og{" "}
        <Link href="/guide/yield-utleiebolig">yield</Link> umiddelbart.
      </p>

      <h2>Regulering av leien underveis</h2>
      <ul>
        <li>
          <strong>KPI-justering:</strong> leien kan justeres i takt med
          konsumprisindeksen én gang i året, med minst 30 dagers skriftlig
          varsel (husleieloven § 4-2).
        </li>
        <li>
          <strong>Gjengs leie:</strong> har leieforholdet vart i over tre år,
          kan begge parter kreve leien justert til gjengs leie – nivået for
          tilsvarende leieforhold i området (husleieloven § 4-3).
        </li>
        <li>
          <strong>Depositum:</strong> maksimalt seks måneders leie, på egen
          sperret depositumskonto i leietakers navn.
        </li>
      </ul>

      <h2>Fra leiepris til lønnsomhet</h2>
      <p>
        Leieprisen er bare halve svaret –{" "}
        <Link href="/guide/lonner-det-seg-a-kjope-utleiebolig">
          om utleien lønner seg
        </Link>{" "}
        avgjøres av leien målt mot lån, kostnader og{" "}
        <Link href="/guide/skatt-pa-utleie-2026">skatt</Link>. Legg
        markedsleien du har funnet inn i utleiekalkulatoren, så ser du
        kontantstrømmen etter skatt og hvilken leie du minst må ha for å gå i
        null.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://www.ssb.no/priser-og-prisindekser/statistikker/lmu/aar"
            rel="noopener noreferrer"
            target="_blank"
          >
            SSB: leiemarkedsundersøkelsen
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
            href="https://www.forbrukerradet.no/kontrakter/hus/husleiekontrakt-bokmal/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Forbrukerrådet: husleiekontrakt
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
