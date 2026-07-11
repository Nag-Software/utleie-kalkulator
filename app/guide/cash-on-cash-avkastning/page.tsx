import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("cash-on-cash-avkastning");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Formelen for cash-on-cash</h2>
      <p>
        <strong>
          Cash-on-cash = årlig kontantstrøm etter skatt / investert
          egenkapital × 100.
        </strong>{" "}
        Investert egenkapital er alt du selv har lagt på bordet: egenkapitalen
        ved kjøpet pluss omkostninger og eventuell oppussing.{" "}
        <Link href="/guide/kontantstrom-utleiebolig">
          Kontantstrømmen etter skatt
        </Link>{" "}
        er det som faktisk står igjen når drift, renter, skatt og avdrag er
        betalt. Tallet svarer dermed på investorens egentlige spørsmål: hvor
        mye kaster pengene du selv har bundet opp, av seg hvert år?
      </p>

      <h2>Yield måler boligen – cash-on-cash måler pengene dine</h2>
      <p>
        <Link href="/guide/yield-utleiebolig">Yield</Link> beskriver
        eiendommen som om den var kjøpt kontant: leie mot kjøpesum, upåvirket
        av finansieringen. Cash-on-cash tar med lånet. Fordi banken gjerne
        finansierer mesteparten av boligen, kan avkastningen på egenkapitalen
        bli en helt annen enn boligens yield – høyere når lånet koster mindre
        enn boligen kaster av seg, lavere når det er omvendt. To investorer
        som kjøper identiske boliger med ulik belåning får samme yield, men
        vidt forskjellig cash-on-cash.
      </p>

      <h2>Regneeksempel: 25 % mot 40 % egenkapital</h2>
      <p>
        Ta en leilighet i en mindre by: kjøpesum 2 400 000 kr, omkostninger
        61 000 kr, utleid for 15 000 kr i måneden. Etter tomgang og
        driftskostnader på til sammen 45 000 kr er netto drift 135 000 kr i
        året, og renten er 5 %. For å rendyrke effekten av belåningen regner
        vi uten avdrag – i praksis krever utlånsforskriften avdrag ved
        belåningsgrad over 60 %, og avdragene kommer vi tilbake til under
        fellene.
      </p>
      <table>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>25 % egenkapital</th>
            <th>40 % egenkapital</th>
            <th>Uten lån</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Investert kapital (EK + omkostninger)</td>
            <td>661 000 kr</td>
            <td>1 021 000 kr</td>
            <td>2 461 000 kr</td>
          </tr>
          <tr>
            <td>Lån</td>
            <td>1 800 000 kr</td>
            <td>1 440 000 kr</td>
            <td>0 kr</td>
          </tr>
          <tr>
            <td>Renter (5 %)</td>
            <td>90 000 kr</td>
            <td>72 000 kr</td>
            <td>0 kr</td>
          </tr>
          <tr>
            <td>Kontantstrøm etter skatt</td>
            <td>35 100 kr</td>
            <td>49 140 kr</td>
            <td>105 300 kr</td>
          </tr>
          <tr>
            <td>
              <strong>Cash-on-cash</strong>
            </td>
            <td>
              <strong>5,3 %</strong>
            </td>
            <td>
              <strong>4,8 %</strong>
            </td>
            <td>
              <strong>4,3 %</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Jo mindre egenkapital, desto høyere cash-on-cash: med 25 %
        egenkapital jobber 1 800 000 lånte kroner for deg til en rente som er
        lavere enn boligens nettoavkastning. Det er{" "}
        <Link href="/guide/gearing-og-belaningsgrad">gearing</Link> i praksis
        – og den virker begge veier. Stiger renten over boligens
        nettoavkastning, snur fortegnet: da er det den med mest lån som får
        dårligst cash-on-cash.
      </p>

      <h2>Fellene i cash-on-cash</h2>
      <ul>
        <li>
          <strong>Avdragene straffes urettferdig:</strong> avdrag reduserer
          kontantstrømmen, men pengene forsvinner ikke – de blir til redusert
          gjeld. En bolig med høye avdrag kan vise svak eller negativ
          cash-on-cash samtidig som formuen din vokser hvert år. Tallet
          undervurderer da totalavkastningen.
        </li>
        <li>
          <strong>Verdistigning telles ikke:</strong> cash-on-cash måler bare
          kontanter. Historisk har verdistigningen stått for en stor del av
          totalavkastningen i pressområder – men den vises ikke her.
        </li>
        <li>
          <strong>Høyt tall kan bety høy risiko:</strong> maksimal belåning
          gir høyest cash-on-cash på papiret, men også minst margin mot
          renteøkning og tomgang. Et imponerende tall kan være et faresignal,
          ikke et kvalitetsstempel.
        </li>
      </ul>

      <h2>Totalavkastningen har tre deler, ikke én</h2>
      <p>
        Den fulle avkastningen på egenkapitalen er summen av{" "}
        <strong>cash-on-cash + nedbetaling av lån + verdistigning</strong>.
        Cash-on-cash fanger kontantene, avdragene fanger formuesbyggingen, og{" "}
        <Link href="/guide/verdistigning-pa-bolig">verdistigningen</Link> er
        oppsiden du håper på, men ikke bør basere kjøpet på – bruk gjerne 0 %
        som stresstest. Vurder aldri en utleiebolig på cash-on-cash alene.
      </p>

      <h2>Kalkulatoren regner cash-on-cash for deg</h2>
      <p>
        Utleiekalkulatoren beregner cash-on-cash sammen med kontantstrøm
        etter skatt, yield og break-even – og lar deg endre egenkapitalen og
        se effekten umiddelbart. Test kjøpet med både 25 og 40 %
        egenkapital, og med renten et par prosentpoeng opp, før du bestemmer
        deg. Gratis og uten konto.
      </p>
    </ArticleLayout>
  );
}
