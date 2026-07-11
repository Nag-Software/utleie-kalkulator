import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("utleiebolig-gjennom-as");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hovedforskjellen: 22 % nå – eller ca. 51,5 % når pengene skal ut</h2>
      <p>
        Eier du utleieboligen privat, betaler du <strong>22 %</strong> skatt
        på netto leieinntekt og 22 % på gevinst ved salg – ferdig skattet. I
        et AS betaler selskapet også 22 %, men skal du ha pengene ut til
        privat forbruk, kommer{" "}
        <strong>utbytteskatt på effektivt 37,84 %</strong> på toppen. Samlet
        blir det <strong>ca. 51,5 %</strong> hvis alt deles ut. AS er derfor
        sjelden et grep for lavere skatt her og nå – det er et verktøy for{" "}
        <strong>reinvestering</strong> og stordrift.
      </p>

      <h2>Regneeksempel: 100 000 kr i netto leieoverskudd</h2>
      <table>
        <thead>
          <tr>
            <th>Post</th>
            <th>Privat</th>
            <th>AS, alt tas ut</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Netto leieoverskudd</td>
            <td>100 000 kr</td>
            <td>100 000 kr</td>
          </tr>
          <tr>
            <td>Skatt 22 %</td>
            <td>22 000 kr</td>
            <td>22 000 kr</td>
          </tr>
          <tr>
            <td>Utbytteskatt (effektivt 37,84 % av 78 000 kr)</td>
            <td>–</td>
            <td>ca. 29 500 kr</td>
          </tr>
          <tr>
            <td>
              <strong>Igjen til deg</strong>
            </td>
            <td>
              <strong>78 000 kr</strong>
            </td>
            <td>
              <strong>ca. 48 500 kr</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Utbytteskatten forsvinner ikke ved å vente, men den{" "}
        <strong>utsettes</strong>. Lar du overskuddet stå i selskapet, jobber
        78 000 kr videre i neste prosjekt – kapital som bare er beskattet med
        22 %, ruller videre med rentes rente så lenge du reinvesterer i stedet
        for å ta utbytte.
      </p>

      <h2>Når AS-strukturen virkelig monner</h2>
      <p>
        Så lenge privat utleie beskattes som kapitalinntekt, er den løpende
        skatten lik (22 %), og AS gir ingen årlig fordel. Forskjellen oppstår
        når utleien blir <strong>næringsvirksomhet</strong> – tommelfingeren
        er{" "}
        <Link href="/guide/nar-blir-utleie-naeringsvirksomhet">
          fem boenheter eller mer
        </Link>
        : da beskattes overskuddet privat som personinntekt med opp mot ca.
        50 %, mens AS-et fortsatt betaler 22 %. Nesten dobbelt så mye står
        igjen til neste kjøp hvert eneste år.
      </p>
      <p>
        Den andre store fordelen er <strong>fritaksmetoden</strong>: eier du
        eiendoms-AS-et gjennom et holdingselskap og selger aksjene, er
        gevinsten i praksis skattefri innenfor selskapssfæren. Hele
        salgssummen kan reinvesteres, og skatt betales først når du tar penger
        ut privat. Selger du en privateid utleiebolig, betaler du 22 % av
        gevinsten ved hvert salg – se guiden om{" "}
        <Link href="/guide/skatt-ved-salg-av-utleiebolig">
          skatt ved salg av utleiebolig
        </Link>
        .
      </p>

      <h2>Kostnadene: stiftelse, regnskap og mer egenkapital</h2>
      <ul>
        <li>
          <strong>Etablering og drift:</strong> stiftelse med aksjekapital og
          gebyrer, løpende bokføring, årsregnskap og egen skattemelding for
          selskapet – og eventuelt revisjon. Faste årlige kostnader som en
          liten utleieøkonomi må klare å bære.
        </li>
        <li>
          <strong>Strengere bank:</strong> banker krever ofte{" "}
          <strong>25–35 % egenkapital</strong> ved lån til eiendoms-AS, mot
          minst 10 % for privatpersoner etter utlånsforskriften – se guiden om{" "}
          <Link href="/guide/egenkapital-og-lan-til-utleiebolig">
            egenkapital og lån til utleiebolig
          </Link>
          . Mer bundet kapital per bolig betyr færre boliger for samme penger.
        </li>
      </ul>

      <h2>Eier du boligen privat? Overføring til AS er dyrt</h2>
      <p>
        Å flytte en privateid bolig inn i eget AS regnes skattemessig som
        salg: det utløser{" "}
        <Link href="/guide/dokumentavgift-og-omkostninger">
          dokumentavgift
        </Link>{" "}
        på <strong>2,5 %</strong> av markedsverdien på nytt, og eventuell
        gevinst beskattes med 22 % hos deg. På en bolig verdt 4 000 000 kr er
        dokumentavgiften alene 100 000 kr. Konklusjonen er enkel: valget
        mellom privat og AS bør tas <strong>før</strong> du kjøper, ikke
        etterpå.
      </p>

      <h2>Privat eller AS: oppsummert</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Privat</th>
            <th>AS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Løpende skatt på overskudd</td>
            <td>22 % (opp mot ca. 50 % ved næring)</td>
            <td>22 % i selskapet</td>
          </tr>
          <tr>
            <td>Uttak til privat forbruk</td>
            <td>Ingen ekstra skatt</td>
            <td>Utbytteskatt – totalt ca. 51,5 %</td>
          </tr>
          <tr>
            <td>Gevinst ved salg</td>
            <td>22 %</td>
            <td>22 % i selskapet; fritaksmetoden ved salg av aksjene</td>
          </tr>
          <tr>
            <td>Egenkapitalkrav i bank</td>
            <td>Fra 10 %</td>
            <td>Ofte 25–35 %</td>
          </tr>
          <tr>
            <td>Administrasjon</td>
            <td>Føres i skattemeldingen</td>
            <td>Regnskap, årsregnskap, ev. revisjon</td>
          </tr>
        </tbody>
      </table>
      <p>
        Tommelfinger: <strong>privat vinner</strong> med én til to boliger og
        behov for leieoverskuddet i privatøkonomien.{" "}
        <strong>AS lønner seg</strong> ved mange enheter, planer om å
        reinvestere overskudd og gevinster i nye boliger, og lang horisont.
        Dette er generell informasjon, ikke skatterådgivning – regn på
        strukturvalget konkret, og se{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetatens utleiesider
        </a>{" "}
        for detaljene.
      </p>

      <h2>Regn på selve prosjektet først</h2>
      <p>
        Privat eller AS endrer skatten og finansieringen – ikke om boligen i
        seg selv er et godt kjøp. Bruk utleiekalkulatoren til å regne
        kontantstrøm, yield og break-even på prosjektet først, gratis og uten
        konto. Skattesatsen setter du selv, så du kan teste både 22 % og
        næringsnivå – og går ikke regnestykket opp der, redder ingen
        selskapsstruktur det.
      </p>
    </ArticleLayout>
  );
}
