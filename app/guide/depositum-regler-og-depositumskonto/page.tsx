import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("depositum-regler-og-depositumskonto");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hovedreglene for depositum</h2>
      <p>
        Depositumet kan maksimalt utgjøre <strong>seks måneders leie</strong>
        , og pengene skal stå på en <strong>egen depositumskonto i
        leietakers navn</strong> i en bank eller annen finansinstitusjon.
        Rentene tilfaller leietaker, og utleier betaler gebyret for å
        opprette kontoen. Vanlig praksis er tre måneders leie: med 15 000 kr
        i månedsleie utgjør depositumet da 45 000 kr.
      </p>
      <p>
        Det viktigste forbudet: depositumet skal <strong>aldri</strong> inn
        på din private konto. Gjør du det likevel, kan leietaker når som
        helst kreve hele beløpet tilbakebetalt med renter – og du står i
        praksis uten sikkerhet. Kontanter «på hånden» er like ulovlig.
      </p>

      <h2>Slik oppretter du depositumskontoen</h2>
      <ol>
        <li>
          Avtal beløpet i leiekontrakten – maks seks måneders leie. Hva
          kontrakten ellers bør regulere, står i guiden om{" "}
          <Link href="/guide/leiekontrakt-dette-ma-den-inneholde">
            hva leiekontrakten må inneholde
          </Link>
          .
        </li>
        <li>
          Opprett depositumskonto i banken. De fleste banker har heldigitale
          løsninger der begge parter signerer med BankID.
        </li>
        <li>
          Du betaler opprettelsesgebyret – det kan ikke veltes over på
          leietaker.
        </li>
        <li>
          Leietaker overfører beløpet, og du bekrefter at pengene står på
          kontoen <strong>før</strong> nøklene leveres ut.
        </li>
      </ol>
      <p>
        Kontoen er sperret for begge parter: ingen av dere kan ta ut penger
        uten den andres samtykke eller en rettslig avgjørelse.
      </p>

      <h2>Hva skjer med depositumet ved utflytting?</h2>
      <p>
        Er dere enige, gir dere banken beskjed sammen, og pengene frigis til
        leietaker – eventuelt med et avtalt trekk til deg. Er dere uenige,
        kan hver av partene kreve utbetaling: banken varsler da den andre
        parten skriftlig, og motparten får en frist – etter loven fem uker –
        til å dokumentere at det er reist sak. Skjer ikke det, utbetales
        beløpet. Skyldig leie står i en særstilling: er det avtalt at leien
        betales til konto i samme bank, kan du kreve forfalt leie dekket av
        depositumet direkte.
      </p>
      <p>
        Hva du faktisk kan trekke for – og grensen mot normal slitasje som
        du selv må bære – er tema i guiden om{" "}
        <Link href="/guide/slitasje-eller-skade">slitasje eller skade</Link>.
        Dokumentasjonen som avgjør slike saker er en{" "}
        <Link href="/guide/overtakelsesprotokoll">
          overtakelsesprotokoll
        </Link>{" "}
        med bilder fra inn- og utflytting. Dette er generell informasjon,
        ikke juridisk rådgivning – tvister om depositum behandles av{" "}
        <a
          href="https://www.htu.no/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Husleietvistutvalget
        </a>{" "}
        for et lavt gebyr.
      </p>

      <h2>Depositumsgaranti og NAV-garanti</h2>
      <ul>
        <li>
          <strong>Depositumsgaranti</strong> er et forsikringsprodukt:
          leietaker betaler en premie som ikke refunderes, i stedet for å
          binde penger på konto. For deg som utleier kan dekningen være
          smalere enn et kontant depositum, og oppgjøret krever ofte mer
          dokumentasjon – les vilkårene nøye før du aksepterer. Du velger
          selv om du godtar garanti i stedet for depositum.
        </li>
        <li>
          <strong>NAV-garanti:</strong> NAV kan stille en skriftlig garanti
          for leietakere som ikke har penger til depositum. Garantien er
          ikke kontanter på konto: ved mislighold må du fremme krav mot NAV,
          og vilkår og frister varierer mellom kommuner – les
          garantidokumentet før du signerer kontrakt.
        </li>
      </ul>

      <h2>Vanlige feil med depositum</h2>
      <table>
        <thead>
          <tr>
            <th>Feil</th>
            <th>Konsekvens</th>
            <th>Riktig</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Depositum på utleiers private konto</td>
            <td>
              Leietaker kan når som helst kreve beløpet tilbake med renter
            </td>
            <td>Egen depositumskonto i leietakers navn</td>
          </tr>
          <tr>
            <td>Leietaker betaler opprettelsesgebyret</td>
            <td>Ulovlig – gebyret er utleiers kostnad</td>
            <td>Utleier betaler gebyret</td>
          </tr>
          <tr>
            <td>Mer enn seks måneders leie i depositum</td>
            <td>Det overskytende er ulovlig og kan kreves tilbake</td>
            <td>Maks seks måneder – tre er vanlig praksis</td>
          </tr>
          <tr>
            <td>Trekke fra depositumet på egen hånd</td>
            <td>
              Banken utbetaler ikke uten enighet eller avgjørelse, og
              selvtekt svekker saken din
            </td>
            <td>Bli enige skriftlig, eller ta saken til HTU</td>
          </tr>
          <tr>
            <td>Nøkler før pengene står på konto</td>
            <td>Null sikkerhet hvis leietaker aldri betaler inn</td>
            <td>Innflytting først når depositumet er bekreftet</td>
          </tr>
        </tbody>
      </table>

      <h2>Depositumet er ikke bufferen din</h2>
      <p>
        Depositumet er leietakers penger og dekker først og fremst ubetalt
        leie og skader ved utflytting. Tomgang, vedlikehold og uforutsette
        kostnader i driften må du budsjettere med selv. Legg leie, ledighet
        og vedlikehold inn i utleiekalkulatoren og se om kontantstrømmen
        tåler en trøblete overgang mellom to leietakere – det er den
        bufferen som faktisk redder økonomien.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lovdata: husleieloven (kapittel 3 om leie og depositum)
          </a>
        </li>
        <li>
          <a
            href="https://www.htu.no/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Husleietvistutvalget: depositumstvister
          </a>
        </li>
        <li>
          <a
            href="https://www.forbrukerradet.no/kontrakter/hus/husleiekontrakt-bokmal/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Forbrukerrådet: husleiekontrakt med depositumsbestemmelser
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
