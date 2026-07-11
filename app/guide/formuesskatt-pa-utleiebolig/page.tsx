import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("formuesskatt-pa-utleiebolig");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Sekundærbolig teller 100 % i formuen</h2>
      <p>
        En utleiebolig du ikke selv bor i, er en{" "}
        <Link href="/guide/sekundaerbolig-krav-og-regler">sekundærbolig</Link>{" "}
        i skattemeldingen og verdsettes til{" "}
        <strong>100 % av beregnet markedsverdi</strong> – uten rabatten
        primærboligen får. Formuesverdien fastsettes av Skatteetatens{" "}
        <strong>boligverdimodell</strong>, en sjablong basert på boligtype,
        areal, byggeår og beliggenhet. Utleieboliger er med andre ord blant de
        minst gunstige måtene å plassere formue på, sett med
        formuesskatt-øyne.
      </p>
      <table>
        <thead>
          <tr>
            <th>Boligtype</th>
            <th>Andel av beregnet markedsverdi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Primærbolig (verdi inntil 10 mill. kr)</td>
            <td>25 %</td>
          </tr>
          <tr>
            <td>Primærbolig (delen av verdien over 10 mill. kr)</td>
            <td>70 %</td>
          </tr>
          <tr>
            <td>Sekundærbolig (utleiebolig)</td>
            <td>100 %</td>
          </tr>
        </tbody>
      </table>
      <p>
        Forskjellen er stor i kroner: en bolig verdt 4 000 000 kr teller
        1 000 000 kr i formuen som primærbolig, men hele 4 000 000 kr som
        sekundærbolig. Formuesverdien står forhåndsutfylt i skattemeldingen
        din.
      </p>

      <h2>Gjelden trekkes fra</h2>
      <p>
        Formuesskatten beregnes av <strong>netto formue</strong>: alle
        eiendeler minus all gjeld. Lånet på utleieboligen reduserer altså
        formuen din, og en høyt belånt utleiebolig gir i starten et beskjedent
        netto bidrag. Men det endrer seg: hvert avdrag og hver krone i
        verdistigning øker netto formue – og dermed formuesskatten – år for
        år så lenge du eier.
      </p>

      <h2>Regneeksempel: bolig til 4 millioner, lån på 3</h2>
      <table>
        <thead>
          <tr>
            <th>Post</th>
            <th>Beløp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Formuesverdi sekundærbolig (100 % av markedsverdi)</td>
            <td>4 000 000 kr</td>
          </tr>
          <tr>
            <td>− Gjeld på boligen</td>
            <td>3 000 000 kr</td>
          </tr>
          <tr>
            <td>
              <strong>= Netto bidrag til skattepliktig formue</strong>
            </td>
            <td>
              <strong>1 000 000 kr</strong>
            </td>
          </tr>
          <tr>
            <td>Årlig formuesskatt av bidraget, rundt 1 % (2025-satser)</td>
            <td>ca. 10 000 kr</td>
          </tr>
        </tbody>
      </table>
      <p>
        Ligger du over bunnfradraget fra før, koster den ekstra millionen
        altså rundt <strong>1 % i året (2025-satser)</strong> – om lag
        10 000 kr. Kom egenkapitalen fra bankinnskudd, var riktignok den
        millionen skattepliktig formue også før kjøpet – det nye er at
        bidraget vokser: den dagen lånet er nedbetalt, er boligens nettobidrag
        hele 4 millioner, og formuesskatten rundt 40 000 kr i året.
      </p>

      <h2>Formuesskatten spiser av netto yield</h2>
      <p>
        Mål formuesskatten mot avkastningen, ikke mot null. Gir boligen en{" "}
        <Link href="/guide/yield-utleiebolig">netto yield</Link> på 3,5 %, er
        netto leieoverskudd på en bolig til 4 millioner rundt 140 000 kr i
        året. 10 000 kr i formuesskatt tilsvarer da{" "}
        <strong>0,25 prosentpoeng lavere yield</strong>. Med nedbetalt lån
        utgjør formuesskatten rundt 40 000 kr – omtrent ett helt prosentpoeng
        av boligens verdi, altså en betydelig del av hele avkastningen.
        Formuesskatten kommer i tillegg til{" "}
        <Link href="/guide/skatt-pa-utleie-2026">
          22 % skatt på netto leieinntekt
        </Link>
        , og den løper uavhengig av om boligen er utleid eller står tom – også
        i år der utleien går med underskudd.
      </p>

      <h2>Hvem rammes – og hvem slipper</h2>
      <p>
        Formuesskatt betales bare av netto formue{" "}
        <strong>over bunnfradraget</strong>. En kjøper med høy gjeld på både
        egen bolig og utleiebolig ligger ofte under grensen og betaler
        ingenting – da spiller verdsettelsen på 100 % liten rolle i praksis.
        En etablert eier med nedbetalt primærbolig ligger derimot gjerne godt
        over, og får formuesskatt av hele utleieboligens nettoverdi fra første
        krone. Husk at hele økonomien teller med i vurderingen: bankinnskudd,
        fond og annen eiendom inngår i formuen, og all gjeld – også studielån
        og billån – trekkes fra. Gjeldende satser og bunnfradrag finner du hos{" "}
        <a
          href="https://www.skatteetaten.no/satser/formuesskatt/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetaten
        </a>
        . Dette er generell informasjon, ikke skatterådgivning.
      </p>

      <h2>Ta formuesskatten med i regnestykket</h2>
      <p>
        Utleiekalkulatoren viser kontantstrøm etter skatt, netto yield og
        flerårig prognose for boligen du vurderer – gratis og uten konto. Er
        du i formuesskatteposisjon, bør du trekke formuesskatten fra
        resultatet slik eksemplet over viser: på marginale prosjekter er den
        forskjellen mellom pluss og minus.
      </p>
    </ArticleLayout>
  );
}
