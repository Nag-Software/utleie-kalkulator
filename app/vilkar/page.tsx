import type { Metadata } from "next";
import Link from "next/link";
import { Pill } from "@/components/site/primitives";
import { COMPANY, CONTACT_EMAIL, PRICE_NOK } from "@/lib/site";

export const metadata: Metadata = {
  title: "Salgsvilkår",
  description:
    "Salgsvilkår for utleie-kalkulator.no: parter, priser, betaling, levering, angrerett, retur, reklamasjon og konfliktløsning. Levert av Nag Software, org.nr. 936 593 127.",
  alternates: { canonical: "/vilkar" },
};

const SERVICES = [
  {
    name: "Utleiekalkulatoren",
    what: "Manuell beregning av kontantstrøm, yield, cash-on-cash, break-even og flerårig prognose. Ubegrenset bruk, ingen konto.",
    price: "0 kr",
  },
  {
    name: "FINN-import",
    what: "Kjøpesum, felleskostnader, fellesgjeld, eieform og omkostninger hentes automatisk fra én FINN-annonse du oppgir, og fyller ut kalkulatoren.",
    price: `${PRICE_NOK} kr per beregning`,
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
          utleie-kalkulator.no. Sist oppdatert 26. august 2026.
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
          ikke part i noe leieforhold. Det eneste du kjøper er en beregning.
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
          opprettes ingen konto, og det løper ingen abonnement, medlemskap
          eller bindingstid som må sies opp.
        </p>

        <h2 id="betaling">3. Betaling</h2>
        <p>
          Betaling skjer i et sikkert betalingsvindu hos vår
          betalingsleverandør <strong>Stripe</strong>. Tilgjengelige
          betalingsmåter vises i betalingsvinduet. Vi mottar aldri kortnummeret
          ditt – det håndteres i sin helhet av betalingsleverandøren.
        </p>
        <p>
          Beløpet belastes når bestillingen bekreftes. Kvittering sendes på
          e-post fra betalingsleverandøren, og lenken du får etter kjøpet gir
          deg tilgang til beregningen din.
        </p>

        <h2 id="levering">4. Levering</h2>
        <p>
          Tjenesten er digital og leveres <strong>umiddelbart</strong> på
          nettstedet – normalt innen få sekunder etter gjennomført betaling. Du
          sendes rett til beregningen, og lenken til den er din kvittering på
          leveringen. Ingenting sendes fysisk, og det påløper ingen
          fraktkostnad.
        </p>
        <p>
          Skulle leveringen svikte av tekniske årsaker, kontakt oss på{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> med
          kvitteringen fra betalingsleverandøren, så leverer vi på nytt eller
          refunderer beløpet.
        </p>

        <h2 id="angrerett">5. Angrerett</h2>
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

        <h2 id="retur">6. Retur</h2>
        <p>
          Tjenesten er et rent digitalt produkt uten fysisk vare, og det finnes
          derfor ingenting å returnere eller sende tilbake. Der du har krav på å
          få pengene tilbake etter punktene om angrerett, levering eller
          reklamasjon, skjer tilbakebetalingen automatisk til samme
          betalingsmiddel som du betalte med – normalt innen få dager, og senest
          innen 14 dager.
        </p>
        <p>
          <strong>Automatisk refusjon ved mislykket FINN-henting:</strong>{" "}
          Klarer vi ikke å hente annonsen fra FINN – for eksempel fordi den er
          solgt eller fjernet – refunderes hele beløpet automatisk uten at du
          trenger å be om det.
        </p>

        <h2 id="reklamasjon">7. Reklamasjon</h2>
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

        <h2 id="konfliktlosning">8. Konfliktløsning</h2>
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

        <h2 id="ansvar">9. Ikke rådgivning – og ansvarsbegrensning</h2>
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
          uansett begrenset til beløpet du har betalt for den aktuelle
          beregningen.
        </p>

        <h2 id="datakilder">10. Datakilder og immaterielle rettigheter</h2>
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

        <h2 id="lovvalg">11. Lovvalg</h2>
        <p>
          Vilkårene er underlagt norsk rett. Se også{" "}
          <Link href="/personvern">personvernerklæringen</Link> og{" "}
          <Link href="/kontakt">kontaktsiden</Link>.
        </p>
      </article>
    </div>
  );
}
