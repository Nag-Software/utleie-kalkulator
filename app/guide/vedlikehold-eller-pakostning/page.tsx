import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("vedlikehold-eller-pakostning");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Grensen: tilbake til samme stand, eller bedre enn før?</h2>
      <p>
        <strong>Vedlikehold</strong> er arbeid som setter boligen tilbake i en
        stand den har hatt tidligere – det gir fullt fradrag i leieinntekten
        det året kostnaden påløper. <strong>Påkostning</strong> er arbeid som
        gjør boligen bedre eller annerledes enn den noen gang har vært – det
        gir ikke fradrag nå, men legges til <strong>inngangsverdien</strong>{" "}
        og reduserer en eventuell skattepliktig gevinst den dagen du selger,
        slik guiden om{" "}
        <Link href="/guide/skatt-ved-salg-av-utleiebolig">
          skatt ved salg av utleiebolig
        </Link>{" "}
        forklarer.
      </p>
      <p>
        Forskjellen i kroner: 100 000 kr i vedlikehold er verdt 22 000 kr i
        spart skatt i år. Samme beløp som påkostning virker først ved salget –
        og bare hvis gevinsten er skattepliktig. Løpende fradrag forutsetter
        dessuten at utleien er skattepliktig; hele listen finner du i guiden
        om <Link href="/guide/fradrag-ved-utleie">fradrag ved utleie</Link>.
      </p>

      <h2>Typiske eksempler på vedlikehold og påkostning</h2>
      <table>
        <thead>
          <tr>
            <th>Tiltak</th>
            <th>Skattemessig behandling</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Male veggene i samme farge som før</td>
            <td>Vedlikehold – fullt fradrag nå</td>
          </tr>
          <tr>
            <td>Bytte 25 år gammelt kjøkken til samme relative standard</td>
            <td>Vedlikehold – fullt fradrag nå</td>
          </tr>
          <tr>
            <td>Bytte til vesentlig høyere kjøkkenstandard enn før</td>
            <td>Delvis: fradrag for «tenkt vedlikehold», resten påkostning</td>
          </tr>
          <tr>
            <td>Skifte taket med tilsvarende tekking</td>
            <td>Vedlikehold – fullt fradrag nå</td>
          </tr>
          <tr>
            <td>Bygge bad der det ikke var bad</td>
            <td>Påkostning – legges på inngangsverdien</td>
          </tr>
          <tr>
            <td>Sette opp tilbygg eller innrede nye rom</td>
            <td>Påkostning – legges på inngangsverdien</td>
          </tr>
          <tr>
            <td>Etterisolere til høyere standard enn opprinnelig</td>
            <td>Delvis: vedlikeholdsdelen gir fradrag, hevingen er påkostning</td>
          </tr>
        </tbody>
      </table>
      <p>
        Merk at standard vurderes relativt til boligens tid: et kjøkken med
        normal standard i dag kan erstatte et kjøkken som hadde normal
        standard da det var nytt, og fortsatt regnes som vedlikehold fullt ut.
        Det spiller heller ingen rolle at slitasjen stammer fra tiden før du
        overtok – etterslep etter forrige eier kan også være vedlikehold, noe
        som gjør skillet spesielt viktig når du kjøper slitt og pusser opp.
      </p>

      <h2>«Tenkt vedlikehold»: fradrag selv når du hever standarden</h2>
      <p>
        Bytter du ut noe som faktisk trengte utskifting, men velger høyere
        standard enn boligen hadde, mister du ikke hele fradraget. Regelen om{" "}
        <strong>tenkt vedlikehold</strong> gir fradrag for det tilsvarende
        vedlikehold ville ha kostet, mens merkostnaden regnes som påkostning.
      </p>
      <p>
        Eksempel: Et nedslitt kjøkken byttes ut med et nytt til 250 000 kr.
        Ville et kjøkken med samme relative standard som det gamle kostet
        120 000 kr, får du fradrag for 120 000 kr nå – verdt{" "}
        <strong>26 400 kr</strong> i spart skatt – mens de resterende
        130 000 kr legges på inngangsverdien. Regelen hjelper bare der det
        fantes et reelt vedlikeholdsbehov: helt nye rom og funksjoner, som et
        bad nummer to, er ren påkostning. Dokumenter gjerne anslaget for
        tenkt vedlikehold, for eksempel med et tilbud på en enklere løsning.
      </p>

      <h2>Dokumentasjonen som avgjør</h2>
      <ul>
        <li>
          <strong>Spesifisert faktura:</strong> Be håndverkeren beskrive
          arbeidet, og gjerne dele fakturaen mellom vedlikehold og
          standardheving.
        </li>
        <li>
          <strong>Bilder før og etter:</strong> Viser hva som var slitt og hva
          som ble endret – enkleste bevis for at arbeidet var vedlikehold.
        </li>
        <li>
          <strong>Tilstandsrapporten fra kjøpet:</strong> Dokumenterer
          boligens opprinnelige stand og standard.
        </li>
        <li>
          <strong>Oppbevar alt lenge:</strong> Fradrag kan bli etterspurt
          flere år senere, og påkostninger skal dokumenteres helt frem til
          salget.
        </li>
      </ul>
      <p>
        Grensen beror på en konkret vurdering, og dette er generell
        informasjon, ikke skatterådgivning. Se{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetatens sider om utleie
        </a>{" "}
        for din situasjon.
      </p>

      <h2>Regn effekten inn i prosjektet</h2>
      <p>
        For et{" "}
        <Link href="/guide/oppussingsobjekt-som-utleiebolig">
          oppussingsobjekt
        </Link>{" "}
        kan skillet utgjøre titusener i kontantstrøm det første året. Legg
        vedlikeholdet inn som kostnad i utleiekalkulatoren og se hva fradraget
        gjør med kontantstrømmen etter skatt – gratis og uten konto.
      </p>
    </ArticleLayout>
  );
}
