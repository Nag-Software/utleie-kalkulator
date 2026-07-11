import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("utleiebolig-vs-indeksfond");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Det korte svaret</h2>
      <p>
        Et globalt indeksfond har historisk gitt{" "}
        <strong>rundt 7 % nominell årlig avkastning</strong> over lange
        perioder – uten arbeidsinnsats, men også uten lånefinansiering. En
        utleiebolig gir typisk <strong>2,5–4 % netto yield</strong> pluss
        eventuell verdistigning – men på et belånt beløp, og med reell
        arbeidsinnsats. Forskjellen mellom de to er altså ikke først og fremst
        avkastningen per krone: det er <strong>gearingen og egeninnsatsen</strong>.
        Og husk at historisk avkastning ikke er noen garanti for fremtiden –
        for noen av delene.
      </p>

      <h2>Sammenligningen punkt for punkt</h2>
      <table>
        <thead>
          <tr>
            <th>Faktor</th>
            <th>Globalt indeksfond</th>
            <th>Utleiebolig</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Avkastning</td>
            <td>Historisk rundt 7 % nominelt i året</td>
            <td>2,5–4 % netto yield + eventuell verdistigning, på belånt kapital</td>
          </tr>
          <tr>
            <td>Arbeidsinnsats</td>
            <td>Tilnærmet null</td>
            <td>Reell jobb: leietakere, vedlikehold, regnskap</td>
          </tr>
          <tr>
            <td>Diversifisering</td>
            <td>Tusenvis av selskaper i mange land</td>
            <td>Ett objekt i ett nabolag</td>
          </tr>
          <tr>
            <td>Likviditet</td>
            <td>Selges på dager</td>
            <td>Uker eller måneder, med salgskostnader</td>
          </tr>
          <tr>
            <td>Skatt</td>
            <td>Først ved salg; skjermingsfradrag; effektivt 37,84 % på gevinst</td>
            <td>22 % løpende på netto leieinntekt</td>
          </tr>
          <tr>
            <td>Kostnader</td>
            <td>Lave årlige forvaltningskostnader</td>
            <td>Dokumentavgift, vedlikehold, felleskostnader, eventuell forvaltning</td>
          </tr>
        </tbody>
      </table>

      <h2>Gearingen er den store forskjellen</h2>
      <p>
        Banken låner deg gjerne 3 200 000 kr for å kjøpe en bolig til
        4 000 000 kr – ingen låner deg tilsvarende for å kjøpe indeksfond.
        Dermed jobber en langt større sum for deg i boligmarkedet: 2–3 %
        verdistigning på fire millioner er flere kroner enn 7 % på 800 000 kr.
        Men lånet forsterker også tap, og renten skal betales uansett –
        mekanismen er forklart i guiden om{" "}
        <Link href="/guide/gearing-og-belaningsgrad">
          gearing og belåningsgrad
        </Link>
        . Selve direkteavkastningen på boligen måler du med{" "}
        <Link href="/guide/yield-utleiebolig">netto yield</Link>.
      </p>

      <h2>Regneeksempel: 800 000 kr i ti år</h2>
      <p>
        Si at du har 800 000 kr i egenkapital og vurderer to veier. Tallene er
        eksempler, ikke prognoser.
      </p>
      <p>
        <strong>Indeksfond:</strong> med et historisk snitt på 7 % nominelt
        vokser 800 000 kr til rundt 1 600 000 kr på ti år, før skatt. Blir
        snittet 5 %, ender du rundt 1 300 000 kr. Skatten kommer først den
        dagen du selger.
      </p>
      <p>
        <strong>Utleiebolig:</strong> 800 000 kr er 20 % egenkapital i en
        bolig til 4 000 000 kr, med 3 200 000 kr i lån over 25 år og en
        eksempelrente på 5,5 %. Etter ti år er lånet nedbetalt til rundt
        2 400 000 kr. Med 2,5 % årlig{" "}
        <Link href="/guide/verdistigning-pa-bolig">verdistigning</Link> er
        boligen verdt rundt 5 100 000 kr – egenkapitalen din har vokst til
        rundt 2 700 000 kr. Uten verdistigning: 1 600 000 kr.
      </p>
      <p>
        Men merk to ting. Avdragene – rundt 800 000 kr over ti år – og
        eventuell negativ kontantstrøm har du skutt inn underveis;
        fondsinvestoren kunne spart de samme kronene månedlig i fond. Og
        selger du, kommer salgskostnader og normalt 22 % skatt på gevinsten i
        tillegg. Utfallet avhenger nesten helt av to variabler du ikke styrer:{" "}
        <strong>verdistigningen og renten</strong>. Med sterk prisvekst og lav
        rente vinner den belånte boligen klart; med flate priser og høy rente
        vinner fondet – med langt mindre arbeid.
      </p>

      <h2>Skatten virker helt ulikt</h2>
      <p>
        Aksjefond beskattes først når du selger: gevinsten skattlegges
        effektivt med <strong>37,84 %</strong>, noe redusert av
        skjermingsfradraget, og pengene vokser ubeskattet underveis.
        Leieinntekter beskattes løpende med <strong>22 %</strong> av netto
        leie hvert eneste år, men rentefradraget trekker i motsatt retning –
        og ved salg av en ren utleiebolig skattlegges gevinsten normalt med
        22 %. Dette er generell informasjon og ikke skatterådgivning; se
        detaljene hos{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetaten
        </a>
        .
      </p>

      <h2>Ikke enten–eller: regn på begge</h2>
      <p>
        Mange lander på begge deler: indeksfond for det enkle og
        diversifiserte, utleiebolig for den som vil bruke egeninnsats og tåler
        belåning. Skal boligen forsvare plassen, bør den regnes hjem som
        butikk – ikke som et håp om verdistigning. Legg inn kjøpesum, lån,
        leie og kostnader i <Link href="/">utleiekalkulatoren</Link> (gratis,
        uten konto), se kontantstrømmen etter skatt og prognosen over ti år,
        og sammenlign selv med hva pengene kunne gjort i fond. Dette er
        generell informasjon, ikke finansrådgivning.
      </p>
    </ArticleLayout>
  );
}
