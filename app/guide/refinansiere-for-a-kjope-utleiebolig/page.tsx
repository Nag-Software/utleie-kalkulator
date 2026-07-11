import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("refinansiere-for-a-kjope-utleiebolig");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Slik fungerer det: egen bolig stiller sikkerheten</h2>
      <p>
        Har primærboligen din{" "}
        <Link href="/guide/verdistigning-pa-bolig">steget i verdi</Link>, kan
        verdistigningen fungere som egenkapital ved kjøp av utleiebolig. Du
        trenger ikke penger på konto: banken tar{" "}
        <strong>pant i egen bolig</strong> slik at samlet sikkerhet i begge
        boligene dekker kjøpet. Det du derimot må ha, er inntekt til å bære
        den samlede gjelden – og det er som regel der grensen går, ikke i
        sikkerheten.
      </p>
      <p>
        I praksis finnes to modeller: banken tar pant i begge boligene
        (<strong>kryssikkerhet</strong>), eller du tar opp et{" "}
        <strong>rammelån</strong> på primærboligen og bruker uttaket som
        kontant egenkapital. Mer om forskjellen lenger ned.
      </p>

      <h2>Regneeksempel: ledig sikkerhet i primærboligen</h2>
      <p>
        Utlånsforskriften tillater samlet lån med pant i boligen på inntil
        90 % av verdien. Si at boligen din er verdt 6 000 000 kr og har
        2 500 000 kr i gjenstående lån:
      </p>
      <ul>
        <li>90 % av 6 000 000 kr = 5 400 000 kr</li>
        <li>
          Ledig sikkerhet: 5 400 000 kr − 2 500 000 kr ={" "}
          <strong>2 900 000 kr</strong>
        </li>
      </ul>
      <p>
        På papiret er det altså nesten 3 millioner å hente. Men før du regner
        hjem kjøpet: sikkerheten er sjelden den reelle begrensningen.
      </p>

      <h2>Gjeldsgraden er den reelle grensen</h2>
      <p>
        Samlet gjeld kan ikke overstige{" "}
        <strong>fem ganger brutto årsinntekt</strong> – og for folk flest er
        det dette kravet som binder, lenge før sikkerheten er brukt opp.
        Tjener du 900 000 kr, er taket 4 500 000 kr i samlet gjeld. Med
        2 500 000 kr i eksisterende boliglån er rommet for nytt lån
        2 000 000 kr – uansett hvor mye boligen har steget.
      </p>
      <table>
        <thead>
          <tr>
            <th>Begrensning</th>
            <th>Regnestykke</th>
            <th>Rom for nytt lån</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sikkerhet (maks 90 % belåning)</td>
            <td>5 400 000 kr − 2 500 000 kr</td>
            <td>2 900 000 kr</td>
          </tr>
          <tr>
            <td>Gjeldsgrad (maks 5 × inntekt)</td>
            <td>4 500 000 kr − 2 500 000 kr</td>
            <td>2 000 000 kr</td>
          </tr>
        </tbody>
      </table>
      <p>
        Det laveste tallet vinner. Dokumenterte leieinntekter kan øke
        inntektsgrunnlaget i mange banker – hvordan det regnes, og resten av
        kravene i{" "}
        <a
          href="https://lovdata.no/dokument/SF/forskrift/2020-12-09-2648"
          rel="noopener noreferrer"
          target="_blank"
        >
          utlånsforskriften
        </a>
        , er dekket i guiden om{" "}
        <Link href="/guide/egenkapital-og-lan-til-utleiebolig">
          egenkapital og lån til utleiebolig
        </Link>
        . Banken gjør alltid en individuell vurdering – dette er generell
        informasjon, ikke finansieringsrådgivning.
      </p>

      <h2>Kryssikkerhet eller rammelån?</h2>
      <p>
        Med <strong>kryssikkerhet</strong> finansierer én bank hele kjøpet
        med pant i begge boligene. Det er enkelt og gir vanligvis
        boliglånsrente på hele beløpet, men binder deg til én bank – og
        boligene henger sammen: skal du selge eller refinansiere den ene, må
        banken løsne pantet.
      </p>
      <p>
        Med <strong>rammelån</strong> (boligkreditt) på primærboligen tar du
        ut penger og møter selger – eller en annen bank – med kontant
        egenkapital. Det gir frihet til å velge bank for utleielånet, og du
        betaler bare renter av det du trekker. Ulempen er at rammelån gjerne
        har noe høyere rente og normalt gis til lavere belåningsgrad enn
        nedbetalingslån. Og husk: alt du trekker på rammen, teller med i
        femgangeren.
      </p>

      <h2>Risikoen: du er giret i begge boliger</h2>
      <p>
        Etter refinansieringen er begge boligene belånt, og all gjelden
        hviler på samme inntekt. En renteøkning treffer hele gjelden
        samtidig – stresstesten på 3 prosentpoeng gjelder totalen, ikke bare
        utleielånet. Faller boligprisene, faller begge verdiene mens gjelden
        står stille. Det er{" "}
        <Link href="/guide/gearing-og-belaningsgrad">gearing</Link> i ren
        form: forsterket avkastning når det går bra, forsterket tap når det
        butter. Tomgang og uforutsett vedlikehold må dessuten dekkes av samme
        lommebok som betjener primærboliglånet.
      </p>

      <h2>Regn på totalen før du ringer banken</h2>
      <p>
        Før du bruker ledig sikkerhet på en utleiebolig, bør du vite hvor
        smertegrensen ligger:{" "}
        <Link href="/guide/break-even-for-utleiebolig">
          break-even-leien og break-even-renten
        </Link>{" "}
        viser hvor mye tomgang og renteøkning kontantstrømmen tåler.
        Utleiekalkulatoren regner begge deler, sammen med kontantstrøm etter
        skatt og cash-on-cash på egenkapitalen du faktisk binder. Gratis og
        uten konto – og et nøkternt oppsett derfra er et godt vedlegg til
        lånesøknaden.
      </p>
    </ArticleLayout>
  );
}
