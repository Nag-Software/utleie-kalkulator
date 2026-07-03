import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vilkår for bruk",
  description:
    "Vilkår for bruk av utleie-kalkulator.no: pris, levering, angrerett og ansvarsbegrensning.",
  alternates: { canonical: "/vilkar" },
};

export default function VilkarPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-8">
      <article className="article">
        <h1 className="text-3xl font-bold tracking-tight">Vilkår for bruk</h1>
        <p className="mt-3">
          Tjenesten utleie-kalkulator.no leveres av Nag Software (kontakt:{" "}
          <a href="mailto:casper@nagsoftware.no">casper@nagsoftware.no</a>).
          Sist oppdatert 4. juli 2026.
        </p>

        <h2>Tjenesten</h2>
        <p>
          Utleie-kalkulator.no er et beregningsverktøy for å estimere
          lønnsomhet ved boligutleie. Den manuelle kalkulatoren er gratis. Mot
          betaling kan du få nøkkeltall fra en FINN-annonse fylt ut automatisk,
          sammen med en KI-generert vurdering av lønnsomheten.
        </p>

        <h2>Ikke rådgivning</h2>
        <p>
          Alle resultater – inkludert KI-vurderingen – er automatiske estimater
          basert på forutsetningene du selv legger inn, og utgjør ikke
          finansiell, juridisk eller skattemessig rådgivning. Tallene kan
          inneholde feil, og faktiske resultater vil avvike. Gjør alltid egne
          undersøkelser og søk profesjonell rådgivning før du investerer.
        </p>

        <h2>Pris og betaling</h2>
        <p>
          En FINN-beregning koster 9,90 kr inkl. ev. mva. per beregning.
          Betaling skjer med kort via Stripe. Kjøpet gjelder én annonse og
          inkluderer én automatisk utfylling, KI-vurdering og én re-vurdering
          etter at du har justert tallene. Ingen konto opprettes; kvitteringen
          er lenken til beregningen samt Stripes kvittering på e-post.
        </p>

        <h2>Levering og angrerett</h2>
        <p>
          Leveringen starter umiddelbart etter betaling. Ved kjøp samtykker du
          uttrykkelig til at leveringen av det digitale innholdet begynner
          straks, og erkjenner at angreretten dermed bortfaller, jf.
          angrerettloven § 22 bokstav n.
        </p>
        <p>
          <strong>Automatisk refusjon:</strong> Klarer vi ikke å hente
          annonsen fra FINN (for eksempel fordi den er solgt eller fjernet),
          refunderes hele beløpet automatisk til betalingskortet ditt.
        </p>

        <h2>Datakilder</h2>
        <p>
          Ved FINN-import henter tjenesten offentlig tilgjengelige nøkkeltall
          fra annonsen du selv oppgir, på dine vegne og til din egen
          beregning. Annonseinnholdet tilhører annonsøren/FINN.no, og vi
          garanterer ikke at tallene i annonsen er korrekte eller fullstendige.
        </p>

        <h2>Ansvarsbegrensning</h2>
        <p>
          Tjenesten leveres «som den er». Nag Software er ikke ansvarlig for
          tap som følge av beslutninger tatt på grunnlag av beregningene, ut
          over det som følger av ufravikelig lovgivning. Vårt samlede ansvar er
          uansett begrenset til beløpet du har betalt for den aktuelle
          beregningen.
        </p>

        <h2>Lovvalg</h2>
        <p>
          Vilkårene er underlagt norsk rett. Forbrukere kan klage til
          Forbrukertilsynet eller bruke EUs klageportal (ODR).
        </p>
      </article>
    </div>
  );
}
