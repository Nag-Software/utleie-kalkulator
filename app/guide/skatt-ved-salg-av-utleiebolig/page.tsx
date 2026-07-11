import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("skatt-ved-salg-av-utleiebolig");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hovedregelen: 22 % skatt på gevinsten</h2>
      <p>
        Gevinst ved salg av utleiebolig beskattes som kapitalinntekt med{" "}
        <strong>22 %</strong>. En bolig som har vært leid ut hele eiertiden,
        oppfyller normalt ikke kravet til botid, og da er hele gevinsten
        skattepliktig – uansett hvor lenge du har eid den. Skatten beregnes av
        netto gevinst, ikke av salgssummen, så inngangsverdien og
        dokumentasjonen din betyr mye for sluttregningen. Utleien i eiertiden
        endrer ikke satsen: leieinntektene er skattlagt løpende, og gevinsten
        beskattes for seg. Gevinst og tap føres i skattemeldingen for
        salgsåret.
      </p>

      <h2>Botidsregelen: slik blir salget skattefritt</h2>
      <p>
        Gevinsten er skattefri hvis du har{" "}
        <strong>eid boligen i mer enn ett år</strong> og{" "}
        <strong>bodd i den i minst 12 av de siste 24 månedene</strong> før
        salget. For en ren utleiebolig er botiden null, og regelen treffer
        derfor sjelden – men den åpner et lovlig handlingsrom som vi kommer
        tilbake til nedenfor.
      </p>

      <h2>Slik beregnes gevinsten – med regneeksempel</h2>
      <p>
        Gevinsten er salgssum minus salgskostnader minus{" "}
        <strong>inngangsverdi</strong>. Inngangsverdien er kjøpesummen pluss
        kjøpsomkostninger – som{" "}
        <Link href="/guide/dokumentavgift-og-omkostninger">
          dokumentavgift og gebyrer
        </Link>{" "}
        – pluss påkostninger i eiertiden.
      </p>
      <table>
        <thead>
          <tr>
            <th>Post</th>
            <th>Beløp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Salgssum</td>
            <td>4 000 000 kr</td>
          </tr>
          <tr>
            <td>− Salgskostnader (megler, annonser, styling)</td>
            <td>100 000 kr</td>
          </tr>
          <tr>
            <td>− Kjøpesum</td>
            <td>3 000 000 kr</td>
          </tr>
          <tr>
            <td>− Dokumentavgift og omkostninger ved kjøpet</td>
            <td>80 000 kr</td>
          </tr>
          <tr>
            <td>− Påkostninger (dokumenterte standardhevinger)</td>
            <td>200 000 kr</td>
          </tr>
          <tr>
            <td>
              <strong>= Skattepliktig gevinst</strong>
            </td>
            <td>
              <strong>620 000 kr</strong>
            </td>
          </tr>
          <tr>
            <td>Skatt (22 %)</td>
            <td>136 400 kr</td>
          </tr>
        </tbody>
      </table>
      <p>
        Merk skillet: <strong>vedlikehold</strong> er allerede fradragsført
        løpende mot leieinntektene, mens <strong>påkostninger</strong> først
        får effekt her – de legges til inngangsverdien og reduserer gevinsten.
        Grensen mellom de to er forklart i guiden om{" "}
        <Link href="/guide/vedlikehold-eller-pakostning">
          vedlikehold eller påkostning
        </Link>
        . Eksempelet viser også hva dokumentasjon er verdt: uten bilag for
        påkostningene på 200 000 kr øker den skattepliktige gevinsten til
        820 000 kr – og skatten med 44 000 kr.
      </p>

      <h2>Tap gir fradrag – etter samme regler</h2>
      <p>
        Reglene er symmetriske: <strong>tap er fradragsberettiget</strong> når
        en gevinst ville vært skattepliktig. Selger du utleieboligen med
        300 000 kr i tap, reduserer det skatten din med 66 000 kr (22 %),
        forutsatt at du har inntekt å føre fradraget mot. Har du derimot
        opparbeidet botid, er gevinsten skattefri – men da er et tap heller
        ikke fradragsberettiget.
      </p>

      <h2>Lovlige grep som reduserer skatten</h2>
      <ul>
        <li>
          <strong>Flytt inn og opparbeid botid.</strong> Bor du reelt i
          boligen i minst 12 av de siste 24 månedene før salget, og har eid
          den i over ett år, blir gevinsten skattefri. Innflyttingen må være
          reell – proformaflytting holder ikke.
        </li>
        <li>
          <strong>Dokumenter påkostningene.</strong> Kvitteringer for
          standardhevinger gjennom hele eiertiden øker inngangsverdien og
          kutter gevinsten krone for krone. Uten bilag, intet fradrag.
        </li>
        <li>
          <strong>Tenk deg om før du flytter inn ved tap.</strong> Botid
          fjerner også tapsfradraget. Ligger boligen an til å selges med tap,
          kan innflytting koste deg 22 % av tapet i tapt fradrag.
        </li>
        <li>
          <strong>Se salget i sammenheng med annen inntekt.</strong> Et
          tapsfradrag har bare verdi hvis du har inntekt å føre det mot i
          salgsåret.
        </li>
      </ul>
      <p>
        Dette er generell informasjon, ikke skatterådgivning – reglene har
        unntak, blant annet ved brukshindring og arv. Se{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/salg/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetatens sider om salg av bolig og eiendom
        </a>
        .
      </p>

      <h2>Gevinstskatten hører hjemme i totalregnestykket</h2>
      <p>
        En stor del av avkastningen på en utleiebolig kommer ofte ved salget,
        ikke i den løpende driften. Utleiekalkulatorens flerårige prognose
        viser hvordan{" "}
        <Link href="/guide/verdistigning-pa-bolig">verdistigning</Link> og
        avdrag bygger egenkapital år for år – husk å trekke 22 % av gevinsten
        fra sluttsummen når du vurderer hva et fremtidig salg faktisk vil gi
        deg. Kalkulatoren er gratis og krever ingen konto.
      </p>
    </ArticleLayout>
  );
}
