import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("korttidsutleie-vs-langtidsutleie");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Det korte svaret</h2>
      <p>
        Korttidsutleie kan gi <strong>1,5–2 ganger så høy bruttoinntekt</strong>{" "}
        som langtidsutleie – men etter belegg, plattformgebyr, rengjøring,
        forbruk, slitasje og arbeidstimer krymper forskjellen kraftig, og i
        mange tilfeller forsvinner den helt. Langtidsutleie gir lavere topp,
        men forutsigbar inntekt med minimal innsats. Korttidsutleie er i
        praksis en deltidsjobb.
      </p>

      <h2>Fra brutto til netto: trekkene som spiser forskjellen</h2>
      <ul>
        <li>
          <strong>Belegg:</strong> du får ikke betalt for tomme netter. 60–80 %
          belegg over året regnes som bra, og de fleste steder har lavsesong.
        </li>
        <li>
          <strong>Plattformgebyr:</strong> fra noen prosent til midt på
          tosifret, avhengig av plattform og hvordan gebyrene er satt opp.
        </li>
        <li>
          <strong>Rengjøring:</strong> mellom hver gjest – enten kjøpt eller
          din egen tid.
        </li>
        <li>
          <strong>Strøm, internett og forbruk:</strong> ved korttidsutleie
          betaler du alt selv, pluss sengetøy, såpe og forbruksartikler.
        </li>
        <li>
          <strong>Slitasje og utstyr:</strong> hyppige inn- og utsjekk sliter
          mer, og boligen må være fullt møblert og utstyrt.
        </li>
        <li>
          <strong>Arbeidstid:</strong> annonser, meldinger, nøkler og
          problemløsing – hver uke, hele året.
        </li>
      </ul>

      <h2>Regneeksempel: 2-roms på langtid og korttid</h2>
      <p>
        Ta en 2-roms som kan leies ut for 15 000 kr i måneden på
        langtidskontrakt, eller for 1 100 kr per natt som korttidsutleie. Med
        70 % belegg blir det rundt 255 betalte netter i året. For
        langtidsutleien har vi lagt inn én måneds tomgang annethvert år.
        Tallene er et eksempel – felleskostnader, forsikring og skatt kommer i
        tillegg i begge scenarioene:
      </p>
      <table>
        <thead>
          <tr>
            <th>Post</th>
            <th>Langtidsutleie</th>
            <th>Korttidsutleie (70 % belegg)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Brutto leieinntekt</td>
            <td>180 000 kr</td>
            <td>280 500 kr</td>
          </tr>
          <tr>
            <td>Plattformgebyr (eksempel: 12 %)</td>
            <td>0 kr</td>
            <td>−33 700 kr</td>
          </tr>
          <tr>
            <td>Rengjøring (ca. 85 utsjekk × 600 kr)</td>
            <td>0 kr</td>
            <td>−51 000 kr</td>
          </tr>
          <tr>
            <td>Strøm, internett og forbruk</td>
            <td>0 kr (leietaker betaler)</td>
            <td>−24 000 kr</td>
          </tr>
          <tr>
            <td>Ekstra slitasje og utstyr</td>
            <td>0 kr</td>
            <td>−15 000 kr</td>
          </tr>
          <tr>
            <td>Tomgang</td>
            <td>−7 500 kr</td>
            <td>Inngår i belegget</td>
          </tr>
          <tr>
            <td>
              <strong>Netto før felleskostnader og skatt</strong>
            </td>
            <td>
              <strong>ca. 172 500 kr</strong>
            </td>
            <td>
              <strong>ca. 156 800 kr</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        I dette eksemplet gir korttidsutleien 100 000 kr mer i brutto, men
        ender <strong>lavere i netto</strong> – før du har regnet én krone for
        arbeidstimene dine. Løfter du belegget til 80 %, kryper
        korttidsnettoen så vidt forbi, til rundt 185 000 kr. Konklusjonen er
        med andre ord følsom for nattpris og belegg: i pressede turistområder
        kan korttid vinne klart, i vanlige boligstrøk gjør den det sjelden.
      </p>

      <h2>Skatten er helt forskjellig</h2>
      <p>
        I <strong>egen bolig</strong> er skattereglene systematisk snillere
        mot langtid: langtidsutleie er skattefri når du selv bruker minst
        halvparten av boligen, mens korttidsutleie har 10 000 kr skattefritt
        per år og deretter regnes 85 % av det overskytende som skattepliktig
        inntekt. I <strong>sekundærbolig</strong> skattlegges begge fullt fra
        første krone, med 22 % av netto leie. Og hyppig korttidsutleie med
        høyt aktivitetsnivå kan bli regnet som næring, med langt høyere skatt.
        Detaljene står i guidene om{" "}
        <Link href="/guide/airbnb-og-korttidsutleie">
          Airbnb og korttidsutleie
        </Link>{" "}
        og{" "}
        <Link href="/guide/nar-blir-utleie-naeringsvirksomhet">
          når utleie blir næringsvirksomhet
        </Link>
        . Dette er generell informasjon, ikke skatterådgivning – se{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetatens sider om utleie
        </a>
        .
      </p>

      <h2>Regler som begrenser korttidsutleie</h2>
      <p>
        I <strong>borettslag</strong> kan du korttidsutleie boligen i inntil
        30 døgn i året uten styrets samtykke; i{" "}
        <strong>eierseksjonssameie</strong> er grensen 90 døgn, og vedtektene
        kan justere den til mellom 60 og 120. Leier du ut et rom mens du selv
        bor der, gjelder ikke døgngrensene. Reglene for borettslag er
        beskrevet i guiden om{" "}
        <Link href="/guide/utleie-i-borettslag">utleie i borettslag</Link>.
      </p>

      <h2>En deltidsjobb med høyere topp</h2>
      <p>
        Velg korttidsutleie hvis boligen ligger der folk vil overnatte, du bor
        i nærheten eller har et pålitelig rengjøringsopplegg – og du faktisk
        vil drive. Da kan toppen bli høyere enn noen langtidskontrakt. Velg
        langtid hvis du vil ha forutsigbar inntekt uten ukentlig innsats. Regn
        begge scenarioer før du bestemmer deg: legg langtidsleien rett inn i{" "}
        <Link href="/">utleiekalkulatoren</Link>, og legg korttidsnettoen inn
        som månedsleie i et eget scenario – så ser du kontantstrøm etter skatt
        og break-even side om side. Kalkulatoren er gratis og krever ingen
        konto.
      </p>
    </ArticleLayout>
  );
}
