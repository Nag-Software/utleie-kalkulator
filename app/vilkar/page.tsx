import type { Metadata } from "next";
import Link from "next/link";
import { Pill } from "@/components/site/primitives";
import {
  COMPANY,
  CONTACT_EMAIL,
  KLIPP_GYLDIGHET_MANEDER,
  KLIPP_PER_KJOP,
  KLIPP_PRIS_NOK,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Salgsvilkår",
  description:
    "Salgsvilkår for utleie-kalkulator.no: priser, betaling, bindingstid, oppsigelse, prisendringer, angrerett og reklamasjon. Levert av Nag Software, org.nr. 936 593 127.",
  alternates: { canonical: "/vilkar" },
};

const SERVICES = [
  {
    name: "Utleiekalkulatoren",
    what: "Manuell beregning av kontantstrøm, yield, cash-on-cash, break-even og flerårig prognose. Ubegrenset bruk, ingen konto.",
    price: "0 kr",
  },
  {
    name: "Klippekort for FINN-import",
    what: `${KLIPP_PER_KJOP} klipp som kan brukes til å hente kjøpesum, felleskostnader, fellesgjeld, eieform og omkostninger fra FINN-annonser. Ett klipp brukes per ny annonse; samme annonse kan åpnes igjen uten nytt klipp. Hvert kjøp er gyldig i ${KLIPP_GYLDIGHET_MANEDER} måneder.`,
    price: `${KLIPP_PRIS_NOK} kr for ${KLIPP_PER_KJOP} klipp`,
  },
];

export default function VilkarPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-12 sm:px-6">
      <Pill>Salgsvilkår</Pill>
      <article className="article">
        <h1 className="display mt-5 text-[clamp(2rem,5vw,2.75rem)]">
          Salgsvilkår
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Disse vilkårene gjelder for kjøp og bruk av tjenestene på
          utleie-kalkulator.no. Sist oppdatert 3. september 2026.
        </p>

        <h2 id="parter">1. Parter</h2>
        <p>
          <strong>Selger</strong> er {COMPANY.legalName}, et{" "}
          {COMPANY.legalForm.toLowerCase()} registrert i Enhetsregisteret med
          organisasjonsnummer{" "}
          <strong>{COMPANY.organizationNumberFormatted}</strong>, som eier og
          driver merkevaren og nettstedet utleie-kalkulator.no.
        </p>
        <ul>
          <li>
            Forretningsadresse: {COMPANY.street}, {COMPANY.postalCode}{" "}
            {COMPANY.city}, {COMPANY.country}
          </li>
          <li>
            Telefon:{" "}
            <a href={`tel:${COMPANY.phone}`}>{COMPANY.phoneFormatted}</a>{" "}
            (hverdager kl. 09–16)
          </li>
          <li>
            E-post: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </li>
        </ul>
        <p>
          <strong>Kjøper</strong> er den som legger inn bestillingen. Er kjøper
          forbruker, gjelder ufravikelige forbrukerrettigheter i tillegg til
          disse vilkårene, blant annet etter angrerettloven og lov om levering
          av digitale ytelser til forbrukere (digitalytelsesloven).
        </p>

        <h2 id="tjenester">2. Tjenester og priser</h2>
        <p>
          Utleie-kalkulator.no er et{" "}
          <strong>digitalt beregningsverktøy</strong> for å estimere
          lønnsomheten ved å eie og leie ut bolig. Vi formidler, selger eller
          leier <em>ikke</em> ut boliger, lokaler eller andre gjenstander, og er
          ikke part i noe leieforhold. Det betalte produktet er et klippekort
          for automatisk import av annonsetall til beregninger.
        </p>
        <div className="my-6 overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Tjeneste</th>
                <th>Hva du får</th>
                <th className="whitespace-nowrap">Pris</th>
              </tr>
            </thead>
            <tbody>
              {SERVICES.map((service) => (
                <tr key={service.name}>
                  <td className="font-medium text-foreground">
                    {service.name}
                  </td>
                  <td>{service.what}</td>
                  <td className="whitespace-nowrap font-medium text-foreground">
                    {service.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Alle priser er oppgitt i norske kroner (NOK) og er totalprisen du
          betaler – det kommer ingen gebyrer i tillegg. {COMPANY.legalName} er
          ikke registrert i Merverdiavgiftsregisteret, og det beregnes derfor
          ikke merverdiavgift på kjøpet. Kjøpet er en engangsbetaling: det
          starter ingen automatisk eller fast betaling.
        </p>

        <h2 id="betaling">3. Betaling</h2>
        <p>
          Betaling skjer med <strong>Vipps</strong>, som er den eneste
          betalingsmåten i tjenesten. Du godkjenner beløpet i Vipps-appen, og
          vi mottar aldri kort- eller kontonummeret ditt – det håndteres i sin
          helhet av Vipps MobilePay AS.
        </p>
        <p>
          Beløpet belastes når du godkjenner betalingen i Vipps. Kvittering
          finner du i Vipps-appen. Klippekortet aktiveres umiddelbart etter
          gjennomført betaling og gir tilgang til {KLIPP_PER_KJOP}{" "}
          FINN-importer.
        </p>

        <h2 id="abonnement">4. Bindingstid, oppsigelse og endringer</h2>
        <p>
          Tjenesten tilbyr per i dag <strong>ikke abonnement eller faste
          betalinger</strong>. Hvert kjøp er en separat engangsbetaling for den
          tjenesten og prisen som vises før bestillingen bekreftes. Eventuell
          innlogging med en betalingsleverandør oppretter ikke et abonnement.
        </p>
        <ul>
          <li>
            <strong>Bindingstid:</strong> Kjøpet har ingen bindingstid og
            fornyes ikke automatisk.
          </li>
          <li>
            <strong>Oppsigelse:</strong> Det finnes ingen løpende betalingsavtale
            å si opp. Du belastes ikke på nytt uten at du selv legger inn og
            bekrefter en ny bestilling.
          </li>
          <li>
            <strong>Endring av tjeneste eller pris:</strong> Vi kan endre
            innhold og pris for fremtidige kjøp. En endring gjelder aldri et
            allerede gjennomført kjøp. Gjeldende tjeneste, totalpris og vilkår
            vises alltid før du bekrefter en ny betaling.
          </li>
        </ul>

        <h2 id="levering">5. Levering</h2>
        <p>
          Tjenesten er digital og leveres <strong>umiddelbart</strong> på
          nettstedet – normalt innen få sekunder etter gjennomført betaling. Du
          får tilgang til klippekortet. Klipp fra hvert kjøp er gyldige i{" "}
          {KLIPP_GYLDIGHET_MANEDER} måneder fra kjøpsdatoen. Ingenting sendes
          fysisk, og det påløper ingen fraktkostnad.
        </p>
        <p>
          Skulle leveringen svikte av tekniske årsaker, kontakt oss på{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> med
          kvitteringen fra betalingsleverandøren, så leverer vi på nytt eller
          refunderer beløpet.
        </p>

        <h2 id="angrerett">6. Angrerett</h2>
        <p>
          Ved kjøp av digitalt innhold som leveres umiddelbart, må du før
          kjøpet gi uttrykkelig samtykke til at leveringen starter med én gang,
          og erkjenne at <strong>angreretten dermed bortfaller</strong>. Dette
          samtykket gir du ved å krysse av i bestillingsdialogen. Unntaket
          følger av angrerettloven § 22 bokstav n.
        </p>
        <p>
          Krysser du ikke av, kan bestillingen ikke gjennomføres – og du har da
          heller ikke betalt for noe. Har du ikke gitt slikt samtykke og
          leveringen likevel ikke er påbegynt, gjelder 14 dagers angrerett
          regnet fra bestillingsdagen. Bruk i så fall{" "}
          <a
            href="https://www.forbrukertilsynet.no/angrerettskjema"
            target="_blank"
            rel="noopener noreferrer"
          >
            Forbrukertilsynets angreskjema
          </a>{" "}
          eller send oss en melding på e-post.
        </p>

        <h2 id="retur">7. Retur</h2>
        <p>
          Tjenesten er et rent digitalt produkt uten fysisk vare, og det finnes
          derfor ingenting å returnere eller sende tilbake. Der du har krav på å
          få pengene tilbake etter punktene om angrerett, levering eller
          reklamasjon, skjer tilbakebetalingen automatisk til samme
          betalingsmiddel som du betalte med – normalt innen få dager, og senest
          innen 14 dager.
        </p>
        <p>
          <strong>Mislykket FINN-henting:</strong> Klarer vi ikke å hente
          annonsen fra FINN – for eksempel fordi den er solgt eller fjernet –
          brukes det ikke et klipp.
        </p>

        <h2 id="reklamasjon">8. Reklamasjon</h2>
        <p>
          Har tjenesten en mangel – den virker ikke som beskrevet, eller
          leveringen uteblir – kan du reklamere ved å sende e-post til{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> eller ringe{" "}
          <a href={`tel:${COMPANY.phone}`}>{COMPANY.phoneFormatted}</a>. Beskriv
          hva som er galt, og legg ved kvittering eller lenken til beregningen.
        </p>
        <ul>
          <li>
            Reklamer <strong>innen rimelig tid</strong> etter at du oppdaget
            eller burde oppdaget mangelen, og senest <strong>to år</strong>{" "}
            etter at tjenesten ble levert.
          </li>
          <li>
            Vi bekrefter mottak og gir deg et svar så raskt som mulig, normalt
            innen én virkedag og senest innen 14 dager.
          </li>
          <li>
            Er det en mangel vi svarer for, retter vi feilen eller leverer på
            nytt. Lar ikke det seg gjøre innen rimelig tid, får du prisavslag
            eller full refusjon.
          </li>
          <li>Reklamasjonen er gratis – du bærer ingen kostnad ved å klage.</li>
        </ul>
        <p>
          Vær oppmerksom på at et resultat du er uenig i, ikke i seg selv er en
          mangel: kalkulatoren regner på forutsetningene du selv legger inn. Ser
          du derimot en regnefeil, vil vi svært gjerne høre om det.
        </p>

        <h2 id="konfliktlosning">9. Konfliktløsning</h2>
        <p>
          Ta alltid kontakt med oss først – de aller fleste saker løses med en
          e-post. Blir vi ikke enige, kan du som forbruker bringe saken inn for{" "}
          <a
            href="https://www.forbrukerradet.no/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Forbrukerrådet
          </a>{" "}
          for mekling. Fører ikke meklingen fram, kan saken behandles av{" "}
          <a
            href="https://www.forbrukerklageutvalget.no/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Forbrukerklageutvalget
          </a>
          . Begge deler er gratis for forbrukere.
        </p>
        <p>
          Er du forbruker bosatt i et annet EU/EØS-land, kan du få veiledning i
          en grensekryssende sak hos{" "}
          <a
            href="https://www.forbrukereuropa.no/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Forbruker Europa
          </a>
          .
        </p>

        <h2 id="ansvar">10. Ikke rådgivning – og ansvarsbegrensning</h2>
        <p>
          Alle resultater er automatiske estimater basert på forutsetningene du
          selv legger inn, og utgjør ikke finansiell, juridisk eller
          skattemessig rådgivning. Tallene kan inneholde feil, og faktiske
          resultater vil avvike. Gjør alltid egne undersøkelser og søk
          profesjonell rådgivning før du investerer.
        </p>
        <p>
          Tjenesten leveres «som den er». {COMPANY.legalName} er ikke ansvarlig
          for tap som følge av beslutninger tatt på grunnlag av beregningene, ut
          over det som følger av ufravikelig lovgivning. Vårt samlede ansvar er
          uansett begrenset til beløpet du har betalt for det aktuelle
          klippekortet.
        </p>

        <h2 id="datakilder">11. Datakilder og immaterielle rettigheter</h2>
        <p>
          Ved FINN-import henter tjenesten offentlig tilgjengelige nøkkeltall
          fra annonsen du selv oppgir, på dine vegne og til din egen beregning.
          Annonseinnholdet tilhører annonsøren/FINN.no, og vi garanterer ikke at
          tallene i annonsen er korrekte eller fullstendige. Kontroller alltid
          tallene mot annonsen og salgsoppgaven før du legger inn bud.
        </p>
        <p>
          Innholdet på utleie-kalkulator.no, inkludert kalkulatoren og guidene,
          tilhører {COMPANY.legalName}. Beregningene dine er dine egne og kan
          fritt deles.
        </p>

        <h2 id="lovvalg">12. Lovvalg</h2>
        <p>
          Vilkårene er underlagt norsk rett. Se også{" "}
          <Link href="/personvern">personvernerklæringen</Link> og{" "}
          <Link href="/kontakt">kontaktsiden</Link>.
        </p>
      </article>
    </div>
  );
}
