import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("utleie-av-hytte");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Skatten: 10 000 kr fritt, deretter 85 %-regelen</h2>
      <p>
        Leier du ut en fritidsbolig du <strong>selv bruker</strong>, er de
        første <strong>10 000 kr</strong> i leieinntekt per år skattefrie. Av
        det overskytende regnes <strong>85 %</strong> som skattepliktig
        kapitalinntekt med 22 % skatt. Eksempel: 60 000 kr i utleieinntekt
        gir (60 000 − 10 000) × 0,85 = <strong>42 500 kr</strong> i
        skattepliktig inntekt og 42 500 × 0,22 = <strong>9 350 kr</strong> i
        skatt – en effektiv skatt på under 16 % av bruttoinntekten. Baksiden
        av sjablongen: du får <strong>ikke fradrag</strong> for rengjøring,
        strøm, plattformgebyr eller andre kostnader.
      </p>

      <h2>Ren utleiehytte skattlegges som vanlig utleie</h2>
      <p>
        Bruker du ikke hytta selv, gjelder ikke sjablongen. Da er
        leieinntekten skattepliktig <strong>fra første krone</strong> som
        annen utleie: 22 % av netto leieinntekt, med fradrag for kostnadene.
        Satsene står i guiden om{" "}
        <Link href="/guide/skatt-pa-utleie-2026">skatt på utleie</Link> og
        kostnadene du kan trekke fra i guiden om{" "}
        <Link href="/guide/fradrag-ved-utleie">fradrag ved utleie</Link>.
        Om hytta regnes som fritidsbolig du bruker selv eller som ren
        utleiehytte, beror på den faktiske bruken over tid – ikke på hva du
        kaller den. Vær også klar over at behandlingen kan smitte over på
        salget: en hytte som skattemessig er ren utleiehytte, kan gi
        skattepliktig gevinst ved salg, der en fritidsbolig med tilstrekkelig
        egen bruk over tid kan selges skattefritt. Reglene er detaljerte, og
        dette er generell informasjon, ikke skatterådgivning – sjekk
        Skatteetaten før du legger om bruken.
      </p>

      <h2>Sesongmatematikken: tell netter, ikke måneder</h2>
      <p>
        Hytteutleie er ikke månedsleie, men <strong>belegg</strong>: noen få
        uker står for det meste av inntekten. For en vinterhytte er det jul,
        vinterferie og påske; for en sommerhytte fellesferien. Et eksempel på
        en vinterhytte:
      </p>
      <table>
        <thead>
          <tr>
            <th>Post</th>
            <th>Beløp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>15 høysesong-netter à 2 500 kr</td>
            <td>37 500 kr</td>
          </tr>
          <tr>
            <td>20 lavsesong-netter à 1 200 kr</td>
            <td>24 000 kr</td>
          </tr>
          <tr>
            <td>
              <strong>Brutto leieinntekt</strong>
            </td>
            <td>
              <strong>61 500 kr</strong>
            </td>
          </tr>
          <tr>
            <td>Rengjøring og plattformgebyr</td>
            <td>−8 000 kr</td>
          </tr>
          <tr>
            <td>Ekstra strøm og slitasje</td>
            <td>−8 000 kr</td>
          </tr>
          <tr>
            <td>
              <strong>Igjen før skatt</strong>
            </td>
            <td>
              <strong>45 500 kr</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Merk at sjablongskatten regnes av <strong>bruttoleien</strong>, ikke
        av det du sitter igjen med: (61 500 − 10 000) × 0,85 × 0,22 ≈
        9 600 kr i skatt. Netto etter skatt blir da rundt{" "}
        <strong>36 000 kr</strong> i dette eksempelet.
      </p>

      <h2>Hva dekker utleien realistisk?</h2>
      <p>
        For de fleste hytteeiere dekker utleien <strong>deler av
        driftskostnadene</strong> – ikke hytteøkonomien som helhet.
        Kommunale avgifter, forsikring, strøm, vedlikehold og eventuelle
        vei- og fellesutgifter summerer seg fort til flere titusener i året,
        og har du lån på hytta, kommer renter og avdrag på toppen. 36 000 kr
        etter skatt betaler gjerne de løpende driftsutgiftene, men sjelden
        lånekostnadene. Utleie gjør hytta billigere å eie – den gjør den
        sjelden gratis.
      </p>

      <h2>Plattform eller leie ut selv?</h2>
      <p>
        Utleieplattformene tar seg av annonsering, booking og betaling mot et
        gebyr, mens utleie i egen regi – til kjente, kolleger eller gjennom
        egne kanaler – lar deg beholde hele beløpet mot mer jobb med
        henvendelser, nøkler og rengjøring. Avveiningen mellom korttids- og
        langtidsutleie er regnet ut i guiden om{" "}
        <Link href="/guide/korttidsutleie-vs-langtidsutleie">
          korttidsutleie mot langtidsutleie
        </Link>
        , og skattereglene og døgngrensene for korttidsutleie av bolig står i
        guiden om{" "}
        <Link href="/guide/airbnb-og-korttidsutleie">
          Airbnb og korttidsutleie
        </Link>
        . Husk også den skjulte kostnaden: hver høysesonguke du leier ut, er
        en uke du ikke kan bruke hytta selv – for mange er det den reelle
        prisen ved hytteutleie.
      </p>

      <h2>Regn på hytta som utleieobjekt</h2>
      <p>
        Utleiekalkulatoren regner også på hytteprosjektet: legg inn forventet
        årlig leieinntekt fordelt per måned, driftskostnadene og et eventuelt
        lån, så ser du hva utleien faktisk bidrar med i kontantstrøm etter
        skatt – og hvor mange netter som skal til før hytta bærer sine egne
        kostnader. Kalkulatoren er gratis og krever ingen konto.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Skatteetaten: skatt ved utleie av bolig og fritidsbolig
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
