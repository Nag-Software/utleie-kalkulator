import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personvernerklæring",
  description:
    "Slik behandler utleie-kalkulator.no opplysninger: ingen konto, ingen sporing, anonyme beregninger.",
  alternates: { canonical: "/personvern" },
  robots: { index: true, follow: true },
};

export default function PersonvernPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-8">
      <article className="article">
        <h1 className="text-3xl font-bold tracking-tight">Personvernerklæring</h1>
        <p className="mt-3">
          Behandlingsansvarlig: Nag Software (kontakt:{" "}
          <a href="mailto:casper@nagsoftware.no">casper@nagsoftware.no</a>).
          Sist oppdatert 4. juli 2026.
        </p>

        <h2>Kort versjon</h2>
        <ul>
          <li>Ingen brukerkonto, ingen profilering, ingen annonsesporing.</li>
          <li>
            Beregninger er anonyme tall om en bolig – ikke personopplysninger.
          </li>
          <li>Betaling håndteres av Stripe; vi ser aldri kortnummeret ditt.</li>
        </ul>

        <h2>Hva vi behandler</h2>
        <ul>
          <li>
            <strong>Beregninger:</strong> Tallene du legger inn (kjøpesum,
            leie, kostnader) behandles i nettleseren din. Velger du å lagre en
            beregning, eller kjøper en FINN-beregning, lagres tallene anonymt
            hos vår databaseleverandør Supabase (EU) med en hemmelig lenke.
            Beregninger knyttes ikke til navn, e-post eller andre
            identifikatorer.
          </li>
          <li>
            <strong>Betaling:</strong> Kjøp gjennomføres hos Stripe. Stripe
            behandler kort- og kontaktopplysninger som selvstendig
            behandlingsansvarlig for betalingsprosessen. Vi lagrer kun en
            teknisk referanse til betalingen (uten kortdata).
          </li>
          <li>
            <strong>Misbruksvern:</strong> For å begrense misbruk lagrer vi en
            saltet hash av IP-adressen din (kan ikke reverseres til IP) i
            inntil ett døgn. Rå IP-adresser lagres ikke.
          </li>
          <li>
            <strong>KI-vurdering:</strong> Ved betalte beregninger sendes
            beregningstallene og boligfakta fra annonsen (ikke opplysninger om
            deg) til OpenAI for å generere vurderingen.
          </li>
          <li>
            <strong>Tekniske logger:</strong> Vår driftsleverandør Vercel
            genererer ordinære, kortlivede tjenerlogger for drift og sikkerhet.
          </li>
        </ul>

        <h2>Informasjonskapsler</h2>
        <p>
          Nettsiden setter ingen sporings- eller analysekapsler. Eventuelle
          kapsler fra Stripe settes først når du går til betalingssiden deres.
        </p>

        <h2>Dine rettigheter</h2>
        <p>
          Siden vi ikke kan knytte beregninger til deg som person, har vi
          normalt ingen personopplysninger å utlevere eller slette. Har du
          spørsmål, eller ønsker du en lagret beregning slettet (oppgi lenken),
          kontakt oss på{" "}
          <a href="mailto:casper@nagsoftware.no">casper@nagsoftware.no</a>. Du
          har rett til å klage til Datatilsynet.
        </p>
      </article>
    </div>
  );
}
