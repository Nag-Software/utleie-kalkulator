import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("moblert-eller-umoblert-utleie");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hvor mye mer gir møblert utleie?</h2>
      <p>
        Møblert utleie gir typisk høyere leie enn umøblert – ofte{" "}
        <strong>5–15 %</strong> avhengig av marked og boligtype – men også
        høyere kostnader og gjerne kortere leieforhold. Om det lønner seg,
        avgjøres av om leiepåslaget i ditt marked faktisk dekker innkjøp,
        slitasje og hyppigere leietakerbytter.
      </p>
      <p>
        Målgruppene er forskjellige: møblert treffer studenter, unge og folk
        i overgangsfaser – leietakere som ofte blir boende kortere og gir
        mer utskifting. Umøblert treffer etablerte leietakere og familier
        med egne møbler, som gjerne gir stabilere og lengre leieforhold.
        Sjekk påslaget lokalt ved å sammenligne møblerte og umøblerte
        annonser, slik guiden om{" "}
        <Link href="/guide/hva-kan-jeg-leie-ut-for">riktig leiepris</Link>{" "}
        beskriver.
      </p>

      <h2>Kostnadssiden: innkjøp, slitasje og lagring</h2>
      <p>
        Å møblere en 2-roms nøkternt – seng, sofa, spisebord, oppbevaring og
        det som ellers mangler – koster fort{" "}
        <strong>60 000–80 000 kr</strong>. Møbler i utleie slites raskere
        enn hjemme, så regn med å skifte ut det meste i løpet av noen år. Og
        vil en god søker heller ha boligen umøblert, må du lagre eller selge
        møblene – lagring koster gjerne noen hundrelapper i måneden.
      </p>
      <p>
        Leier du ut møblert, bør inventaret listes opp med tilstand som
        vedlegg til{" "}
        <Link href="/guide/overtakelsesprotokoll">
          overtakelsesprotokollen
        </Link>{" "}
        – ellers er det umulig å dokumentere hva som manglet eller ble
        ødelagt ved utflytting. En mellomvariant mange lander på, er delvis
        møblert: hvitevarer og garderober følger boligen, mens leietaker har
        med resten.
      </p>

      <h2>Regnestykket: når betaler møbleringen seg?</h2>
      <p>
        Et eksempel: en 2-roms som kan leies ut for 15 000 kr umøblert, får
        10 % påslag møblert – 1 500 kr mer i måneden, altså{" "}
        <strong>18 000 kr i året</strong>. Koster møbleringen 70 000 kr, er
        den «nedbetalt» på i underkant av fire år – omtrent det nøkterne
        møbler tåler med aktiv bruk. Regnestykket står og faller derfor på
        tre ting: at påslaget faktisk finnes i ditt marked, at møblene
        overlever mer enn én leietaker, og at hyppigere bytter ikke spiser
        gevinsten i form av tomgang. Bare to ukers ekstra tomgang ved et
        leietakerbytte koster rundt 7 500 kr i eksempelet – nesten halve
        årspåslaget.
      </p>

      <h2>Skatt: fradrag for møblene</h2>
      <p>
        Ved skattepliktig utleie er møblene fradragsberettiget: gjenstander
        som koster under <strong>15 000 kr</strong>, utgiftsføres direkte i
        kjøpsåret, mens dyrere gjenstander avskrives med 20 % saldo per år.
        Leier du ut din egen møblerte bolig i inntil tre år og skal bo der
        igjen, kan du i stedet bruke et{" "}
        <strong>sjablongfradrag på 15 %</strong> av brutto leie. Leier du ut
        skattefritt i egen bolig, får du derimot ingen fradrag for møblene.
        Se guidene om{" "}
        <Link href="/guide/fradrag-ved-utleie">fradrag ved utleie</Link> og{" "}
        <Link href="/guide/skatt-pa-utleie-2026">skatt på utleie</Link> for
        helheten. Dette er generell informasjon, ikke skatterådgivning –
        detaljene finner du hos{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetaten
        </a>
        .
      </p>

      <h2>Beslutningstabellen</h2>
      <table>
        <thead>
          <tr>
            <th>Velg møblert hvis</th>
            <th>Velg umøblert hvis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bymarked med mange studenter og unge leietakere</td>
            <td>Målgruppen er familier og etablerte leietakere</td>
          </tr>
          <tr>
            <td>Små enheter som hybel og 2-roms</td>
            <td>Større boliger der folk har egne møbler</td>
          </tr>
          <tr>
            <td>Du håndterer kortere kontrakter og flere bytter</td>
            <td>Du vil ha lange leieforhold og minst mulig jobb</td>
          </tr>
          <tr>
            <td>Tydelig leiepåslag for møblert i området</td>
            <td>Lite eller usikkert påslag lokalt</td>
          </tr>
        </tbody>
      </table>

      <h2>Test begge scenarioene før du kjøper sofa</h2>
      <p>
        Kjør to varianter i utleiekalkulatoren: én med umøblert leie, og én
        med møblert påslag der innkjøp og utskifting ligger inne som årlige
        kostnader. Da ser du svart på hvitt hva møbleringen gjør med
        kontantstrøm og netto yield for akkurat din bolig – før du bruker
        70 000 kr på møbler. Kalkulatoren er gratis og krever ingen konto.
      </p>
    </ArticleLayout>
  );
}
