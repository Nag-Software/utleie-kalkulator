import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("kjope-utleiebolig-med-leietaker");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hva skjer med leiekontrakten når boligen bytter eier?</h2>
      <p>
        <strong>Leiekontrakten følger boligen, ikke selgeren.</strong> Ved
        eierskifte trer du som kjøper inn i utleierens rettigheter og plikter:
        leietakeren beholder kontrakten uendret, med samme leie, samme
        oppsigelsesvern og samme vilkår som før. Du kan ikke si opp leietakeren
        fordi boligen har fått ny eier, og du kan ikke sette opp leien utover
        det husleieloven tillater. Kjøper du en bolig med leietaker, kjøper du
        derfor to ting på én gang: eiendommen og leieforholdet.
      </p>
      <p>
        Det er ingen ulempe i seg selv – for en utleieinvestor er det ofte
        selve poenget. Men kontrakten du overtar er en del av det du betaler
        for, og den bør granskes like grundig som tilstandsrapporten.
      </p>

      <h2>Depositumet skal følge med på kjøpet</h2>
      <p>
        Depositumet står på en egen depositumskonto i leietakers navn –{" "}
        <Link href="/guide/depositum-regler-og-depositumskonto">
          maks seks måneders leie
        </Link>{" "}
        – og tilhører verken selgeren eller deg. Sjekk før overtakelse at
        kontoen faktisk finnes, at beløpet stemmer med kontrakten, og at
        banken registrerer deg som ny utleier med rettigheter i kontoen. Er
        depositumet i stedet betalt rett til selger uten lovlig konto, arver
        du problemet – få det ryddet opp i som en del av overtakelsen.
      </p>

      <h2>Sjekkliste før du legger inn bud</h2>
      <ul>
        <li>
          <strong>Kontraktstype:</strong> er avtalen tidsbestemt eller
          løpende, og hva sier den om{" "}
          <Link href="/guide/oppsigelse-av-leieforhold">
            oppsigelsestid og oppsigelsesvern
          </Link>
          ? En tidsbestemt kontrakt med lang gjenværende tid binder deg til
          vilkårene ut perioden.
        </li>
        <li>
          <strong>Leienivå mot marked:</strong> ligger leien under
          markedsleie, tar opptrappingen tid – se regneeksempelet under.
        </li>
        <li>
          <strong>Betalingshistorikk:</strong> be om dokumentasjon på innbetalt
          leie de siste tolv månedene. Purringer og etterslep vil du vite om
          før budrunden, ikke etter.
        </li>
        <li>
          <strong>Overtakelsesprotokoll fra innflytting:</strong> uten{" "}
          <Link href="/guide/overtakelsesprotokoll">protokoll</Link> og bilder
          fra da leietakeren flyttet inn, blir diskusjonen om slitasje og
          depositumstrekk ved utflytting nesten umulig å vinne.
        </li>
        <li>
          <strong>Utkastelsesklausul:</strong> sjekk om kontrakten har den
          vanlige klausulen om tvangsfravikelse ved ubetalt leie – den gjør
          prosessen raskere hvis noe går galt.
        </li>
      </ul>

      <h2>Fordeler og ulemper ved å kjøpe med leietaker</h2>
      <ul>
        <li>
          <strong>Leieinntekt fra dag én:</strong> ingen tomgang, ingen
          annonsering og ingen visningsrunder – kontantstrømmen starter ved
          overtakelse.
        </li>
        <li>
          <strong>Dokumentert leie:</strong> du regner på faktiske tall, ikke
          på anslag fra prospektet.
        </li>
        <li>
          <strong>Færre budgivere:</strong> de fleste boligkjøpere skal bo
          selv og styrer unna utleide objekter. Mindre konkurranse kan gi deg
          rabatt.
        </li>
        <li>
          <strong>Du arver vilkårene:</strong> lav leie, gunstige betingelser
          eller en ulmende konflikt mellom selger og leietaker blir ditt
          problem fra dag én.
        </li>
        <li>
          <strong>Du velger ikke leietaker selv:</strong> referansesjekken er
          gjort av noen andre – kanskje aldri.
        </li>
      </ul>

      <h2>Regneeksempel: leietaker betaler under markedsleie</h2>
      <p>
        Si at du vurderer en leilighet til 4 000 000 kr der leietakeren
        betaler 13 000 kr i måneden, mens tilsvarende boliger leies ut for
        15 000 kr.
      </p>
      <table>
        <thead>
          <tr>
            <th>Leie</th>
            <th>Årsleie</th>
            <th>Brutto yield</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dagens kontrakt: 13 000 kr/mnd</td>
            <td>156 000 kr</td>
            <td>3,9 %</td>
          </tr>
          <tr>
            <td>Markedsleie: 15 000 kr/mnd</td>
            <td>180 000 kr</td>
            <td>4,5 %</td>
          </tr>
        </tbody>
      </table>
      <p>
        Gapet er <strong>24 000 kr i året</strong> før skatt – og du kan ikke
        tette det med et pennestrøk. Husleieloven tillater{" "}
        <Link href="/guide/husleieokning-slik-gjor-du-det">
          KPI-justering én gang i året
        </Link>{" "}
        med én måneds varsel, men den justerer bare for prisvekst – gapet til
        markedsleien består. Tilpasning til <strong>gjengs leie</strong>{" "}
        krever at leieforholdet har vart i minst to og et halvt år uten annen
        endring enn KPI, pluss seks måneders varsel – i praksis fra år tre.
        Tiden regnes fra leieforholdets start, ikke fra eierskiftet, så har
        leietakeren allerede bodd der lenge, kan du varsle tidligere. Merk
        også at gjengs leie er et gjennomsnitt av løpende leieforhold og
        gjerne ligger noe under markedsleien for nye kontrakter.
      </p>
      <p>
        Konsekvensen for budet: regn med dagens leie i flere år fremover, og
        pris inn gapet. En bolig som gir 3,9 % i stedet for 4,5 % brutto
        yield er mindre verdt for deg som investor – budet bør speile det.
      </p>

      <h2>Regn på boligen med leien som faktisk gjelder</h2>
      <p>
        Legg inn kjøpesummen og leien fra kontrakten – ikke markedsleien fra
        prospektet – i utleiekalkulatoren, så ser du kontantstrøm etter
        skatt, yield og break-even slik boligen faktisk drives i dag. Kjør
        deretter samme regnestykke med markedsleie fra år tre, så ser du hva
        oppsiden er verdt. Kalkulatoren er gratis og krever ingen konto.
      </p>
      <p>
        Dette er generell informasjon, ikke juridisk rådgivning – reglene om
        eierskifte, depositum og leiefastsettelse finner du i{" "}
        <a
          href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
          rel="noopener noreferrer"
          target="_blank"
        >
          husleieloven på Lovdata
        </a>
        .
      </p>
    </ArticleLayout>
  );
}
