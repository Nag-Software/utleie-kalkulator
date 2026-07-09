import type { Metadata } from "next";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("yield-utleiebolig");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hva er yield?</h2>
      <p>
        Yield (også kalt direkteavkastning) måler leieinntektene opp mot det
        boligen koster. Det er det raskeste verktøyet for å sammenligne to
        utleieobjekter – eller for å vurdere om utleie i det hele tatt slår å
        sette pengene i fond eller på sparekonto.
      </p>

      <h2>Brutto yield: den raske huskeregelen</h2>
      <p>
        <strong>Brutto yield = årlig leieinntekt / kjøpesum × 100</strong>
      </p>
      <p>
        Eksempel: En leilighet til 4 000 000 kr som leies ut for 15 000 kr i
        måneden gir 180 000 kr i årsleie. Brutto yield blir 180 000 / 4 000 000
        = <strong>4,5 %</strong>.
      </p>
      <p>
        Brutto yield er nyttig for å sile kandidater raskt, men den lyver om
        lønnsomheten: den ignorerer felleskostnader, vedlikehold, ledighet og
        alle andre utgifter.
      </p>

      <h2>Netto yield: det ærlige tallet</h2>
      <p>
        <strong>
          Netto yield = netto driftsresultat / total investering × 100
        </strong>
      </p>
      <p>
        Netto driftsresultat (NOI) er leieinntektene minus ledighet og alle
        driftskostnader: felleskostnader, kommunale avgifter, forsikring,
        vedlikehold og eventuell forvaltning. Total investering inkluderer
        omkostninger (dokumentavgift for selveier) og oppussing – pengene du
        faktisk binder opp.
      </p>
      <p>
        Samme leilighet med 3 500 kr/mnd i felleskostnader, 5 % ledighet og
        normale driftskostnader ender gjerne rundt 2,5–3 % i netto yield. Det
        er dette tallet du bør sammenligne med hva pengene kunne gitt et annet
        sted – og med lånerenten din.
      </p>

      <h2>Hva er en god yield i Norge?</h2>
      <table>
        <thead>
          <tr>
            <th>Marked</th>
            <th>Typisk brutto yield</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Oslo sentralt</td>
            <td>3–4 %</td>
          </tr>
          <tr>
            <td>Bergen, Trondheim, Stavanger</td>
            <td>4–5,5 %</td>
          </tr>
          <tr>
            <td>Mindre byer og studentbyer</td>
            <td>5,5–7 %+</td>
          </tr>
        </tbody>
      </table>
      <p>
        Lav yield i pressområder kompenseres historisk av høyere verdistigning
        og lavere ledighetsrisiko; høy yield i mindre markeder kommer med
        større risiko for tomgang og svakere prisutvikling. Ingen av delene er
        «best» – de er ulike risikoprofiler.
      </p>

      <h2>Yield er ikke hele bildet</h2>
      <ul>
        <li>
          <strong>Kontantstrømmen</strong> avgjør om du klarer å sitte med
          boligen: med dagens renter kan en bolig med grei yield fortsatt koste
          deg penger hver måned.
        </li>
        <li>
          <strong>Gearingen</strong> (belåningen) forsterker både gevinst og
          tap på egenkapitalen – cash-on-cash-avkastningen viser dette.
        </li>
        <li>
          <strong>Skatten</strong> på 22 % av netto leieinntekt reduserer
          avkastningen, men rentefradraget demper effekten.
        </li>
      </ul>
      <p>
        En full vurdering krever at du regner på alt samtidig – det er nøyaktig
        det utleiekalkulatoren gjør, med break-even-leie, rentefølsomhet og
        prognose over flere år.
      </p>
    </ArticleLayout>
  );
}
