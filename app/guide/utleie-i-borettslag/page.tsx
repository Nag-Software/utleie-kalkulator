import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("utleie-i-borettslag");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hovedregelen: bo først, lei ut i inntil tre år</h2>
      <p>
        I borettslag er utgangspunktet at du selv skal bo i boligen. Å la
        andre bruke den – loven kaller det <strong>bruksoverlating</strong> –
        krever godkjenning fra styret. Hovedregelen: har du{" "}
        <strong>bodd i boligen minst ett av de siste to årene</strong>, kan du
        med styrets godkjenning leie ut hele boligen i{" "}
        <strong>inntil tre år</strong>. Styret kan bare si nei med{" "}
        <strong>saklig grunn</strong>, i praksis forhold ved leietakeren eller
        boligen. Vil du leie ut på nytt etter treårsperioden, må du først
        opparbeide ny botid.
      </p>

      <h2>Unntakene uten krav til botid</h2>
      <p>
        I noen situasjoner kan du leie ut uten å ha bodd der først.
        Godkjenning fra styret kreves fortsatt, men den kan ikke nektes uten
        saklig grunn:
      </p>
      <ul>
        <li>
          <strong>Midlertidig fravær:</strong> du skal være borte på grunn av
          arbeid, utdanning, militærtjeneste, sykdom eller andre tungtveiende
          grunner – typisk jobb eller studier i en annen by.
        </li>
        <li>
          <strong>Nærstående:</strong> utleie til ektefelle, eller til barn,
          foreldre eller andre slektninger i rett opp- eller nedstigende
          linje.
        </li>
        <li>
          <strong>Juridisk person:</strong> andeler som eies av en juridisk
          person, for eksempel en kommune.
        </li>
      </ul>
      <p>
        Bor du selv i boligen, kan du dessuten leie ut enkeltrom uten
        godkjenning i det hele tatt.
      </p>

      <h2>Korttidsutleie: 30 døgn i året uten samtykke</h2>
      <p>
        Du kan korttidsutleie borettslagsboligen i{" "}
        <strong>inntil 30 døgn per år</strong> uten samtykke fra styret –
        typisk utleie via Airbnb mens du selv er bortreist. Over 30 døgn
        regnes det som bruksoverlating med krav om godkjenning. Skatten er et
        eget spor og er forklart i guiden om{" "}
        <Link href="/guide/airbnb-og-korttidsutleie">
          Airbnb og korttidsutleie
        </Link>
        .
      </p>

      <h2>Reglene i tabellform</h2>
      <table>
        <thead>
          <tr>
            <th>Situasjon</th>
            <th>Krav</th>
            <th>Maks varighet</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bodd i boligen minst ett av siste to år</td>
            <td>Styrets godkjenning; avslag krever saklig grunn</td>
            <td>Inntil 3 år</td>
          </tr>
          <tr>
            <td>Midlertidig fravær (arbeid, utdanning, militærtjeneste,
            sykdom)</td>
            <td>Godkjenning; kan ikke nektes uten saklig grunn</td>
            <td>Så lenge fraværet varer</td>
          </tr>
          <tr>
            <td>Utleie til nærstående (ektefelle, barn, foreldre)</td>
            <td>Godkjenning; kan ikke nektes uten saklig grunn</td>
            <td>Ingen lovbestemt grense</td>
          </tr>
          <tr>
            <td>Andel eid av juridisk person</td>
            <td>Godkjenning; kan ikke nektes uten saklig grunn</td>
            <td>Ingen lovbestemt grense</td>
          </tr>
          <tr>
            <td>Utleie av enkeltrom mens du selv bor der</td>
            <td>Ingen godkjenning nødvendig</td>
            <td>Ingen grense</td>
          </tr>
          <tr>
            <td>Korttidsutleie av hele boligen</td>
            <td>Ingen godkjenning nødvendig</td>
            <td>Inntil 30 døgn per år</td>
          </tr>
        </tbody>
      </table>

      <h2>Derfor er borettslag sjelden et rent utleieobjekt</h2>
      <p>
        For en investor som vil kjøpe og leie ut fra dag én, stopper det
        allerede på botidskravet – og etter tre år er det uansett slutt.
        Borettslag er derfor i praksis uegnet som rene utleieobjekter, og
        guiden om{" "}
        <Link href="/guide/egenkapital-og-lan-til-utleiebolig">
          lån til utleiebolig
        </Link>{" "}
        peker på selveier av samme grunn. For deg som skal{" "}
        <strong>leie ut noen år</strong> – jobb i en annen by, studier eller
        flytte sammen med kjæresten uten å selge – er reglene derimot
        romslige nok, og andelsleiligheter er ofte billigere i innkjøp. Husk
        bare at lav pris gjerne følges av høy fellesgjeld; se guiden om{" "}
        <Link href="/guide/fellesgjeld-og-felleskostnader">
          fellesgjeld og felleskostnader
        </Link>
        .
      </p>

      <h2>Slik søker du styret om godkjenning</h2>
      <p>
        Send skriftlig søknad til styret med navn på leietakeren, hvem som
        skal bo i boligen og hvor lenge du vil leie ut. Styret kan be om
        opplysningene det trenger om leietakeren, men kan ikke nekte uten
        saklig grunn – og svarer ikke styret innen <strong>én måned</strong>,
        regnes godkjenningen som gitt. Overfor borettslaget er ansvaret
        fortsatt ditt: felleskostnadene skal betales uansett om leietakeren
        gjør opp, og det samme gjelder skader leietakeren påfører laget.
        Dette er generell informasjon, ikke juridisk rådgivning – reglene
        står i{" "}
        <a
          href="https://lovdata.no/dokument/NL/lov/2003-06-06-39"
          rel="noopener noreferrer"
          target="_blank"
        >
          borettslagsloven på Lovdata
        </a>
        .
      </p>

      <h2>Regn på utleieårene før du flytter</h2>
      <p>
        Tre år går fort, og med felleskostnader, vedlikehold og skatt er
        marginen ofte mindre enn folk tror. Legg leie, felleskostnader og lån
        inn i utleiekalkulatoren – gratis og uten konto – og se om
        utleieperioden faktisk går i pluss måned for måned, eller om den bare
        dekker deler av kostnadene mens du er borte. Da vet du hva
        treårsperioden er verdt før du takker ja til jobben i en annen by.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://lovdata.no/dokument/NL/lov/2003-06-06-39"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lovdata: borettslagsloven
          </a>
        </li>
        <li>
          <a
            href="https://lovdata.no/dokument/NL/lov/1999-03-26-17"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lovdata: husleieloven
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
