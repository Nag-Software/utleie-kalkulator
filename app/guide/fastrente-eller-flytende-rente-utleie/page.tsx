import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("fastrente-eller-flytende-rente-utleie");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Valget handler om risiko, ikke om å spå renten</h2>
      <p>
        <strong>Flytende rente</strong> har historisk vært billigst over tid,
        men lar hele renterisikoen ligge hos deg. <strong>Fastrente</strong>{" "}
        i 3, 5 eller 10 år koster normalt et påslag, men låser den viktigste
        marginen i utleieregnskapet: avstanden mellom leieinntekt og
        rentekostnad. Ingen vet hvor renten skal – valget handler derfor om
        hvor stor renteøkning kontantstrømmen din tåler, ikke om å gjette
        bedre enn markedet.
      </p>

      <h2>Flytende rente: historisk billigst, full risiko</h2>
      <p>
        Over lange perioder har flytende rente som regel gitt lavere samlet
        rentekostnad enn binding – i fastrenten ligger det i praksis en
        forsikringspremie. Historikk er likevel ingen garanti, og
        styringsrenten har svingt mye gjennom tiårene (historiske renter
        finner du hos{" "}
        <a
          href="https://www.norges-bank.no"
          rel="noopener noreferrer"
          target="_blank"
        >
          Norges Bank
        </a>
        ). Problemet for en utleier er asymmetrien: lånerenten kan endres
        flere ganger i året, mens leien normalt bare kan KPI-justeres én gang
        i året. Stiger renten raskt, skvises marginen fra begge kanter.
      </p>

      <h2>Fastrente: du låser marginen mellom leie og rente</h2>
      <p>
        For en utleier er poenget med fastrente ikke å slå markedet, men å
        gjøre{" "}
        <Link href="/guide/kontantstrom-utleiebolig">kontantstrømmen</Link>{" "}
        forutsigbar: kjent rentekostnad pluss nokså stabil leie betyr at
        marginen er låst i hele bindingsperioden. Det har en verdi i seg
        selv – særlig med høy belåning og små marginer. Ulempene:
      </p>
      <ul>
        <li>
          <strong>Påslaget:</strong> fastrente er normalt priset noe over
          flytende ved inngåelse – prisen for forutsigbarheten.
        </li>
        <li>
          <strong>Overkurs:</strong> innfrir du lånet i bindingsperioden –
          for eksempel fordi du selger – og markedsrenten da er lavere enn
          fastrenten din, må du betale overkurs til banken. Bindingen har en
          pris begge veier (er markedsrenten høyere, kan du få underkurs).
        </li>
        <li>
          <strong>Du mister rentefall:</strong> faller renten, sitter du med
          den gamle prisen bindingsperioden ut.
        </li>
        <li>
          <strong>Mindre fleksibilitet:</strong> ekstra nedbetaling og
          endringer på lånet er normalt begrenset i bindingstiden.
        </li>
      </ul>

      <h2>Regneeksempel: kontantstrøm ved ulike renter</h2>
      <p>
        Ta en leilighet med 18 000 kr i månedlig leie, 3 500 kr i
        driftskostnader og et avdragsfritt lån på 3 000 000 kr. Rentesatsene
        er illustrasjoner, ikke prognoser; skatt og avdrag er holdt utenfor
        – i praksis demper{" "}
        <Link href="/guide/rentefradrag-pa-utleielan">rentefradraget</Link>{" "}
        utslagene noe.
      </p>
      <table>
        <thead>
          <tr>
            <th>Rente</th>
            <th>Renter per måned</th>
            <th>Kontantstrøm per måned</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>4,0 %</td>
            <td>10 000 kr</td>
            <td>+4 500 kr</td>
          </tr>
          <tr>
            <td>5,5 %</td>
            <td>13 750 kr</td>
            <td>+750 kr</td>
          </tr>
          <tr>
            <td>7,0 %</td>
            <td>17 500 kr</td>
            <td>−3 000 kr</td>
          </tr>
          <tr>
            <td>8,5 %</td>
            <td>21 250 kr</td>
            <td>−6 750 kr</td>
          </tr>
        </tbody>
      </table>
      <p>
        Fra 5,5 % til 8,5 % – nøyaktig de 3 prosentpoengene bankene
        stresstester mot – snur månedsresultatet fra +750 kr til −6 750 kr.
        Det er en forverring på 90 000 kr i året, uten at leien kan økes
        tilsvarende.
      </p>

      <h2>Delt lån: halvparten fast, halvparten flytende</h2>
      <p>
        Du må ikke velge alt eller ingenting. De fleste banker lar deg dele
        lånet i en fast og en flytende del. Da halverer du utslaget av
        renteendringer begge veier og beholder fleksibiliteten på den
        flytende delen – et ryddig kompromiss for utleiere som vil dempe
        risikoen uten å binde alt.
      </p>

      <h2>Stresstesten avgjør – regn før du velger</h2>
      <p>
        Tåler økonomien din 3 prosentpoeng høyere rente uten at prosjektet
        velter, er flytende rente et informert valg – det er samme test som
        ligger i{" "}
        <Link href="/guide/egenkapital-og-lan-til-utleiebolig">
          utlånsforskriftens krav
        </Link>
        . Gir en slik økning negativ kontantstrøm du ikke kan bære over tid,
        er fastrente en forsikringspremie verdt å vurdere.
      </p>
      <p>
        Utleiekalkulatoren viser <strong>break-even-renten</strong> for
        prosjektet ditt – rentenivået der kontantstrømmen går i null – og
        hva ulike renter gjør med månedsresultatet, som i tabellen over.
        Ligger{" "}
        <Link href="/guide/break-even-for-utleiebolig">break-even</Link>{" "}
        langt over rentetilbudene du får, har du margin til å flyte; ligger
        den rett over, vet du nøyaktig hva fastrenten forsikrer deg mot.
        Gratis og uten konto.
      </p>
    </ArticleLayout>
  );
}
