import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { getGuide, guidePageMetadata } from "@/lib/guides";

const meta = getGuide("airbnb-og-korttidsutleie");

export const metadata: Metadata = guidePageMetadata(meta.slug);

export default function Page() {
  return (
    <ArticleLayout meta={meta}>
      <h2>Hva regnes som korttidsutleie?</h2>
      <p>
        Korttidsutleie er leieforhold som varer <strong>under 30 dager</strong>{" "}
        – typisk utleie via Airbnb eller lignende plattformer. Skattereglene
        skiller skarpt mellom korttidsutleie av boligen du selv bor i og
        utleie av en sekundærbolig, så start med å plassere deg i riktig
        kategori.
      </p>

      <h2>Korttidsutleie av egen bolig: 10 000-kronersgrensen</h2>
      <p>
        Leier du ut hele eller deler av boligen du selv bor i, i perioder
        under 30 dager, gjelder en egen sjablongregel:
      </p>
      <ul>
        <li>
          Inntekter opp til <strong>10 000 kr i året er skattefrie</strong>.
          Grensen gjelder per bolig, ikke per utleieforhold.
        </li>
        <li>
          Av det som overstiger 10 000 kr, regnes <strong>85 % som
          skattepliktig inntekt</strong>, som beskattes som kapitalinntekt med
          22 %.
        </li>
      </ul>
      <p>
        Eksempel: Du leier ut leiligheten din via Airbnb for 60 000 kr i
        løpet av året. De første 10 000 kr er skattefrie. Av de resterende
        50 000 kr er 85 % – altså 42 500 kr – skattepliktig. Skatten blir
        42 500 × 22 % = <strong>9 350 kr</strong>, en effektiv skatt på under
        16 % av bruttoinntekten. Merk at sjablongen erstatter fradrag: du får
        ikke trekke fra vask, plattformgebyr eller slitasje i tillegg.
      </p>
      <p>
        Langtidsutleie av deler av egen bolig følger andre og ofte gunstigere
        regler – se guiden om{" "}
        <Link href="/guide/leie-ut-del-av-egen-bolig">
          å leie ut del av egen bolig
        </Link>{" "}
        og oversikten over{" "}
        <Link href="/guide/skatt-pa-utleie-2026">skatt på utleie</Link>.
      </p>

      <h2>Korttidsutleie av sekundærbolig: skatt fra første krone</h2>
      <p>
        Eier du en bolig du ikke bor i, er all utleie skattepliktig – også
        korttidsutleie. Da gjelder de vanlige reglene: 22 % skatt på netto
        leieinntekt, med fradrag for felleskostnader, forsikring, vedlikehold,
        plattformgebyrer, vask, strøm og andre kostnader knyttet til utleien.
        Regnestykket blir som ved langtidsutleie, men med høyere inntekter{" "}
        <em>og</em> høyere kostnader og mer tomgang – bruk kalkulatoren til å
        sammenligne scenarioene.
      </p>

      <h2>Når blir utleien virksomhet?</h2>
      <p>
        Hyppig korttidsutleie med høyt aktivitetsnivå – mange korte opphold,
        rengjøring mellom gjester, annonsering og gjestehåndtering – kan bli
        regnet som <strong>skattemessig virksomhet</strong>. Da beskattes
        overskuddet som næringsinntekt med marginalskatt på opp mot 50 %, og
        ved hotellignende drift kan det også bli merverdiavgift (12 %) når
        omsetningen passerer 50 000 kr. Grensen beror på en helhetsvurdering
        av omfang og aktivitet; Skatteetaten har lagt til grunn at utleie av
        én enkelt boenhet til korttidsutleie normalt ikke er virksomhet, men
        flere enheter eller intensiv drift kan tippe vurderingen. Er du i
        tvil, be om en bindende forhåndsuttalelse.
      </p>

      <h2>Borettslag og sameie setter egne grenser</h2>
      <ul>
        <li>
          <strong>Borettslag:</strong> du kan korttidsutleie boligen i inntil{" "}
          <strong>30 døgn per år</strong> uten styrets samtykke. Utover det
          gjelder de vanlige, strenge utleiereglene i borettslag.
        </li>
        <li>
          <strong>Eierseksjonssameie:</strong> korttidsutleie av hele
          seksjonen i mer enn <strong>90 døgn per år</strong> er ikke tillatt.
          Sameiet kan i vedtektene justere grensen til mellom 60 og 120 døgn.
        </li>
        <li>
          <strong>Selveier utenfor sameie:</strong> ingen døgngrense, men
          sjekk kommunale krav og eventuelle servitutter.
        </li>
      </ul>
      <p>
        Leier du ut et rom mens du selv bor i boligen, rammes du ikke av
        døgngrensene – de gjelder utleie av hele boenheten.
      </p>

      <h2>Airbnb rapporterer til Skatteetaten</h2>
      <p>
        Utleieplattformer har opplysningsplikt: Airbnb og tilsvarende
        tjenester rapporterer utleieinntektene dine til Skatteetaten, og
        tallene dukker opp i skattemeldingen. «Ingen får vite det»-strategien
        finnes ikke lenger – sørg heller for å bruke reglene riktig, så er
        korttidsutleie av egen bolig fortsatt svært gunstig.
      </p>

      <h2>Lønner korttidsutleie seg mot vanlig utleie?</h2>
      <p>
        Bruttoinntekten per natt er høyere, men regn ærlig på nettoen:
        plattformgebyr, vask mellom gjester, strøm, forbruksartikler, mer
        slitasje, sesongvariasjon og netter uten gjester. En bolig som
        leies ut 15 netter i måneden til 1 200 kr/natt gir 18 000 kr brutto,
        men ofte 25–35 % lavere netto etter drift – og krever betydelig mer
        arbeid enn en langtidsleietaker. Mange lander på langtidsutleie for
        forutsigbarheten; regn begge deler med{" "}
        <Link href="/guide/hva-kan-jeg-leie-ut-for">realistisk leiepris</Link>{" "}
        og se hva kontantstrømmen faktisk blir.
      </p>

      <h2>Kilder</h2>
      <ul>
        <li>
          <a
            href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/korttidsutleie-av-egen-bolig/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Skatteetaten: korttidsutleie av egen bolig
          </a>
        </li>
        <li>
          <a
            href="https://lovdata.no/dokument/NL/lov/2017-06-16-65"
            rel="noopener noreferrer"
            target="_blank"
          >
            Eierseksjonsloven § 24 (90-døgnsgrensen)
          </a>
        </li>
        <li>
          <a
            href="https://lovdata.no/dokument/NL/lov/2003-06-06-39"
            rel="noopener noreferrer"
            target="_blank"
          >
            Borettslagslova § 5-4 (30-døgnsgrensen)
          </a>
        </li>
        <li>
          <a
            href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/bolig-og-eiendeler/bolig-eiendom-tomt/utleie/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Skatteetaten: skatt ved utleie av bolig og eiendom
          </a>
        </li>
      </ul>
    </ArticleLayout>
  );
}
