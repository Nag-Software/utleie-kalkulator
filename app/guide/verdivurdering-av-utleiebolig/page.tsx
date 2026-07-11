import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("verdivurdering-av-utleiebolig");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Det korte svaret: tre metoder, tre ulike tall</h2>
      <p>
        En utleiebolig kan verdsettes på tre måter:{" "}
        <strong>sammenlignbare salg</strong> (hva markedet betaler),{" "}
        <strong>yield-metoden</strong> (hva leieinntektene forsvarer) og{" "}
        <strong>e-takst</strong> (meglers faglige skjønn). For deg som
        investor er yield-metoden den viktigste: verdi er lik årlig netto
        leie delt på avkastningskravet ditt. I pressområder ligger dette
        tallet ofte under markedsverdien – og da er det yield-verdien som
        skal styre budet ditt, ikke prisantydningen.
      </p>

      <h2>Metode 1: sammenlignbare salg</h2>
      <p>
        Finn kvadratmeterprisen på faktisk solgte boliger i samme område – på
        FINN kan du se solgte boliger med endelig salgssum, og{" "}
        <a
          href="https://www.ssb.no/priser-og-prisindekser/boligpriser-og-boligprisindekser"
          rel="noopener noreferrer"
          target="_blank"
        >
          SSBs boligprisstatistikk
        </a>{" "}
        viser utviklingen over tid. Juster for etasje, stand, utsikt og –
        viktig – fellesgjeld: det er totalpris du skal sammenligne, ikke
        prisantydning. Metoden forteller hva boligen trolig går for i
        markedet, men ingenting om den er en god investering.
      </p>

      <h2>Metode 2: yield-metoden – hva leien forsvarer</h2>
      <p>
        Investorverdien er årlig <strong>netto leie</strong> delt på{" "}
        <strong>avkastningskravet</strong> ditt. Netto leie er leieinntektene
        minus eierkostnader som felleskostnader, vedlikehold, forsikring og
        normal tomgang – før lånekostnader. Hvordan du kommer frem til
        tallet, er forklart i guiden om{" "}
        <Link href="/guide/yield-utleiebolig">yield på utleiebolig</Link>.
      </p>
      <p>
        Regneeksempel: En leilighet leies ut for 13 500 kr i måneden, altså
        162 000 kr i året. Etter 42 000 kr i felleskostnader, vedlikehold og
        tomgang er netto leie <strong>120 000 kr</strong>. Med et
        avkastningskrav på 4,5 % blir investorverdien 120 000 kr delt på
        0,045, altså <strong>ca. 2 670 000 kr</strong>.
      </p>
      <table>
        <thead>
          <tr>
            <th>Avkastningskrav</th>
            <th>Investorverdi (netto leie 120 000 kr)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>4,0 %</td>
            <td>3 000 000 kr</td>
          </tr>
          <tr>
            <td>4,5 %</td>
            <td>ca. 2 670 000 kr</td>
          </tr>
          <tr>
            <td>5,0 %</td>
            <td>2 400 000 kr</td>
          </tr>
          <tr>
            <td>5,5 %</td>
            <td>ca. 2 180 000 kr</td>
          </tr>
        </tbody>
      </table>
      <p>
        Et halvt prosentpoeng i avkastningskravet flytter verdien med flere
        hundre tusen kroner. Kravet ditt bør minst ligge over lånerenten og
        speile risikoen: høyere krav i små markeder med usikker leie, noe
        lavere der utleien er trygg og{" "}
        <Link href="/guide/verdistigning-pa-bolig">verdistigning</Link>{" "}
        historisk har bidratt. Og bruk reell markedsleie i telleren –{" "}
        <Link href="/guide/hva-kan-jeg-leie-ut-for">
          sjekk hva boligen faktisk kan leies ut for
        </Link>
        , ikke det mest optimistiske annonsenivået.
      </p>

      <h2>Metode 3: e-takst og meglervurdering</h2>
      <p>
        En e-takst er meglers dokumenterte verdivurdering basert på
        sammenlignbare salg og befaring, og brukes av banken ved lånesøknad
        og refinansiering. Den estimerer markedsverdi – ikke investorverdi.
        Prisantydning er på sin side markedsføring og kan settes lavt for å
        trekke folk til visning. Ingen av delene er fasit for hva du bør
        betale.
      </p>

      <h2>Når er det riktig å by under prisantydning?</h2>
      <p>
        I pressområder betaler folk som selv skal bo i boligen, ofte mer enn
        leieinntektene forsvarer – de kjøper et hjem, ikke en kontantstrøm.
        Da ligger investorverdien under markedsverdien, og yield-metoden gir
        deg <strong>budtaket</strong>, ikke en spådom om salgsprisen. Betaler
        du mer enn investorverdien, betaler du i praksis for forventet
        verdistigning – det kan gå bra, men det er spekulasjon, ikke
        leieavkastning. Bud under prisantydning er typisk riktig når:
      </p>
      <ul>
        <li>netto yield ved prisantydning ligger under lånerenten</li>
        <li>
          boligen har lang liggetid eller dokumenterte utbedringsbehov i
          tilstandsrapporten
        </li>
        <li>
          leienivået som forsvarer prisen, er høyere enn det området faktisk
          betaler
        </li>
      </ul>
      <p>
        Vær samtidig ærlig med deg selv: i et hett marked vil du tape mange
        budrunder med denne disiplinen. Det er poenget – du skal bare vinne
        de riktige.
      </p>

      <h2>Regn ut investorverdien baklengs</h2>
      <p>
        I utleiekalkulatoren kan du jobbe baklengs: legg inn leie og
        kostnader, og juster kjøpesummen til netto yield treffer
        avkastningskravet ditt. Tallet du lander på, er budtaket. Med
        FINN-import hentes annonsens tall automatisk, så du ser med en gang
        hvor langt prisantydningen ligger fra investorverdien.
      </p>
    </ArticleLayout>
  );
}
