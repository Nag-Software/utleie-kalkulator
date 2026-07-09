import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("egenkapital-og-lan-til-utleiebolig");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Minst 10 % egenkapital – også for sekundærbolig</h2>
      <p>
        Utlånsforskriften krever minst <strong>10 % egenkapital</strong> ved
        boligkjøp (kravet ble senket fra 15 % fra 1. januar 2025), og det
        gjelder også sekundærbolig. Det tidligere særkravet om 40 %
        egenkapital for sekundærbolig i Oslo er historie. På en bolig til
        4 000 000 kr er minstekravet altså 400 000 kr – pluss{" "}
        <Link href="/guide/dokumentavgift-og-omkostninger">
          omkostningene
        </Link>
        , som normalt må betales kontant.
      </p>

      <h2>Forskriftens øvrige krav</h2>
      <ul>
        <li>
          <strong>Gjeldsgrad:</strong> samlet gjeld – boliglån, fellesgjeld,
          studielån, billån og kredittrammer – kan ikke overstige{" "}
          <strong>fem ganger brutto årsinntekt</strong>.
        </li>
        <li>
          <strong>Stresstest:</strong> du må kunne betjene gjelden også ved en
          renteøkning på <strong>3 prosentpoeng</strong> fra dagens nivå.
        </li>
        <li>
          <strong>Avdragsplikt:</strong> ved belåningsgrad over 60 % kreves
          årlige avdrag på minst 2,5 % av innvilget lån – avdragsfrihet er
          altså forbeholdt lavt belånte kjøp.
        </li>
        <li>
          <strong>Fleksibilitet:</strong> bankene har en kvote til å fravike
          kravene i en mindre andel av utlånene, men regn ikke med den.
        </li>
      </ul>

      <h2>Teller leieinntektene med?</h2>
      <p>
        Ja, som regel – men praksis varierer mellom banker. Dokumenterte
        leieinntekter (løpende leiekontrakt, eller et realistisk anslag på{" "}
        <Link href="/guide/hva-kan-jeg-leie-ut-for">markedsleie</Link> for
        boligen du kjøper) styrker betjeningsevnen i bankens regnestykke.
        Bankene regner sjelden med hele leien: de tar høyde for tomgang,
        vedlikehold og skatt. Kommer du til møtet med et nøkternt oppsett av
        leieinntekter, kostnader og kontantstrøm, står saken din sterkere enn
        med et optimistisk overslag.
      </p>

      <h2>Egenkapital fra egen bolig</h2>
      <p>
        Den vanligste finansieringen av utleiebolig nummer én er ikke
        oppsparte penger, men <strong>pant i egen bolig</strong>: har
        primærboligen steget i verdi, kan du refinansiere og bruke
        låneopptaket som egenkapital i utleieboligen. Husk at samlet gjeld
        fortsatt må holde seg innenfor fem ganger inntekt, og at du nå har
        giret opp begge boligene – stresstesten på 3 prosentpoeng treffer
        hele gjelden din samtidig.
      </p>

      <h2>Borettslag: sjekk utleieadgangen først</h2>
      <p>
        Andelsleiligheter er ofte billigere per kvadratmeter og slipper
        dokumentavgift – men borettslagsloven begrenser utleie. Hovedregelen
        er at du må ha bodd i boligen i minst ett av de siste to årene før du
        kan leie ut, normalt i inntil tre år, og styret må godkjenne
        leietakeren. En andelsleilighet kjøpt rent som utleieobjekt er derfor
        sjelden mulig. Selveierleiligheter har ingen slik begrensning – det
        er grunnen til at investorer nesten alltid velger selveier.
      </p>

      <h2>Renten: forvent et påslag</h2>
      <p>
        Mange banker priser lån til sekundærbolig noe høyere enn lån til
        primærbolig, og enkelte krever lavere belåningsgrad enn forskriftens
        tak. Innhent tilbud fra flere banker – på et lån på 3,6 millioner
        utgjør 0,3 prosentpoeng over 10 000 kr i året, som går rett ut av
        kontantstrømmen.
      </p>

      <h2>Regn baklengs: hvor høy rente tåler prosjektet?</h2>
      <p>
        Før du snakker med banken, snu regnestykket: utleiekalkulatoren
        viser <strong>break-even-renten</strong> – rentenivået der
        kontantstrømmen går i null – og hva en renteøkning på 3 prosentpoeng
        gjør med månedsresultatet. Det er nøyaktig samme stresstest banken
        kjører, og tåler prosjektet den, vet du det før budrunden.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://lovdata.no/dokument/SF/forskrift/2020-12-09-2648"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lovdata: utlånsforskriften
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
