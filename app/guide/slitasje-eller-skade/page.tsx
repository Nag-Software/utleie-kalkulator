import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("slitasje-eller-skade");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hovedregelen: samme stand, minus normal slitasje</h2>
      <p>
        Leietaker skal levere boligen tilbake i samme stand som ved
        innflytting – med fradrag for <strong>normal slitasje og elde</strong>.
        Normal slitasje er utleiers kostnad: den er en del av det leien skal
        dekke, og kan ikke trekkes fra depositumet. <strong>Skader</strong>,
        uaktsom bruk og manglende rengjøring kan derimot kreves erstattet,
        typisk som trekk i depositumet.
      </p>
      <p>
        Hva som er normalt, avhenger av botid og bruk: etter fem år med
        barnefamilie er merker på vegger og gulv å forvente, mens de samme
        merkene etter et halvt år lettere blir vurdert som skade. Et nyttig
        kontrollspørsmål er om endringen kunne oppstått ved vanlig,
        forsvarlig bruk over den aktuelle botiden. Kunne den det, er det
        slitasje – kunne den ikke, peker det mot skade.
      </p>

      <h2>Typiske grensetilfeller</h2>
      <table>
        <thead>
          <tr>
            <th>Tilfelle</th>
            <th>Vurdering</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Matte vegger, småmerker og riper etter noen års botid</td>
            <td>Normal slitasje – utleiers kostnad</td>
          </tr>
          <tr>
            <td>Noen skruehull etter bilder og oppheng</td>
            <td>Som regel normal slitasje</td>
          </tr>
          <tr>
            <td>Mange eller store hull etter hyllemontering utover det vanlige</td>
            <td>Skade – kan kreves utbedret</td>
          </tr>
          <tr>
            <td>Brennmerker på benkeplate eller parkett</td>
            <td>Skade</td>
          </tr>
          <tr>
            <td>Knuste fliser eller sprukket servant</td>
            <td>Skade</td>
          </tr>
          <tr>
            <td>Riper, hakk og lukt etter husdyr</td>
            <td>Skade utover normal slitasje</td>
          </tr>
          <tr>
            <td>Sterkt tilsmusset bolig uten sluttvask</td>
            <td>Rengjøring kan kreves dekket</td>
          </tr>
        </tbody>
      </table>

      <h2>Levetid: du får ikke nytt bad på leietakers regning</h2>
      <p>
        Overflater og innredning har en forventet levetid, og et
        erstatningskrav tar utgangspunkt i <strong>restverdien</strong>, ikke
        nyprisen. Ødelegger leietaker noe som allerede var gammelt og
        nedslitt, er restverdien lav – og et rimelig trekk tilsvarende lite.
        Husleietvistutvalget bruker slike <strong>aldersfradrag</strong>{" "}
        konsekvent i praksisen sin: utflytting er ikke en anledning til å
        oppgradere boligen på leietakers regning. Et 20 år gammelt bad med
        vannskade etter uforsvarlig bruk gir med andre ord et beskjedent
        krav – badet var uansett modent for utskifting, og du får ikke nytt
        bad betalt av leietaker.
      </p>

      <h2>Regneeksempel: et rimelig depositumstrekk</h2>
      <p>
        Et eksempel: leietaker flytter ut etter å ha satt et brennmerke i
        benkeplaten, og boligen er ikke sluttvasket. Ny benkeplate ferdig
        montert koster 12 000 kr, men platen var åtte år gammel med en
        forventet levetid på rundt 15 år – restverdien er altså under
        halvparten. Et rimelig trekk er da i størrelsesorden{" "}
        <strong>5 000–6 000 kr</strong>, ikke 12 000 kr. Legg til
        dokumentert sluttvask til 2 500 kr, og samlet trekk blir rundt
        8 000 kr av et depositum på 45 000 kr. Resten skal tilbake til
        leietaker. Dokumenter alltid trekket med faktura eller kvittering –
        et rundt beløp uten bilag står svakt hvis leietaker bestrider det.
      </p>

      <h2>Bevis og uenighet: protokoll, bilder og HTU</h2>
      <p>
        Grensen mellom slitasje og skade avgjøres i praksis av
        dokumentasjonen. En signert{" "}
        <Link href="/guide/overtakelsesprotokoll">overtakelsesprotokoll</Link>{" "}
        med daterte bilder fra både innflytting og utflytting viser hva som
        faktisk endret seg i leietiden – uten den står påstand mot påstand,
        og tvilen går gjerne ut over utleieren. Blir dere ikke enige om
        trekket, kan pengene ikke tas ensidig fra kontoen: følg reglene i
        guiden om{" "}
        <Link href="/guide/depositum-regler-og-depositumskonto">
          depositum og depositumskonto
        </Link>
        , og la eventuelt <strong>Husleietvistutvalget</strong> avgjøre
        saken – gebyret er lavt. Dette er generell informasjon, ikke
        juridisk rådgivning – se{" "}
        <a
          href="https://www.htu.no/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Husleietvistutvalget
        </a>{" "}
        for veiledning og praksis.
      </p>

      <h2>Slitasje er en driftskostnad – regn med den</h2>
      <p>
        Siden normal slitasje er din kostnad, hører den hjemme i kalkylen
        som vedlikehold, ikke som en overraskelse ved utflytting. Sett av et
        årlig beløp, slik guiden om{" "}
        <Link href="/guide/vedlikeholdsbudsjett-utleiebolig">
          vedlikeholdsbudsjett
        </Link>{" "}
        beskriver, og legg det inn i utleiekalkulatoren. Da ser du
        kontantstrøm og netto yield med realistiske kostnader – ikke bare
        slik det ser ut i et år uten utgifter. Kalkulatoren er gratis og
        uten konto.
      </p>
    </ArticleLayout>
  );
}
