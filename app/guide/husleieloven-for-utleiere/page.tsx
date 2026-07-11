import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("husleieloven-for-utleiere");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Én lov – og den kan ikke avtales bort</h2>
      <p>
        Husleieloven regulerer alle leieforhold om bolig i Norge, og ved
        utleie til vanlige forbrukere er den{" "}
        <strong>ufravikelig til leietakers gunst</strong>: du kan avtale bedre
        vilkår for leietakeren enn loven gir, men aldri dårligere. En
        kontraktsklausul som svekker leietakers lovfestede rettigheter, er
        ugyldig selv om begge parter har signert. Som utleier må du derfor
        kjenne minimumsreglene – de gjelder uansett hva kontrakten sier. Denne
        guiden gir oversikten; dybdeguidene tar detaljene.
      </p>

      <h2>De ti reglene du må kunne</h2>
      <p>
        Tabellen oppsummerer kjernereglene og hva de betyr i praksis for deg
        som leier ut.
      </p>
      <table>
        <thead>
          <tr>
            <th>Regel</th>
            <th>Hva den betyr for deg</th>
            <th>Dybdeguide</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Skriftlig kontrakt</td>
            <td>
              Begge parter kan kreve skriftlig avtale – muntlig er gyldig, men
              nesten umulig å dokumentere
            </td>
            <td>
              <Link href="/guide/leiekontrakt-dette-ma-den-inneholde">
                Leiekontrakten
              </Link>
            </td>
          </tr>
          <tr>
            <td>Depositum: maks seks måneders leie</td>
            <td>
              Skal stå på egen depositumskonto i leietakers navn – aldri på
              din private konto
            </td>
            <td>
              <Link href="/guide/depositum-regler-og-depositumskonto">
                Depositum
              </Link>
            </td>
          </tr>
          <tr>
            <td>Forskuddsleie: maks én måned</td>
            <td>Du kan ikke kreve flere måneders leie betalt på forskudd</td>
            <td>–</td>
          </tr>
          <tr>
            <td>Leieøkning: KPI én gang i året</td>
            <td>
              Minst én måneds skriftlig varsel; gjengs leie i praksis først
              fra år tre
            </td>
            <td>
              <Link href="/guide/husleieokning-slik-gjor-du-det">
                Husleieøkning
              </Link>
            </td>
          </tr>
          <tr>
            <td>Oppsigelsesvern</td>
            <td>
              Din oppsigelse krever saklig grunn og strenge formkrav – ellers
              er den ugyldig
            </td>
            <td>
              <Link href="/guide/oppsigelse-av-leieforhold">Oppsigelse</Link>
            </td>
          </tr>
          <tr>
            <td>Tidsbestemt kontrakt: hovedregel tre år</td>
            <td>
              Ett år er nok for sokkel- eller loftsbolig der du selv bor i
              samme hus
            </td>
            <td>–</td>
          </tr>
          <tr>
            <td>Delt vedlikeholdsplikt</td>
            <td>
              Leietaker tar småting som låser, kraner og brytere; du tar
              resten
            </td>
            <td>
              <Link href="/guide/vedlikeholdsbudsjett-utleiebolig">
                Vedlikehold
              </Link>
            </td>
          </tr>
          <tr>
            <td>Husstand og fremleie</td>
            <td>
              Nær familie kan flytte inn uten samtykke; visse
              fremleiesituasjoner kan du bare nekte med saklig grunn
            </td>
            <td>–</td>
          </tr>
          <tr>
            <td>Dyrehold</td>
            <td>
              Kan ikke nektes uten saklig grunn når leietaker har gode grunner
              og dyret ikke er til ulempe – selv med forbud i kontrakten
            </td>
            <td>–</td>
          </tr>
          <tr>
            <td>Tvister går til Husleietvistutvalget</td>
            <td>Landsdekkende førsteinstans med lavt gebyr</td>
            <td>
              <Link href="/guide/slitasje-eller-skade">
                Slitasje eller skade
              </Link>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Pengene: depositum, forskudd og leieøkning</h2>
      <p>
        Depositum er begrenset til <strong>seks måneders leie</strong> og skal
        stå på egen depositumskonto i leietakers navn – rentene tilfaller
        leietaker, og du betaler opprettelsesgebyret. Forskuddsleie er
        begrenset til én måned. Leien kan justeres i takt med
        konsumprisindeksen én gang i året med minst én måneds skriftlig
        varsel, og tidligst etter to og et halvt år kan du varsle justering
        til <strong>gjengs leie</strong> med seks måneders frist – i praksis
        fra det tredje året. Utover leie, depositum og betaling for strøm og
        lignende etter forbruk kan du ikke kreve andre pengeytelser.
      </p>

      <h2>Oppsigelse og kontraktslengde</h2>
      <p>
        Ved tidsubestemt kontrakt er oppsigelsestiden normalt{" "}
        <strong>tre måneder</strong>. Din oppsigelse må være skriftlig, saklig
        begrunnet og opplyse om at leietaker kan protestere innen én måned –
        mangler noe av dette, er den ugyldig. Tidsbestemte kontrakter skal som
        hovedregel vare i minst <strong>tre år</strong>; ett år er nok for
        sokkelbolig eller loftsbolig i enebolig, eller del av tomannsbolig,
        der du selv bor i samme hus. Er en kortere tidsbestemt avtale inngått
        uten lovlig grunnlag, regnes den som tidsubestemt. Slutter leietaker å
        betale, gjelder egne varslingsregler – se guiden om{" "}
        <Link href="/guide/nar-leietaker-ikke-betaler">
          når leietaker ikke betaler
        </Link>
        .
      </p>

      <h2>Uenige? Husleietvistutvalget tar saken</h2>
      <p>
        Tvister om depositum, mangler, skader og oppsigelse løses av{" "}
        <strong>Husleietvistutvalget (HTU)</strong>, som behandler
        husleietvister i hele landet til et lavt gebyr. Flest saker handler om
        trekk i depositum og grensen mellom normal slitasje og skade – og de
        vinnes med dokumentasjon: kontrakt, protokoller og bilder. Dette er
        generell informasjon, ikke juridisk rådgivning – hele loven ligger på{" "}
        <a
          href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
          rel="noopener noreferrer"
          target="_blank"
        >
          Lovdata
        </a>
        , og{" "}
        <a href="https://www.htu.no/" rel="noopener noreferrer" target="_blank">
          HTU
        </a>{" "}
        forklarer klageprosessen.
      </p>

      <h2>Lovens rammer hører hjemme i regnestykket</h2>
      <p>
        Reglene over er ikke bare juss – de er økonomiske rammer. Leien kan de
        første årene bare økes med KPI, oppsigelsesvernet gjør en
        feilvurdering av leietaker dyr å rette, og det store
        vedlikeholdsansvaret ligger hos deg. Legg derfor nøkterne tall inn i
        utleiekalkulatoren – den er gratis og krever ingen konto – og se om
        kontantstrømmen etter skatt tåler rammene loven setter, før du
        forplikter deg.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lovdata: husleieloven
          </a>
        </li>
        <li>
          <a
            href="https://www.htu.no/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Husleietvistutvalget
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
