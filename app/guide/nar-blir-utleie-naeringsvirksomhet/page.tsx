import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("nar-blir-utleie-naeringsvirksomhet");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Femboligregelen: fem enheter eller mer er normalt næring</h2>
      <p>
        Utleie av <strong>fire boenheter eller færre</strong> til langtidsleie
        regnes normalt som passiv kapitalplassering, og overskuddet beskattes
        som kapitalinntekt med 22 %. Leier du ut{" "}
        <strong>fem boenheter eller mer</strong>, regnes utleien normalt som{" "}
        <strong>næringsvirksomhet</strong> – da beskattes overskuddet som
        personinntekt, med marginalskatt opp mot ca. 50 %. Dette er{" "}
        <strong>femboligregelen</strong>: en tommelfingerregel fra
        skattepraksis, ikke en lovfestet grense.
      </p>

      <h2>Grensen er en helhetsvurdering</h2>
      <p>
        Antall enheter er bare utgangspunktet. Skatteetaten vurderer konkret{" "}
        <strong>omfanget</strong> av utleien (antall enheter og samlet
        leieinntekt) og <strong>aktivitetsnivået</strong> – hvor mye arbeid
        driften krever til administrasjon, vedlikehold, visninger og
        leietakerbytter. Høy aktivitet kan gjøre utleie av færre enn fem
        enheter til næring, og svært passiv drift kan unntaksvis trekke motsatt
        vei. Merk at det ikke hjelper å sette bort jobben: arbeid en
        utleiemegler eller vaktmester gjør for din regning, teller med i
        vurderingen.
      </p>

      <h2>Hvorfor korttidsutleie vurderes strengere</h2>
      <p>
        Korttidsutleie krever langt mer arbeid per enhet enn langtidsutleie:
        annonsering, gjestebytter, nøkkelhåndtering, rengjøring og løpende
        kommunikasjon. Derfor kan intensiv korttidsutleie bli regnet som
        næringsvirksomhet med langt færre enheter enn fem – jo mer driften
        ligner et hotell, desto raskere. Skattereglene for sporadisk
        korttidsutleie av egen bolig er egne, se guiden om{" "}
        <Link href="/guide/airbnb-og-korttidsutleie">
          Airbnb og korttidsutleie
        </Link>
        .
      </p>

      <h2>Hva næringsbeskatning betyr i kroner</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Kapitalinntekt</th>
            <th>Næringsvirksomhet</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Skatt på overskudd</td>
            <td>22 % flat sats</td>
            <td>
              Personinntekt: 22 % pluss trygdeavgift og trinnskatt, opp mot
              ca. 50 %
            </td>
          </tr>
          <tr>
            <td>Rapportering</td>
            <td>Føres i skattemeldingen</td>
            <td>Næringsspesifikasjon og krav til bokføring</td>
          </tr>
          <tr>
            <td>Skatt av 300 000 kr i overskudd</td>
            <td>66 000 kr</td>
            <td>Opp mot ca. 150 000 kr</td>
          </tr>
        </tbody>
      </table>
      <p>
        Forskjellen på et overskudd på 300 000 kr kan altså bli rundt{" "}
        <strong>84 000 kr i året</strong>. Fradragene er i hovedsak de samme
        som ved{" "}
        <Link href="/guide/skatt-pa-utleie-2026">vanlig utleiebeskatning</Link>
        , men satsen på det som blir igjen, er en helt annen – og pliktene til
        bokføring og rapportering er mer omfattende. Merk også at overgangen
        gjelder utleievirksomheten under ett: blir aktiviteten regnet som
        næring, beskattes hele overskuddet som personinntekt, ikke bare den
        delen som skyldes enhet nummer fem.
      </p>

      <h2>Mva: langtid er unntatt, hotellignende korttid kan bli pliktig</h2>
      <p>
        <strong>Langtidsutleie av bolig er unntatt mva</strong> – det gjelder
        uansett omfang, også når utleien er næringsvirksomhet. Driver du
        derimot næringsmessig korttidsutleie som ligner hotell- eller
        romutleie, kan utleien bli <strong>mva-pliktig med 12 %</strong> (lav
        sats) når omsetningen passerer 50 000 kr. Da kommer registrering i
        Mva-registeret og mva-meldinger på toppen av inntektsskatten. Som
        langtidsutleier skal du altså ikke beregne mva på husleien – men du
        har heller ikke fradrag for mva på kostnadene.
      </p>

      <h2>Grep folk vurderer nær grensen</h2>
      <ul>
        <li>
          <strong>Holde antallet under fem:</strong> noen stopper bevisst på
          fire boenheter, eller selger én enhet før de kjøper neste.
        </li>
        <li>
          <strong>Velge langtidsleie:</strong> lav aktivitet per enhet gir
          større avstand til næringsgrensen enn intensiv korttidsutleie.
        </li>
        <li>
          <strong>Legge utleien i AS:</strong> i et aksjeselskap er skatten
          22 % i selskapet uansett omfang, mot utbytteskatt først ved uttak.
          Se guiden om{" "}
          <Link href="/guide/utleiebolig-gjennom-as">
            utleiebolig gjennom AS
          </Link>
          .
        </li>
      </ul>
      <p>
        Vurderingen er skjønnsmessig, og konsekvensene av å bomme er store.
        Dette er generell informasjon, ikke skatterådgivning – sjekk{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetatens utleiesider
        </a>{" "}
        eller få vurdert din konkrete situasjon.
      </p>

      <h2>Regn på begge utfall før du kjøper enhet nummer fem</h2>
      <p>
        Skattesatsen er en forutsetning du selv setter i utleiekalkulatoren.
        Regn først kontantstrømmen med 22 %, og kjør deretter samme prosjekt
        med en sats opp mot 50 %. Differansen viser hva næringsbeskatning gjør
        med lønnsomheten – og om boenhet nummer fem egentlig er verdt det.
        Kalkulatoren er gratis og krever ingen konto.
      </p>
    </ArticleLayout>
  );
}
