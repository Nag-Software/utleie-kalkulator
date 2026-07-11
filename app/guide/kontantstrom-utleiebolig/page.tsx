import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("kontantstrom-utleiebolig");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hva er kontantstrøm på en utleiebolig?</h2>
      <p>
        <strong>Kontantstrømmen</strong> er det som faktisk står igjen på
        kontoen når alt er betalt: drift, renter, skatt og avdrag. Den kan
        være negativ selv om investeringen er god – og se positiv ut i
        regneark som glemmer halve kostnadene. Der yield beskriver boligen,
        beskriver kontantstrømmen hverdagen din som eier: hvor mye som går
        inn på eller ut av lommeboken hver måned.
      </p>

      <h2>Oppstillingen steg for steg</h2>
      <p>
        Regnestykket har tre etapper: først driften, så skatten, til slutt
        avdragene. Vi følger ett eksempel hele veien: en leilighet kjøpt for
        4 000 000 kr, leid ut for 15 000 kr i måneden, med lån på
        3 000 000 kr til 5 % rente og 25 års nedbetalingstid.
      </p>
      <ol>
        <li>
          <strong>Netto drift:</strong> brutto leie minus tomgang,
          felleskostnader, kommunale avgifter og eiendomsskatt, forsikring,
          vedlikehold og eventuell forvaltning. I eksempelet: 180 000 kr i
          årsleie minus 5 % tomgang og 55 000 kr i driftskostnader gir
          116 000 kr.
        </li>
        <li>
          <strong>Resultat før skatt:</strong> netto drift minus renter.
          Rentene er om lag 148 000 kr det første året, så resultatet blir
          −32 000 kr – et underskudd.
        </li>
        <li>
          <strong>Skatt:</strong> 22 % av resultatet. Ved overskudd trekkes
          skatten fra; ved underskudd får du 22 % av underskuddet igjen som{" "}
          <Link href="/guide/underskudd-pa-utleie">
            fradrag i annen inntekt
          </Link>{" "}
          – her pluss 7 040 kr.
        </li>
        <li>
          <strong>Kontantstrøm etter skatt:</strong> trekk til slutt fra
          avdragene, om lag 62 000 kr det første året.
        </li>
      </ol>

      <h2>Hele oppstillingen i én tabell</h2>
      <table>
        <thead>
          <tr>
            <th>Post</th>
            <th>Beløp per år</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Brutto leie (15 000 kr × 12)</td>
            <td>180 000 kr</td>
          </tr>
          <tr>
            <td>− Tomgang (5 %)</td>
            <td>−9 000 kr</td>
          </tr>
          <tr>
            <td>− Felleskostnader (2 500 kr/mnd)</td>
            <td>−30 000 kr</td>
          </tr>
          <tr>
            <td>− Kommunale avgifter og eiendomsskatt</td>
            <td>−6 000 kr</td>
          </tr>
          <tr>
            <td>− Forsikring</td>
            <td>−4 000 kr</td>
          </tr>
          <tr>
            <td>− Vedlikeholdsavsetning</td>
            <td>−15 000 kr</td>
          </tr>
          <tr>
            <td>− Forvaltning (leier ut selv)</td>
            <td>0 kr</td>
          </tr>
          <tr>
            <td>
              <strong>= Netto drift</strong>
            </td>
            <td>
              <strong>116 000 kr</strong>
            </td>
          </tr>
          <tr>
            <td>− Renter (3 000 000 kr, 5 %)</td>
            <td>−148 000 kr</td>
          </tr>
          <tr>
            <td>
              <strong>= Resultat før skatt</strong>
            </td>
            <td>
              <strong>−32 000 kr</strong>
            </td>
          </tr>
          <tr>
            <td>+ Skattefordel av underskudd (22 %)</td>
            <td>+7 040 kr</td>
          </tr>
          <tr>
            <td>− Avdrag (første år, 25 års annuitet)</td>
            <td>−62 000 kr</td>
          </tr>
          <tr>
            <td>
              <strong>= Kontantstrøm etter skatt</strong>
            </td>
            <td>
              <strong>−86 960 kr</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Kontantstrømmen er altså rundt <strong>−87 000 kr i året</strong>,
        eller omtrent 7 200 kr i måneden som må dekkes av lønnskontoen – selv
        om boligen er utleid til markedsleie.
      </p>

      <h2>Avdrag påvirker kontantstrømmen – ikke skatten</h2>
      <p>
        Den vanligste kilden til forvirring: <strong>skatten regnes uten
        avdrag</strong>. Skattemessig er avdrag ingen kostnad, men flytting
        av penger fra bankkontoen din til formuen din – gjelden krymper like
        mye som kontoen. Derfor gir renter fradrag, mens avdrag ikke gjør
        det. Og derfor kan kontantstrømmen være tung å bære selv når
        skatteregnskapet bare viser et beskjedent underskudd, slik som i
        eksempelet. Dette er generell informasjon, ikke skatterådgivning – se{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetatens sider om utleie
        </a>
        .
      </p>

      <h2>Hva er god kontantstrøm?</h2>
      <p>
        Positiv kontantstrøm etter alt – inkludert avdrag – er sjelden vare i
        pressområder med normal belåning. Det betyr ikke at alle slike kjøp
        er dårlige. I eksempelet går 62 000 av de 87 000 kronene til avdrag:
        penger du beholder i form av redusert gjeld. Det reelle tapet før
        eventuell verdistigning er dermed rundt 25 000 kr i året. Negativ
        kontantstrøm kan være helt greit når avdragene bygger formue raskere
        enn kontoen tappes – men bare hvis du har buffer til å bære den
        gjennom rentetopper og tomgang. Uten buffer er negativ kontantstrøm
        en nedtelling.
      </p>

      <h2>Postene folk glemmer</h2>
      <ul>
        <li>
          <strong>Vedlikeholdsavsetning:</strong> bad, hvitevarer og
          overflater varer ikke evig. Kalkyler uten{" "}
          <Link href="/guide/vedlikeholdsbudsjett-utleiebolig">
            vedlikeholdsbudsjett
          </Link>{" "}
          ser alltid bedre ut enn virkeligheten.
        </li>
        <li>
          <strong>Tomgang:</strong> leietakerbytte betyr nesten alltid noen
          uker uten leie. Sjekk{" "}
          <Link href="/guide/hva-kan-jeg-leie-ut-for">
            hva boligen realistisk kan leies ut for
          </Link>{" "}
          – og regn med 5 % tomgang, ikke null.
        </li>
        <li>
          <strong>Kostnader ved bytte:</strong> annonsering, visninger, vask
          og oppfriskning mellom leietakere.
        </li>
      </ul>

      <h2>Kalkulatoren setter opp hele regnestykket</h2>
      <p>
        Utleiekalkulatoren gjør nøyaktig denne oppstillingen for deg: legg
        inn kjøpesum, leie, lån og kostnader, så får du kontantstrøm etter
        skatt, break-even-leie og prognose år for år – gratis og uten konto.
        Har du funnet en bolig på FINN, kan du importere annonsen og få
        feltene forhåndsutfylt med en KI-vurdering for 9,90 kr.
      </p>
    </ArticleLayout>
  );
}
