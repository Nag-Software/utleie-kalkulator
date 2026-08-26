import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("forste-utleiebolig-sjekkliste");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hvor begynner du?</h2>
      <p>
        Ikke med boligannonsene. Riktig rekkefølge er å rydde i egen økonomi
        først, velge marked deretter, og regne på konkrete objekter før du
        drar på visning. Da vet du nøyaktig hvor budet ditt skal stoppe – og
        de dyreste nybegynnerfeilene skjer nettopp når den rekkefølgen snus.
      </p>

      <h2>Steg 1–5: gjør jobben før budrunden</h2>
      <ol>
        <li>
          <strong>Rydd i egen økonomi og skaff finansieringsbevis.</strong>{" "}
          Utlånsforskriften krever minst <strong>10 % egenkapital</strong>{" "}
          også for sekundærbolig, samlet gjeld på maks fem ganger brutto
          årsinntekt, og at du tåler 3 prosentpoeng renteøkning. For en bolig
          til 3 500 000 kr trenger du altså minst 350 000 kr i egenkapital
          pluss omkostninger. Les hvordan{" "}
          <Link href="/guide/egenkapital-og-lan-til-utleiebolig">
            banken vurderer lån til utleiebolig
          </Link>
          , og få finansieringsbeviset på plass før du begynner å lete.
        </li>
        <li>
          <strong>Velg marked og sjekk leienivået.</strong> Let etter steder
          folk faktisk vil leie: nær studiested, sykehus eller
          kollektivknutepunkt. Undersøk{" "}
          <Link href="/guide/hva-kan-jeg-leie-ut-for">
            hva tilsvarende boliger faktisk leies ut for
          </Link>{" "}
          med FINN-søk og SSBs leiestatistikk – annonserte priser er
          utropspriser, ikke fasit. Leienivået er halve regnestykket ditt.
        </li>
        <li>
          <strong>Regn på objektene før visning.</strong> Sett opp totalpris
          med omkostninger, nøktern leie, felleskostnader, vedlikehold og
          tomgang – og se om{" "}
          <Link href="/guide/lonner-det-seg-a-kjope-utleiebolig">
            regnestykket faktisk går opp
          </Link>
          . Regner du først etter visningen, regner du for å forsvare en
          bolig du allerede har blitt glad i. Tall før følelser.
        </li>
        <li>
          <strong>Sjekk eieform og utleieadgang.</strong> I borettslag krever
          utleie styrets godkjenning, og hovedregelen er at du må ha bodd der
          ett av de siste to årene før du kan leie ut i inntil tre år –{" "}
          <Link href="/guide/utleie-i-borettslag">
            reglene for utleie i borettslag
          </Link>{" "}
          gjør dem ofte uegnet som rene utleieobjekter. Selveier gir fri
          utleie, men koster 2,5 % dokumentavgift.
        </li>
        <li>
          <strong>Les salgsoppgave og tilstandsrapport grundig.</strong> TG2-
          og TG3-merknader forteller hvor de neste hundretusenene skal brukes
          – bad, tak, rør og elektrisk anlegg er de dyre punktene. Bruk
          funnene til å justere hva boligen er verdt for deg, eller til å gå
          videre til neste objekt.
        </li>
      </ol>

      <h2>Steg 6–10: fra bud til første leietaker</h2>
      <ol start={6}>
        <li>
          <strong>Sett budtak fra regnestykket – og hold det.</strong> Bestem
          på forhånd den høyeste totalprisen der kjøpet fortsatt er lønnsomt,
          og skriv tallet ned før budrunden starter. Vinner du 200 000 kr
          over taket ditt, har du ikke vunnet noe – du har kjøpt et dårligere
          regnestykke.
        </li>
        <li>
          <strong>Overtakelse og målrettet oppgradering.</strong> Gå gjennom
          boligen med protokoll og les av strømmåler. Skal du pusse opp, gjør
          det målrettet mot leiemarkedet: funksjonelt, lyst og lettstelt slår
          påkostet. Hver uke boligen står tom under oppgraderingen, koster en
          uke leie.
        </li>
        <li>
          <strong>Forsikring og lovlig utleiedel.</strong> Tegn
          utleieforsikring eller utvidet husforsikring, og sjekk at det du
          skal leie ut, oppfyller{" "}
          <Link href="/guide/krav-til-godkjent-utleiedel">
            kravene til godkjent utleiedel
          </Link>
          : takhøyde, rømningsvei, dagslys og ventilasjon. Røykvarslere i
          hver etasje og slokkeutstyr er utleiers ansvar.
        </li>
        <li>
          <strong>Annonse, visning og valg av leietaker.</strong> Gode
          bilder, ærlig beskrivelse og riktig pris gir deg flere søkere å
          velge blant. Sjekk referanser og betalingsevne systematisk –{" "}
          <Link href="/guide/finne-og-velge-leietaker">
            slik finner du riktig leietaker
          </Link>
          . Riktig leietaker til 500 kr under toppris er ofte bedre butikk
          enn feil leietaker til full pris.
        </li>
        <li>
          <strong>Skriftlig kontrakt og depositum på egen konto.</strong>{" "}
          Kontrakten skal regulere leie, varighet, oppsigelse, depositum og
          vedlikeholdsansvar – se{" "}
          <Link href="/guide/leiekontrakt-dette-ma-den-inneholde">
            hva leiekontrakten må inneholde
          </Link>
          . Depositumet, maks seks måneders leie, skal stå på egen
          depositumskonto i leietakers navn, og du som utleier betaler
          opprettelsen. Først når kontrakt og depositum er på plass,
          overleverer du nøklene.
        </li>
      </ol>

      <h2>Sjekklistens kjerne: regn før du byr</h2>
      <p>
        Steg 3 og 6 er der førstegangskjøpere oftest snubler, og de henger
        sammen: uten regnestykke finnes ikke noe budtak. Utleiekalkulatoren
        gjør regnedelen på minutter – legg inn pris, leie, rente og kostnader
        og få kontantstrøm etter skatt, netto yield og break-even, gratis og
        uten konto. Med FINN-import (9,90 kr) hentes tallene rett fra
        annonsen, før du i det hele tatt booker visning.
      </p>
    </ArticleLayout>
  );
}
