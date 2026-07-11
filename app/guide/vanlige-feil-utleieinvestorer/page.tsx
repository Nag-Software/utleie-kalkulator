import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("vanlige-feil-utleieinvestorer");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hvorfor går det galt for nye utleieinvestorer?</h2>
      <p>
        De dyreste feilene ved kjøp av utleiebolig er sjelden uflaks. De er
        forutsigbare regnefeil: for optimistiske inntekter, glemte kostnader
        og null sikkerhetsmargin. Her er de sju vanligste – med det de typisk
        koster, og hvordan du unngår dem.
      </p>

      <h2>Feil 1: Du regner med bruttoleie</h2>
      <p>
        Annonser og raske overslag bruker bruttotall fordi de ser best ut. En
        leilighet som leies ut for 15 000 kr i måneden, gir 180 000 kr brutto
        i året – men trekker du én måneds tomgang (15 000 kr), 3 500 kr i
        måneden i felleskostnader (42 000 kr) og et nøkternt
        vedlikeholdsbudsjett (20 000 kr), står du igjen med drøyt{" "}
        <strong>100 000 kr</strong> før renter og skatt. Over 40 % av
        bruttotallet er borte. Regn alltid på netto, og bruk netto yield når
        du sammenligner objekter.
      </p>

      <h2>Feil 2: Du regner på prisantydning, ikke totalkostnad</h2>
      <p>
        Prisantydningen er tallet i annonsen, så det er tallet folk regner
        på. Men en selveierleilighet til 4 000 000 kr koster med
        dokumentavgift på 2,5 % og gebyrer rundt 4 100 000 kr – og en
        andelsleilighet kan ha fellesgjeld på toppen av prisantydningen. I
        eksempelet faller brutto yield fra 4,5 % til 4,4 %, og omkostningene
        er penger du aldri får igjen ved salg. Regn alltid på totalpris med
        alle omkostninger.
      </p>

      <h2>Feil 3: Du legger for optimistisk leie til grunn</h2>
      <p>
        Du trenger et leietall i kalkylen og velger det høyeste du har sett
        annonsert. Men annonserte leiepriser er utropspriser – noen boliger
        blir liggende nettopp fordi de er priset for høyt. 1 000 kr for mye i
        antatt leie er 12 000 kr i året i regnearket, og setter du faktisk
        leien for høyt, betaler du i stedet med tomgang. Undersøk{" "}
        <Link href="/guide/hva-kan-jeg-leie-ut-for">
          hva sammenlignbare boliger faktisk leies ut for
        </Link>
        , og regn med den nederste delen av intervallet.
      </p>

      <h2>Feil 4: Du har ingen buffer</h2>
      <p>
        Kalkylen settes opp med tolv måneders leie og null uforutsett – alt
        må gå perfekt for at den skal stemme. Én måned tomgang (15 000 kr)
        pluss én vaskemaskin (10 000 kr) er <strong>25 000 kr</strong>, og
        for mange høyt belånte utleieboliger er det hele årets kontantstrøm.
        Ett leietakerbytte og én maskin skiller pluss fra minus. Ha en buffer
        på 2–3 måneders leie i bakhånd, og legg tomgang og vedlikehold inn i
        kalkylen fra start.
      </p>

      <h2>Feil 5: Du kjøper med hjertet – i feil område</h2>
      <p>
        Det føles trygt å kjøpe en bolig du selv kunne bodd i, i nabolaget du
        kjenner. Men pressområder prises av folk som skal bo der selv: brutto
        yield i Oslo sentralt ligger typisk på 3–4 %, mot 5,5–7 % i flere
        mindre byer og studentbyer – se{" "}
        <Link href="/guide/hvor-i-norge-er-yield-hoyest">
          hvor i Norge yielden er høyest
        </Link>
        . Å kjøpe «koselig» fremfor lønnsomt kan koste deg et par
        prosentpoeng i årlig direkteavkastning. Velg område med regneark –
        det er leietakeren som skal bo der, ikke du.
      </p>

      <h2>Feil 6: Du undervurderer renterisikoen</h2>
      <p>
        Regnestykket settes opp med dagens rente, og dagens rente føles
        alltid normal. Med 3 600 000 kr i lån betyr 3 prosentpoeng høyere
        rente – nivået bankene stresstester deg på – 108 000 kr mer i renter
        i året, rundt <strong>84 000 kr etter rentefradrag</strong>. Det er
        7 000 kr i måneden som må dekkes av samme leie. Finn{" "}
        <Link href="/guide/break-even-for-utleiebolig">
          break-even-renten din
        </Link>{" "}
        før du byr, og sjekk at du tåler den med margin.
      </p>

      <h2>Feil 7: Du sjekker ikke eieform og utleieregler</h2>
      <p>
        En «billig» andelsleilighet ser ut som et kupp – helt til du
        oppdager reglene. I borettslag krever utleie styrets samtykke, og
        hovedregelen er at du må ha bodd i boligen minst ett av de siste to
        årene før du kan leie ut i inntil tre år. Som ren investor får du i
        praksis ikke leid ut i det hele tatt, og da er kuppet verdiløst som
        utleieprosjekt. Sjekk eieform, vedtekter og{" "}
        <Link href="/guide/utleie-i-borettslag">
          reglene for utleie i borettslag
        </Link>{" "}
        før visning, ikke etter bud.
      </p>

      <h2>Slik unngår du alle sju</h2>
      <p>
        Fellesnevneren er å regne nøkternt før du byr, ikke etterpå.
        Utleiekalkulatoren tvinger frem hele regnestykket: totalpris med
        omkostninger, tomgang, vedlikehold, skatt og break-even ved høyere
        rente – gratis og uten konto. Da ser du på forhånd om objektet tåler
        både en rentetopp og en vaskemaskin i samme år.
      </p>
    </ArticleLayout>
  );
}
