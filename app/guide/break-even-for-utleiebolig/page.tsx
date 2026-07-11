import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("break-even-for-utleiebolig");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>De to tallene som viser tåleevnen din</h2>
      <p>
        <strong>Break-even-leie</strong> er leien der kontantstrømmen går i
        null: alt under betyr at du må dekke mellomlegget fra egen lomme hver
        måned. <strong>Break-even-rente</strong> er renten der resultatet går
        i null: alt over betyr at driften ikke lenger dekker rentene. Sammen
        viser de hvor stor margin kjøpet har mot de to største truslene i
        utleieregnskapet – leiefall og renteøkning – og de bør regnes ut før
        budrunden, ikke etter.
      </p>

      <h2>Regneeksempel med full kostnadsoppstilling</h2>
      <p>
        Vi bruker samme oppstilling som i guiden om{" "}
        <Link href="/guide/kontantstrom-utleiebolig">kontantstrøm</Link>: en
        leilighet kjøpt for 3 000 000 kr med 25 % egenkapital, lån på
        2 250 000 kr til 5 % rente og 25 års nedbetaling (avdrag om lag
        45 000 kr det første året). Boligen leies ut for 16 000 kr i måneden
        – som her også er markedsleien.
      </p>
      <table>
        <thead>
          <tr>
            <th>Post</th>
            <th>Beløp per år</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Brutto leie (16 000 kr × 12)</td>
            <td>192 000 kr</td>
          </tr>
          <tr>
            <td>− Tomgang (5 %)</td>
            <td>−9 600 kr</td>
          </tr>
          <tr>
            <td>− Felleskostnader</td>
            <td>−30 000 kr</td>
          </tr>
          <tr>
            <td>− Kommunale avgifter og forsikring</td>
            <td>−8 000 kr</td>
          </tr>
          <tr>
            <td>− Vedlikeholdsavsetning</td>
            <td>−12 400 kr</td>
          </tr>
          <tr>
            <td>
              <strong>= Netto drift</strong>
            </td>
            <td>
              <strong>132 000 kr</strong>
            </td>
          </tr>
          <tr>
            <td>− Renter (5 % av 2 250 000 kr)</td>
            <td>−112 500 kr</td>
          </tr>
          <tr>
            <td>
              <strong>= Resultat før skatt</strong>
            </td>
            <td>
              <strong>19 500 kr</strong>
            </td>
          </tr>
          <tr>
            <td>− Skatt (22 %)</td>
            <td>−4 290 kr</td>
          </tr>
          <tr>
            <td>− Avdrag (første år)</td>
            <td>−45 000 kr</td>
          </tr>
          <tr>
            <td>
              <strong>= Kontantstrøm etter skatt</strong>
            </td>
            <td>
              <strong>−29 790 kr</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Break-even-leie: her går kontantstrømmen i null</h3>
      <p>
        Leien må dekke driftskostnader og renter – 162 900 kr i året – pluss
        avdragene. Avdrag betales av allerede skattlagte kroner, så 45 000 kr
        i avdrag krever 45 000 / 0,78 ≈ 57 700 kr i leie før skatt. Med 5 %
        tomgang innregnet lander break-even-leien på rundt{" "}
        <strong>19 400 kr i måneden</strong>. Markedsleien er 16 000 kr –
        altså under break-even, og tabellen viser konsekvensen: omtrent
        2 500 kr må skytes inn hver måned.
      </p>
      <p>
        Merk nyansen: allerede ved rundt 14 300 kr i måneden dekkes drift og
        renter, slik at resultatet er positivt. Mellomrommet opp til
        19 400 kr er avdrag – penger som flyttes fra kontoen din til formuen
        din.
      </p>

      <h3>Break-even-rente: her går resultatet i null</h3>
      <p>
        Netto drift er 132 000 kr. Break-even-renten blir 132 000 /
        2 250 000 = <strong>om lag 5,9 %</strong>. Ved den renten går drift
        og renter akkurat opp i opp – avdragene kommer i tillegg. Med 5 %
        rente i dag er marginen bare 0,9 prosentpoeng.
      </p>

      <h2>Slik bruker du tallene før budrunden</h2>
      <ul>
        <li>
          <strong>Break-even-leie mot markedsleie:</strong> undersøk{" "}
          <Link href="/guide/hva-kan-jeg-leie-ut-for">
            hva tilsvarende boliger faktisk leies ut for
          </Link>
          , og sammenlign. Marginen er sikkerhetsbufferen din mot leiefall og
          tomgang. I eksempelet er marginen negativ – da skal du vite på
          forhånd at kjøpet krever månedlig påfyll, og prise budet deretter.
        </li>
        <li>
          <strong>Break-even-rente mot dagens rente pluss 3 prosentpoeng:</strong>{" "}
          det er samme stresstest som{" "}
          <Link href="/guide/egenkapital-og-lan-til-utleiebolig">
            banken bruker
          </Link>
          . En break-even-rente på 5,9 % tåler ikke en rentetopp på 8 % – da
          må bufferen din bære et negativt resultat i en periode.
        </li>
      </ul>

      <h2>Hva flytter break-even?</h2>
      <ul>
        <li>
          <strong>Egenkapitalandelen:</strong> mer egenkapital gir mindre
          lån, lavere renter og lavere avdrag. Med 40 % egenkapital i
          eksempelet faller lånet til 1 800 000 kr, og break-even-renten
          stiger til 7,3 %.
        </li>
        <li>
          <strong>Avdragsfrihet:</strong> fjerner avdragsleddet og senker
          break-even-leien fra 19 400 kr til rundt 14 300 kr i eksempelet –
          men{" "}
          <Link href="/guide/avdragsfrihet-pa-utleiebolig">
            bygger ingen formue
          </Link>{" "}
          og krever normalt en belåningsgrad på 60 % eller lavere.
        </li>
        <li>
          <strong>Felleskostnadene:</strong> hver ekstra tusenlapp i måneden
          løfter break-even-leien omtrent tilsvarende. To ellers like boliger
          kan ha vidt forskjellig break-even på grunn av felleskostnadene
          alene.
        </li>
      </ul>

      <h2>Kalkulatoren regner begge automatisk</h2>
      <p>
        Utleiekalkulatoren viser break-even-leie og break-even-rente direkte
        når du legger inn kjøpesum, leie, lån og kostnader – og du kan flytte
        på egenkapital, avdragstid og rente og se hvordan marginene endrer
        seg. Regn ut begge tallene før du setter deg i budrunden, så vet du
        nøyaktig hvor smertegrensen går. Gratis og uten konto.
      </p>
    </ArticleLayout>
  );
}
