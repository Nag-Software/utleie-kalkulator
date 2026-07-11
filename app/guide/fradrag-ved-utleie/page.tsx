import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("fradrag-ved-utleie");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hovedregelen: fradrag for alt utleien koster</h2>
      <p>
        Ved skattepliktig utleie får du fradrag for{" "}
        <strong>alle kostnader med tilknytning til leieinntekten</strong>, og
        skatten på 22 % beregnes av netto resultat – ikke av brutto leie. Hver
        tusenlapp du kan dokumentere, reduserer altså skatten med 220 kr.
        Satsene og reglene for når utleie er skattefri finner du i guiden om{" "}
        <Link href="/guide/skatt-pa-utleie-2026">skatt på utleie</Link>; her
        går vi gjennom selve fradragspostene og dokumentasjonen du bør ha i
        orden.
      </p>

      <h2>Fradragspostene én for én</h2>
      <ul>
        <li>
          <strong>Felleskostnader:</strong> Månedlige felleskostnader til
          sameiet eller borettslaget er fullt fradragsberettiget. Sjekk hva de
          dekker – inngår kommunale avgifter og bygningsforsikring, skal du
          ikke føre de postene i tillegg.
        </li>
        <li>
          <strong>Kommunale avgifter og eiendomsskatt:</strong> Gir fradrag når
          du betaler dem selv, slik du typisk gjør i enebolig og småhus.
        </li>
        <li>
          <strong>Forsikring:</strong> Hus- eller utleieforsikring for boligen
          som leies ut.
        </li>
        <li>
          <strong>Vedlikehold:</strong> Arbeid som setter boligen tilbake i
          tidligere stand gir fradrag nå. Standardheving gjør ikke – grensen er
          forklart i guiden om{" "}
          <Link href="/guide/vedlikehold-eller-pakostning">
            vedlikehold eller påkostning
          </Link>
          .
        </li>
        <li>
          <strong>Møbler og inventar:</strong> Gjenstander som koster under{" "}
          <strong>15 000 kr</strong> utgiftsføres direkte i kjøpsåret; dyrere
          gjenstander avskrives med <strong>20 % saldo</strong> per år. Leier
          du ut din egen møblerte bolig i inntil tre år fordi du skal bo der
          igjen, kan et sjablongfradrag på 15 % av brutto leie være
          alternativet.
        </li>
        <li>
          <strong>Utleiemegler og annonsering:</strong> Honorar til megler
          eller forvalter (typisk 8–12 % av leien pluss mva), boligannonser og
          kostnader ved visning.
        </li>
        <li>
          <strong>Regnskap og gebyrer:</strong> Regnskapsføring av utleien og
          gebyrer knyttet til leieforholdet, for eksempel gebyret for å
          opprette depositumskonto.
        </li>
        <li>
          <strong>Reise ved tilsyn:</strong> Rimelige reisekostnader ved
          visning, tilsyn og vedlikehold av utleieboligen.
        </li>
      </ul>
      <p>
        <strong>Gjeldsrenter</strong> kommer i tillegg: de er
        fradragsberettiget i alminnelig inntekt uansett hva lånet finansierer,
        og føres som egen post. Les mer i guiden om{" "}
        <Link href="/guide/rentefradrag-pa-utleielan">
          rentefradrag på utleielån
        </Link>
        .
      </p>

      <h2>Hvilken dokumentasjon trenger du?</h2>
      <p>
        Bilagene skal ikke legges ved skattemeldingen, men Skatteetaten kan be
        om dem flere år tilbake i tid. Hvordan postene føres i praksis, viser
        guiden om{" "}
        <Link href="/guide/skattemelding-leieinntekter">
          leieinntekter i skattemeldingen
        </Link>
        . Et praktisk grep er egen bankkonto for utleien: da ligger
        leieinnbetalinger og kostnader samlet når skattemeldingen skal fylles
        ut. Dette holder normalt som dokumentasjon:
      </p>
      <table>
        <thead>
          <tr>
            <th>Fradragspost</th>
            <th>Typisk dokumentasjon</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Felleskostnader</td>
            <td>Faktura fra sameiet eller borettslaget</td>
          </tr>
          <tr>
            <td>Kommunale avgifter og eiendomsskatt</td>
            <td>Faktura fra kommunen</td>
          </tr>
          <tr>
            <td>Forsikring</td>
            <td>Polise og betalingsbekreftelse</td>
          </tr>
          <tr>
            <td>Vedlikehold</td>
            <td>Spesifisert faktura, kvitteringer, bilder før og etter</td>
          </tr>
          <tr>
            <td>Møbler og inventar</td>
            <td>Kvitteringer med dato og beløp</td>
          </tr>
          <tr>
            <td>Megler og annonsering</td>
            <td>Faktura fra megler, kvittering for annonsen</td>
          </tr>
          <tr>
            <td>Regnskap og gebyrer</td>
            <td>Faktura</td>
          </tr>
          <tr>
            <td>Reise ved tilsyn</td>
            <td>Notat med dato, formål og strekning</td>
          </tr>
        </tbody>
      </table>

      <h2>Regneeksempel: fra brutto leie til skatt</h2>
      <p>
        Si at du leier ut en leilighet for 15 000 kr i måneden –{" "}
        <strong>180 000 kr</strong> i året – og har kostnadene under (tallene
        er eksempler):
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
            <td>Brutto leieinntekter</td>
            <td>180 000 kr</td>
          </tr>
          <tr>
            <td>Felleskostnader</td>
            <td>−36 000 kr</td>
          </tr>
          <tr>
            <td>Kommunale avgifter og eiendomsskatt</td>
            <td>−8 000 kr</td>
          </tr>
          <tr>
            <td>Forsikring</td>
            <td>−3 000 kr</td>
          </tr>
          <tr>
            <td>Vedlikehold</td>
            <td>−15 000 kr</td>
          </tr>
          <tr>
            <td>Møbler (utgiftsført)</td>
            <td>−10 000 kr</td>
          </tr>
          <tr>
            <td>Annonsering og visning</td>
            <td>−2 000 kr</td>
          </tr>
          <tr>
            <td>Reise ved tilsyn</td>
            <td>−1 000 kr</td>
          </tr>
          <tr>
            <td>
              <strong>Netto skattepliktig leieinntekt</strong>
            </td>
            <td>
              <strong>105 000 kr</strong>
            </td>
          </tr>
          <tr>
            <td>Skatt (22 %)</td>
            <td>23 100 kr</td>
          </tr>
        </tbody>
      </table>
      <p>
        Uten fradragene ville skatten vært 39 600 kr. Dokumentasjonen er med
        andre ord verdt <strong>16 500 kr</strong> i spart skatt i dette
        eksempelet – og har du i tillegg 100 000 kr i gjeldsrenter, reduserer
        rentefradraget skatten med ytterligere 22 000 kr.
      </p>
      <p>
        Fradragsreglene har detaljer og unntak – dette er generell
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

      <h2>Fradragene hører hjemme i kalkylen</h2>
      <p>
        Skal du vurdere en utleiebolig, må fradragene inn i regnestykket fra
        start: det er kontantstrømmen <em>etter skatt</em> som avgjør om
        prosjektet bærer seg. Utleiekalkulatoren trekker kostnadene fra leien,
        regner 22 % skatt av netto og viser hva du faktisk sitter igjen med per
        måned og år – gratis og uten konto.
      </p>
    </ArticleLayout>
  );
}
