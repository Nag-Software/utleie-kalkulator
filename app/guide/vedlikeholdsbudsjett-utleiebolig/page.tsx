import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("vedlikeholdsbudsjett-utleiebolig");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hvor mye bør du sette av til vedlikehold?</h2>
      <p>
        En vanlig tommelfingerregel for leilighet er å sette av i
        størrelsesorden <strong>50–150 kr per kvadratmeter per år</strong> til
        innvendig vedlikehold – sameiet tar det ytre (tak, fasade, drenering)
        over felleskostnadene. For enebolig, der alt ansvaret er ditt, må du
        regne klart høyere. En annen grov regel er{" "}
        <strong>0,5–1 % av boligverdien</strong> årlig; for en bolig til
        4 000 000 kr blir det 20 000–40 000 kr i året. Tallene er grove, men
        de er langt nærmere sannheten enn null – som er tallet mange kalkyler
        i praksis bruker.
      </p>

      <h2>Hvorfor kalkyler uten vedlikehold lyver</h2>
      <p>
        Selger-regnestykker og optimistiske annonser viser gjerne leie minus
        felleskostnader og lånekostnad – vedlikeholdet er utelatt. Da ser
        nesten enhver utleiebolig lønnsom ut. Problemet er at vedlikehold ikke
        kommer jevnt: du kan ha null kroner i kostnader i fire år, og så et
        bad til 400 000 kr i det femte. Boligen slites like fullt hver eneste
        måned, og en kalkyle som hopper over det, flytter bare regningen frem
        i tid. Skal du sammenligne utleiebolig med andre investeringer, må
        slitasjen inn som en månedlig kostnad fra dag én.
      </p>

      <h2>Levetid og kostnad for de store postene</h2>
      <p>
        Tabellen viser grove anslag for komponentene som dominerer
        vedlikeholdsbudsjettet. Prisene varierer mye med standard, areal og
        hvor i landet boligen ligger – bruk dem som startpunkt, ikke fasit.
      </p>
      <table>
        <thead>
          <tr>
            <th>Komponent</th>
            <th>Grov levetid</th>
            <th>Grovt kostnadsanslag</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bad, totalrenovering</td>
            <td>25–35 år</td>
            <td>300 000–500 000 kr</td>
          </tr>
          <tr>
            <td>Kjøkken, utskifting</td>
            <td>20–30 år</td>
            <td>100 000–250 000 kr</td>
          </tr>
          <tr>
            <td>Hvitevarer</td>
            <td>ca. 10 år</td>
            <td>5 000–15 000 kr per enhet</td>
          </tr>
          <tr>
            <td>Innvendig maling</td>
            <td>8–12 år</td>
            <td>avhenger av areal og egeninnsats</td>
          </tr>
          <tr>
            <td>Gulvsliping</td>
            <td>15–25 år</td>
            <td>avhenger av areal og gulvtype</td>
          </tr>
        </tbody>
      </table>

      <h2>Regneeksempel: fra levetid til månedsbeløp</h2>
      <p>
        Prinsippet er enkelt: <strong>årlig avsetning = kostnad delt på
        levetid</strong>, summert over de store postene. Et eksempel for en
        2-roms på 60 kvm:
      </p>
      <ul>
        <li>Bad: 400 000 kr delt på 30 år = ca. 13 300 kr per år</li>
        <li>Kjøkken: 150 000 kr delt på 25 år = 6 000 kr per år</li>
        <li>Hvitevarer: 30 000 kr delt på 10 år = 3 000 kr per år</li>
        <li>Maling: 40 000 kr delt på 10 år = 4 000 kr per år</li>
        <li>Gulvsliping: 30 000 kr delt på 20 år = 1 500 kr per år</li>
      </ul>
      <p>
        Summen blir ca. 27 800 kr i året – rundt{" "}
        <strong>2 300 kr i måneden</strong>. Er boligen verdt 4 000 000 kr,
        tilsvarer det ca. 0,7 % av verdien, midt i den grove regelen over.
        Sett beløpet over på egen konto hver måned, så er badet i praksis
        spart opp den dagen det må tas.
      </p>

      <h2>Skatt: kostnaden gir fradrag – ikke avsetningen</h2>
      <p>
        Ved skattepliktig utleie er vedlikehold{" "}
        <strong>fradragsberettiget det året arbeidet utføres</strong>.
        Avsetningen du gjør underveis, gir altså ikke fradrag i seg selv –
        fradraget kommer når regningen kommer. Merk også grensen mot
        standardheving:{" "}
        <Link href="/guide/vedlikehold-eller-pakostning">
          vedlikehold gir fradrag nå, påkostning først ved salg
        </Link>
        . Hele listen over fradragsposter finner du i guiden om{" "}
        <Link href="/guide/fradrag-ved-utleie">fradrag ved utleie</Link>.
        Dette er generell informasjon, ikke skatterådgivning – se{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetaten
        </a>{" "}
        for detaljene.
      </p>

      <h2>Hva leietaker plikter å vedlikeholde</h2>
      <p>
        Hvis ikke annet er avtalt, har leietaker etter husleieloven ansvar for
        småtingene: dørlåser, kraner, vannklosetter, elektriske kontakter og
        brytere – i praksis det som ryker ved daglig bruk. Alt annet er ditt
        ansvar som utleier, og må en gjenstand du eier skiftes helt ut, er
        også det din regning. Gjenta gjerne fordelingen i leiekontrakten, så
        ingen er i tvil. Dette er generell informasjon, ikke juridisk
        rådgivning – detaljene står i{" "}
        <a
          href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
          rel="noopener noreferrer"
          target="_blank"
        >
          husleieloven
        </a>
        .
      </p>

      <h2>Legg vedlikeholdet inn i kontantstrømmen</h2>
      <p>
        En utleiebolig som bare går i pluss uten vedlikeholdspost, går i
        praksis i minus. Legg månedsbeløpet fra regneeksempelet inn som
        vedlikeholdskostnad i utleiekalkulatoren, og se hva{" "}
        <Link href="/guide/kontantstrom-utleiebolig">
          kontantstrømmen etter skatt
        </Link>{" "}
        faktisk blir. Tåler kalkylen 2 000–3 000 kr i måneden til slitasje og
        fortsatt går i pluss, står prosjektet på trygg grunn.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Skatteetaten: skatt ved utleie av bolig
          </a>
        </li>
        <li>
          <a
            href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lovdata: husleieloven
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
