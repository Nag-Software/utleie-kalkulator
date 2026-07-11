import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("gearing-og-belaningsgrad");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hva er gearing?</h2>
      <p>
        <strong>Gearing</strong> betyr at du kjøper boligen delvis for lånte
        penger. Verdiendringer treffer hele boligen, mens lånet står fast –
        dermed havner hele gevinsten eller hele tapet på egenkapitalen din. Jo
        høyere <strong>belåningsgrad</strong> (lån delt på boligverdi), desto
        kraftigere blir utslagene: gearing forsterker avkastningen i gode år og
        tapet i dårlige, i nøyaktig samme forhold.
      </p>

      <h2>Samme bolig, tre belåningsgrader</h2>
      <p>
        Ta en utleiebolig til <strong>4 000 000 kr</strong>. Stiger den 5 % i
        verdi, er gevinsten 200 000 kr – uansett hvordan kjøpet er finansiert.
        Faller den 5 %, er tapet 200 000 kr. Det belåningen avgjør, er hvor
        mye egenkapital gevinsten eller tapet måles mot:
      </p>
      <table>
        <thead>
          <tr>
            <th>Egenkapital</th>
            <th>Lån</th>
            <th>+5 % verdistigning</th>
            <th>−5 % verdifall</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>10 % (400 000 kr)</td>
            <td>3 600 000 kr</td>
            <td>+50 % på egenkapitalen</td>
            <td>−50 % på egenkapitalen</td>
          </tr>
          <tr>
            <td>25 % (1 000 000 kr)</td>
            <td>3 000 000 kr</td>
            <td>+20 % på egenkapitalen</td>
            <td>−20 % på egenkapitalen</td>
          </tr>
          <tr>
            <td>40 % (1 600 000 kr)</td>
            <td>2 400 000 kr</td>
            <td>+12,5 % på egenkapitalen</td>
            <td>−12,5 % på egenkapitalen</td>
          </tr>
        </tbody>
      </table>
      <p>
        Med 10 % egenkapital gir en helt vanlig prisbevegelse på 5 % et utslag
        på <strong>50 % av pengene dine</strong> – begge veier. Uten lån hadde
        det samme fallet gitt nøyaktig −5 %; det er hele forskjellen gearing
        gjør. Og faller boligen 10 %, er tapet 400 000 kr:{" "}
        <strong>hele egenkapitalen er borte</strong>, selv om boligen bare har
        falt ti prosent. Eksemplet ser bort fra omkostninger, avdrag og løpende
        kontantstrøm, men selve mekanismen er høyst reell.
      </p>
      <p>
        Et papirtap velter deg først når du må realisere det. Kan du betjene
        lånet og sitte gjennom nedturen, kan verdiene hente seg inn igjen.
        Derfor hører høy gearing sammen med solid buffer og trygg inntekt –
        ikke med et regnestykke som så vidt går rundt.
      </p>

      <h2>Høyere belåning betyr tynnere margin hver måned</h2>
      <p>
        Gearing koster løpende: et større lån gir høyere rentekostnad, som
        skal dekkes av de samme leieinntektene. Med høy belåning kan boligen
        gå fra pluss til minus ved en moderat renteøkning eller én måneds
        tomgang. Regn derfor ut{" "}
        <Link href="/guide/break-even-for-utleiebolig">
          break-even-leien og break-even-renten
        </Link>{" "}
        før du velger belåning, og se hvordan{" "}
        <Link href="/guide/cash-on-cash-avkastning">
          cash-on-cash-avkastningen
        </Link>{" "}
        endrer seg med ulik egenkapital: høy gearing gir høyere prosentvis
        avkastning når det går bra, men også raskere negativ kontantstrøm når
        det butter.
      </p>

      <h2>Utlånsforskriften setter rammene</h2>
      <p>
        Du kan ikke gire ubegrenset. <strong>Utlånsforskriften</strong> krever
        minst 10 % egenkapital – også for sekundærbolig – og samlet gjeld kan
        normalt ikke overstige 5 ganger brutto årsinntekt. Banken skal
        stressteste økonomien din mot 3 prosentpoeng renteøkning, og ved
        belåningsgrad over 60 % kreves avdrag. Avdragene reduserer samtidig
        belåningsgraden over tid, så risikoen faller år for år. I praksis er
        det ofte bankens egen vurdering, ikke forskriftens minimum, som setter
        grensen – les mer i guiden om{" "}
        <Link href="/guide/egenkapital-og-lan-til-utleiebolig">
          egenkapital og lån til utleiebolig
        </Link>
        . Selve forskriften ligger på{" "}
        <a
          href="https://lovdata.no/dokument/SF/forskrift/2020-12-09-2648"
          rel="noopener noreferrer"
          target="_blank"
        >
          Lovdata
        </a>
        .
      </p>

      <h2>Derfor kan utleie slå fond – og tape mot fond</h2>
      <p>
        Gearingen er selve grunnen til at utleiebolig kan gi høyere
        egenkapitalavkastning enn aksjemarkedet: ingen bank låner deg fire
        ganger egenkapitalen for å kjøpe indeksfond, men til bolig gjør de det
        gjerne. Moderat verdistigning på en stor, belånt sum kan dermed slå
        god avkastning på en liten, ubelånt sum. Men pilen peker begge veier:
        samme mekanisme gjør at et middels boligprisfall kan viske ut hele
        egenkapitalen – noe et bredt indeksfond uten belåning aldri gjør. Se
        den fulle sammenligningen i guiden om{" "}
        <Link href="/guide/utleiebolig-vs-indeksfond">
          utleiebolig mot indeksfond
        </Link>
        .
      </p>

      <h2>Se gearingeffekten med dine egne tall</h2>
      <p>
        I utleiekalkulatoren legger du inn kjøpesum, egenkapital og rente og
        ser umiddelbart hvordan belåningen slår ut i kontantstrøm etter skatt,
        cash-on-cash-avkastning og break-even-rente – og hvordan regnestykket
        tåler renteøkning eller verdifall over flere år.{" "}
        <Link href="/">Kalkulatoren</Link> er gratis og krever ingen konto:
        test tre ulike egenkapitalnivåer på samme bolig og se forskjellen
        svart på hvitt.
      </p>
    </ArticleLayout>
  );
}
