import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("utleieforsikring-verdt-det");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hva dekker en utleieforsikring?</h2>
      <p>
        En utleieforsikring dekker typisk tre ting: <strong>tapt husleie</strong>{" "}
        når leietaker ikke betaler (ofte inntil 6–12 måneder),{" "}
        <strong>skadeverk</strong> fra leietaker utover normal slitasje, og{" "}
        <strong>rettshjelp</strong> med kostnadene ved en utkastelse. Mange
        dekninger inkluderer også rengjøring og utrydding når leietaker
        etterlater boligen i dårlig stand.
      </p>
      <table>
        <thead>
          <tr>
            <th>Dekning</th>
            <th>Hva det typisk omfatter</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tapt husleie</td>
            <td>Leie som uteblir ved mislighold, ofte inntil 6–12 måneder</td>
          </tr>
          <tr>
            <td>Skadeverk</td>
            <td>Skader fra leietaker utover normal slitasje, mot egenandel</td>
          </tr>
          <tr>
            <td>Utkastelse og rettshjelp</td>
            <td>Juridisk bistand og kostnader i prosessen hos namsmannen</td>
          </tr>
          <tr>
            <td>Rengjøring og utrydding</td>
            <td>
              Nedvask og fjerning av etterlatte eiendeler (varierer mellom
              produkter)
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Les vilkårene før du sammenligner pris: egenandel, maksbeløp og
        varighet på husleiedekningen varierer, og mange produkter stiller
        krav om at du har tatt depositum og gjort kredittsjekk av leietaker
        for at dekningen skal gjelde fullt ut.
      </p>

      <h2>Hva den ikke dekker</h2>
      <ul>
        <li>
          <strong>Normal slitasje:</strong> matte vegger og slitte gulv er
          din kostnad som utleier uansett – se guiden om{" "}
          <Link href="/guide/slitasje-eller-skade">
            grensen mellom slitasje og skade
          </Link>
          .
        </li>
        <li>
          <strong>Tomgang uten mislighold:</strong> står boligen tom mellom
          leietakere, er det din markedsrisiko. Ingen utleieforsikring
          betaler for manglende etterspørsel.
        </li>
        <li>
          <strong>Vedlikehold og elde:</strong> utskifting av slitte
          overflater og gammelt utstyr er drift, ikke skade.
        </li>
      </ul>
      <p>
        Husk også at utleieforsikringen kommer i tillegg til – ikke i stedet
        for – vanlig hus- eller innboforsikring på boligen. Brann-, vann- og
        andre bygningsskader hører hjemme i boligforsikringen, og den
        trenger du uansett hvem som bor der.
      </p>

      <h2>Hva koster den? Et regneeksempel</h2>
      <p>
        Prisen ligger typisk på noen tusenlapper i året, avhengig av
        leienivå og hvor mye som dekkes. Sett premien opp mot det som står
        på spill:
      </p>
      <ul>
        <li>
          Premie: <strong>4 000 kr i året</strong> (eksempel)
        </li>
        <li>
          Depositum på tre måneders leie ved 15 000 kr i måneden:{" "}
          <strong>45 000 kr</strong>
        </li>
        <li>
          En betalingssak som ender med utkastelse og seks måneder tapt
          leie: <strong>90 000 kr</strong> pluss prosesskostnader
        </li>
      </ul>
      <p>
        Depositumet dekker altså bare rundt halvparten av en alvorlig
        betalingssak – reglene for hva det kan brukes til står i guiden om{" "}
        <Link href="/guide/depositum-regler-og-depositumskonto">
          depositum og depositumskonto
        </Link>
        . Premien er dessuten <strong>fradragsberettiget</strong> ved
        skattepliktig utleie: med 22 % skatt er netto kostnad i eksempelet
        rundt 3 120 kr, se guiden om{" "}
        <Link href="/guide/fradrag-ved-utleie">fradrag ved utleie</Link>.
        Dette er generell informasjon, ikke skatterådgivning – detaljene
        finner du hos{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetaten
        </a>
        .
      </p>

      <h2>Når er forsikringen verdt det?</h2>
      <ul>
        <li>
          <strong>Høy leie:</strong> jo høyere månedsleie, desto mer taper
          du per måned mislighold varer – og desto mindre utgjør premien i
          forhold.
        </li>
        <li>
          <strong>Én enkelt utleiebolig:</strong> all risiko er konsentrert
          i ett leieforhold. Ett mislighold rammer hele utleieøkonomien din
          samtidig.
        </li>
        <li>
          <strong>Stram økonomi:</strong> er du avhengig av leien for å
          betjene lånet, kjøper forsikringen deg tid og forutsigbarhet når
          det butter.
        </li>
      </ul>

      <h2>Når er depositum og husforsikring nok?</h2>
      <p>
        Har du solid buffer på konto, grundig leietakervalg og fullt
        depositum på plass, er sannsynligheten for et stort udekket tap lav
        – da kan premien være penger spart år etter år. Flere utleieenheter
        sprer dessuten risikoen: ett mislighold velter ikke helheten.
        Prosessen ved mislighold er uansett den samme med og uten
        forsikring, fra purring til namsmann – den er beskrevet i guiden om{" "}
        <Link href="/guide/nar-leietaker-ikke-betaler">
          når leietaker ikke betaler
        </Link>
        . Forskjellen er hvem som bærer kostnaden og jobben underveis.
      </p>

      <h2>Legg premien inn i regnestykket</h2>
      <p>
        En premie på 4 000 kr i året er drøyt 300 kr i måneden. I en kalkyle
        som går et par tusenlapper i pluss hver måned er det merkbart, men
        sjelden avgjørende. Legg premien inn som driftskostnad i
        utleiekalkulatoren og se hva den gjør med kontantstrøm og netto
        yield for din bolig – da tar du valget på tall, ikke på magefølelse.
        Kalkulatoren er gratis og krever ingen konto.
      </p>
    </ArticleLayout>
  );
}
