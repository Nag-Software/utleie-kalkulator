import type { Metadata } from "next";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("dokumentavgift-og-omkostninger");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hva er dokumentavgiften?</h2>
      <p>
        Dokumentavgiften er en statlig avgift på <strong>2,5 %</strong> av
        kjøpesummen (markedsverdien) som betales når skjøtet på en{" "}
        <strong>selveierbolig</strong> tinglyses. Den betales av kjøper, kommer
        på toppen av kjøpesummen, og er penger du aldri får igjen – den inngår
        ikke i boligens verdi.
      </p>
      <p>
        På en leilighet til 4 000 000 kr utgjør dokumentavgiften alene{" "}
        <strong>100 000 kr</strong>. For et utleieregnestykke er det et helt
        års leieinntekter i mange markeder.
      </p>

      <h2>Hvem slipper dokumentavgift?</h2>
      <ul>
        <li>
          <strong>Andelsleiligheter i borettslag:</strong> Du kjøper en andel i
          borettslaget, ikke en tinglyst eiendom. I stedet betaler du et
          eierskiftegebyr til forretningsføreren, typisk noen tusenlapper.
        </li>
        <li>
          <strong>Aksjeleiligheter:</strong> Samme prinsipp – ingen
          dokumentavgift.
        </li>
        <li>
          <strong>Nybygg:</strong> Ved kjøp fra utbygger betales dokumentavgift
          kun av <em>tomteverdien</em>, ikke av hele kjøpesummen. Det kan bety
          titusener spart.
        </li>
      </ul>

      <h2>De andre omkostningene</h2>
      <table>
        <thead>
          <tr>
            <th>Kostnad</th>
            <th>Gjelder</th>
            <th>Typisk beløp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dokumentavgift 2,5 %</td>
            <td>Selveier</td>
            <td>2,5 % av kjøpesum</td>
          </tr>
          <tr>
            <td>Tinglysing av skjøte</td>
            <td>Selveier</td>
            <td>ca. 600 kr</td>
          </tr>
          <tr>
            <td>Tinglysing av pantedokument</td>
            <td>Ved boliglån</td>
            <td>ca. 600 kr</td>
          </tr>
          <tr>
            <td>Eierskiftegebyr</td>
            <td>Borettslag/aksje</td>
            <td>1 000–8 000 kr</td>
          </tr>
          <tr>
            <td>Boligkjøperforsikring (valgfritt)</td>
            <td>Alle</td>
            <td>4 000–15 000 kr</td>
          </tr>
        </tbody>
      </table>
      <p>
        Gebyrsatsene justeres årlig; eksakte beløp står alltid i
        salgsoppgaven under «Omkostninger».
      </p>

      <h2>Eksempel: selveier vs. andel</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Selveier 4 mill.</th>
            <th>Andel 4 mill.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dokumentavgift</td>
            <td>100 000 kr</td>
            <td>0 kr</td>
          </tr>
          <tr>
            <td>Gebyrer</td>
            <td>ca. 1 200 kr</td>
            <td>ca. 1 500 kr</td>
          </tr>
          <tr>
            <td>Sum omkostninger</td>
            <td>ca. 101 200 kr</td>
            <td>ca. 1 500 kr</td>
          </tr>
        </tbody>
      </table>
      <p>
        Merk at andelsboliger ofte har <strong>fellesgjeld</strong> som kommer
        på toppen av kjøpesummen, og høyere felleskostnader som betjener denne.
        Totalprisen (kjøpesum + fellesgjeld) er det reelle
        sammenligningsgrunnlaget.
      </p>

      <h2>Hvorfor dette betyr mye for utleie</h2>
      <p>
        Omkostningene øker den totale investeringen uten å øke leieinntektene –
        de senker altså netto yield direkte. Utleiekalkulatoren beregner
        automatisk riktig dokumentavgift ut fra eieform, legger fellesgjelden
        inn i totalprisen, og viser hvordan omkostningene påvirker avkastningen
        på egenkapitalen din. Henter du tallene fra en FINN-annonse, brukes de
        eksakte omkostningene fra salgsoppgaven.
      </p>
    </ArticleLayout>
  );
}
