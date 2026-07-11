import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("leiepriser-bergen");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hva koster leie i Bergen tidlig i 2026?</h2>
      <p>
        En <strong>hybel</strong> i Bergen leies tidlig i 2026 typisk ut for{" "}
        <strong>7 000–10 000 kr</strong> i måneden, en <strong>2-roms</strong>{" "}
        for <strong>12 000–16 000 kr</strong> og en <strong>3-roms</strong>{" "}
        for <strong>15 000–20 000 kr</strong>. Spennet i hvert intervall
        skyldes standard og beliggenhet – nyoppusset i sentrum og enklere
        standard lenger ut er to ulike markeder.
      </p>
      <table>
        <thead>
          <tr>
            <th>Boligtype</th>
            <th>Typisk månedsleie i Bergen (tidlig 2026)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hybel</td>
            <td>7 000–10 000 kr</td>
          </tr>
          <tr>
            <td>2-roms</td>
            <td>12 000–16 000 kr</td>
          </tr>
          <tr>
            <td>3-roms</td>
            <td>15 000–20 000 kr</td>
          </tr>
        </tbody>
      </table>
      <p>
        Nivåene er runde anslag som endrer seg – sjekk ferske tall i SSBs
        leiemarkedsundersøkelse og i aktive annonser før du setter leien.
      </p>

      <h2>Studentbyen: august-toppen styrer markedet</h2>
      <p>
        Bergen har titusenvis av studenter ved <strong>UiB, HVL og NHH</strong>,
        og det preger leiemarkedet mer enn i noen annen norsk storby:
        etterspørselen etter hybler og 2-roms er sterk, og den topper seg
        tydelig i <strong>juli og august</strong> før studiestart. For deg
        som leier ut betyr det én ting: <strong>time innflyttingen mot
        studiestart</strong>. En hybel som legges ut i juni med innflytting
        1. august møter et langt bredere felt av søkere enn en som blir
        ledig i oktober. Presset er størst i sentrum, på Nygårdshøyden og
        Møhlenpris nær universitetet, i Sandviken og rundt campusene på
        Kronstad og i Ytre Sandviken. Studentene leier også i bofellesskap,
        så romslige 3- og 4-roms konkurrerer i praksis i hybelmarkedet –
        utleid samlet til en vennegjeng som deler leien. Hvordan du rigger
        annonse og visning
        for å lande riktig leietaker i rushet, står i guiden om å{" "}
        <Link href="/guide/finne-og-velge-leietaker">
          finne og velge leietaker
        </Link>
        .
      </p>

      <h2>Yield: bedre direkteavkastning enn i Oslo</h2>
      <p>
        Brutto yield i Bergen ligger typisk på <strong>4–5,5 %</strong>.
        Eksempel: en 2-roms til 3 200 000 kr utleid for 13 500 kr i måneden
        gir 162 000 kr i året – rundt 5,1 % brutto. Det er klart bedre
        direkteavkastning enn de 3–4 % som er vanlig sentralt i Oslo; til
        gjengjeld har boligprisveksten i Bergen historisk i perioder vært
        roligere. Hvordan du regner{" "}
        <Link href="/guide/yield-utleiebolig">yield på utleiebolig</Link>{" "}
        riktig, og avveiningen mellom direkteavkastning og verdistigning,
        finner du i guiden om{" "}
        <Link href="/guide/hvor-i-norge-er-yield-hoyest">
          hvor i Norge yield er høyest
        </Link>
        .
      </p>

      <h2>Vestlandsværet: budsjettér vedlikehold</h2>
      <p>
        Mye av utleiemassen i Bergen er eldre bygårder og trehus i sentrum og
        Sandviken – sjarmerende, men utsatt for fukt i en av landets mest
        nedbørrike byer. Sjekk drenering, tak, vinduer og bad ekstra nøye før
        kjøp, og sett av et realistisk{" "}
        <Link href="/guide/vedlikeholdsbudsjett-utleiebolig">
          vedlikeholdsbudsjett
        </Link>{" "}
        – i eldre bygg bør det ligge i øvre ende av tommelfingerreglene. Les
        tilstandsrapporten nøye og be om dokumentasjon på drenering og
        takarbeid; i Bergen er fukthistorikken ofte viktigere enn
        oppussingsåret. En god yield på papiret forsvinner fort i et
        dreneringsprosjekt du ikke hadde regnet med.
      </p>

      <h2>Slik finner du riktig leie for din bolig</h2>
      <p>
        Bruk FINN-metoden: sammenlign med tilsvarende boliger i samme strøk
        som ligger ute nå, og følg med på hvilke annonser som faktisk
        forsvinner fra markedet. Metoden – og statistikken som
        kvalitetssikrer anslaget, blant annet SSBs leiemarkedsundersøkelse –
        er beskrevet i guiden om{" "}
        <Link href="/guide/hva-kan-jeg-leie-ut-for">
          hva du kan leie ut for
        </Link>
        .
      </p>

      <h2>Regn ut om Bergens-kjøpet lønner seg</h2>
      <p>
        Med leienivå, kjøpesum og lånerente på plass gir utleiekalkulatoren
        deg kontantstrøm etter skatt, netto yield og break-even-leie – gratis
        og uten konto. Med 4–5,5 % brutto yield går regnestykket i Bergen
        oftere i pluss fra dag én enn i Oslo, men marginene avgjøres av
        rente, felleskostnader og vedlikeholdet du nettopp budsjetterte.
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
      </ul>
    </ArticleLayout>
  );
}
