import type { Metadata } from "next";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide } from "@/lib/guides";

const meta = getGuide("skatt-pa-utleie-2026");

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/guide/${meta.slug}` },
};

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hovedregelen: 22 % av netto leieinntekt</h2>
      <p>
        Skattepliktige leieinntekter beskattes som kapitalinntekt med{" "}
        <strong>22 %</strong> (2026). Skatten beregnes av{" "}
        <strong>netto</strong> resultat: leieinntekter minus alle
        fradragsberettigede kostnader. Utleie av sekundærbolig – en bolig du
        ikke selv bor i – er alltid skattepliktig fra første krone.
      </p>

      <h2>Når er utleie skattefritt?</h2>
      <ul>
        <li>
          <strong>Utleie i egen bolig:</strong> Leier du ut mindre enn
          halvparten av boligen du selv bor i, målt etter utleieverdi, er
          inntektene skattefrie. Klassisk eksempel: hybel eller sokkelleilighet
          i eneboligen.
        </li>
        <li>
          <strong>Halve boligen eller mer:</strong> Leier du ut mer enn
          halvparten, er inntektene skattefrie bare hvis samlet brutto
          leieinntekt er under 20 000 kr i inntektsåret.
        </li>
        <li>
          <strong>Korttidsutleie av egen bolig</strong> (leieforhold under 30
          dager, typisk Airbnb): De første 10 000 kr i året er skattefrie.
          Av det overskytende regnes 85 % som skattepliktig inntekt.
        </li>
      </ul>
      <p>
        Er utleien din skattefri, setter du ganske enkelt skattesatsen til 0 i
        kalkulatoren.
      </p>

      <h2>Fradragene du kan kreve (skattepliktig utleie)</h2>
      <ul>
        <li>Felleskostnader til sameie eller borettslag</li>
        <li>Kommunale avgifter og eiendomsskatt</li>
        <li>Forsikring av boligen</li>
        <li>
          Vedlikehold som holder boligen i samme stand (ikke påkostninger som
          hever standarden)
        </li>
        <li>Møbler og utstyr i møblert utleie (avskrives eller utgiftsføres)</li>
        <li>Utgifter til utleiemegler, annonsering og visning</li>
        <li>Regnskapsføring og eierskiftegebyr</li>
        <li>Reisekostnader ved tilsyn av boligen</li>
      </ul>
      <p>
        <strong>Gjeldsrenter</strong> er også fradragsberettiget i alminnelig
        inntekt – uavhengig av utleien – og reduserer dermed den effektive
        skatten på et lånefinansiert utleieprosjekt betydelig.
      </p>

      <h2>Underskudd gir skattefordel</h2>
      <p>
        Går utleien med skattemessig underskudd (kostnader og renter overstiger
        leien), reduserer underskuddet annen alminnelig inntekt – du får i
        praksis 22 % av underskuddet «tilbake», forutsatt at du har annen
        inntekt å føre fradraget mot. Kalkulatoren viser dette som
        fradragsfordel.
      </p>

      <h2>Andre regler å kjenne til</h2>
      <ul>
        <li>
          <strong>Formuesskatt:</strong> Sekundærboliger verdsettes til 100 %
          av beregnet markedsverdi og øker formuesskatten for mange.
        </li>
        <li>
          <strong>Utleie i næring:</strong> Driver du stort – tommelfingerregelen
          er fem boenheter eller mer – kan utleien bli regnet som
          næringsvirksomhet med opp mot ~50 % marginalskatt. Vurderes konkret.
        </li>
        <li>
          <strong>Rapportering:</strong> Skattepliktig utleie føres i
          skattemeldingen (RF-1189/vedlegg for utleie). Ta vare på alle
          kvitteringer.
        </li>
      </ul>
      <p>
        Reglene har detaljer og unntak – sjekk{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetatens utleiesider
        </a>{" "}
        for din situasjon. Denne guiden er generell informasjon, ikke
        skatterådgivning.
      </p>
    </ArticleLayout>
  );
}
