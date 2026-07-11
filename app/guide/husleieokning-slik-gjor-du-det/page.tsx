import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("husleieokning-slik-gjor-du-det");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>To lovlige mekanismer – og bare to</h2>
      <p>
        I et løpende leieforhold kan leien bare økes på to måter:{" "}
        <strong>KPI-justering</strong> én gang i året med minst én måneds
        skriftlig varsel, og justering til <strong>gjengs leie</strong>{" "}
        tidligst etter to og et halvt år, med seks måneders varsel. Utover
        dette kan ikke leien settes opp i avtaleperioden – større hopp
        krever at leieforholdet avsluttes og et nytt inngås.
      </p>
      <table>
        <thead>
          <tr>
            <th>Regel</th>
            <th>KPI-justering</th>
            <th>Gjengs leie</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hjemmel</td>
            <td>Husleieloven § 4-2</td>
            <td>Husleieloven § 4-3</td>
          </tr>
          <tr>
            <td>Når</td>
            <td>
              Én gang i året, tidligst ett år etter at leien sist ble
              fastsatt
            </td>
            <td>
              Tidligst 2,5 år etter inngåelse uten annen endring enn KPI, og
              tidligst iverksatt ett år etter forrige leiefastsetting – i
              praksis fra år tre
            </td>
          </tr>
          <tr>
            <td>Varsel</td>
            <td>Minst én måned, skriftlig</td>
            <td>Seks måneder, skriftlig</td>
          </tr>
          <tr>
            <td>Nytt nivå</td>
            <td>Endringen i konsumprisindeksen (SSB)</td>
            <td>
              Gjengs leie for lignende bolig på lignende leievilkår
            </td>
          </tr>
        </tbody>
      </table>

      <h2>KPI-justering i praksis</h2>
      <p>
        Fremgangsmåten er enkel: finn prisveksten siden leien sist ble
        fastsatt i SSBs KPI-kalkulator, send leietaker skriftlig varsel med
        ny leie og dato, og la det gå minst én måned før den nye leien
        gjelder. Et eksempel: er leien <strong>15 000 kr</strong> og KPI har
        steget 3 %, blir ny leie 15 000 × 1,03 ={" "}
        <strong>15 450 kr</strong>. Det nye beløpet er utgangspunktet for
        neste års justering.
      </p>
      <p>
        Hopper du over noen år, kan du justere for hele indeksveksten siden
        forrige fastsettelse – men månedene med for lav leie får du aldri
        igjen. Tidfest derfor justeringen i{" "}
        <Link href="/guide/leiekontrakt-dette-ma-den-inneholde">
          leiekontrakten
        </Link>
        , for eksempel til 1. januar hvert år. Det årlige varselet må
        likevel sendes.
      </p>

      <h2>Gjengs leie: den store justeringen fra år tre</h2>
      <p>
        Har leieforholdet vart i minst 2,5 år uten annen endring enn KPI,
        kan begge parter kreve leien satt til gjengs leie med seks måneders
        varsel. <strong>Gjengs leie</strong> er ikke toppen av markedet: det
        er et gjennomsnitt av leienivået i eksisterende leieforhold for
        lignende boliger på lignende vilkår, og ligger normalt under
        markedsleien en ny leietaker ville betalt. Forskjellen mellom gjengs
        leie og markedsleie er forklart i guiden om{" "}
        <Link href="/guide/hva-kan-jeg-leie-ut-for">
          hva du kan leie ut for
        </Link>
        . Merk at mekanismen går begge veier: har leienivået i området falt,
        kan leietaker kreve nedjustering.
      </p>
      <p>
        Blir dere ikke enige om nivået, kan hver av partene kreve det
        fastsatt av en takstnemnd, og tvister kan bringes inn for
        Husleietvistutvalget. Dette er generell informasjon, ikke juridisk
        rådgivning – se husleieloven §§ 4-2 og 4-3 på{" "}
        <a
          href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
          rel="noopener noreferrer"
          target="_blank"
        >
          Lovdata
        </a>
        .
      </p>

      <h2>Nytt leieforhold: fri leiefastsettelse</h2>
      <p>
        Reglene over gjelder løpende leieforhold. Når en leietaker flytter
        ut og en ny flytter inn, står du fritt til å avtale leie på
        markedsnivå. Det er derfor leien i praksis tar de store hoppene ved
        leietakerbytte – og enda en grunn til å beholde gode leietakere med
        jevn, forutsigbar regulering i stedet for å presse hvert år
        maksimalt.
      </p>

      <h2>Strategien: små årlige hopp slår sjokkøkninger</h2>
      <p>
        En leietaker som får varsel om 3 % justering hvert år, opplever det
        som normalt. En leietaker som får 15 % etter fem stille år,
        opplever det som en konflikt – og da risikerer du oppsigelse og
        tomgang som koster mer enn hele økningen. Jevnlig KPI-justering
        bevarer realverdien av leien uten drama. I utleiekalkulatoren er
        dette feltet «Årlig leiejustering»: legg inn for eksempel 2,5 % og
        se hva jevnlig regulering betyr for kontantstrøm og totalavkastning
        over ti år – og hva det koster å la leien stå stille.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lovdata: husleieloven (§§ 4-2 og 4-3)
          </a>
        </li>
        <li>
          <a
            href="https://www.ssb.no/kpi"
            rel="noopener noreferrer"
            target="_blank"
          >
            SSB: konsumprisindeksen med KPI-kalkulator
          </a>
        </li>
        <li>
          <a
            href="https://www.htu.no/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Husleietvistutvalget: tvister om leienivå
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
