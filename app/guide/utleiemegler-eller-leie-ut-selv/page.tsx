import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("utleiemegler-eller-leie-ut-selv");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Tre nivåer av hjelp – tre prisnivåer</h2>
      <p>
        «Utleiemegler» dekker alt fra en engangsjobb til løpende forvaltning.
        Prisene varierer mellom aktører og byer, men markedet ser typisk slik
        ut:
      </p>
      <table>
        <thead>
          <tr>
            <th>Tjeneste</th>
            <th>Hva du får</th>
            <th>Typisk pris</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Leie ut selv</td>
            <td>Du gjør alt: annonse, visning, kontrakt, oppfølging</td>
            <td>Nesten gratis – men koster tid</td>
          </tr>
          <tr>
            <td>Utleiemegling (engangs)</td>
            <td>
              Annonsering, visninger, referansesjekk, kontrakt og innflytting
            </td>
            <td>50–100 % av én månedsleie</td>
          </tr>
          <tr>
            <td>Full forvaltning</td>
            <td>
              Alt over, pluss husleieinnkreving, purring, leietakerkontakt og
              vedlikeholdsoppfølging
            </td>
            <td>8–12 % av månedsleien + mva</td>
          </tr>
        </tbody>
      </table>
      <p>
        Noen forvaltere tilbyr også <strong>garantert leie</strong>: de
        betaler deg fast leie uansett om boligen står tom. Tryggheten koster
        gjerne 15–20 % av markedsleien – det er en forsikring du betaler dyrt
        for, men som kan være riktig hvis du er helt avhengig av
        leieinntekten.
      </p>

      <h2>Regnestykket: hva koster 10 % forvaltning egentlig?</h2>
      <p>
        Med 15 000 kr i månedsleie og 10 % forvaltningshonorar + mva betaler
        du 1 875 kr per måned – <strong>22 500 kr i året</strong>. Ved
        skattepliktig utleie er honoraret fradragsberettiget, så netto
        kostnad etter 22 % skattefradrag blir om lag 17 550 kr. Det er
        fortsatt over en månedsleie i året, og i en kalkyle som så vidt går i
        pluss, er det ofte forskjellen på positiv og negativ kontantstrøm.
      </p>
      <p>
        Utleiekalkulatoren har et eget felt for forvaltning i prosent av
        leien: legg inn 10–12,5 % og se hva det gjør med kontantstrøm og
        netto <Link href="/guide/yield-utleiebolig">yield</Link> for din
        bolig, før du signerer en forvaltningsavtale.
      </p>

      <h2>Hva tid er verdt: jobben du gjør selv</h2>
      <p>
        Å leie ut selv er ingen heltidsjobb, men vær realistisk om timene:
      </p>
      <ul>
        <li>
          <strong>Ved innflytting</strong> (hvert leietakerbytte): annonse,
          svare på henvendelser, 1–3 visningsrunder, referansesjekk,
          kontrakt, depositumskonto og overtakelsesprotokoll – gjerne 10–20
          timer.
        </li>
        <li>
          <strong>Løpende:</strong> husleiekontroll, KPI-justering én gang i
          året, småreparasjoner og leietakerkontakt – normalt få timer i
          året med en god leietaker.
        </li>
        <li>
          <strong>Når det butter:</strong> purring, konflikt eller utkastelse
          er sjelden, men tid- og nervekrevende når det skjer. Det er her
          forvalterens verdi er størst.
        </li>
      </ul>
      <p>
        Verktøyene for å gjøre jobben selv er gode og gratis:
        Forbrukerrådets standardkontrakt, digital depositumskonto i banken og
        FINN-annonse. Guiden om{" "}
        <Link href="/guide/hva-kan-jeg-leie-ut-for">riktig leiepris</Link>{" "}
        viser hvordan du priser boligen som en profesjonell.
      </p>

      <h2>Når lønner forvaltning seg?</h2>
      <ul>
        <li>
          Du bor <strong>langt unna</strong> utleieboligen og kan ikke stille
          på visning eller håndtere praktiske problemer.
        </li>
        <li>
          Du har <strong>flere utleieenheter</strong> – stordriftsulempene av
          å administrere alt selv vokser raskt.
        </li>
        <li>
          Leiemarkedet lokalt er krevende, eller du vil ha{" "}
          <strong>profesjonell avstand</strong> til leietaker.
        </li>
        <li>
          Timene dine er rett og slett mer verdt i jobb eller familie enn i
          utleieadministrasjon – det er en helt legitim konklusjon.
        </li>
      </ul>
      <p>
        Motsatt: har du én utleieenhet i nærheten, en stabil leietaker og
        orden i papirene, er egenutleie nesten alltid det klart mest
        lønnsomme. Differansen på 17–22 000 kr i året per enhet er ren
        kontantstrøm.
      </p>

      <h2>Sjekkliste før du velger forvalter</h2>
      <ul>
        <li>
          Be om <strong>total årskostnad</strong> inkludert mva, oppstart- og
          fornyelsesgebyrer – ikke bare prosentsatsen.
        </li>
        <li>Hva skjer ved tomgang – løper honoraret da også?</li>
        <li>
          Hvem betaler håndverkere, og fra hvilket beløp må forvalteren
          innhente ditt samtykke?
        </li>
        <li>Oppsigelsestid på forvaltningsavtalen (bind deg kort først).</li>
        <li>
          Sjekk at leien settes riktig:{" "}
          <Link href="/guide/hva-kan-jeg-leie-ut-for">
            sammenlign med markedet selv
          </Link>{" "}
          – forvalterens insentiv er rask utleie, ikke nødvendigvis høyest
          leie.
        </li>
      </ul>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://www.forbrukerradet.no/kontrakter/hus/husleiekontrakt-bokmal/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Forbrukerrådet: gratis husleiekontrakt
          </a>
        </li>
        <li>
          <a
            href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Skatteetaten: fradrag ved utleie (forvaltningshonorar)
          </a>
        </li>
        <li>
          <a
            href="https://www.huseierne.no/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Huseierne: råd om utleie og forvaltning
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
