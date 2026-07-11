import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("sekundaerbolig-krav-og-regler");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hva regnes som sekundærbolig?</h2>
      <p>
        En <strong>sekundærbolig</strong> er en boligeiendom du eier uten å bo
        i den – typisk en utleiebolig, en pendlerbolig eller en leilighet du
        har kjøpt til barna. Det avgjørende er{" "}
        <strong>folkeregistrert adresse</strong>: boligen du er
        folkeregistrert i, er primærboligen din, og alle andre boliger du
        eier, regnes som sekundærboliger. Fritidsbolig er en egen kategori
        med egne regler.
      </p>
      <p>
        Pendlerbolig er et grensetilfelle. Den regnes normalt som
        sekundærbolig i formuesskatten selv om du selv bruker den store deler
        av uken, men reglene har nyanser – blant annet kan du etter
        omstendighetene opparbeide botid i en pendlerbolig. Sjekk med
        Skatteetaten hvis du pendler.
      </p>

      <h2>Fire områder der sekundærbolig koster mer</h2>
      <p>
        Statusen som sekundærbolig slår inn på fire områder: lånevilkår,
        formuesskatt, skatt på leieinntektene og gevinstskatt ved salg.
      </p>
      <table>
        <thead>
          <tr>
            <th>Område</th>
            <th>Primærbolig</th>
            <th>Sekundærbolig</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Egenkapitalkrav ved lån</td>
            <td>Minst 10 %</td>
            <td>Minst 10 %, ofte rentepåslag</td>
          </tr>
          <tr>
            <td>Formuesverdsettelse</td>
            <td>25 % opp til 10 mill. kr</td>
            <td>100 %</td>
          </tr>
          <tr>
            <td>Skatt på leieinntekter</td>
            <td>Kan være skattefri</td>
            <td>22 % fra første krone</td>
          </tr>
          <tr>
            <td>Gevinst ved salg</td>
            <td>Skattefri med botid</td>
            <td>22 % av gevinsten</td>
          </tr>
        </tbody>
      </table>
      <p>
        <strong>Lån:</strong> utlånsforskriften stiller samme minstekrav om
        10 % egenkapital for sekundærbolig som for primærbolig, men mange
        banker priser utleielån med et rentepåslag og vurderer søknaden
        strengere. Kravene til gjeldsgrad, stresstest og avdrag er dekket i
        guiden om{" "}
        <Link href="/guide/egenkapital-og-lan-til-utleiebolig">
          egenkapital og lån til utleiebolig
        </Link>
        .
      </p>
      <p>
        <strong>Formuesskatt:</strong> sekundærbolig verdsettes til{" "}
        <strong>100 %</strong> av beregnet markedsverdi, mot 25 % for
        primærboligen (opp til 10 mill. kr). En bolig verdt 4 000 000 kr
        teller altså 1 000 000 kr i formuen som primærbolig, men hele
        4 000 000 kr som sekundærbolig. Med en formuesskatt på rundt 1 % over
        bunnfradraget (2025-satser) kan forskjellen utgjøre i størrelsesorden
        30 000 kr i året – regnestykket står i guiden om{" "}
        <Link href="/guide/formuesskatt-pa-utleiebolig">
          formuesskatt på utleiebolig
        </Link>
        .
      </p>
      <p>
        <strong>Skatt på leie og gevinst:</strong> leieinntekter fra
        sekundærbolig er skattepliktige med{" "}
        <Link href="/guide/skatt-pa-utleie-2026">22 % fra første krone</Link>{" "}
        – de skattefrie grensene gjelder bare utleie i egen bolig. Og selger
        du uten å ha bodd der minst 12 av de siste 24 månedene, skattlegges
        gevinsten med 22 % – botidsregelen er forklart i guiden om{" "}
        <Link href="/guide/skatt-ved-salg-av-utleiebolig">
          skatt ved salg av utleiebolig
        </Link>
        .
      </p>

      <h2>Når skifter en bolig status?</h2>
      <p>
        Statusen følger folkeregistrering og faktisk bruk, ikke hva boligen
        ble kjøpt som:
      </p>
      <ul>
        <li>
          <strong>Du flytter ut og leier ut:</strong> boligen du flytter fra,
          blir sekundærbolig når du folkeregistrerer deg på ny adresse. Fra
          da slutter du å opptjene botid, og vinduet for skattefritt salg
          begynner å lukke seg.
        </li>
        <li>
          <strong>Barna bor der gratis:</strong> boligen er fortsatt
          sekundærbolig for deg. Uten leieinntekter er det ingen skatt på
          leie, men verdsettelsen på 100 % i formuesskatten gjelder like
          fullt.
        </li>
        <li>
          <strong>Du flytter inn i utleieboligen:</strong> den blir
          primærbolig fra du bor der med folkeregistrert adresse – og du
          begynner å opptjene botid.
        </li>
      </ul>
      <p>
        Reglene har flere detaljer og grensetilfeller – sjekk{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetatens boligsider
        </a>{" "}
        for din situasjon. Dette er generell informasjon, ikke
        skatterådgivning.
      </p>

      <h2>Hvorfor ble Oslo-særkravet fjernet?</h2>
      <p>
        I en tidligere versjon av utlånsforskriften gjaldt et særkrav om{" "}
        <strong>40 % egenkapital</strong> ved kjøp av sekundærbolig i Oslo,
        innført for å dempe investorkjøp i hovedstaden. Kravet ble senere
        fjernet: myndighetene ønsket like regler i hele landet, og
        egenkapitalkravet er i dag minst 10 % uansett hvor sekundærboligen
        ligger. Inngangsbilletten til utleiemarkedet i Oslo er dermed
        vesentlig lavere enn den var – men gjeldsgraden på maks fem ganger
        inntekt begrenser fortsatt hvor mye lån du får.
      </p>

      <h2>Sekundærbolig i utleieregnestykket</h2>
      <p>
        Rentepåslag, 22 % skatt på leien og full formuesverdsettelse er ikke
        detaljer – de avgjør om en utleiebolig lønner seg. Utleiekalkulatoren
        regner kontantstrøm etter skatt, yield og break-even for boligen du
        vurderer, slik at konsekvensene av sekundærbolig-statusen er med i
        tallene fra start. Gratis og uten konto.
      </p>
    </ArticleLayout>
  );
}
