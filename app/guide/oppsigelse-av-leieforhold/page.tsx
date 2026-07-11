import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("oppsigelse-av-leieforhold");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Kontraktstypen avgjør hvordan leieforholdet slutter</h2>
      <p>
        En <strong>tidsbestemt</strong> kontrakt opphører av seg selv på
        sluttdatoen, uten oppsigelse – men kan til gjengjeld som hovedregel
        ikke sies opp underveis, med mindre kontrakten åpner for det. En{" "}
        <strong>tidsubestemt</strong> kontrakt løper til en av partene sier
        opp, og da gjelder frister og formkrav. Sjekk derfor først hva
        slags kontrakt dere har – valget av kontraktstype er en del av{" "}
        <Link href="/guide/leiekontrakt-dette-ma-den-inneholde">
          det leiekontrakten må regulere
        </Link>
        .
      </p>

      <h2>Leietakers oppsigelse: fri og enkel</h2>
      <p>
        Leietaker kan si opp en tidsubestemt leieavtale uten begrunnelse.
        Fristen er normalt <strong>tre måneder</strong>, regnet til utløpet
        av en kalendermåned: en oppsigelse levert 10. mars løper dermed ut
        30. juni. For et enkelt beboelsesrom der leietaker har adgang til en
        annens bolig – typisk hybel i utleiers egen bolig – er fristen én
        måned om ikke annet er avtalt. I oppsigelsestiden løper leieplikten
        som normalt, også hvis leietaker flytter ut tidligere.
      </p>

      <h2>Utleiers oppsigelse: saklig grunn og strenge formkrav</h2>
      <p>
        Skal du som utleier si opp en tidsubestemt avtale, må du ha{" "}
        <strong>saklig grunn</strong>:
      </p>
      <ul>
        <li>boligen skal brukes av deg selv eller noen i husstanden,</li>
        <li>eiendommen skal rives eller bygges om,</li>
        <li>leietaker har misligholdt leieavtalen, eller</li>
        <li>det foreligger en annen saklig grunn.</li>
      </ul>
      <p>
        Formkravene er absolutte: oppsigelsen skal være{" "}
        <strong>skriftlig</strong>, den skal begrunnes, og den skal opplyse
        om at leietaker kan protestere skriftlig innen én måned. Mangler
        noe av dette, er oppsigelsen <strong>ugyldig</strong> – og du må
        begynne på nytt. Oppsigelsesfristen er den samme som ellers,
        normalt tre måneder.
      </p>

      <h2>Hva skjer hvis leietaker protesterer?</h2>
      <p>
        Protesterer leietaker skriftlig innen én måned, faller oppsigelsen
        bort med mindre du reiser sak innen tre måneder etter at
        protestfristen løp ut – i praksis for Husleietvistutvalget. Der
        prøves både om oppsigelsen er lovlig og om den vil virke{" "}
        <strong>urimelig</strong>: selv en saklig oppsigelse kan settes til
        side etter en avveining av begge parters interesser. Leietaker kan
        normalt bli boende til saken er avgjort. Ubetalt leie og annet
        vesentlig mislighold følger en egen og raskere løype med heving og
        utkastelse – den er beskrevet i guiden om{" "}
        <Link href="/guide/nar-leietaker-ikke-betaler">
          når leietaker ikke betaler
        </Link>
        . Dette er generell informasjon, ikke juridisk rådgivning – se
        husleieloven kapittel 9 på{" "}
        <a
          href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
          rel="noopener noreferrer"
          target="_blank"
        >
          Lovdata
        </a>{" "}
        og veiledningen hos{" "}
        <a
          href="https://www.htu.no/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Husleietvistutvalget
        </a>
        .
      </p>

      <h2>Tidslinjen i et normalt oppsigelsesløp</h2>
      <p>
        Slik ser løpet typisk ut for en tidsubestemt kontrakt med tre
        måneders frist, der utleier sier opp 10. mars:
      </p>
      <table>
        <thead>
          <tr>
            <th>Tidspunkt</th>
            <th>Hva skjer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>10. mars</td>
            <td>
              Skriftlig oppsigelse leveres, med begrunnelse og opplysning om
              protestretten
            </td>
          </tr>
          <tr>
            <td>Innen 10. april</td>
            <td>
              Leietaker kan protestere skriftlig (én måned fra oppsigelsen
              er mottatt)
            </td>
          </tr>
          <tr>
            <td>Ingen protest</td>
            <td>
              Oppsigelsen står, og leieforholdet opphører 30. juni – tre
              hele kalendermåneder etter oppsigelsen
            </td>
          </tr>
          <tr>
            <td>Ved protest: innen 10. juli</td>
            <td>
              Utleier må reise sak innen tre måneder etter protestfristen –
              ellers faller oppsigelsen bort
            </td>
          </tr>
          <tr>
            <td>Sak reist</td>
            <td>
              Leieforholdet løper som regel til saken er avgjort;
              flyttedato følger avgjørelsen
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Regn på leietakerbyttet før du sier opp</h2>
      <p>
        En oppsigelse betyr som regel noen uker uten leieinntekt til
        utflytting, oppussing og ny visningsrunde. Samtidig er et nytt
        leieforhold eneste anledning til fri leiefastsettelse – du kan sette
        leien til{" "}
        <Link href="/guide/hva-kan-jeg-leie-ut-for">markedsnivå</Link>. Legg
        begge deler inn i utleiekalkulatoren – noen ukers ledighet og ny
        leie – og se hva byttet faktisk gjør med årets kontantstrøm før du
        sier opp en stabil, betalende leietaker.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lovdata: husleieloven (kapittel 9 om opphør)
          </a>
        </li>
        <li>
          <a
            href="https://www.htu.no/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Husleietvistutvalget: oppsigelsessaker
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
