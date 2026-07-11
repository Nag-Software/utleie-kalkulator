import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("leiepriser-oslo");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hva koster leie i Oslo tidlig i 2026?</h2>
      <p>
        En <strong>hybel</strong> i Oslo leies tidlig i 2026 typisk ut for{" "}
        <strong>9 000–13 000 kr</strong> i måneden, en <strong>2-roms</strong>{" "}
        for <strong>15 000–19 000 kr</strong> og en <strong>3-roms</strong>{" "}
        for <strong>19 000–26 000 kr</strong>. Intervallene er brede med
        vilje: de spenner fra nøktern standard i ytre by til nyoppusset og
        sentralt. Hyblene og 2-romsene leies i praksis av studenter og unge i
        arbeid, mens 3-roms går til par og småbarnsfamilier – en gruppe som
        stiller høyere krav til standard, men også blir boende lenger.
      </p>
      <table>
        <thead>
          <tr>
            <th>Boligtype</th>
            <th>Typisk månedsleie i Oslo (tidlig 2026)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hybel</td>
            <td>9 000–13 000 kr</td>
          </tr>
          <tr>
            <td>2-roms</td>
            <td>15 000–19 000 kr</td>
          </tr>
          <tr>
            <td>3-roms</td>
            <td>19 000–26 000 kr</td>
          </tr>
        </tbody>
      </table>
      <p>
        Leiemarkedet flytter seg fra år til år, og nivåene over er runde
        anslag – sjekk alltid ferske tall i SSBs leiemarkedsundersøkelse og i
        aktive annonser før du setter pris.
      </p>

      <h2>Bydelsmønsteret: vest dyrest, øst best yield</h2>
      <p>
        Mønsteret i Oslo er stabilt. <strong>Sentrumsnære bydeler i vest</strong>{" "}
        (Frogner, Majorstuen-området) ligger øverst i pris.{" "}
        <strong>Indre øst</strong> (Grünerløkka, Tøyen, Gamle Oslo) følger
        tett bak, drevet av sterk etterspørsel fra studenter og unge i
        arbeid. <strong>Ytre øst og sør</strong> er rimeligst – og det er
        gjerne der yielden er best, fordi kjøpesummene faller brattere enn
        leieprisene når du beveger deg utover i byen. Kollektivnettet
        strekker dessuten prisene: en ytre bydel med kort T-banevei til
        sentrum leier bedre ut enn avstanden på kartet tilsier. Avveiningen
        mellom lav pris og høy leie er tema i guiden om{" "}
        <Link href="/guide/hvor-i-norge-er-yield-hoyest">
          hvor i Norge yield er høyest
        </Link>
        .
      </p>

      <h2>Hva drar leien opp i Oslo?</h2>
      <ul>
        <li>
          <strong>Kort vei til T-bane, trikk eller sentrum</strong> –
          reisetid er faktoren flest leietakere sorterer på.
        </li>
        <li>
          <strong>Balkong eller uteplass</strong> – sjeldnere i eldre
          bygårder, og derfor priset deretter.
        </li>
        <li>
          <strong>Heis</strong> – betyr mye i etasjene over tredje.
        </li>
        <li>
          <strong>Nyoppusset bad og kjøkken</strong> – standardhevingen som
          tydeligst flytter boligen oppover i intervallet.
        </li>
        <li>
          <strong>Møblert</strong> – mange unge flytter til Oslo uten møbler;
          om påslaget forsvarer slitasjen, er regnet ut i guiden om{" "}
          <Link href="/guide/moblert-eller-umoblert-utleie">
            møblert eller umøblert utleie
          </Link>
          .
        </li>
      </ul>

      <h2>Slik finner du riktig leie for din bolig</h2>
      <p>
        Tabellen gir nivået, men prisen for akkurat din bolig finner du ved å
        sammenligne med boliger som faktisk ligger ute: samme bydel, samme
        antall rom, sammenlignbar standard. Fremgangsmåten – FINN-metoden –
        og statistikken som kvalitetssikrer anslaget, er beskrevet steg for
        steg i guiden om{" "}
        <Link href="/guide/hva-kan-jeg-leie-ut-for">
          hva du kan leie ut for
        </Link>
        . Og husk tomgangsmatematikken: én måned tomt koster 8,3 % av
        årsleien, så en «rekordleie» som gir treg utleie taper mot riktig
        pris fra dag én. Etterspørselen er størst mot studiestart i august og
        roligst midt på vinteren – har du fleksibilitet, kan du time
        kontraktsslutt mot høysesongen.
      </p>

      <h2>Yield-virkeligheten: 3–4 % sentralt</h2>
      <p>
        Sentralt i Oslo gir utleieboliger typisk <strong>3–4 % brutto
        yield</strong>. Eksempel: en 2-roms til 5 000 000 kr utleid for
        16 000 kr i måneden gir 192 000 kr i året – 3,8 % brutto før
        kostnader. Med høy belåning og en lånerente på for eksempel 5 % blir{" "}
        <Link href="/guide/kontantstrom-utleiebolig">kontantstrømmen</Link>{" "}
        da ofte stram eller negativ: du skyter inn penger hver måned. Et
        Oslo-kjøp er derfor i praksis ofte et veddemål på{" "}
        <Link href="/guide/verdistigning-pa-bolig">verdistigning</Link>,
        ikke på løpende overskudd.
      </p>

      <h2>Fra leiepris til beslutning</h2>
      <p>
        Leienivået er bare halve regnestykket. Legg kjøpesum, leie, lån og
        kostnader inn i utleiekalkulatoren, så får du kontantstrøm etter
        skatt, yield og break-even-leie for den konkrete boligen – gratis og
        uten konto. Vurderer du en bolig som ligger ute nå, kan du importere
        FINN-annonsen direkte og få en KI-vurdering av regnestykket
        (9,90 kr).
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
