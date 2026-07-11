import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("avdragsfrihet-pa-utleiebolig");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hva sier utlånsforskriften om avdragsfrihet?</h2>
      <p>
        Utlånsforskriften krever avdrag på minst <strong>2,5 % per år</strong>{" "}
        av innvilget lån når belåningsgraden er over <strong>60 %</strong>.
        Vil du ha avdragsfrihet på utleieboligen, må belåningsgraden altså
        være 60 % eller lavere – i praksis <strong>minst 40 %
        egenkapital</strong>, enten som kontanter, nedbetalt gjeld eller
        verdistigning. Banken kan dessuten stille strengere krav enn
        forskriften og vurderer alltid betjeningsevnen individuelt. De
        øvrige kravene – egenkapital, gjeldsgrad og stresstest – er dekket i
        guiden om{" "}
        <Link href="/guide/egenkapital-og-lan-til-utleiebolig">
          egenkapital og lån til utleiebolig
        </Link>
        ; selve forskriften ligger hos{" "}
        <a
          href="https://lovdata.no/dokument/SF/forskrift/2020-12-09-2648"
          rel="noopener noreferrer"
          target="_blank"
        >
          Lovdata
        </a>
        . Merk også at avdragsfrihet normalt innvilges for en avgrenset
        periode av gangen, ikke for hele lånets løpetid.
      </p>

      <h2>Regneeksempel: 3 millioner med og uten avdrag</h2>
      <p>
        Ta et lån på 3 000 000 kr med 5,5 % rente (illustrasjon) og 25 års
        nedbetalingstid:
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Annuitetslån 25 år</th>
            <th>Avdragsfritt</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Til banken per måned</td>
            <td>ca. 18 400 kr</td>
            <td>13 750 kr</td>
          </tr>
          <tr>
            <td>Herav renter (første år)</td>
            <td>ca. 13 700 kr</td>
            <td>13 750 kr</td>
          </tr>
          <tr>
            <td>Herav avdrag</td>
            <td>ca. 4 700 kr</td>
            <td>0 kr</td>
          </tr>
          <tr>
            <td>Restgjeld etter 5 år</td>
            <td>ca. 2 680 000 kr</td>
            <td>3 000 000 kr</td>
          </tr>
        </tbody>
      </table>
      <p>
        Avdragsfrihet bedrer den månedlige kontantstrømmen med rundt
        4 700 kr. Men se på nederste rad: etter fem år har annuitetslånet
        bygget rundt 320 000 kr i egenkapital som det avdragsfrie lånet ikke
        har. Regnet som sparing utgjør avdragene drøyt 56 000 kr i året i
        formuesbygging – penger du fortsatt eier, ikke penger som er
        forsvunnet ut av regnskapet.
      </p>

      <h2>Avdrag er sparing, ikke kostnad</h2>
      <p>
        Avdrag føles som en utgift, men er i realiteten flytting av penger:
        fra bankkontoen din til egenkapitalen i boligen. Formuen din er
        uendret i samme øyeblikk som du betaler. Derfor kan et utleieprosjekt
        ha negativ{" "}
        <Link href="/guide/kontantstrom-utleiebolig">kontantstrøm</Link> og
        likevel være god butikk – og derfor er avdrag heller ikke
        fradragsberettiget i skatten, i motsetning til renter. Skal du
        vurdere lønnsomheten, se på resultatet før avdrag og på
        totalavkastningen – ikke bare på hva som går ut av konto hver måned.
      </p>

      <h2>Verktøy eller faresignal?</h2>
      <h3>Når avdragsfrihet er et verktøy</h3>
      <ul>
        <li>
          <strong>Oppussingsfase:</strong> boligen står tom og pengene trengs
          til håndverkere – avdragsfrihet frigjør likviditet til boligen er i
          drift.
        </li>
        <li>
          <strong>Midlertidig tomgang</strong> eller leietakerbytte: en pause
          i avdragene er billigere enn dyr kortsiktig kreditt.
        </li>
        <li>
          <strong>Reinvestering:</strong> noen prioriterer å bygge buffer
          eller spare egenkapital til neste prosjekt en periode.
        </li>
      </ul>
      <p>
        Fellesnevneren er at avdragsfriheten er midlertidig, planlagt og har
        en tydelig slutt.
      </p>
      <h3>Når det er et faresignal</h3>
      <p>
        Hvis regnestykket bare går i pluss uten avdrag, er ikke
        avdragsfriheten løsningen – den er symptomet. Et prosjekt som ikke
        tåler 2,5 % avdrag, tåler normalt heller ikke renteøkningen på
        3 prosentpoeng som banken uansett stresstester deg mot. Da er
        problemet marginen i prosjektet, og den bør du kjenne før kjøpet:
        regn ut{" "}
        <Link href="/guide/break-even-for-utleiebolig">
          break-even-leien og break-even-renten
        </Link>{" "}
        først.
      </p>

      <h2>Serielån eller annuitetslån?</h2>
      <p>
        Et <strong>annuitetslån</strong> har likt terminbeløp hele veien:
        mest renter i starten, mest avdrag mot slutten. Et{" "}
        <strong>serielån</strong> har like store avdrag hver termin, så
        terminbeløpet starter høyere og synker over tid. Serielån gir lavere
        samlet rentekostnad, men er tyngst for kontantstrømmen de første
        årene – nettopp når marginen i et utleieprosjekt gjerne er
        strammest. Derfor velger de fleste utleiere annuitetslån.
      </p>

      <h2>Test forskjellen i kalkulatoren</h2>
      <p>
        Utleiekalkulatoren viser kontantstrøm etter skatt og en flerårig
        prognose for prosjektet, slik at du ser hva rente, lånestørrelse og
        nedbetaling betyr i kroner per måned – og hvor break-even ligger.
        Tåler prosjektet avdrag fra dag én, har du margin. Må du ha
        avdragsfrihet for at det skal gå rundt, har du fått et ærlig svar før
        budrunden. Gratis og uten konto.
      </p>
    </ArticleLayout>
  );
}
