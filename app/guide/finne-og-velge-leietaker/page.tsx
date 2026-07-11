import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("finne-og-velge-leietaker");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Annonsen: riktig pris, ærlig beskrivelse, gode bilder</h2>
      <p>
        En god utleieprosess har tre ledd: en annonse med riktig pris og
        godt bildemateriale, en visning der du møter søkerne, og en
        utvelgelse basert på referanser, inntekt og eventuelt kredittsjekk.
        Snarveier er dyre – feil leietaker koster langt mer enn den uken
        ekstra en grundig prosess tar.
      </p>
      <p>
        Fotografer ryddige rom i dagslys, beskriv boligen ærlig – mangler
        oppdages uansett på visning – og sett leien etter markedet, ikke
        etter håpet:{" "}
        <Link href="/guide/hva-kan-jeg-leie-ut-for">
          slik finner du markedsleien
        </Link>
        . En annonse priset over markedet gir færre og svakere søkere, og
        tomgangen som følger, spiser gevinsten raskt.
      </p>

      <h2>Visning: felles eller individuell?</h2>
      <p>
        Felles visning er effektiv når pågangen er stor og skaper naturlig
        konkurranse, men gir lite tid per søker. Individuell visning gir
        bedre inntrykk av hvem du faktisk slipper inn i boligen. Mange
        kombinerer: felles visning først, deretter en kort samtale med de
        mest aktuelle. Legg merke til det enkle – kommer de presis, hvordan
        omtaler de forrige leieforhold, stiller de fornuftige spørsmål? Og
        husk at visningen går begge veier: gode leietakere velger også bort
        uryddige utleiere.
      </p>

      <h2>Referanser, inntekt og kredittsjekk</h2>
      <ul>
        <li>
          <strong>Referanser:</strong> be om tidligere utleiere – og ring
          dem. En nåværende utleier kan ha interesse av å bli kvitt en
          dårlig betaler; tidligere utleiere har ingen agenda. Spør
          konkret: ble leien betalt i tide, hvordan var boligen ved
          utflytting, ville du leid ut til dem igjen?
        </li>
        <li>
          <strong>Arbeid og inntekt:</strong> be om dokumentasjon på
          arbeidsforhold og inntekt. En mye brukt tommelfingerregel er at
          leien ikke bør overstige omtrent en tredjedel av brutto inntekt.
        </li>
        <li>
          <strong>Kredittsjekk:</strong> du kan kredittvurdere en aktuell
          kandidat, men det krever <strong>saklig behov</strong> – i praksis
          at vedkommende er reelt aktuell for kontrakt, ikke alle som melder
          interesse. Leietakeren får automatisk et gjenpartsbrev om at
          sjekken er gjort, så vær åpen om det på forhånd.
        </li>
      </ul>

      <h2>Diskrimineringsforbudet: dette kan du ikke vektlegge</h2>
      <p>
        Magefølelse er lov – du velger fritt den søkeren du mener passer
        best, ut fra saklige forhold som betalingsevne, referanser og
        stabilitet. Men husleieloven § 1-8 forbyr å legge vekt på blant
        annet etnisitet, religion, livssyn, kjønn, seksuell orientering og
        funksjonsnedsettelse ved utleie, og brudd kan gi
        <strong> erstatningsansvar</strong>. Sorter søkerne på
        dokumenterbare kriterier, så holder prosessen seg på riktig side.
        Dette er generell informasjon, ikke juridisk rådgivning – loven
        ligger på{" "}
        <a
          href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
          rel="noopener noreferrer"
          target="_blank"
        >
          Lovdata
        </a>
        .
      </p>

      <h2>Student eller lav inntekt? Garantist og medleietaker</h2>
      <p>
        En student eller søker med lav inntekt kan være en utmerket
        leietaker. Løsningen er å sikre betalingen: en{" "}
        <strong>garantist</strong> – typisk en forelder – som skriftlig
        garanterer for leien, eller en <strong>medleietaker</strong> som
        står på kontrakten og er ansvarlig sammen med hovedleietakeren.
        Uansett hvem du velger: signert{" "}
        <Link href="/guide/leiekontrakt-dette-ma-den-inneholde">
          leiekontrakt
        </Link>{" "}
        og{" "}
        <Link href="/guide/depositum-regler-og-depositumskonto">
          depositum på sperret konto
        </Link>{" "}
        skal være på plass før nøklene bytter hender.
      </p>

      <h2>Tomgangsregnestykket: grundighet lønner seg</h2>
      <p>
        Med 15 000 kr i månedsleie koster hver uke tomgang om lag 3 500 kr.
        Setter du leien 500 kr over markedet og bruker en måned ekstra på å
        finne noen som aksepterer den, har du tapt 15 000 kr for å hente
        6 000 kr i året – det tar over to år bare å gå i null. Motsatt er en
        uke ekstra på referanser og kredittsjekk billig forsikring mot
        purringer, konflikt og utkastelse. I utleiekalkulatoren legger du
        inn ledighet som andel av året – test noen nivåer og se hvor følsom
        kontantstrømmen din er for tomgang før du bestemmer pris og prosess.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lovdata: husleieloven (§ 1-8 om diskriminering)
          </a>
        </li>
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
