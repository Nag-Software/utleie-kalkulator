import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("underskudd-pa-utleie");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Skattefradraget: 22 % av underskuddet</h2>
      <p>
        Går utleien med skattemessig underskudd – fradragsberettigede
        kostnader og renter er større enn leieinntektene – trekkes
        underskuddet fra i annen alminnelig inntekt, for eksempel lønnen din.
        Verdien er <strong>22 %</strong>: et underskudd på 40 000 kr
        reduserer skatten med 8 800 kr, forutsatt at du har annen inntekt å
        føre fradraget mot. Du søker ikke om noe – det skjer automatisk i{" "}
        <Link href="/guide/skattemelding-leieinntekter">skattemeldingen</Link>
        . Forutsetningen er at utleien er skattepliktig: skattefri utleie i
        egen bolig gir verken skatt på leien eller fradrag for kostnadene.
      </p>

      <h2>Regneeksempel: renter og kostnader over leien</h2>
      <p>
        Underskudd oppstår typisk de første eierårene, når rentene er på sitt
        høyeste og gjelden på sitt største, eller i enkeltår med mye
        vedlikehold. Si at en leilighet leies ut for 15 000 kr i måneden.
        Lånet er på 3 000 000 kr med for eksempel 5 % rente – rundt
        150 000 kr i renter det første året – og driftskostnadene er
        45 000 kr.
      </p>
      <ul>
        <li>Leieinntekter: 180 000 kr</li>
        <li>Driftskostnader: −45 000 kr</li>
        <li>Gjeldsrenter: −150 000 kr</li>
        <li>
          Skattemessig resultat: <strong>−15 000 kr</strong>
        </li>
      </ul>
      <p>
        Underskuddet på 15 000 kr gir <strong>3 300 kr</strong> i redusert
        skatt. Rentene står for brorparten av fradragene – hvordan
        rentefradraget virker på lånekostnaden, er tema i guiden om{" "}
        <Link href="/guide/rentefradrag-pa-utleielan">
          rentefradrag på utleielån
        </Link>
        .
      </p>

      <h2>Kontantstrøm-underskudd er ikke skattemessig underskudd</h2>
      <p>
        Her går mange i surr, og forskjellen er hele poenget: i
        kontantstrømmen betaler du også <strong>avdrag</strong> – i eksempelet
        75 000 kr i året. Avdrag er ikke en kostnad, men nedbetaling av egen
        gjeld, og gir <strong>ikke fradrag</strong>. Derfor kan kontoen tømmes
        hver måned selv om det skattemessige underskuddet er beskjedent:
      </p>
      <table>
        <thead>
          <tr>
            <th>Post</th>
            <th>Skatteregnskapet</th>
            <th>Kontantstrømmen</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Leieinntekter</td>
            <td>+180 000 kr</td>
            <td>+180 000 kr</td>
          </tr>
          <tr>
            <td>Driftskostnader</td>
            <td>−45 000 kr</td>
            <td>−45 000 kr</td>
          </tr>
          <tr>
            <td>Gjeldsrenter</td>
            <td>−150 000 kr</td>
            <td>−150 000 kr</td>
          </tr>
          <tr>
            <td>Avdrag</td>
            <td>0 kr (ikke fradrag)</td>
            <td>−75 000 kr</td>
          </tr>
          <tr>
            <td>
              <strong>Resultat</strong>
            </td>
            <td>
              <strong>−15 000 kr</strong>
            </td>
            <td>
              <strong>−90 000 kr</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Etter skattefordelen på 3 300 kr må du skyte inn omtrent 86 700 kr i
        året – rundt 7 200 kr i måneden. Men 75 000 kr av dette er avdrag som
        bygger egenkapital i boligen, så det reelle tapet før eventuell
        verdiendring er under 12 000 kr i året. Merk også at skattefordelen
        først kommer i skatteoppgjøret – gjennom året må du kunne dekke hele
        minuset løpende. Hele oppstillingen fra brutto leie til kroner på
        konto finner du i guiden om{" "}
        <Link href="/guide/kontantstrom-utleiebolig">
          kontantstrøm på utleiebolig
        </Link>
        .
      </p>

      <h2>Når er vedvarende underskudd greit – og når er det et faresignal?</h2>
      <p>
        Underskudd kan være helt fint når minuset i hovedsak skyldes avdrag:
        da sparer du i boligen hver måned, rentene faller etter hvert som
        gjelden betales ned, og leien kan KPI-justeres én gang i året.
        Forutsetningen er at du har buffer til å bære underskuddet gjennom
        renteøkninger og tomgang.
      </p>
      <p>
        Faresignalet er skattemessig underskudd år etter år – altså minus
        selv før avdrag – eller negativ kontantstrøm til tross for{" "}
        <Link href="/guide/avdragsfrihet-pa-utleiebolig">avdragsfrihet</Link>.
        Da hviler hele investeringen på fremtidig verdistigning, og den er
        ikke garantert. Test derfor hva 3 prosentpoeng høyere rente og en
        måned tomgang i året gjør med tallene før du stoler på regnestykket.
        Dette er generell informasjon, ikke skatterådgivning –
        se{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetatens sider om utleie
        </a>{" "}
        for reglene i detalj.
      </p>

      <h2>Se begge tallene før du kjøper</h2>
      <p>
        Utleiekalkulatoren skiller nettopp disse to størrelsene: den regner
        skattemessig resultat med fradragsfordelen, og viser kontantstrømmen
        etter skatt per måned – pluss break-even-leien og break-even-renten
        der minus blir pluss. Gratis og uten konto, så du kan stressteste
        kjøpet før budrunden.
      </p>
    </ArticleLayout>
  );
}
