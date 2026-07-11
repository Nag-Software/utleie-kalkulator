import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("utleie-i-sameie");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Utgangspunktet: fri utleie uten samtykke</h2>
      <p>
        Eier du en <strong>selveierseksjon</strong>, kan du i utgangspunktet
        leie den ut fritt: uten samtykke fra styret, uten krav om botid og
        uten tidsbegrensning. Det er den store kontrasten til{" "}
        <Link href="/guide/utleie-i-borettslag">utleie i borettslag</Link>,
        der bruksoverlating krever godkjenning og normalt er begrenset til
        tre år. Den fulle utleieretten er hovedgrunnen til at investorer
        nesten alltid velger selveier når boligen kjøpes rent som
        utleieobjekt. Du kan leie ut hele seksjonen eller enkeltrom, møblert
        eller umøblert, så lenge du vil.
      </p>

      <h2>Unntaket: korttidsutleie er begrenset til 90 døgn</h2>
      <p>
        Eierseksjonsloven setter én grense: <strong>korttidsutleie</strong> –
        utleie av hele seksjonen i leieforhold på under 30 døgn – er
        begrenset til <strong>90 døgn per år</strong>. Vedtektene kan justere
        grensen, men bare til et sted mellom <strong>60 og 120 døgn</strong>.
        Ordinær langtidsutleie berøres ikke, og leier du bare ut et rom mens
        du selv bor i seksjonen, rammes du heller ikke av 90-døgnsregelen.
        Driver du med Airbnb,
        bør du også lese guiden om{" "}
        <Link href="/guide/airbnb-og-korttidsutleie">
          skatt og regler for korttidsutleie
        </Link>{" "}
        – de reglene er strengere enn mange tror.
      </p>

      <h2>Hva vedtektene kan – og ikke kan – bestemme</h2>
      <p>
        Vedtekter og ordensregler binder også deg som leier ut, men de kan
        ikke ta fra deg utleieretten:
      </p>
      <ul>
        <li>
          <strong>Vedtektene kan:</strong> ha ordensregler om ro, bruk av
          fellesarealer og avfall, kreve at du melder fra til styret om hvem
          som leier, og justere korttidsgrensen innenfor 60–120 døgn.
        </li>
        <li>
          <strong>Vedtektene kan ikke:</strong> forby ordinær utleie eller
          kreve at styret godkjenner leietakeren din. Begrensninger i
          råderetten krever i utgangspunktet samtykke fra seksjonseierne som
          rammes.
        </li>
      </ul>
      <p>
        Leietakeren plikter å følge vedtektene og ordensreglene – men overfor
        sameiet er det <strong>du</strong> som er ansvarlig, både for
        felleskostnadene og for bråk og skader leietakeren står bak. I
        ytterste konsekvens kan alvorlig og gjentatt mislighold gi sameiet
        rett til å kreve seksjonen solgt – også når det er leietakeren som
        står for bråket. Velg derfor leietaker like nøye som om du skulle
        bodd vegg i vegg selv. Dette er generell informasjon, ikke juridisk
        rådgivning – loven ligger på{" "}
        <a
          href="https://lovdata.no/dokument/NL/lov/2017-06-16-65"
          rel="noopener noreferrer"
          target="_blank"
        >
          Lovdata
        </a>
        .
      </p>

      <h2>Praktisk: gjør utleien ryddig fra start</h2>
      <ul>
        <li>
          Gi styret navn og kontaktinformasjon til leietakeren – og til deg
          selv, hvis du ikke bor i nærheten.
        </li>
        <li>
          Legg vedtekter og ordensregler som vedlegg til leiekontrakten, og
          la leietaker kvittere for å ha lest dem – se guiden om{" "}
          <Link href="/guide/leiekontrakt-dette-ma-den-inneholde">
            hva leiekontrakten må inneholde
          </Link>
          .
        </li>
        <li>
          Behold ansvaret for felleskostnadene selv fremfor å la leietaker
          betale dem direkte – et mislighold blir uansett ditt problem
          overfor sameiet.
        </li>
      </ul>

      <h2>Borettslag og sameie side om side</h2>
      <p>
        Forskjellene mellom eieformene avgjør i praksis hvem som kjøper hva:
        investorer velger seksjoner, mens borettslag passer best for dem som
        skal bo først og leie ut en periode etterpå.
      </p>
      <table>
        <thead>
          <tr>
            <th>Utleiepunkt</th>
            <th>Borettslag</th>
            <th>Eierseksjonssameie</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Samtykke fra styret</td>
            <td>Ja, ved utleie av hele boligen</td>
            <td>Nei</td>
          </tr>
          <tr>
            <td>Krav om botid</td>
            <td>Hovedregel: bodd der ett av siste to år</td>
            <td>Ingen</td>
          </tr>
          <tr>
            <td>Maksimal utleietid</td>
            <td>Inntil 3 år (hovedregel)</td>
            <td>Ubegrenset</td>
          </tr>
          <tr>
            <td>Korttidsutleie</td>
            <td>Inntil 30 døgn per år uten samtykke</td>
            <td>Inntil 90 døgn per år (vedtekter: 60–120)</td>
          </tr>
          <tr>
            <td>Egnet som rent utleieobjekt</td>
            <td>Sjelden</td>
            <td>Ja</td>
          </tr>
          <tr>
            <td>Dokumentavgift ved kjøp</td>
            <td>Nei</td>
            <td>2,5 % av kjøpesummen</td>
          </tr>
        </tbody>
      </table>

      <h2>Regn inn selveier-premien</h2>
      <p>
        Friheten koster: som selveier betaler du{" "}
        <strong>2,5 % dokumentavgift</strong> ved kjøpet – 100 000 kr på en
        bolig til 4 000 000 kr – en kostnad andelskjøperen slipper; detaljene
        står i guiden om{" "}
        <Link href="/guide/dokumentavgift-og-omkostninger">
          dokumentavgift og omkostninger
        </Link>
        . Husk også felleskostnadene: de løper hver måned uansett om
        seksjonen står tom, og de er ditt ansvar overfor sameiet. Legg
        totalkostnaden inn i utleiekalkulatoren, så ser du hva avgiften gjør
        med yield og cash-on-cash – og hvilken leie som skal til for at
        regnestykket går opp. Kalkulatoren er gratis og krever ingen konto.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://lovdata.no/dokument/NL/lov/2017-06-16-65"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lovdata: eierseksjonsloven
          </a>
        </li>
        <li>
          <a
            href="https://lovdata.no/dokument/NL/lov/2003-06-06-39"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lovdata: borettslagsloven
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
