import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("skattemelding-leieinntekter");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hvor i skattemeldingen føres leieinntekter?</h2>
      <p>
        Skattepliktige leieinntekter føres under temaet{" "}
        <strong>«Bolig og eiendeler»</strong> i skattemeldingen. Der velger du
        den utleide boligen, oppgir leieinntektene og fører fradragene –
        skattemeldingen beregner resultatet automatisk. Temaet erstatter det
        tidligere utleieskjemaet <strong>RF-1189</strong>. Overskuddet inngår i
        alminnelig inntekt og skattlegges med 22 %.
      </p>
      <p>
        Er utleien skattefri – typisk hybel i boligen du selv bor i – skal den
        ikke føres i skattemeldingen i det hele tatt. Grensene for skattefri
        utleie finner du i guiden om{" "}
        <Link href="/guide/skatt-pa-utleie-2026">skatt på utleie</Link>. Og
        driver du stort – tommelfingerregelen er fem boenheter eller mer – kan
        utleien regnes som næringsvirksomhet og skal da rapporteres som
        næring, ikke under «Bolig og eiendeler».
      </p>

      <h2>Slik fører du utleien, steg for steg</h2>
      <ol>
        <li>
          Åpne skattemeldingen og gå til temaet «Bolig og eiendeler». Boliger
          du eier, ligger normalt inne fra før.
        </li>
        <li>
          Velg boligen og oppgi at den har vært leid ut: utleieperiode og
          samlet brutto leie for inntektsåret. Har du flere utleieboliger,
          føres hver bolig for seg. Sjekk samtidig at de forhåndsutfylte
          opplysningene om boligen stemmer.
        </li>
        <li>
          Før kostnadene post for post: felleskostnader, kommunale avgifter,
          forsikring, vedlikehold og resten. Full oversikt over postene finner
          du i guiden om{" "}
          <Link href="/guide/fradrag-ved-utleie">fradrag ved utleie</Link>.
        </li>
        <li>
          Kontroller resultatet. Overskudd legges automatisk til inntekten
          din; underskudd trekkes automatisk fra.
        </li>
        <li>Lever innen fristen 30. april.</li>
      </ol>

      <h2>Frist og oppbevaring av kvitteringer</h2>
      <p>
        Fristen for skattemeldingen er <strong>30. april</strong> året etter
        inntektsåret. Kvitteringer og fakturaer skal ikke legges ved, men du
        må kunne legge dem frem hvis Skatteetaten spør – og de kan spørre
        flere år tilbake i tid. Oppdager du feil etter levering, kan du selv
        endre skattemeldingen i ettertid. Ha dette klart før du begynner:
      </p>
      <table>
        <thead>
          <tr>
            <th>Dokument</th>
            <th>Hvorfor du trenger det</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Leiekontrakt</td>
            <td>Dokumenterer leienivå og utleieperiode</td>
          </tr>
          <tr>
            <td>Oversikt over innbetalt leie</td>
            <td>Dokumenterer inntekten, for eksempel kontoutskrift</td>
          </tr>
          <tr>
            <td>Fakturaer og kvitteringer</td>
            <td>Dokumenterer hver fradragspost</td>
          </tr>
          <tr>
            <td>Spesifisert håndverkerfaktura</td>
            <td>Skiller vedlikehold fra påkostning</td>
          </tr>
        </tbody>
      </table>

      <h2>Hva skjer med underskudd?</h2>
      <p>
        Ingenting du trenger å gjøre noe med: går utleien i minus, flyter
        underskuddet automatisk inn i alminnelig inntekt og reduserer skatten
        på lønn og annen inntekt. I praksis får du 22 % av underskuddet i
        redusert skatt – et underskudd på 30 000 kr betyr 6 600 kr mindre
        skatt, og fordelen viser seg i skatteoppgjøret. Mekanikken, og den
        viktige forskjellen på skattemessig underskudd og negativ
        kontantstrøm, er forklart i guiden om{" "}
        <Link href="/guide/underskudd-pa-utleie">underskudd på utleie</Link>.
      </p>

      <h2>Feilene som oftest gir spørsmål fra Skatteetaten</h2>
      <ul>
        <li>
          <strong>Glemme fradrag:</strong> Den vanligste feilen rammer bare
          deg selv – hver glemt tusenlapp koster 220 kr i unødvendig skatt.
        </li>
        <li>
          <strong>Føre påkostning som vedlikehold:</strong> Standardheving gir
          ikke fradrag nå. Grensen er forklart i guiden om{" "}
          <Link href="/guide/vedlikehold-eller-pakostning">
            vedlikehold eller påkostning
          </Link>
          .
        </li>
        <li>
          <strong>Føre avdrag som kostnad:</strong> Avdrag er nedbetaling av
          gjeld, ikke en fradragsberettiget kostnad. Rentene er derimot
          fradragsberettiget, men hører hjemme under lånet – de kommer normalt
          ferdig utfylt fra banken og skal ikke føres en gang til under
          utleien.
        </li>
        <li>
          <strong>Ikke oppgi utleien i det hele tatt:</strong> Skatteetaten
          mottar opplysninger fra blant annet utleieplattformer, og uoppgitt
          leieinntekt kan gi tilleggsskatt.
        </li>
        <li>
          <strong>Runde anslag uten bilag:</strong> Før faktiske beløp fra
          faktura og kvittering, ikke omtrentlige tall.
        </li>
      </ul>
      <p>
        Dette er generell informasjon, ikke skatterådgivning – se{" "}
        <a
          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Skatteetatens sider om utleie
        </a>{" "}
        for detaljene i din situasjon.
      </p>

      <h2>Ha tallene klare før april</h2>
      <p>
        Det enkleste er å ha oppstillingen løpende i stedet for å lete i
        kontoutskrifter når fristen nærmer seg. Utleiekalkulatoren setter opp
        nettopp de tallene skattemeldingen spør om – brutto leie, kostnader
        post for post og netto resultat – og viser samtidig kontantstrømmen
        etter skatt. Gratis og uten konto.
      </p>
    </ArticleLayout>
  );
}
