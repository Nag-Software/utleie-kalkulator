import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("hvor-i-norge-er-yield-hoyest");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Mønsteret: yield stiger der kvadratmeterprisen er lav</h2>
      <p>
        Brutto yield er høyest i mindre byer og studentbyer og lavest i Oslo
        sentrum. Forklaringen er enkel: <strong>leieprisene varierer langt
        mindre mellom markedene enn kjøpesummene gjør</strong>. En bolig i en
        mindre by kan koste en tredjedel av en tilsvarende i Oslo, men leies
        ut for godt over halvparten – da blir leie delt på pris høyere.
      </p>
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
        Et eksempel: en 2-roms sentralt i Oslo til 5 500 000 kr med 17 000 kr
        i månedsleie gir <strong>3,7 %</strong> brutto yield. En 2-roms i en
        mindre by til 2 000 000 kr med 11 000 kr i leie gir{" "}
        <strong>6,6 %</strong>. Leien er rundt en tredjedel lavere – prisen er
        nesten to tredjedeler lavere. Husk at dette er bruttotall: netto yield
        ligger typisk 1–1,5 prosentpoeng lavere for leiligheter, når
        felleskostnader, vedlikehold og tomgang er trukket fra. Hvordan du
        regner begge deler, står i guiden om{" "}
        <Link href="/guide/yield-utleiebolig">yield på utleiebolig</Link>.
      </p>

      <h2>Hvorfor høy yield ikke er gratis penger</h2>
      <p>
        Markedet priser risiko. Når kjøperne krever 6–7 % løpende avkastning
        for å eie i et lite marked, er det fordi:
      </p>
      <ul>
        <li>
          <strong>Leiemarkedet er tynnere:</strong> færre søkere per annonse
          gir lengre tomgang – og én måned tomgang spiser rundt 8 % av
          årsleien, fort hele yield-forskjellen.
        </li>
        <li>
          <strong>Verdistigningen har historisk vært svakere:</strong>{" "}
          pressområdene har tatt mesteparten av prisveksten, mindre markeder
          mer av den løpende avkastningen – se guiden om{" "}
          <Link href="/guide/verdistigning-pa-bolig">
            verdistigning på bolig
          </Link>
          .
        </li>
        <li>
          <strong>Færre kjøpere den dagen du selger:</strong> lengre salgstid
          og større prisusikkerhet – du betales for å bære
          likviditetsrisikoen.
        </li>
        <li>
          <strong>Sårbarheten er større:</strong> ett studiested, én
          hjørnesteinsbedrift eller ett sykehus kan bære hele leiemarkedet.
          Endres det, endres regnestykket ditt.
        </li>
      </ul>

      <h2>Studentbyer: stabil etterspørsel med sesongrytme</h2>
      <p>
        Studentbyene skiller seg positivt ut med forutsigbar etterspørsel:
        hvert høstsemester kommer et nytt kull leietakere. Men markedet er
        sesongstyrt – annonser i juli og august går unna, mens en ledig hybel
        i november kan bli stående. Regn også med årlig utskifting av
        leietakere, mer administrasjon og høyere slitasje enn med en stabil
        langtidsleietaker. Høy brutto yield i en studentby krymper derfor mer
        på veien til netto enn i et vanlig leiemarked.
      </p>

      <h2>Sjekkliste: slik vurderer du et lokalt leiemarked</h2>
      <p>
        Skal du vurdere et marked du ikke kjenner fra før, gir disse fem
        punktene et raskt og ærlig bilde:
      </p>
      <ul>
        <li>
          <strong>Folketall og utvikling:</strong> vokser kommunen eller
          krymper den? SSB har befolkningstall og fremskrivinger per kommune.
        </li>
        <li>
          <strong>Leieannonser mot salgsannonser på FINN:</strong> uvanlig
          mange leieannonser i forhold til størrelsen på stedet tyder på hard
          konkurranse om leietakerne.
        </li>
        <li>
          <strong>Tid på markedet:</strong> følg 10–15 leieannonser over noen
          uker. Forsvinner de raskt, er markedet stramt; blir de liggende, bør
          du budsjettere med tomgang.
        </li>
        <li>
          <strong>Arbeidsmarkedet:</strong> flere store arbeidsgivere er
          tryggere enn én dominerende.
        </li>
        <li>
          <strong>Leienivået:</strong> sjekk hva sammenlignbare boliger
          faktisk annonseres for, og bruk{" "}
          <a
            href="https://www.ssb.no/priser-og-prisindekser/statistikker/lmu/aar"
            rel="noopener noreferrer"
            target="_blank"
          >
            SSBs leiemarkedsundersøkelse
          </a>{" "}
          som referanse. Metoden er beskrevet i guidene om{" "}
          <Link href="/guide/leiepriser-oslo">leiepriser i Oslo</Link> og{" "}
          <Link href="/guide/leiepriser-bergen">leiepriser i Bergen</Link>.
        </li>
      </ul>

      <h2>Høy eller lav yield er ikke svaret – regnestykket er</h2>
      <p>
        Det finnes lønnsomme kjøp i begge ender av skalaen: dyre boliger i
        pressområder med lav yield og lav risiko, og billige boliger i små
        markeder der du betales godt for å bære risikoen. Avgjørelsen bør tas
        på kontantstrøm etter skatt, med realistisk tomgang – ikke på
        bruttotallet alene. Regn på konkrete objekter i{" "}
        <Link href="/">utleiekalkulatoren</Link>: legg inn leie, tomgang og
        kostnader, eller hent tallene rett fra FINN-annonsen (9,90
        kr). Kalkulatoren er ellers gratis og krever ingen konto.
      </p>
    </ArticleLayout>
  );
}
