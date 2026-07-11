import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("fellesgjeld-og-felleskostnader");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hva er fellesgjeld – og hvorfor er totalpris det viktigste tallet?</h2>
      <p>
        <strong>Fellesgjeld</strong> er din andel av borettslagets eller
        sameiets felles lån, og den følger med boligen når du kjøper. Det
        reelle sammenligningsgrunnlaget mellom boliger er derfor{" "}
        <strong>totalpris: kjøpesum pluss andel fellesgjeld</strong>.
        Prisantydningen alene sier ikke hva boligen koster deg – og
        fellesgjelden betjener du hver måned gjennom felleskostnadene.
      </p>

      <h2>Regneeksempel: to «like» leiligheter</h2>
      <p>
        Se på to identiske leiligheter i samme gate, annonsert samme uke:
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Leilighet A</th>
            <th>Leilighet B</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kjøpesum</td>
            <td>3 200 000 kr</td>
            <td>4 000 000 kr</td>
          </tr>
          <tr>
            <td>Andel fellesgjeld</td>
            <td>800 000 kr</td>
            <td>0 kr</td>
          </tr>
          <tr>
            <td>Totalpris</td>
            <td>4 000 000 kr</td>
            <td>4 000 000 kr</td>
          </tr>
        </tbody>
      </table>
      <p>
        Leilighet A ser 800 000 kr billigere ut og havner foran i prissorterte
        FINN-søk, men koster nøyaktig det samme. Forskjellen er hvor lånet
        ligger: B-kjøperen betaler renter på et større privat boliglån, mens
        A-kjøperen betaler renter på fellesgjelden gjennom felleskostnadene.
        Med 5 % rente utgjør rentene på 800 000 kr i fellesgjeld rundt{" "}
        <strong>3 300 kr i måneden</strong> – penger som ligger gjemt i de
        «høye» felleskostnadene til leilighet A.
      </p>
      <p>
        Andelsboliger har til gjengjeld en reell fordel i kjøpsøyeblikket: du
        slipper{" "}
        <Link href="/guide/dokumentavgift-og-omkostninger">
          dokumentavgiften på 2,5 %
        </Link>
        , og borettslag oppnår ofte gunstige lånebetingelser på fellesgjelden.
      </p>

      <h2>Hva dekker felleskostnadene?</h2>
      <p>
        Felleskostnadene er din månedlige andel av lagets utgifter og består
        typisk av to deler:
      </p>
      <ul>
        <li>
          <strong>Kapitalkostnader:</strong> renter og avdrag på fellesgjelden
          – ofte den største posten i lag med høy gjeld.
        </li>
        <li>
          <strong>Driftskostnader:</strong> kommunale avgifter,
          bygningsforsikring, vedlikehold av fellesarealer, forretningsfører,
          vaktmester og ofte TV/internett.
        </li>
      </ul>
      <p>
        I annonsen står felleskostnadene som én sum. Be alltid om
        spesifikasjonen: hvor mye er drift, og hvor mye er renter og avdrag?
        Uten den vet du ikke hva du sammenligner.
      </p>

      <h2>Tre feller du må sjekke før du byr</h2>
      <h3>Avdragsfri fellesgjeld</h3>
      <p>
        Mange lag har avdragsfrihet de første årene, som holder
        felleskostnadene kunstig lave. Eksempel: 800 000 kr i fellesgjeld til
        5 % rente, avdragsfritt i ti år og deretter nedbetaling over tjue år.
        I den avdragsfrie perioden betaler du rundt 3 300 kr i måneden i
        renter; når avdragene starter, dobles kapitalkostnaden til rundt
        6 600 kr. Felleskostnader på 5 500 kr kan dermed hoppe til nærmere{" "}
        <strong>9 000 kr i måneden</strong> – uten at leien du kan ta, øker
        tilsvarende. Sjekk alltid når avdragsfriheten utløper.
      </p>
      <h3>IN-ordning: individuell nedbetaling</h3>
      <p>
        Noen borettslag har <strong>IN-ordning</strong>, som lar deg nedbetale
        din andel av fellesgjelden og få tilsvarende lavere felleskostnader.
        Det kan være nyttig for å bedre kontantstrømmen, men krever at laget
        har en sikringsordning, og pengene er i praksis låst i andelen. Sjekk
        vilkårene hos forretningsføreren.
      </p>
      <h3>Lave felleskostnader nå, stor rehabilitering senere</h3>
      <p>
        Et lag med påfallende lave felleskostnader kan ha utsatt
        vedlikeholdet. Les styrets årsberetning, regnskapet og
        vedlikeholdsplanen før du byr: står tak, fasade, rør eller våtrom for
        tur, kan fellesgjelden per andel øke med flere hundre tusen kroner –
        og felleskostnadene med flere tusenlapper i måneden.
      </p>

      <h2>Hva betyr dette for utleieregnestykket?</h2>
      <p>
        For deg som skal leie ut er felleskostnadene en driftskostnad som
        spiser direkte av{" "}
        <Link href="/guide/yield-utleiebolig">netto yield</Link>: en leilighet
        med 180 000 kr i årlig leie og 66 000 kr i felleskostnader mister over
        en tredjedel av inntekten før du har betalt en krone i lånerenter. Til
        gjengjeld er felleskostnadene, som andre driftskostnader,{" "}
        <Link href="/guide/fradrag-ved-utleie">
          fradragsberettiget i leieinntekten
        </Link>
        . Dette er generell informasjon og ikke skatterådgivning – se
        detaljene hos{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetaten
        </a>
        .
      </p>

      <h2>Regn med totalpris og reelle felleskostnader</h2>
      <p>
        Utleiekalkulatoren tar kjøpesum og fellesgjeld hver for seg og regner
        yield og kontantstrøm på totalprisen, med felleskostnadene som løpende
        kostnad. Henter du en FINN-annonse rett inn, følger fellesgjeld og
        felleskostnader med automatisk. Test gjerne fellen over før du byr:
        sett felleskostnadene opp 2 000–3 000 kr og se hva en avdragsstart i
        laget ville gjort med kontantstrømmen din.
      </p>
    </ArticleLayout>
  );
}
