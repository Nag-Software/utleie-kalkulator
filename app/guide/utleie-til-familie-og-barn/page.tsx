import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("utleie-til-familie-og-barn");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Lav leie er lov – men skatten følger boligtypen</h2>
      <p>
        Du kan leie ut så billig du vil til barn og annen familie; ingen regel
        pålegger deg å ta markedsleie. Skattemessig avhenger alt av hvilken
        bolig det gjelder: i boligen du selv bor i, gjelder de vanlige
        skattefritakene uansett hvem som leier. I en sekundærbolig skattlegges
        faktisk leie fra første krone – og setter du leien langt under
        markedsnivå, risikerer du i tillegg å miste fradrag.
      </p>
      <table>
        <thead>
          <tr>
            <th>Situasjon</th>
            <th>Skatt på leien</th>
            <th>Verdt å merke seg</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hybel i boligen du bor i</td>
            <td>Skattefri etter halvparten-regelen</td>
            <td>Samme regler som ved utleie til andre</td>
          </tr>
          <tr>
            <td>Sekundærbolig, leie under markedsleie</td>
            <td>22 % av faktisk netto leie</td>
            <td>Fradragene kan avkortes</td>
          </tr>
          <tr>
            <td>Sekundærbolig, gratis bruk</td>
            <td>Ingen leieinntekt å skattlegge</td>
            <td>Ingen fradrag – og fortsatt formuesskatt</td>
          </tr>
          <tr>
            <td>Foreldrekjøp – eie sammen med barnet</td>
            <td>Leie for foreldrenes andel skattlegges</td>
            <td>Barnets andel regnes som primærbolig</td>
          </tr>
        </tbody>
      </table>

      <h2>Hybel i egen bolig til barn eller familie</h2>
      <p>
        Leier du ut mindre enn halvparten av boligen du selv bor i, regnet
        etter utleieverdi, er leien skattefri – også når leietakeren er
        familie. Reglene er de samme som ved utleie til hvem som helst; se
        guiden om å{" "}
        <Link href="/guide/leie-ut-del-av-egen-bolig">
          leie ut del av egen bolig
        </Link>
        . Skriv leiekontrakt og opprett depositumskonto som ellers –
        ryddighet er billig, også i familien.
      </p>

      <h2>Sekundærbolig leid billig ut til barnet</h2>
      <p>
        Leier barnet en leilighet du eier, for 7 000 kr i måneden når
        markedsleien er 14 000 kr, skattlegges du av den faktiske leien:
        84 000 kr i året, med 22 % av netto etter fradrag. Fellen ligger i
        fradragene: når leien er vesentlig under markedsleie, kan Skatteetaten
        legge til grunn at utleien ikke er et reelt <strong>inntektserverv</strong>{" "}
        – formålet er ikke å tjene penger – og da kan fradragene{" "}
        <strong>avkortes eller nektes</strong>. Du risikerer altså skatt på
        inntekten uten fullt fradrag for kostnadene. Jo nærmere markedsleie du
        ligger, jo tryggere står fradragene. Hva markedsleien faktisk er,
        dokumenterer du enklest med sammenlignbare annonser og SSBs
        leiestatistikk – fremgangsmåten står i guiden om{" "}
        <Link href="/guide/hva-kan-jeg-leie-ut-for">
          hva du kan leie ut for
        </Link>
        .
      </p>

      <h2>Gratis bruk: ingen leieinntekt, men fortsatt formuesskatt</h2>
      <p>
        Lar du barnet bo gratis, har du utenfor næringsvirksomhet ingen
        leieinntekt å skattlegge – og dermed heller ingen fradrag for
        kostnadene. Boligen er like fullt en <strong>sekundærbolig</strong> i
        formuesskatten, verdsatt til 100 % av beregnet markedsverdi. Hva det
        betyr i kroner, viser guiden om{" "}
        <Link href="/guide/formuesskatt-pa-utleiebolig">
          formuesskatt på utleiebolig
        </Link>
        .
      </p>

      <h2>Foreldrekjøp: å eie sammen med barnet</h2>
      <p>
        En vanlig modell er at foreldre og barn kjøper sammen, og barnet bor i
        boligen. Da regnes <strong>barnets eierandel som primærbolig</strong>:
        verdsatt til 25 % i formuesskatten (opp til 10 millioner kroner) og
        med mulighet for skattefritt salg etter botidsregelen. Foreldrenes
        andel er sekundærbolig, og betaler barnet leie for den, er leien
        skattepliktig for foreldrene. Overføres foreldrenes andel til barnet
        senere, utløser det <strong>dokumentavgift på 2,5 %</strong> av
        andelens verdi i selveierbolig – se guiden om{" "}
        <Link href="/guide/dokumentavgift-og-omkostninger">
          dokumentavgift og omkostninger
        </Link>{" "}
        – og eventuell gevinst kan være skattepliktig for foreldrene. Sett
        eierbrøken skriftlig i en sameieavtale fra start: den styrer både
        formuesverdsettelsen og skatten den dagen boligen selges.
      </p>
      <p>
        Familieutleie vurderes konkret, og grensene er skjønnsmessige. Dette
        er generell informasjon, ikke skatterådgivning – se{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetatens sider om utleie
        </a>{" "}
        for din situasjon.
      </p>

      <h2>Regn på hjelpen før du gir den</h2>
      <p>
        «Familiepris» er også en pris: differansen mot markedsleie er et årlig
        beløp du gir bort, og lav leie kan i tillegg svekke fradragene. Sett
        den faktiske leien inn i utleiekalkulatoren og se hva rabatten betyr i
        kontantstrøm etter skatt per måned og år – gratis og uten konto.
        Vurderer dere en konkret bolig, kan tallene hentes rett fra
        FINN-annonsen.
      </p>
    </ArticleLayout>
  );
}
