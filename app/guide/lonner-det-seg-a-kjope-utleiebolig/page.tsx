import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("lonner-det-seg-a-kjope-utleiebolig");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Det korte svaret</h2>
      <p>
        Det avhenger av tre ting: hvor mye leie boligen gir i forhold til hva
        den koster (yield), hva finansieringen koster deg (rente), og hvor
        lenge du klarer å sitte med den. Utleie lønner seg når summen av
        kontantstrøm, nedbetaling av lån og verdistigning slår det pengene
        kunne gitt et annet sted – etter skatt og etter alle kostnader. Det er
        et regnestykke, ikke en magefølelse.
      </p>

      <h2>Regnestykket: tre kilder til avkastning</h2>
      <p>
        Ta en leilighet til 4 000 000 kr som leies ut for 15 000 kr i måneden
        (
        <Link href="/guide/yield-utleiebolig">brutto yield 4,5 %</Link>
        ). Avkastningen din kommer fra tre kilder:
      </p>
      <ul>
        <li>
          <strong>Kontantstrøm:</strong> det som er igjen av leien hver måned
          etter lån, felleskostnader, vedlikehold, ledighet og{" "}
          <Link href="/guide/skatt-pa-utleie-2026">22 % skatt</Link>. Med
          dagens renter er kontantstrømmen ofte svakt negativ de første årene
          på høyt belånte kjøp – det må du tåle.
        </li>
        <li>
          <strong>Avdrag:</strong> hver termin flytter penger fra banken til
          din egen balanse. Det føles som en kostnad, men er tvungen sparing –
          leietakeren betaler i praksis ned lånet ditt.
        </li>
        <li>
          <strong>Verdistigning:</strong> historisk den største bidragsyteren
          i pressområder, men aldri garantert. Regn gjerne med 0 % som
          stresstest: lønner boligen seg uten verdistigning, står du trygt.
        </li>
      </ul>

      <h2>Kostnadene folk glemmer</h2>
      <ul>
        <li>
          <strong>Omkostninger ved kjøp:</strong>{" "}
          <Link href="/guide/dokumentavgift-og-omkostninger">
            dokumentavgiften på 2,5 %
          </Link>{" "}
          (100 000 kr på en bolig til 4 mill.) er penger du aldri får igjen.
        </li>
        <li>
          <strong>Tomgang:</strong> én måned uten leietaker i året spiser
          8,3 % av leieinntektene. Bytte av leietaker betyr nesten alltid noe
          tomgang.
        </li>
        <li>
          <strong>Vedlikehold:</strong> en tommelfingerregel er å sette av
          rundt 1 % av boligverdien i året over tid – hvitevarer, bad og
          overflater varer ikke evig.
        </li>
        <li>
          <strong>Formuesskatt:</strong> sekundærboliger verdsettes til 100 %
          av beregnet markedsverdi og kan øke formuesskatten merkbart.
        </li>
        <li>
          <strong>Din egen tid:</strong> visninger, kontrakter, oppfølging og
          småreparasjoner er arbeid, ikke passiv inntekt.
        </li>
      </ul>

      <h2>Gearing: derfor kan tallene bli veldig gode – eller veldig dårlige</h2>
      <p>
        Kjøper du med 10 % egenkapital, jobber hele boligen for pengene dine.
        Stiger boligen 3 % i verdi, har egenkapitalen din vokst med rundt
        30 % før kostnader – det er gearingens magi, og grunnen til at
        cash-on-cash-avkastningen kan slå de fleste alternativer. Men
        gearingen virker begge veier: et verdifall rammer egenkapitalen like
        forsterket, og en renteøkning treffer hele lånet.{" "}
        <Link href="/guide/egenkapital-og-lan-til-utleiebolig">
          Bankens krav til egenkapital og tåleevne
        </Link>{" "}
        finnes av en grunn.
      </p>

      <h2>Utleiebolig eller fond?</h2>
      <p>
        Et globalt indeksfond krever ingen vedlikehold, har ingen tomgang og
        kan selges på dagen. Utleieboligens fortrinn er tilgangen på billig
        lånefinansiering: banken låner deg gjerne 4 millioner til bolig, men
        aldri til fondskjøp. Sammenlign derfor cash-on-cash-avkastningen
        (avkastningen på egenkapitalen din) med fondsalternativet – ikke
        boligens totalavkastning. Og husk at én utleiebolig er det motsatte
        av diversifisering: alt står og faller på ett objekt, ett nabolag og
        én leietaker av gangen.
      </p>

      <h2>Når lønner det seg vanligvis ikke?</h2>
      <ul>
        <li>
          Når du må selge innen få år – omkostningene ved kjøp og salg spiser
          gevinsten.
        </li>
        <li>
          Når kontantstrømmen er så negativ at en rentetopp eller noen måneder
          tomgang velter privatøkonomien.
        </li>
        <li>
          Når leieprisen du trenger for å gå i null ligger over{" "}
          <Link href="/guide/hva-kan-jeg-leie-ut-for">markedsleien</Link> i
          området.
        </li>
      </ul>

      <h2>Konklusjon: regn på det konkrete objektet</h2>
      <p>
        «Lønner utleie seg?» har ikke ett svar – det har ett svar per bolig.
        Legg inn kjøpesum, leie, rente og kostnader i utleiekalkulatoren, så
        får du kontantstrøm etter skatt, netto yield, cash-on-cash og
        break-even på sekunder. Test så det viktigste: hva skjer med
        regnestykket hvis renten stiger med 3 prosentpoeng, eller leien må
        settes 1 000 kr ned?
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Skatteetaten: skatt ved utleie av bolig
          </a>
        </li>
        <li>
          <a
            href="https://www.ssb.no/priser-og-prisindekser/boligpriser-og-boligprisindekser"
            rel="noopener noreferrer"
            target="_blank"
          >
            SSB: boligpriser og boligprisindekser
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
