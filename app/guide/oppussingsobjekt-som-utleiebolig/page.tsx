import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("oppussingsobjekt-som-utleiebolig");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Strategien: kjøp slitt, oppgrader målrettet, lei ut høyere</h2>
      <p>
        Et oppussingsobjekt lar deg gjøre det vanskeligste i
        utleieregnestykket: kjøpe under markedspris. Slitte boliger skremmer
        bort mange kjøpere, så du får rabatt i kjøpet, oppgraderer målrettet
        mot leiemarkedet og henter gevinsten i høyere leie og innebygget
        egenkapital. Gevinsten skapes med andre ord i kjøpet og oppussingen –
        ikke ved å håpe på markedet.
      </p>

      <h2>Regneeksempel: oppussingsobjekt mot ferdig oppusset</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Oppussingsobjekt</th>
            <th>Ferdig oppusset</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kjøpesum</td>
            <td>2 800 000 kr</td>
            <td>3 500 000 kr</td>
          </tr>
          <tr>
            <td>Oppussing</td>
            <td>400 000 kr</td>
            <td>0 kr</td>
          </tr>
          <tr>
            <td>Total investering</td>
            <td>3 200 000 kr</td>
            <td>3 500 000 kr</td>
          </tr>
          <tr>
            <td>Leie etter oppgradering</td>
            <td>16 000 kr/mnd</td>
            <td>16 000 kr/mnd</td>
          </tr>
          <tr>
            <td>Brutto yield</td>
            <td>6,0 %</td>
            <td>ca. 5,5 %</td>
          </tr>
        </tbody>
      </table>
      <p>
        Samme standard og samme leie, men 300 000 kr lavere investering gir
        et halvt prosentpoeng høyere yield – og priser markedet den ferdig
        oppussede til 3 500 000 kr, har du i tillegg bygget inn rundt{" "}
        <strong>300 000 kr i egenkapital</strong>. Det forspranget er
        samtidig hele feilmarginen din: sprekker budsjettet og byggetiden,
        forsvinner det fort. Omkostninger ved kjøpet kommer i tillegg i begge
        scenarioene.
      </p>

      <h2>Budsjett med 20–30 % buffer – og husk at tid er penger</h2>
      <p>
        Sett opp et detaljert budsjett og legg på <strong>20–30 %</strong> i
        buffer: et budsjett på 400 000 kr bør regnes som 480 000–520 000 kr
        før du byr. Det dukker nesten alltid opp noe bak flisene – råte,
        skjevheter eller elektrisk anlegg som må oppgraderes.
      </p>
      <p>
        Tomgang i byggeperioden er en like reell kostnad: tre måneder uten
        leieinntekt er 48 000 kr med leien i eksempelet, samtidig som rentene
        løper. Lag en fremdriftsplan og regn tomgangsmånedene inn i
        totalinvesteringen.
      </p>
      <p>
        Og oppgrader mot leiemarkedet, ikke mot drømmeboligen: bad og kjøkken
        skal være funksjonelle, lyse og lettstelte – ikke luksus. Leietakere
        betaler for standard og beliggenhet, ikke for eksklusive materialer.
        Sjekk{" "}
        <Link href="/guide/hva-kan-jeg-leie-ut-for">
          hva oppgraderte boliger faktisk leies ut for
        </Link>{" "}
        i området før du velger ambisjonsnivå.
      </p>

      <h2>TG2 og TG3 er forhandlingskort</h2>
      <p>
        I tilstandsrapporten er TG2- og TG3-merknader dokumenterte avvik – og
        dermed dokumenterte kostnader. Prislappen for å utbedre dem hører
        hjemme i budtaket ditt: trekk utbedringskostnaden fra det du
        maksimalt kan betale, og bruk yield-metoden til å{" "}
        <Link href="/guide/verdivurdering-av-utleiebolig">
          regne ut hva boligen er verdt som investering
        </Link>
        . Objekter med TG3 og lang liggetid er ofte der forhandlingsrommet –
        og dermed hele strategien – faktisk finnes.
      </p>

      <h2>Skatt: vedlikehold gir fradrag, påkostning gjør det ikke</h2>
      <p>
        Skattemessig går det et viktig skille i oppussingen:{" "}
        <strong>vedlikehold</strong> – å føre boligen tilbake til tidligere
        stand, som å male om eller bytte like mot like – kan trekkes fra i
        leieinntekten. <strong>Påkostning</strong> – standardheving og ting
        som ikke var der før – gir ikke fradrag nå, men legges til
        inngangsverdien og reduserer eventuell gevinstskatt ved salg.
        Grensedragningen er forklart i guiden om{" "}
        <Link href="/guide/vedlikehold-eller-pakostning">
          vedlikehold eller påkostning
        </Link>
        .
      </p>
      <p>
        Vær særlig oppmerksom på oppussing <strong>før første utleie</strong>
        : kostnader for å sette boligen i stand før den i det hele tatt er
        leid ut, kan ha begrenset fradragsrett og bli regnet som en del av
        kjøpet. Planlegger du med fradragene i regnestykket, bør du sjekke
        reglene hos{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetaten
        </a>{" "}
        først, og uansett dokumentere alt med bilder og oppdelte fakturaer.
        Dette er generell informasjon, ikke skatterådgivning.
      </p>

      <h2>Regn på begge scenarioene før du byr</h2>
      <p>
        Legg oppussingsobjektet inn i utleiekalkulatoren med kjøpesum pluss
        oppussingsbudsjett (med buffer) som investering, og leien etter
        oppgradering som inntekt – og sammenlign med det ferdig oppussede
        alternativet. Da ser du svart på hvitt om rabatten er stor nok til å
        betale for risikoen, arbeidet og tomgangen. Kalkulatoren er gratis og
        krever ingen konto.
      </p>
    </ArticleLayout>
  );
}
