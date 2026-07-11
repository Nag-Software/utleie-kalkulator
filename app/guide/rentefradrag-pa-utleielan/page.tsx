import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("rentefradrag-pa-utleielan");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>22 % fradrag – uansett hva lånet finansierer</h2>
      <p>
        Gjeldsrenter er fradragsberettiget i <strong>alminnelig inntekt</strong>{" "}
        med <strong>22 %</strong> (2026) – uavhengig av hva lånet har
        finansiert. Renter på lån til utleiebolig behandles likt med renter
        på lån til egen bolig, hytte eller bil: fradraget følger lånet, ikke
        formålet. Den effektive renten etter skatt blir dermed nominell rente
        ganger 0,78 – en rente på for eksempel <strong>5,5 %</strong> koster
        reelt <strong>4,29 %</strong>.
      </p>
      <p>
        Fradraget er ikke penger rett inn på konto, men lavere skatt: har du
        165 000 kr i renter, blir alminnelig inntekt 165 000 kr lavere, og
        skatten reduseres med 36 300 kr. Det forutsetter at du har
        skattepliktig inntekt å føre fradraget mot – lønn, pensjon eller
        kapitalinntekt.
      </p>

      <h2>Regneeksempel: rentekostnaden før og etter skatt</h2>
      <p>
        Et lån på 3 000 000 kr med 5,5 % rente (illustrasjon) gir 165 000 kr
        i renter det første året:
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Før skattefradrag</th>
            <th>Etter skattefradrag</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Renter per år</td>
            <td>165 000 kr</td>
            <td>128 700 kr</td>
          </tr>
          <tr>
            <td>Renter per måned</td>
            <td>13 750 kr</td>
            <td>10 725 kr</td>
          </tr>
          <tr>
            <td>Effektiv rentesats</td>
            <td>5,5 %</td>
            <td>4,29 %</td>
          </tr>
        </tbody>
      </table>
      <p>
        I kontantstrømmen dempes rentekostnaden altså med drøyt 3 000 kr i
        måneden. En kalkyle som overser fradraget, undervurderer prosjektet
        med 36 300 kr i året – ofte forskjellen på rød og svart bunnlinje.
        Effekten er størst der marginene er små: tåler regnestykket ditt en
        rentekostnad på 4,3 % etter skatt, tilsvarer det en nominell rente på
        om lag 5,5 % – fradraget gir deg rundt 1,2 prosentpoeng ekstra å gå
        på før prosjektet bikker i minus. Hele oppstillingen fra brutto leie
        til kroner på konto finner du i guiden om{" "}
        <Link href="/guide/kontantstrom-utleiebolig">
          kontantstrøm på utleiebolig
        </Link>
        .
      </p>

      <h2>Avdrag gir ikke fradrag</h2>
      <p>
        En vanlig misforståelse er at hele terminbeløpet kan trekkes fra. Det
        stemmer ikke: bare rentedelen er fradragsberettiget.{" "}
        <strong>Avdrag</strong> er nedbetaling av egen gjeld – du flytter
        penger fra bankkontoen til egenkapital i boligen – og er verken en
        kostnad eller et fradrag i skattemeldingen. Går utleien samlet sett i
        minus, gir derimot underskuddet 22 % fradrag i annen inntekt –
        hvordan det fungerer, står i guiden om{" "}
        <Link href="/guide/underskudd-pa-utleie">underskudd på utleie</Link>.
      </p>

      <h2>Forhåndsutfylt i skattemeldingen – men sjekk tallene</h2>
      <p>
        Banken rapporterer gjeldsrenter automatisk, og beløpet står normalt
        forhåndsutfylt i skattemeldingen – du trenger ikke gjøre noe for å få
        fradraget, men du bør kontrollere at alt er med. Fradraget gjelder
        alle lån, også et rammelån du har brukt til å{" "}
        <Link href="/guide/refinansiere-for-a-kjope-utleiebolig">
          frigjøre egenkapital til utleieboligen
        </Link>
        . Har lånet en medlåntaker, eller eier dere utleieboligen sammen, kan
        rentene fordeles mellom dere i skattemeldingen – fordelingen bør
        speile hvem som faktisk betaler.
      </p>

      <h2>Fradraget gjelder også ved skattefri utleie</h2>
      <p>
        Leier du ut skattefritt i egen bolig – for eksempel en hybel innenfor
        halvparten-regelen – beholder du likevel fullt rentefradrag for
        boliglånet. Fradraget følger lånet, ikke utleien, og forsvinner ikke
        selv om leieinntektene er skattefrie. Det gjør skattefri utleie i
        egen bolig ekstra gunstig: null skatt på leien og full
        fradragseffekt på rentene. Reglene for når utleie er skattefri, står
        i guiden om{" "}
        <Link href="/guide/skatt-pa-utleie-2026">skatt på utleie</Link>.
      </p>
      <p>
        Detaljene finner du på{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetatens sider om skatt og fradrag
        </a>
        . Dette er generell informasjon, ikke skatterådgivning.
      </p>

      <h2>Slik slår fradraget inn i kalkylen</h2>
      <p>
        Utleiekalkulatoren regner kontantstrøm <strong>etter skatt</strong>:
        renter føres til fradrag, overskudd skattlegges med 22 %, og
        underskudd vises som fradragsfordel. Dermed ser du den reelle
        månedskostnaden ved lånet – ikke bruttorenten – og hvor break-even
        ligger for prosjektet ditt. Gratis og uten konto.
      </p>
    </ArticleLayout>
  );
}
