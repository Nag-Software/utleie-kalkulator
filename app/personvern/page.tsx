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
            leie, kostnader) behandles i nettleseren din. Vi har ingen egen
            database og lagrer ingen beregninger på egne servere; deling skjer
            ved at tallene legges i lenken du selv deler.
          </li>
          <li>
            <strong>Betaling:</strong> Kjøp gjennomføres hos Stripe, som
            behandler kort- og kontaktopplysninger som selvstendig
            behandlingsansvarlig. Ved kjøp av en FINN-beregning lagres
            boligtallene fra annonsen og KI-vurderingen som del av
            betalingsoppføringen hos Stripe – dette er opplysninger om en
            bolig, ikke om deg.
          </li>
          <li>
            <strong>Misbruksvern:</strong> IP-adresser brukes kun flyktig i
            minnet for å begrense misbruk, og lagres ikke.
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
          spørsmål, eller ønsker du en betalt beregning slettet (oppgi lenken),
          kontakt oss på{" "}
          <a href="mailto:casper@nagsoftware.no">casper@nagsoftware.no</a>. Du
          har rett til å klage til Datatilsynet.
        </p>
      </article>
    </div>
  );
}
