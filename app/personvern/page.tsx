import type { Metadata } from "next";
import { COMPANY, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Personvernerklæring",
  description:
    "Slik behandler utleie-kalkulator.no opplysninger ved beregninger, klippekort, betaling og valgfri innlogging.",
  alternates: { canonical: "/personvern" },
  robots: { index: true, follow: true },
};

export default function PersonvernPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-12 sm:px-6">
      <article className="article">
        <h1 className="display text-[clamp(2rem,5vw,2.75rem)]">Personvernerklæring</h1>
        <p className="mt-3">
          Sist oppdatert 3. september 2026.
        </p>
        <p>
          <strong>Behandlingsansvarlig</strong> er {COMPANY.legalName}, org.nr.{" "}
          {COMPANY.organizationNumberFormatted}, {COMPANY.street},{" "}
          {COMPANY.postalCode} {COMPANY.city}, {COMPANY.country}. Henvendelser
          om personvern rettes til{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> eller{" "}
          <a href={`tel:${COMPANY.phone}`}>{COMPANY.phoneFormatted}</a>.
        </p>

        <h2>Kort versjon</h2>
        <ul>
          <li>Ingen profilering eller annonsesporing.</li>
          <li>
            Beregninger er anonyme tall om en bolig – ikke personopplysninger.
          </li>
          <li>
            Betaling håndteres av betalingsleverandøren; vi ser aldri
            kortnummeret ditt.
          </li>
          <li>Vipps-innlogging er valgfri når den er tilgjengelig.</li>
        </ul>

        <h2>Hva vi behandler</h2>
        <ul>
          <li>
            <strong>Beregninger:</strong> Tallene du legger inn (kjøpesum,
            leie, kostnader) behandles i nettleseren din. Vi har ingen egen
            database og lagrer ingen beregninger på egne servere; deling skjer
            ved at tallene legges i lenken du selv deler.
          </li>
          <li>
            <strong>Betaling:</strong> Kjøp gjennomføres hos Stripe, som
            behandler kort- og kontaktopplysninger som selvstendig
            behandlingsansvarlig. Klippekortsaldo, utløpsdato og en liste over
            FINN-koder du har låst opp, lagres i metadata på kundereferansen
            hos Stripe. Dette er nødvendig for å levere klippekortet.
          </li>
          <li>
            <strong>Valgfri Vipps-innlogging:</strong> Logger du inn, ber vi om
            <code>openid</code> og navn. Vi mottar en pseudonym bruker-ID og
            navnet ditt, slik at klippekortet kan brukes på flere enheter.
          </li>
          <li>
            <strong>Misbruksvern:</strong> IP-adresser brukes kun flyktig i
            minnet for å begrense misbruk, og lagres ikke.
          </li>
          <li>
            <strong>Tekniske logger:</strong> Vår driftsleverandør Vercel
            genererer ordinære, kortlivede tjenerlogger for drift og sikkerhet.
          </li>
        </ul>

        <h2>Informasjonskapsler</h2>
        <p>
          Nettsiden bruker en nødvendig, signert og <code>httpOnly</code>{" "}
          informasjonskapsel for å knytte nettleseren til klippekortet og
          eventuell innlogging. Den kan ikke brukes til annonsesporing. En
          kortvarig sikkerhetskapsel brukes under Vipps-innlogging. Stripe kan
          sette egne kapsler når du går til betalingssiden.
        </p>

        <h2>Dine rettigheter</h2>
        <p>
          Du kan be om innsyn, retting eller sletting av opplysninger knyttet
          til klippekortet eller innloggingen. Kontakt oss på{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Du
          har rett til å klage til Datatilsynet.
        </p>
      </article>
    </div>
  );
}
