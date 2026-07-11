import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("kjope-utleiebolig-sammen-med-andre");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Slik eier dere sammen: eierbrøk og tinglysing</h2>
      <p>
        Kjøper dere bolig sammen, blir dere <strong>sameiere</strong> med hver
        deres <strong>eierbrøk</strong> som tinglyses i grunnboken. Brøken bør
        speile det hver av dere faktisk skyter inn, for den styrer hvordan
        leieinntekter, fradrag, formue og en fremtidig gevinst fordeles.
        Skyter du inn 60 % av egenkapitalen, bør du normalt eie 60 % – ikke
        50 % «for enkelhets skyld». Å rette opp en skjev brøk i etterkant er
        både dyrere og vanskeligere enn å tinglyse riktig fra start.
      </p>

      <h2>Sameieavtalen: dokumentet som redder vennskapet</h2>
      <p>
        Muntlig enighet er lite verdt den dagen dere er uenige. Skriv en
        sameieavtale før dere legger inn bud – ikke etter overtakelse. Dette
        bør den regulere:
      </p>
      <table>
        <thead>
          <tr>
            <th>Punkt</th>
            <th>Hva dere bør avtale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kostnadsdeling</td>
            <td>
              Hvordan lån, felleskostnader, vedlikehold og uforutsette
              utgifter fordeles – og hva som skjer hvis én ikke betaler.
            </td>
          </tr>
          <tr>
            <td>Beslutninger</td>
            <td>
              Hva som krever enighet (salg, refinansiering, større oppussing)
              og hva én kan avgjøre alene.
            </td>
          </tr>
          <tr>
            <td>Drift og vedlikehold</td>
            <td>
              Hvem som følger opp leietaker og småreparasjoner – og om
              arbeidet skal kompenseres.
            </td>
          </tr>
          <tr>
            <td>Salg og utløsning</td>
            <td>
              Forkjøpsrett, hvordan en medeier kjøpes ut, og hvordan prisen
              settes – for eksempel ved uavhengig takst.
            </td>
          </tr>
          <tr>
            <td>Uenighet</td>
            <td>
              Exit-mekanisme når én vil ut og de andre vil sitte – frister og
              fremgangsmåte.
            </td>
          </tr>
          <tr>
            <td>Død og samlivsbrudd</td>
            <td>
              Om arvinger eller tidligere partnere kan tre inn som medeiere,
              eller om de øvrige har rett til å løse dem ut.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Uten avtale gjelder sameieloven, som blant annet lar en sameier kreve
        sameiet oppløst – i verste fall med tvangssalg som resultat. Dette er
        generell informasjon, ikke juridisk rådgivning; se{" "}
        <a
          href="https://lovdata.no/dokument/NL/lov/1965-06-18-6"
          rel="noopener noreferrer"
          target="_blank"
        >
          sameigelova på Lovdata
        </a>
        .
      </p>

      <h2>Skatt: inntekt og fradrag følger eierandelen</h2>
      <p>
        Utleie i sameie beskattes hos hver enkelt eier. Leieinntekter og
        fradrag fordeles etter eierbrøken og føres i{" "}
        <Link href="/guide/skattemelding-leieinntekter">
          hver deres skattemelding
        </Link>
        . Et eksempel: boligen leies ut for 180 000 kr i året og har
        60 000 kr i fradragsberettigede kostnader, altså 120 000 kr i netto
        leieinntekt. Med eierbrøk 60/40 fører den ene 72 000 kr og den andre
        48 000 kr til beskatning – med 22 % skatt blir det henholdsvis
        15 840 kr og 10 560 kr. Formuesverdi og felles gjeld fordeles på
        samme måte.
      </p>

      <h2>Lånet: solidaransvar betyr at du hefter for alt</h2>
      <p>
        Banken gir som regel ett felles lån med <strong>solidaransvar</strong>
        : hver av dere hefter for hele lånet, ikke bare sin andel. Slutter
        medeieren å betale, krever banken deg for full termin – uansett hva
        sameieavtalen sier dere imellom. Husk også at utlånsforskriftens tak
        på samlet gjeld,{" "}
        <Link href="/guide/egenkapital-og-lan-til-utleiebolig">
          maks fem ganger brutto årsinntekt
        </Link>
        , vurderes for hver låntaker: felleslånet spiser av lånekapasiteten
        til dere begge og kan stå i veien for neste boligkjøp. Kravet om
        minst 10 % egenkapital gjelder som ved kjøp alene.
      </p>

      <h2>Exit-planen er viktigst av alt</h2>
      <p>
        Alle sameier tar slutt: noen trenger pengene til egen bolig, noen
        flytter, noen går fra samboeren sin. Det viktigste punktet i hele
        avtalen er derfor veien ut: hvem har forkjøpsrett, til hvilken pris,
        hvor raskt skal utløsningen skje – og hva skjer hvis ingen vil eller
        kan kjøpe. En vanlig løsning er forkjøpsrett til takst satt av
        uavhengig megler, med noen måneders frist, og salg i markedet hvis
        retten ikke brukes. Arver dere en bolig sammen som søsken, oppstår
        akkurat de samme spørsmålene – les mer i guiden om{" "}
        <Link href="/guide/arvet-bolig-leie-ut-eller-selge">arvet bolig</Link>
        .
      </p>

      <h2>Regn på økonomien per eier før dere byr</h2>
      <p>
        Legg inn kjøpesum, leie, lån og kostnader i utleiekalkulatoren og se
        kontantstrømmen etter skatt for hele boligen. Del deretter på
        eierbrøken, så vet hver av dere hva dere må tåle per måned hvis
        renten stiger eller boligen står tom. Går regnestykket opp også for
        den av dere med strammest økonomi, er dere rustet for mer enn
        solskinnsdager. Kalkulatoren er gratis og krever ingen konto.
      </p>
    </ArticleLayout>
  );
}
